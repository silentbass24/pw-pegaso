/*
  Point every jqwidgets-ng import at the subpath that actually exports the symbol.

  A handful of demos import a component from a neighbouring widget's folder -
  jqxPivotDesignerComponent from jqwidgets-ng/jqxpivotgrid, jqxSwitchButton*
  from jqwidgets-ng/jqxgrid - which the compiler rejects. Where one statement
  mixes symbols from two folders, it is split into one statement per folder.

  Usage
    node scripts/fix-angular-import-paths.js --dry-run
    node scripts/fix-angular-import-paths.js
*/
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE = path.join(ROOT, 'demos', 'Angular');
const DRY = process.argv.includes('--dry-run');

// Find the package: the demos share one installed copy, so any demo's will do.
const NG = [
    path.join(ROOT, 'node_modules', 'jqwidgets-ng'),
    'C:/jqxng/_tpl/node_modules/jqwidgets-ng',
].find(p => fs.existsSync(p));
if (!NG) { console.error('jqwidgets-ng is not installed anywhere I can see - run npm i in a demo first'); process.exit(1); }

const home = new Map();      // exported class -> the folder that declares it
for (const d of fs.readdirSync(NG)) {
    const dir = path.join(NG, d);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir)) {
        if (!f.endsWith('.d.ts')) continue;
        for (const m of fs.readFileSync(path.join(dir, f), 'utf8').matchAll(/export declare class ([A-Za-z0-9_]+)/g))
            home.set(m[1], d);
    }
}

const IMPORT = /^([ \t]*)import\s*\{([^}]*)\}\s*from\s*(['"])jqwidgets-ng\/([^'"]+)\3\s*;?[ \t]*$/gm;
let touched = 0, moved = 0;

function walk(dir, out) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.name === 'node_modules' || e.name === 'dist') continue;
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p, out);
        else if (e.name.endsWith('.ts')) out.push(p);
    }
    return out;
}

for (const file of walk(BASE, [])) {
    const src = fs.readFileSync(file, 'utf8');
    const eol = src.includes('\r\n') ? '\r\n' : '\n';
    let changed = false;

    const next = src.replace(IMPORT, (stmt, indent, names, q, sub) => {
        const byFolder = new Map();
        for (const raw of names.split(',')) {
            const name = raw.trim();
            if (!name) continue;
            const bare = name.split(/\s+as\s+/)[0].trim();
            const folder = home.has(bare) ? home.get(bare) : sub;
            if (!byFolder.has(folder)) byFolder.set(folder, []);
            byFolder.get(folder).push(name);
        }
        if (byFolder.size === 1 && byFolder.has(sub)) return stmt;
        changed = true;
        moved += [...byFolder.keys()].filter(f => f !== sub).length;
        // keep the original folder first so the diff stays readable
        const order = [...byFolder.keys()].sort((a, b) => (a === sub ? -1 : b === sub ? 1 : a < b ? -1 : 1));
        return order
            .map(f => `${indent}import { ${byFolder.get(f).join(', ')} } from ${q}jqwidgets-ng/${f}${q};`)
            .join(eol);
    });

    if (changed) {
        touched++;
        if (!DRY) fs.writeFileSync(file, next);
        console.log('  ' + path.relative(BASE, file).split(path.sep).join('/'));
    }
}

console.log(`\n${touched} file(s), ${moved} import(s) repointed${DRY ? '   (dry run, nothing written)' : ''}`);
