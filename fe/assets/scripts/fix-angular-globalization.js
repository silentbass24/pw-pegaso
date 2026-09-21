/*
  Ship the globalization scripts the localization demos load.

  Four Angular demos - calendar/localization, calendar/righttoleftlayout,
  datetimeinput/localization, datetimeinput/righttoleftlayout - pull Globalize and
  their culture files straight off the web:

      <script src="https://www.jqwidgets.com/public/jqwidgets/globalization/globalize.js"></script>
      <script src="https://www.jqwidgets.com/public/jqwidgets/globalization/globalize.culture.de-DE.js"></script>

  With no network Globalize never defines itself, so the widget falls back to its
  default culture and the demo silently stops demonstrating the thing it is named
  after. The SDK already ships every one of those files in jqwidgets/globalization.

  This copies the ones each demo references into that demo's src/assets/globalization
  and rewrites the tags to point there, which the assets glob then carries into the
  build (see scripts/fix-angular-assets.js).

  Usage
    node scripts/fix-angular-globalization.js --dry-run
    node scripts/fix-angular-globalization.js
*/
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE = path.join(ROOT, 'demos', 'Angular');
const DRY = process.argv.includes('--dry-run');

const SOURCE = [
    path.join(ROOT, 'jqwidgets', 'globalization'),
    'C:/jqxng/_tpl/node_modules/jqwidgets-ng/jqwidgets/globalization',
].find(p => fs.existsSync(p));
if (!SOURCE) { console.error('no local jqwidgets/globalization folder'); process.exit(1); }

const REMOTE = /(["'])https?:\/\/[^"']*\/globalization\/([A-Za-z0-9_.\-]+\.js)\1/g;

let touched = 0, copied = 0;
const missing = new Set();

for (const w of fs.readdirSync(BASE, { withFileTypes: true })) {
    if (!w.isDirectory() || ['node_modules', 'sampledata'].includes(w.name)) continue;
    for (const d of fs.readdirSync(path.join(BASE, w.name), { withFileTypes: true })) {
        if (!d.isDirectory()) continue;
        const dir = path.join(BASE, w.name, d.name);
        const html = path.join(dir, 'src', 'index.html');
        if (!fs.existsSync(html)) continue;

        const before = fs.readFileSync(html, 'utf8');
        if (!REMOTE.test(before)) { REMOTE.lastIndex = 0; continue; }
        REMOTE.lastIndex = 0;

        const wanted = [];
        const after = before.replace(REMOTE, (whole, q, file) => {
            if (!fs.existsSync(path.join(SOURCE, file))) { missing.add(file); return whole; }
            wanted.push(file);
            return `${q}assets/globalization/${file}${q}`;
        });
        if (after === before) continue;

        if (!DRY) {
            const out = path.join(dir, 'src', 'assets', 'globalization');
            fs.mkdirSync(out, { recursive: true });
            for (const f of wanted) fs.copyFileSync(path.join(SOURCE, f), path.join(out, f));
            fs.writeFileSync(html, after);
        }
        copied += wanted.length;
        touched++;
        console.log(`  ${(w.name + '/' + d.name).padEnd(44)} ${wanted.length} file(s)`);
    }
}

console.log(`\n${copied} script(s) localised across ${touched} demo(s)${DRY ? '   (dry run, nothing written)' : ''}`);
if (missing.size) console.log('\nnot in the SDK, left remote: ' + [...missing].join(', '));
