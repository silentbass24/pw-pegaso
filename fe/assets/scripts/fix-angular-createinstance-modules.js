/*
  Load the widgets a demo creates by name at runtime.

  Some demos build part of their UI imperatively:

      jqwidgets.createInstance('#treeContainer', 'jqxTree', { ... });

  The widget is named by a string, so nothing statically imports it. With the old
  script-tag demos that did not matter - every widget was already on the page - but
  each jqwidgets-ng entry point only pulls in its own bundle, so the plugin is simply
  absent and the call dies inside minified code as "f(...)[p] is not a function".

  For every widget a demo names this way, this adds a side-effect import of the
  bundle that registers it:

      import 'jqwidgets-ng/jqwidgets/modules/jqxtree.js';

  The '.js' is required: the package exports map exposes only the wildcard
  "./jqwidgets/*", which does no extension resolution.

  Usage
    node scripts/fix-angular-createinstance-modules.js --dry-run
    node scripts/fix-angular-createinstance-modules.js
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

// widget name -> bundle that registers it, and bundle -> everything it registers
const bundleOf = new Map();
const registeredBy = new Map();
const modulesDir = path.join(NG, 'jqwidgets', 'modules');
for (const f of fs.readdirSync(modulesDir)) {
    if (!f.endsWith('.js')) continue;
    const base = f.replace(/\.js$/, '');
    const names = new Set();
    for (const m of fs.readFileSync(path.join(modulesDir, f), 'utf8').matchAll(/jqx\.jqxWidget\("([A-Za-z]+)"/g)) {
        names.add(m[1]);
        // prefer the bundle named after the widget, otherwise first one wins
        if (!bundleOf.has(m[1]) || base === m[1].toLowerCase()) bundleOf.set(m[1], base);
    }
    registeredBy.set(base, names);
}

const CREATE = /createInstance\s*\(\s*[^,]+,\s*['"](jqx[A-Za-z]+)['"]/g;
// the jQuery-style form some demos still use: element.jqxTooltip({ ... })
const PLUGIN = /[A-Za-z0-9_$)\]]\.(jqx[A-Z][A-Za-z]+)\s*\(/g;
// Widgets that another widget builds internally from a plain option. jqxForm turns
// `type: 'password'` into a jqxPasswordInput, and its bundle does not register one.
const IMPLIED = [
    { when: /from\s*['"]jqwidgets-ng\/jqxform['"]/, and: /type\s*:\s*['"]password['"]/, need: 'jqxPasswordInput' },
    // `type: 'option'` renders as radio buttons or check boxes
    { when: /from\s*['"]jqwidgets-ng\/jqxform['"]/, and: /type\s*:\s*['"]option['"]/, need: 'jqxRadioButton' },
    { when: /from\s*['"]jqwidgets-ng\/jqxform['"]/, and: /type\s*:\s*['"]option['"]/, need: 'jqxCheckBox' },
];
const SHIM = n => `import 'jqwidgets-ng/jqwidgets/modules/${n}.js';`;

let touched = 0, addedTotal = 0;
const unknown = new Set();

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
                else if (/\.(ts|html)$/.test(e.name) && !/\.d\.ts$/.test(e.name)) files.push(path.join(p, e.name));
            }
        })(root);

        const texts = new Map(files.map(f => [f, fs.readFileSync(f, 'utf8')]));
        const all = [...texts.values()].join('\n');

        const wanted = new Set();
        for (const m of all.matchAll(CREATE)) wanted.add(m[1]);
        // only the demo's own code, not the wrapper class names it imports
        const own = [...texts.values()].join('\n').replace(/^\s*import[^\n]*$/gm, '');
        for (const m of own.matchAll(PLUGIN)) if (bundleOf.has(m[1])) wanted.add(m[1]);
        for (const rule of IMPLIED) if (rule.when.test(all) && rule.and.test(all)) wanted.add(rule.need);
        if (!wanted.size) continue;

        // what the demo's existing imports already register
        const have = new Set();
        for (const m of all.matchAll(/from\s*['"]jqwidgets-ng\/([a-z0-9]+)['"]/g))
            for (const n of registeredBy.get(m[1]) || []) have.add(n);
        for (const m of all.matchAll(/import\s*['"]jqwidgets-ng\/jqwidgets\/modules\/([a-z0-9]+)\.js['"]/g))
            for (const n of registeredBy.get(m[1]) || []) have.add(n);

        const bundles = new Set();
        for (const n of wanted) {
            if (have.has(n)) continue;
            const b = bundleOf.get(n);
            if (!b) { unknown.add(n); continue; }
            bundles.add(b);
        }
        if (!bundles.size) continue;

        // put the imports in the .ts file that does the createInstance call
        const target = files.find(f => /\.ts$/.test(f) && CREATE.test(texts.get(f)))
            || files.find(f => /app\.component\.ts$/.test(f));
        CREATE.lastIndex = 0; PLUGIN.lastIndex = 0;
        if (!target) continue;

        let src = texts.get(target);
        const eol = src.includes('\r\n') ? '\r\n' : '\n';
        const block = [...bundles].sort().map(SHIM).join(eol);
        const imports = [...src.matchAll(/^[ \t]*import[\s{][^\n]*$/gm)];
        if (imports.length) {
            const last = imports[imports.length - 1];
            const at = last.index + last[0].length;
            src = src.slice(0, at) + eol + block + src.slice(at);
        } else {
            src = block + eol + src;
        }

        touched++;
        addedTotal += bundles.size;
        if (!DRY) fs.writeFileSync(target, src);
        console.log(`  ${id.padEnd(46)} +${[...bundles].sort().join(', ')}`);
    }
}

console.log(`\n${addedTotal} bundle import(s) added across ${touched} demo(s)${DRY ? '   (dry run, nothing written)' : ''}`);
if (unknown.size) console.log('\nno bundle registers these, left alone: ' + [...unknown].join(', '));
