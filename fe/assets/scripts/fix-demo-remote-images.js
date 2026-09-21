/*
  Serve the demos' images from the SDK instead of from jqwidgets.com.

  The framework demos reference 2,185 images as absolute jqwidgets.com URLs -
  https://www.jqwidgets.com/angular/images/add.png, .../react/images/books/..., and
  the wp-content design assets. Every one of those 264 distinct files is already in
  this SDK, so the remote fetch buys nothing and costs the demo its appearance
  whenever there is no network, a proxy in the way, or a change at the other end.

  Each framework needs the copy in a different place, because each serves its build
  from a different root:

    Angular   src/assets/img/<name>   referenced as  assets/img/<name>
    React     public/img/<name>       referenced as  /img/<name>
    Vue       img/<name>              referenced as  img/<name>

  Demos outside those three are left alone: they are served from the SDK root and
  already reach the images by relative path.

  Usage
    node scripts/fix-demo-remote-images.js --dry-run
    node scripts/fix-demo-remote-images.js
    node scripts/fix-demo-remote-images.js --fw Angular
*/
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const DRY = argv.includes('--dry-run');
const ONLY_FW = arg('fw', null);

// where each framework's demo folder keeps files the browser can reach, and the
// prefix the markup has to use to get at them
const LAYOUT = {
    'Angular':    { dir: ['src', 'assets', 'img'], prefix: 'assets/img/' },
    'React-TSX':  { dir: ['public', 'img'],        prefix: '/img/' },
    'Vue.js':     { dir: ['img'],                  prefix: 'img/' },
};

// index every image the SDK ships, by lowercased basename
const local = new Map();
(function scan(dir, depth) {
    if (depth > 7) return;
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
    for (const f of entries) {
        if (f.name === 'node_modules' || f.name === 'dist') continue;
        const p = path.join(dir, f.name);
        if (f.isDirectory()) { scan(p, depth + 1); continue; }
        if (!/\.(png|jpe?g|gif|svg)$/i.test(f.name)) continue;
        const key = f.name.toLowerCase();
        if (!local.has(key)) local.set(key, p);
    }
})(ROOT, 0);

