/*
  Match every jqx element in the demo templates to the selector the package
  actually declares.

  Angular element names are case sensitive, so a template that opens <jqxToolbar>
  and closes </jqxToolBar> is a parse error (NG5002), and one that consistently
  uses the wrong spelling silently renders nothing. The wrapper classes and their
  selectors do not agree on case - jqxToolBarComponent's selector is "jqxToolbar" -
  so the spelling has to come from the package, not from the class name.

  Selectors are read out of jqwidgets-ng's own .d.ts (ComponentDeclaration<Class,
  "selector">), and every jqx tag in the templates is rewritten to that spelling.

  Usage
    node scripts/fix-angular-selector-case.js --dry-run
    node scripts/fix-angular-selector-case.js
*/
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE = path.join(ROOT, 'demos', 'Angular');
const DRY = process.argv.includes('--dry-run');

const NG = [
    path.join(ROOT, 'node_modules', 'jqwidgets-ng'),
    'C:/jqxng/_tpl/node_modules/jqwidgets-ng',
].find(p => fs.existsSync(p));
if (!NG) { console.error('jqwidgets-ng is not installed anywhere I can see'); process.exit(1); }

// lowercased selector -> the spelling the package declares
const selectors = new Map();
for (const d of fs.readdirSync(NG)) {
    const dir = path.join(NG, d);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir)) {
        if (!f.endsWith('.d.ts')) continue;
        const txt = fs.readFileSync(path.join(dir, f), 'utf8');
        for (const m of txt.matchAll(/ComponentDeclaration<[^,]+,\s*"([^"]+)"/g)) {
            const sel = m[1].trim();
            if (/^jqx/i.test(sel)) selectors.set(sel.toLowerCase(), sel);
        }
    }
}
if (!selectors.size) { console.error('no selectors found in jqwidgets-ng'); process.exit(1); }

const counts = new Map();
let touched = 0, fixes = 0;

function walk(dir, out) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.name === 'node_modules' || e.name === 'dist') continue;
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p, out);
        else if (/\.(html|ts)$/.test(e.name)) out.push(p);
    }
    return out;
}

for (const file of walk(BASE, [])) {
    const src = fs.readFileSync(file, 'utf8');
    // Opening and closing tags alike; the capture is the raw tag name as written.
    const next = src.replace(/<(\/?)(jqx[A-Za-z0-9_-]*)/g, (whole, slash, name) => {
        const right = selectors.get(name.toLowerCase());
        if (!right || right === name) return whole;
        fixes++;
        const key = name + ' -> ' + right;
        counts.set(key, (counts.get(key) || 0) + 1);
        return '<' + slash + right;
    });
    if (next === src) continue;
    touched++;
    if (!DRY) fs.writeFileSync(file, next);
}

console.log(`${fixes} tag(s) in ${touched} file(s) respelled${DRY ? '   (dry run, nothing written)' : ''}`);
for (const [k, n] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
    console.log('  ' + String(n).padStart(4) + 'x  ' + k);
}
