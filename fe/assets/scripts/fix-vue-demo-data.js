/*
  Give the Vue demos the data files they ask for.

  163 Vue demos load their data with a plain relative url - `url: 'orders.xml'`,
  `url: 'customers.txt'` - and not one of those files is in the demo folder. Every
  one of them is somewhere in the SDK, in demos/Angular/sampledata or in some
  Angular demo's src/assets, but the Vue demos were never given a copy, so each of
  them renders an empty widget.

  This copies the file each demo actually references into that demo's own folder,
  preferring the canonical copy in demos/Angular/sampledata and falling back to any
  identical copy elsewhere in the tree.

  Usage
    node scripts/fix-vue-demo-data.js --dry-run
    node scripts/fix-vue-demo-data.js
*/
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE = path.join(ROOT, 'demos', 'Vue.js');
const DRY = process.argv.includes('--dry-run');

// Where to look for a data file, best source first.
const SEARCH = [
    path.join(ROOT, 'demos', 'Angular', 'sampledata'),
    path.join(ROOT, 'demos', 'Angular'),
    path.join(ROOT, 'demos', 'React-TSX'),
    path.join(ROOT, 'demos', 'Javascript & JQuery'),
    path.join(ROOT, 'images'),
];

// basename -> first path found, scanning the roots in order
const index = new Map();
function scan(dir, depth) {
    if (depth > 6) return;
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
    for (const e of entries) {
        if (e.name === 'node_modules' || e.name === 'dist') continue;
        const p = path.join(dir, e.name);
        if (e.isDirectory()) scan(p, depth + 1);
        else if (!index.has(e.name)) index.set(e.name, p);
    }
}
for (const root of SEARCH) scan(root, 0);

const URLREF = /\burl\s*:\s*['"]([^'"]+)['"]/g;
// the same thing written as a direct request: fetch('orders.xml'), $.get('data.txt')
const FETCHREF = /\b(?:fetch|\$\.get|\$\.getJSON|\$\.ajax)\(\s*['"]([^'"]+)['"]/g;
// `url` is also an ordinary field in some demos' own data (a tag's link, say), so only
// treat a reference as a data file when it names one.
const DATAFILE = /\.(txt|json|xml|csv|tsv|png|jpg|jpeg|gif|svg)$/i;
let copied = 0, demos = 0;
const notFound = new Map();

for (const w of fs.readdirSync(BASE, { withFileTypes: true })) {
    if (!w.isDirectory() || ['node_modules', 'temp'].includes(w.name)) continue;
    for (const d of fs.readdirSync(path.join(BASE, w.name), { withFileTypes: true })) {
        if (!d.isDirectory()) continue;
        const id = w.name + '/' + d.name;
        const dir = path.join(BASE, w.name, d.name);

        let text = '';
        for (const f of fs.readdirSync(dir)) {
            if (/\.(vue|js)$/.test(f) && f !== 'webpack.config.js') text += fs.readFileSync(path.join(dir, f), 'utf8');
        }

        const refs = new Set();
        for (const m of text.matchAll(URLREF)) refs.add(m[1]);
        for (const m of text.matchAll(FETCHREF)) refs.add(m[1]);

        const done = [];

        for (const ref of refs) {
            if (/^(https?:)?\/\//.test(ref) || ref.startsWith('data:')) continue;   // remote, not ours
            if (!DATAFILE.test(ref.split('?')[0])) continue;
            const rel = ref.replace(/^\.\//, '').split('?')[0];
            if (fs.existsSync(path.join(dir, rel))) continue;

            const source = index.get(path.basename(rel));
            if (!source) {
                if (!notFound.has(rel)) notFound.set(rel, []);
                notFound.get(rel).push(id);
                continue;
            }

            // A reference that climbs out of the demo folder cannot resolve once the demo
            // is served on its own, so the file comes in beside the demo and the reference
            // is shortened to match how every other demo names its data.
            const escapes = rel.startsWith('..') || path.isAbsolute(rel);
            const localName = escapes ? path.basename(rel) : rel;
            const target = path.join(dir, localName);

            if (!DRY) {
                fs.mkdirSync(path.dirname(target), { recursive: true });
                fs.copyFileSync(source, target);
            }
            if (escapes) {
                for (const f of fs.readdirSync(dir)) {
                    if (!/\.(vue|js)$/.test(f) || f === 'webpack.config.js') continue;
                    const p = path.join(dir, f);
                    const before = fs.readFileSync(p, 'utf8');
                    const after = before.split(ref).join(localName);
                    if (after !== before && !DRY) fs.writeFileSync(p, after);

                }
            }
            copied++;
            done.push(localName + (escapes ? `  (was ${ref})` : ''));
        }
        if (done.length) { demos++; console.log(`  ${id.padEnd(44)} ${done.join(', ')}`); }
    }
}

console.log(`\n${copied} file(s) copied into ${demos} demo(s)${DRY ? '   (dry run, nothing written)' : ''}`);
if (notFound.size) {
    console.log(`\n${notFound.size} reference(s) with no copy anywhere in the SDK:`);
    for (const [ref, ids] of [...notFound.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 15))
        console.log(`  ${String(ids.length).padStart(3)}x  ${ref}   e.g. ${ids[0]}`);
}
