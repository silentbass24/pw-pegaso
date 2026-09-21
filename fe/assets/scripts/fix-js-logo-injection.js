/*
  Repair demo pages where the jqwidgets.com logo was spliced into JavaScript.

  Something in packaging appends this block to every demo, just before </body>:

      <div style="position: absolute; bottom: 5px; right: 5px;">
      <a href="https://www.jqwidgets.com/" ...><img ... /></a>
      </div>

  It matched on the text "</body>", which several demos also contain *inside a
  string* - the print demos build a whole document to hand to a new window:

      '<body>\n' + gridContent + '\n</body>\n</html>';

  Splicing the block in there cuts the string in half, so the page dies with
  "Uncaught SyntaxError: Invalid or unexpected token" and the demo never runs.
  This removes the block wherever it sits inside a <script>, leaving the copy in
  the page body alone.

  Usage
    node scripts/fix-js-logo-injection.js --dry-run
    node scripts/fix-js-logo-injection.js

  No dependencies beyond Node.js. Idempotent.
*/
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE = path.join(ROOT, 'demos', 'Javascript & JQuery');
const DRY = process.argv.includes('--dry-run');

// the injected block, as it appears: a blank line or two, the div, the anchor, the closing div
const BLOCK = /\r?\n\s*\r?\n<div style="position: absolute; bottom: 5px; right: 5px;">\r?\n<a href="https:\/\/www\.jqwidgets\.com\/"[^\n]*\r?\n<\/div>\r?\n/g;

function scripts(html) {
    // [start, end) of every <script>...</script> body
    const out = [];
    const re = /<script\b[^>]*>/gi;
    let m;
    while ((m = re.exec(html))) {
        const start = m.index + m[0].length;
        const end = html.indexOf('</script>', start);
        if (end > start) out.push([start, end]);
    }
    return out;
}

function walk(dir, acc = []) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.isDirectory()) { if (e.name !== 'documentation') walk(path.join(dir, e.name), acc); continue; }
        if (/\.html?$/i.test(e.name)) acc.push(path.join(dir, e.name));
    }
    return acc;
}

const fixed = [];
const stillBroken = [];

for (const file of walk(BASE)) {
    let html = fs.readFileSync(file, 'utf8');
    const ranges = scripts(html);
    if (!ranges.length) continue;

    // only touch occurrences that fall inside a script body
    let changed = false;
    let out = '';
    let cursor = 0;
    for (const [s, e] of ranges) {
        const body = html.slice(s, e);
        BLOCK.lastIndex = 0;
        if (!BLOCK.test(body)) continue;
        BLOCK.lastIndex = 0;
        const cleaned = body.replace(BLOCK, '');
        out += html.slice(cursor, s) + cleaned;
        cursor = e;
        changed = true;
    }
    if (!changed) continue;
    out += html.slice(cursor);

    const rel = path.relative(BASE, file).replace(/\\/g, '/');
    if (!DRY) fs.writeFileSync(file, out);

    // did the inline scripts become parseable?
    let ok = true;
    for (const [s, e] of scripts(out)) {
        const body = out.slice(s, e).trim();
        if (!body) continue;
        try { new Function(body); } catch (err) { if (/Invalid or unexpected token|Unexpected end/.test(err.message)) { ok = false; } }
    }
    (ok ? fixed : stillBroken).push(rel);
}

console.log(`${fixed.length} demo${fixed.length === 1 ? '' : 's'} repaired${DRY ? '   (dry run, nothing written)' : ''}`);
for (const f of fixed) console.log('  ' + f);
if (stillBroken.length) {
    console.log(`\n${stillBroken.length} still do not parse and need a look by hand:`);
    for (const f of stillBroken) console.log('  ! ' + f);
}
