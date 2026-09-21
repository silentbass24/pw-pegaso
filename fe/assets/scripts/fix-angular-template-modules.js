/*
  Give each standalone demo the modules its own template uses.

  A standalone component only knows the directives listed in its `imports` array.
  Several demos render, say, <jqxGrid [source]="dataAdapter"> without importing
  jqxGridModule, and Angular then reports NG8002 ("Can't bind to 'source' since it
  isn't a known property of 'jqxGrid'") - or, with no bindings to complain about,
  silently renders the tag as an unknown element and the demo shows nothing.

  This reads every jqx element out of the demo's template, maps the selector to the
  module that declares it (both taken from jqwidgets-ng's .d.ts, since selector and
  class name do not agree on case), and adds whatever is missing to the import list
  and to the `imports` array.

  Usage
    node scripts/fix-angular-template-modules.js --dry-run
    node scripts/fix-angular-template-modules.js
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

// selector (lowercased) -> { module, folder }
const bySelector = new Map();
for (const d of fs.readdirSync(NG)) {
    const dir = path.join(NG, d);
    if (!fs.statSync(dir).isDirectory()) continue;
    let text = '';
    for (const f of fs.readdirSync(dir)) if (f.endsWith('.d.ts')) text += fs.readFileSync(path.join(dir, f), 'utf8');
    const mod = (text.match(/export declare class ([A-Za-z0-9_]+Module)/) || [])[1];
    if (!mod) continue;
    for (const m of text.matchAll(/ComponentDeclaration<[^,]+,\s*"([^"]+)"/g)) {
        const sel = m[1].trim();
        if (/^jqx/i.test(sel)) bySelector.set(sel.toLowerCase(), { module: mod, folder: d });
    }
}

let touched = 0, added = 0;
const perModule = new Map();

for (const w of fs.readdirSync(BASE, { withFileTypes: true })) {
    if (!w.isDirectory() || ['node_modules', 'sampledata'].includes(w.name)) continue;
    for (const dd of fs.readdirSync(path.join(BASE, w.name), { withFileTypes: true })) {
        if (!dd.isDirectory()) continue;
        const id = w.name + '/' + dd.name;
        const tsFile = path.join(BASE, w.name, dd.name, 'src', 'app', 'app.component.ts');
        if (!fs.existsSync(tsFile)) continue;

        let src = fs.readFileSync(tsFile, 'utf8');
        const decorator = src.match(/@Component\s*\(\s*\{[\s\S]*?\n\s*\}\s*\)/);
        if (!decorator) continue;
        const arr = decorator[0].match(/\bimports\s*:\s*\[([^\]]*)\]/);
        if (!arr) continue;                       // not a standalone component

        // the template: an external file, or inline in the decorator
        const htmlFile = path.join(BASE, w.name, dd.name, 'src', 'app', 'app.component.html');
        let template = fs.existsSync(htmlFile) ? fs.readFileSync(htmlFile, 'utf8') : '';
        const inline = decorator[0].match(/\btemplate\s*:\s*`([\s\S]*?)`/);
        if (inline) template += inline[1];
        if (!template) continue;

        const needed = new Set();
        for (const m of template.matchAll(/<(jqx[A-Za-z0-9_-]*)/g)) {
            const hit = bySelector.get(m[1].toLowerCase());
            if (hit) needed.add(hit.module);
        }
        if (!needed.size) continue;

        const listed = new Set(arr[1].split(',').map(s => s.trim()).filter(Boolean));
        const imported = new Set();
        for (const m of src.matchAll(/import\s*\{([^}]*)\}\s*from/g))
            for (const raw of m[1].split(',')) {
                const spec = raw.trim();
                if (spec) imported.add((spec.split(/\s+as\s+/)[1] || spec).trim());
            }

        const missing = [...needed].filter(n => !listed.has(n));
        if (!missing.length) continue;

        const eol = src.includes('\r\n') ? '\r\n' : '\n';

        // import whatever is not already imported
        const toImport = missing.filter(n => !imported.has(n));
        if (toImport.length) {
            const block = toImport
                .map(n => `import { ${n} } from 'jqwidgets-ng/${[...bySelector.values()].find(v => v.module === n).folder}';`)
                .join(eol);
            const imports = [...src.matchAll(/^[ \t]*import[\s{][^\n]*$/gm)];
            if (imports.length) {
                const last = imports[imports.length - 1];
                const at = last.index + last[0].length;
                src = src.slice(0, at) + eol + block + src.slice(at);
            } else {
                src = block + eol + src;
            }
        }

        // and list them in the component's imports array
        const merged = [...listed, ...missing];
        src = src.replace(arr[0], `imports: [${merged.join(', ')}]`);

        for (const n of missing) perModule.set(n, (perModule.get(n) || 0) + 1);
        added += missing.length;
        touched++;
        if (!DRY) fs.writeFileSync(tsFile, src);
        console.log(`  ${id}  +[${missing.join(', ')}]`);
    }
}

console.log(`\n${added} module(s) added across ${touched} demo(s)${DRY ? '   (dry run, nothing written)' : ''}`);
for (const [m, n] of [...perModule.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15))
    console.log('  ' + String(n).padStart(4) + 'x  ' + m);