const URL = /https:\/\/www\.jqwidgets\.com\/[^"'`\s)]+?\.(?:png|jpe?g|gif|svg)/gi;
// The other way a demo reaches an image it does not own: climbing out of its folder
// to the SDK's images/ - "../../../images/folder.png". From demos/Vue.js/x/y that
// lands in demos/images/, which does not exist (the folder is one level higher), and
// in a Vue template vue-loader turns it into a require() that throws at runtime.
const RELATIVE = /(?:\.\.\/)+images\/([A-Za-z0-9_\/. -]+?\.(?:png|jpe?g|gif|svg))/gi;   // spaces too: "books/The Lord of the Rings.jpg"
// The same climb with the file name computed at runtime:
//     '../../../images/' + firstname.toLowerCase() + '.png'
//     `../../../images/t-shirts/${product.pic}`
// Only the folder is known statically, so the folder's plausible contents come
// along: a named subfolder whole, or for the root the employee portraits plus any
// image literal the same file mentions (the movie posters, say).
const DYNAMIC = /(?:\.\.\/)+images\/((?:[A-Za-z0-9_-]+\/)*)(?=['"`]\s*\+|\$\{)/g;
const PORTRAITS = ['andrew', 'anne', 'janet', 'laura', 'margaret', 'michael', 'nancy', 'robert', 'steven'].map(n => n + '.png');
const LITERAL_IMAGE = /['"]([A-Za-z0-9_-]+\.(?:png|jpe?g|gif))['"]/g;
const TEXT = /\.(htm|html|ts|tsx|js|jsx|vue|css|json)$/i;

let demosTouched = 0, filesTouched = 0, copied = 0, rewritten = 0;
const unresolved = new Map();

for (const fw of Object.keys(LAYOUT)) {
    if (ONLY_FW && fw !== ONLY_FW) continue;
    const base = path.join(ROOT, 'demos', fw);
    if (!fs.existsSync(base)) continue;
    const { dir: sub, prefix } = LAYOUT[fw];

    for (const w of fs.readdirSync(base, { withFileTypes: true })) {
        if (!w.isDirectory() || ['node_modules', 'sampledata', 'temp'].includes(w.name)) continue;
        for (const d of fs.readdirSync(path.join(base, w.name), { withFileTypes: true })) {
            if (!d.isDirectory()) continue;
            const demoDir = path.join(base, w.name, d.name);

            // every text file in the demo, minus the usual noise
            const files = [];
            (function walk(p, depth) {
                if (depth > 5) return;
                let entries = [];
                try { entries = fs.readdirSync(p, { withFileTypes: true }); } catch (e) { return; }
                for (const e of entries) {
                    if (e.name === 'node_modules' || e.name === 'dist') continue;
                    const q = path.join(p, e.name);
                    if (e.isDirectory()) walk(q, depth + 1);
                    else if (TEXT.test(e.name)) files.push(q);
                }
            })(demoDir, 0);

            const wanted = new Map();          // published relative path -> source path
            const edits = [];
            for (const f of files) {
                let text;
                try { text = fs.readFileSync(f, 'utf8'); } catch (e) { continue; }
                if (!URL.test(text) && !RELATIVE.test(text) && !DYNAMIC.test(text)) { URL.lastIndex = 0; RELATIVE.lastIndex = 0; DYNAMIC.lastIndex = 0; continue; }
                URL.lastIndex = 0; RELATIVE.lastIndex = 0; DYNAMIC.lastIndex = 0;

                let changed = false;
                let next = text.replace(URL, (u) => {
                    const name = u.split('/').pop();
                    const source = local.get(name.toLowerCase());
                    if (!source) {
                        unresolved.set(u, (unresolved.get(u) || 0) + 1);
                        return u;
                    }
                    wanted.set(name, source);
                    changed = true;
                    rewritten++;
                    return prefix + name;
                });
                next = next.replace(RELATIVE, (u, rel) => {
                    // keep any subfolder ("books/x.jpg") so two files with one name cannot collide
                    const source = path.join(ROOT, 'images', rel);
                    const fallback = local.get(rel.split('/').pop().toLowerCase());
                    const from = fs.existsSync(source) ? source : fallback;
                    if (!from) {
                        unresolved.set(u, (unresolved.get(u) || 0) + 1);
                        return u;
                    }
                    wanted.set(rel, from);
                    changed = true;
                    rewritten++;
                    return prefix + rel;
                });
                next = next.replace(DYNAMIC, (u, sub) => {
                    const folder = path.join(ROOT, 'images', sub);
                    if (!fs.existsSync(folder)) { unresolved.set(u, (unresolved.get(u) || 0) + 1); return u; }
                    if (sub) {
                        // a named subfolder: bring the whole folder, it is what the code indexes into
                        for (const f2 of fs.readdirSync(folder)) {
                            if (/\.(png|jpe?g|gif|svg)$/i.test(f2)) wanted.set(sub + f2, path.join(folder, f2));
                        }
                    } else {
                        for (const p of PORTRAITS) if (fs.existsSync(path.join(folder, p))) wanted.set(p, path.join(folder, p));
                        for (const m of text.matchAll(LITERAL_IMAGE)) {
                            const src = path.join(folder, m[1]);
                            if (fs.existsSync(src)) wanted.set(m[1], src);
                        }
                    }
                    changed = true;
                    rewritten++;
                    return prefix + sub;
                });
                if (changed) edits.push([f, next]);
            }
            if (!edits.length) continue;

            if (!DRY) {
                const out = path.join(demoDir, ...sub);
                for (const [name, source] of wanted) {
                    const target = path.join(out, name);
                    fs.mkdirSync(path.dirname(target), { recursive: true });
                    if (!fs.existsSync(target)) fs.copyFileSync(source, target);
                }
                for (const [f, next] of edits) fs.writeFileSync(f, next);
            }
            copied += wanted.size;
            filesTouched += edits.length;
            demosTouched++;
        }
    }
}

console.log(`${rewritten} reference(s) repointed, ${copied} image(s) copied`);
console.log(`across ${filesTouched} file(s) in ${demosTouched} demo(s)${DRY ? '   (dry run, nothing written)' : ''}`);
if (unresolved.size) {
    console.log(`\n${unresolved.size} URL(s) with no copy in the SDK - left remote:`);
    for (const [u, n] of [...unresolved.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12))
        console.log(`  ${String(n).padStart(4)}x  ${u.replace('https://www.jqwidgets.com', '')}`);
}
