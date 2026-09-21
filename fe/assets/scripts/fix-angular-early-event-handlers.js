/*
  Stop widget events that fire during initialisation from reaching into a view
  child that does not exist yet.

  The jqwidgets-ng components raise several of their events while they are still
  being created - a radio button marked checked raises onChange, a tree with a
  selected item raises onSelect, a chart raises onRefreshBegin on its first draw, a
  responsive panel raises onCollapse when it sizes itself. That happens during the
  parent's view construction, before Angular has populated the parent's @ViewChild
  references. A handler that reaches for one, like

      treeOnSelect(event) { let item = this.myTree.getItem(event.args.element); ... }

  dies with "Cannot read properties of undefined", and that first error takes the
  demo down with it.

  Every later event - the ones the demo is actually about - arrives after the view
  is complete, so the premature call has nothing to do. This adds a guard to each
  template-bound handler (and any method it delegates to) that dereferences a view
  child:

      if (!this.myTree) { return; }

  Usage
    node scripts/fix-angular-early-event-handlers.js --dry-run
    node scripts/fix-angular-early-event-handlers.js
*/
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE = path.join(ROOT, 'demos', 'Angular');
const DRY = process.argv.includes('--dry-run');

let touched = 0, guards = 0;

// A method declaration: name(args): type {   - captures the indentation and the
// text up to and including the opening brace.
function methodHead(name) {
    return new RegExp(`(^([ \\t]*)(?:public\\s+|private\\s+)?${name}\\s*\\([^)]*\\)\\s*(?::\\s*[A-Za-z<>\\[\\]|\\s]+?)?\\s*\\{)`, 'm');
}

// The body of a method, to a bounded depth, for looking at what it touches.
function methodBody(src, name) {
    const m = src.match(methodHead(name));
    if (!m) return null;
    let i = m.index + m[1].length, depth = 1;
    const start = i;
    while (i < src.length && depth > 0 && i - start < 4000) {
        const c = src[i++];
        if (c === '{') depth++;
        else if (c === '}') depth--;
    }
    return { start: m.index + m[1].length, indent: m[2], body: src.slice(start, i - 1) };
}

for (const w of fs.readdirSync(BASE, { withFileTypes: true })) {
    if (!w.isDirectory() || ['node_modules', 'sampledata'].includes(w.name)) continue;
    for (const d of fs.readdirSync(path.join(BASE, w.name), { withFileTypes: true })) {
        if (!d.isDirectory()) continue;
        const id = w.name + '/' + d.name;
        const dir = path.join(BASE, w.name, d.name, 'src', 'app');
        const tsFile = path.join(dir, 'app.component.ts');
        const htmlFile = path.join(dir, 'app.component.html');
        if (!fs.existsSync(tsFile)) continue;

        let src = fs.readFileSync(tsFile, 'utf8');
        let html = fs.existsSync(htmlFile) ? fs.readFileSync(htmlFile, 'utf8') : '';
        const inline = src.match(/\btemplate\s*:\s*`([\s\S]*?)`/);
        if (inline) html += inline[1];
        if (!html) continue;

        // Every handler the template binds to a widget event that can fire on its own.
        // Anything a person has to do - click, key, mouse, drag, touch - cannot happen
        // during initialisation, so those handlers are left exactly as they are.
        const USER_DRIVEN = /^on(Click|DoubleClick|RightClick|ItemClick|RowClick|RowDoubleClick|CellClick|CellDoubleClick|ColumnClick|Key|Mouse|Drag|Drop|Touch|Swipe|Tap|Focus|Blur|ContextMenu|Scroll)/;
        const handlers = new Set();
        for (const m of html.matchAll(/\((on[A-Za-z]+)\)\s*=\s*"([A-Za-z0-9_$]+)\s*\(/g)) {
            if (USER_DRIVEN.test(m[1])) continue;
            handlers.add(m[2]);
        }
        if (!handlers.size) continue;

        // the component's view children - the things that are not ready yet
        const children = [...src.matchAll(/@ViewChild\([^)]*\)\s*([A-Za-z0-9_$]+)\s*[:;!]/g)].map(m => m[1]);
        if (!children.length) continue;

        // follow one level of delegation: handler() -> this.helper()
        const targets = new Set(handlers);
        for (const name of handlers) {
            const mb = methodBody(src, name);
            if (!mb) continue;
            for (const c of mb.body.matchAll(/\bthis\.([A-Za-z0-9_$]+)\s*\(/g)) {
                if (!children.includes(c[1])) targets.add(c[1]);
            }
        }

        const eol = src.includes('\r\n') ? '\r\n' : '\n';
        const done = [];

        for (const name of targets) {
            const mb = methodBody(src, name);
            if (!mb) continue;
            const used = children.filter(c => new RegExp(`\\bthis\\.${c}\\b`).test(mb.body));
            if (!used.length) continue;
            if (/^\s*(\/\/[^\n]*\n\s*)?if\s*\(\s*!this\./.test(mb.body)) continue;      // already guarded

            const indent = mb.indent + '    ';
            const guard = `${eol}${indent}// the widget raises this while initialising, before @ViewChild is populated` +
                `${eol}${indent}if (${used.map(c => '!this.' + c).join(' || ')}) { return; }`;
            src = src.slice(0, mb.start) + guard + src.slice(mb.start);
            guards++;
            done.push(name);
        }

        if (!done.length) continue;
        touched++;
        if (!DRY) fs.writeFileSync(tsFile, src);
        console.log(`  ${id.padEnd(46)} ${done.join(', ')}`);
    }
}

console.log(`\n${guards} handler(s) guarded across ${touched} demo(s)${DRY ? '   (dry run, nothing written)' : ''}`);
