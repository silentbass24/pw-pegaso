/*
  Move the React demos off the APIs React 19 removed.

  ReactDOM.render and ReactDOM.unmountComponentAtNode were deleted in React 19.
  The demos declare react 19, so every demo that renders a widget into a cell,
  a panel or a docking pane through ReactDOM.render throws at runtime - the demo
  builds, mounts and then blanks out. Vite only transpiles, so nothing catches
  this before the browser does.

  Each affected file gets a small helper that keeps one createRoot per container
  (a renderer can be called repeatedly for the same element, and creating a second
  root for it both warns and leaks):

      const roots = new WeakMap<Element, Root>();
      const renderInto = (element, container) => { ... root.render(element) };
      const unmountFrom = (container) => { ... root.unmount() };

  Usage
    node scripts/fix-react19-render.js --dry-run
    node scripts/fix-react19-render.js
    node scripts/fix-react19-render.js --only grid/rowdetails

  No dependencies beyond Node.js. Idempotent.
*/
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE = path.join(ROOT, 'demos', 'React-TSX');
const argv = process.argv.slice(2);
const DRY = argv.includes('--dry-run');
const onlyIdx = argv.indexOf('--only');
const ONLY = onlyIdx >= 0 ? argv[onlyIdx + 1] : null;

const HELPER = `
// React 19 removed ReactDOM.render. One root is kept per container element,
// because these renderers run again every time the widget redraws, and the
// render is flushed synchronously: the jQWidgets renderer that calls this looks
// the element up immediately afterwards, which the asynchronous createRoot
// render would not have produced yet.
const reactRoots = new WeakMap<Element, Root>();
const renderInto = (element: React.ReactElement, container: Element | null, attempt: number = 0): void => {
    if (!container) { return; }
    // The widget looks its own element up in the document once it mounts, so the
    // container has to be attached first - a panel's initContent and a cell
    // renderer both hand us an element that is still detached.
    if (!document.contains(container)) {
        if (attempt < 10) { requestAnimationFrame(() => renderInto(element, container, attempt + 1)); }
        return;
    }
    let root = reactRoots.get(container);
    if (!root) { root = createRoot(container); reactRoots.set(container, root); }
    flushSync(() => root!.render(element));
};
const unmountFrom = (container: Element | null): void => {
    if (!container) { return; }
    const root = reactRoots.get(container);
    if (root) { root.unmount(); reactRoots.delete(container); }
};
`;

function demos() {
    const out = [];
    for (const w of fs.readdirSync(BASE, { withFileTypes: true })) {
        if (!w.isDirectory() || w.name === 'node_modules') continue;
        for (const d of fs.readdirSync(path.join(BASE, w.name), { withFileTypes: true })) {
            if (!d.isDirectory()) continue;
            const f = path.join(BASE, w.name, d.name, 'src', 'App.tsx');
            if (fs.existsSync(f)) out.push({ id: w.name + '/' + d.name, file: f });
        }
    }
    return out;
}

// Rewrites ReactDOM.render(a, b) / unmountComponentAtNode(b), brace- and
// paren-matched so nested JSX and callbacks inside the arguments survive.
function rewriteCalls(src) {
    let changed = 0;
    for (const [name, replacement] of [['render', 'renderInto'], ['unmountComponentAtNode', 'unmountFrom']]) {
        const needle = 'ReactDOM.' + name + '(';
        let at;
        while ((at = src.indexOf(needle)) >= 0) {
            let i = at + needle.length, depth = 1, inStr = null, inLine = false, inBlock = false;
            while (i < src.length && depth > 0) {
                const c = src[i], n = src[i + 1], p = src[i - 1];
                if (inLine) { if (c === '\n') inLine = false; i++; continue; }
                if (inBlock) { if (c === '*' && n === '/') { inBlock = false; i++; } i++; continue; }
                if (inStr) { if (c === inStr && p !== '\\') inStr = null; i++; continue; }
                if (c === '/' && n === '/') { inLine = true; i += 2; continue; }
                if (c === '/' && n === '*') { inBlock = true; i += 2; continue; }
                if (c === "'" || c === '"' || c === '`') { inStr = c; i++; continue; }
                if (c === '(') depth++;
                else if (c === ')') depth--;
                i++;
            }
            src = src.slice(0, at) + replacement + '(' + src.slice(at + needle.length, i - 1) + ')' + src.slice(i);
            changed++;
        }
    }
    return { src, changed };
}

const touched = [];
const warn = [];

for (const { id, file } of demos()) {
    if (ONLY && id !== ONLY) continue;
    let src = fs.readFileSync(file, 'utf8');
    if (!/ReactDOM\s*\.\s*(render|unmountComponentAtNode)\s*\(/.test(src)) continue;

    const bom = src.startsWith('﻿') ? '﻿' : '';
    src = src.replace(/^﻿/, '');

    const res = rewriteCalls(src);
    src = res.src;
    if (/ReactDOM\s*\./.test(src)) { warn.push(id + ': a ReactDOM call is left over'); }

    // the react-dom import is now the client one
    src = src.replace(/^[ \t]*import\s+(?:\*\s+as\s+)?ReactDOM\s+from\s+['"]react-dom['"]\s*;?[ \t]*\r?\n/m,
        "import { createRoot, Root } from 'react-dom/client';\n");
    if (!/react-dom\/client/.test(src)) {
        // it imported ReactDOM some other way; add the client import after the react import
        const m = src.match(/^[ \t]*import[^\n]*from\s+['"]react['"][^\n]*\r?\n/m);
        const at = m ? m.index + m[0].length : 0;
        src = src.slice(0, at) + "import { createRoot, Root } from 'react-dom/client';\n" + src.slice(at);
    }

    if (!src.includes('const renderInto')) {
        // put the helper after the import block
        const imports = [...src.matchAll(/^[ \t]*import[^\n]*\r?\n/gm)];
        const at = imports.length ? imports[imports.length - 1].index + imports[imports.length - 1][0].length : 0;
        src = src.slice(0, at) + HELPER + src.slice(at);
    }

    if (!DRY) fs.writeFileSync(file, bom + src);
    touched.push({ id, calls: res.changed });
}

console.log(`${touched.length} React demos moved off ReactDOM.render${DRY ? '   (dry run, nothing written)' : ''}`);
for (const t of touched.slice(0, 60)) console.log('  ' + t.id.padEnd(44) + t.calls + ' call' + (t.calls === 1 ? '' : 's'));
if (touched.length > 60) console.log(`  … and ${touched.length - 60} more`);
if (warn.length) { console.log('\nNeeds a look:'); warn.forEach(w => console.log('  ! ' + w)); }
