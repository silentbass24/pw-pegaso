/*
  Make sure a demo that uses jqx.dataAdapter actually loads the code that defines it.

  jqwidgets-ng ships one webpack bundle per widget, and jqx.dataAdapter (plus
  jqx.filter, jqx.formatDate, jqx.formatNumber, jqx.observableArray) is compiled
  into some of them but not others - jqxgrid and jqxlistbox define it, jqxdropdownlist
  only calls it. So a demo whose only jqwidgets-ng import is the dropdown list builds
  cleanly and then throws "jqx.dataAdapter is not a constructor" on its first render.

  Where a demo uses one of those globals and none of its jqwidgets-ng imports
  provides one, this adds a side-effect import of the script that does:

      import 'jqwidgets-ng/jqwidgets/jqxdata.js';

  Usage
    node scripts/fix-angular-jqxdata-import.js --dry-run
    node scripts/fix-angular-jqxdata-import.js
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

const SHIM = "import 'jqwidgets-ng/jqwidgets/jqxdata.js';";
const GLOBALS = /\bjqx\.(dataAdapter|filter|formatDate|formatNumber|observableArray)\b/;

// which per-widget bundles compile jqx.dataAdapter in
const provides = new Set();
const modulesDir = path.join(NG, 'jqwidgets', 'modules');
for (const f of fs.readdirSync(modulesDir)) {
    if (!f.endsWith('.js')) continue;
    if (/jqx\.dataAdapter\s*=\s*function/.test(fs.readFileSync(path.join(modulesDir, f), 'utf8')))
        provides.add(f.replace(/\.js$/, ''));
}

let touched = 0;
const names = [];
const removed = [];

for (const w of fs.readdirSync(BASE, { withFileTypes: true })) {
    if (!w.isDirectory() || ['node_modules', 'sampledata'].includes(w.name)) continue;
    for (const d of fs.readdirSync(path.join(BASE, w.name), { withFileTypes: true })) {
        if (!d.isDirectory()) continue;
        const id = w.name + '/' + d.name;
        const root = path.join(BASE, w.name, d.name, 'src');
        if (!fs.existsSync(root)) continue;

        const files = [];
        (function walk(p) {
            for (const e of fs.readdirSync(p, { withFileTypes: true })) {
                if (e.isDirectory()) walk(path.join(p, e.name));
                else if (/\.ts$/.test(e.name) && !/\.d\.ts$/.test(e.name)) files.push(path.join(p, e.name));
            }
        })(root);

        const texts = new Map(files.map(f => [f, fs.readFileSync(f, 'utf8')]));
        const all = [...texts.values()].join('\n');
        if (!GLOBALS.test(all)) continue;

        // Anything that pulls in a bundle defining jqx.dataAdapter counts, whether it
        // came from an entry point or from a side-effect import of the bundle itself.
        const imported = [
            ...[...all.matchAll(/from\s*['"]jqwidgets-ng\/([a-z0-9]+)['"]/g)].map(m => m[1]),
            ...[...all.matchAll(/import\s*['"]jqwidgets-ng\/jqwidgets\/modules\/([a-z0-9]+)\.js['"]/g)].map(m => m[1]),
        ];
        const covered = imported.some(sub => provides.has(sub));

        if (all.includes('jqwidgets/jqxdata')) {
            // The raw script reads jqxBaseFramework off window, so it only works once a
            // bundle has set it. Where a bundle already provides dataAdapter the shim is
            // both redundant and a load-order hazard - drop it.
            if (!covered) continue;
            for (const [f, text] of texts) {
                if (!/import\s*['"]jqwidgets-ng\/jqwidgets\/jqxdata\.js['"]/.test(text)) continue;
                const eol = text.includes('\r\n') ? '\r\n' : '\n';
                const next = text.split(/\r?\n/)
                    .filter(l => !/^\s*import\s*['"]jqwidgets-ng\/jqwidgets\/jqxdata\.js['"];?\s*$/.test(l))
                    .join(eol);
                if (!DRY) fs.writeFileSync(f, next);
                removed.push(id);
            }
            continue;
        }

        if (covered) continue;                                           // a real widget already brings it

        // put the shim next to the component that uses the global
        const target = files.find(f => GLOBALS.test(texts.get(f))) || files[0];
        let src = texts.get(target);
        const eol = src.includes('\r\n') ? '\r\n' : '\n';
        const imports = [...src.matchAll(/^[ \t]*import[\s{][^\n]*$/gm)];
        if (imports.length) {
            const last = imports[imports.length - 1];
            const at = last.index + last[0].length;
            src = src.slice(0, at) + eol + SHIM + src.slice(at);
        } else {
            src = SHIM + eol + src;
        }

        touched++;
        names.push(id);
        if (!DRY) fs.writeFileSync(target, src);
    }
}

if (removed.length) console.log(`${removed.length} redundant shim(s) removed (a widget bundle already provides it)`);
console.log(`${touched} demo(s) now load jqxdata.js${DRY ? '   (dry run, nothing written)' : ''}`);
for (const n of names.slice(0, 40)) console.log('  ' + n);
if (names.length > 40) console.log(`  … and ${names.length - 40} more`);
