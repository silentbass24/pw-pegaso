/*
  Make every Angular demo import what it actually uses.

  A standalone component has to list, in its own `imports`, every module whose
  elements its template uses - there is no NgModule left to supply them. A fifth
  of the demos do not, so they fail to compile with NG8001 / NG8002 / NG8004.
  The same demos sometimes use a TypeScript symbol (ViewEncapsulation, a
  jqx*Component type) without importing it, which fails with TS2304.

  This finds both by comparing what the template and component body use against
  what the component declares, and adds only what is missing.

  Usage
    node scripts/fix-angular-imports.js --dry-run     # report, write nothing
    node scripts/fix-angular-imports.js               # apply
    node scripts/fix-angular-imports.js --only chart  # one widget folder

  No dependencies beyond Node.js. Idempotent: a second run reports nothing.
*/
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE = path.join(ROOT, 'demos', 'Angular');
const argv = process.argv.slice(2);
const DRY = argv.includes('--dry-run');
const onlyIdx = argv.indexOf('--only');
const ONLY = onlyIdx >= 0 ? argv[onlyIdx + 1] : null;

// Element -> module, for the handful whose module name is not the element name + "Module".
const MODULE_OVERRIDES = {
    jqxButton: 'jqxButtonModule', jqxToggleButton: 'jqxToggleButtonModule',
    jqxRepeatButton: 'jqxRepeatButtonModule', jqxSwitchButton: 'jqxSwitchButtonModule',
    jqxLinkButton: 'jqxLinkButtonModule'
};
// Module -> package subpath. Most follow jqwidgets-ng/<lowercased element>.
const PACKAGE_OVERRIDES = {
    jqxButtonModule: 'jqwidgets-ng/jqxbuttons', jqxToggleButtonModule: 'jqwidgets-ng/jqxbuttons',
    jqxRepeatButtonModule: 'jqwidgets-ng/jqxbuttons', jqxSwitchButtonModule: 'jqwidgets-ng/jqxswitchbutton',
    jqxLinkButtonModule: 'jqwidgets-ng/jqxbuttons', jqxBulletChartModule: 'jqwidgets-ng/jqxbulletchart',
    jqxDropDownButtonModule: 'jqwidgets-ng/jqxdropdownbutton', jqxDropDownListModule: 'jqwidgets-ng/jqxdropdownlist',
    jqxCheckBoxModule: 'jqwidgets-ng/jqxcheckbox', jqxRadioButtonModule: 'jqwidgets-ng/jqxradiobutton',
    jqxComboBoxModule: 'jqwidgets-ng/jqxcombobox', jqxListBoxModule: 'jqwidgets-ng/jqxlistbox',
    jqxListMenuModule: 'jqwidgets-ng/jqxlistmenu', jqxNumberInputModule: 'jqwidgets-ng/jqxnumberinput',
    jqxMaskedInputModule: 'jqwidgets-ng/jqxmaskedinput', jqxPasswordInputModule: 'jqwidgets-ng/jqxpasswordinput',
    jqxFormattedInputModule: 'jqwidgets-ng/jqxformattedinput', jqxComplexInputModule: 'jqwidgets-ng/jqxcomplexinput',
    jqxDateTimeInputModule: 'jqwidgets-ng/jqxdatetimeinput', jqxTimePickerModule: 'jqwidgets-ng/jqxtimepicker',
    jqxColorPickerModule: 'jqwidgets-ng/jqxcolorpicker', jqxFileUploadModule: 'jqwidgets-ng/jqxfileupload',
    jqxProgressBarModule: 'jqwidgets-ng/jqxprogressbar', jqxRangeSelectorModule: 'jqwidgets-ng/jqxrangeselector',
    jqxResponsivePanelModule: 'jqwidgets-ng/jqxresponsivepanel', jqxScrollViewModule: 'jqwidgets-ng/jqxscrollview',
    jqxScrollBarModule: 'jqwidgets-ng/jqxscrollbar', jqxNavigationBarModule: 'jqwidgets-ng/jqxnavigationbar',
    jqxNavBarModule: 'jqwidgets-ng/jqxnavbar', jqxTagCloudModule: 'jqwidgets-ng/jqxtagcloud',
    jqxTreeMapModule: 'jqwidgets-ng/jqxtreemap', jqxTreeGridModule: 'jqwidgets-ng/jqxtreegrid',
    jqxDataTableModule: 'jqwidgets-ng/jqxdatatable', jqxPivotGridModule: 'jqwidgets-ng/jqxpivotgrid',
    jqxDockingLayoutModule: 'jqwidgets-ng/jqxdockinglayout', jqxDockPanelModule: 'jqwidgets-ng/jqxdockpanel',
    jqxButtonGroupModule: 'jqwidgets-ng/jqxbuttongroup', jqxCheckBoxGroupModule: 'jqwidgets-ng/jqxcheckboxgroup',
    jqxRadioButtonGroupModule: 'jqwidgets-ng/jqxradiobuttongroup', jqxSplitLayoutModule: 'jqwidgets-ng/jqxsplitlayout',
    jqxLinearGaugeModule: 'jqwidgets-ng/jqxlineargauge', jqxBarGaugeModule: 'jqwidgets-ng/jqxbargauge',
    jqxPickListModule: 'jqwidgets-ng/jqxpicklist', jqxPivotDesignerModule: 'jqwidgets-ng/jqxpivotdesigner'
};
const CORE_SYMBOLS = ['ViewEncapsulation', 'ViewChild', 'ViewChildren', 'ElementRef', 'ChangeDetectorRef',
    'ChangeDetectionStrategy', 'Renderer2', 'AfterViewInit', 'AfterViewChecked', 'OnInit', 'OnDestroy',
    'OnChanges', 'SimpleChanges', 'Input', 'Output', 'EventEmitter', 'HostListener', 'TemplateRef', 'NgZone', 'inject'];

// The tables above are a fallback. Where jqwidgets-ng is installed we read the
// truth out of its .d.ts instead, because neither name can be derived reliably:
// the element <jqxToolbar> is declared by class jqxToolBarComponent in
// jqwidgets-ng/jqxtoolbar, so guessing from the selector produces
// "jqxToolbarModule", which does not exist and does not build.
const NG_ROOT = [
    path.join(ROOT, 'node_modules', 'jqwidgets-ng'),
    'C:/jqxng/_tpl/node_modules/jqwidgets-ng',
].find(p => { try { return fs.existsSync(p); } catch (e) { return false; } });

const SELECTOR_TO_MODULE = new Map();   // lowercased selector -> real module class
const EXPORT_TO_PACKAGE = new Map();    // exported class -> 'jqwidgets-ng/<folder>'
if (NG_ROOT) {
    for (const d of fs.readdirSync(NG_ROOT)) {
        const dir = path.join(NG_ROOT, d);
        try { if (!fs.statSync(dir).isDirectory()) continue; } catch (e) { continue; }
        let text = '';
        for (const f of fs.readdirSync(dir)) if (f.endsWith('.d.ts')) text += fs.readFileSync(path.join(dir, f), 'utf8');
        for (const m of text.matchAll(/export declare class ([A-Za-z0-9_]+)/g))
            EXPORT_TO_PACKAGE.set(m[1], 'jqwidgets-ng/' + d);
        const mod = (text.match(/export declare class ([A-Za-z0-9_]+Module)/) || [])[1];
        if (!mod) continue;
        for (const m of text.matchAll(/ComponentDeclaration<[^,]+,\s*"([^"]+)"/g))
            if (/^jqx/i.test(m[1])) SELECTOR_TO_MODULE.set(m[1].trim().toLowerCase(), mod);
    }
}

function moduleFor(el) {
    return SELECTOR_TO_MODULE.get(String(el).toLowerCase()) || MODULE_OVERRIDES[el] || el + 'Module';
}
function packageFor(mod) {
    return EXPORT_TO_PACKAGE.get(mod) || PACKAGE_OVERRIDES[mod] ||
        'jqwidgets-ng/' + mod.replace(/Module$/, '').toLowerCase();
}
function packageForComponent(name) {
    return EXPORT_TO_PACKAGE.get(name) || packageFor(name.replace(/Component$/, 'Module'));
}

const read = f => { try { return fs.readFileSync(f, 'utf8'); } catch (e) { return null; } };
const stripBom = s => s.replace(/^﻿/, '');

const results = [];
const skipped = [];
const legacyPaths = [];

const widgets = fs.readdirSync(BASE, { withFileTypes: true })
    .filter(d => d.isDirectory() && !['node_modules', 'sampledata'].includes(d.name))
    .filter(d => !ONLY || d.name === ONLY);

for (const widget of widgets) {
    for (const demo of fs.readdirSync(path.join(BASE, widget.name), { withFileTypes: true })) {
        if (!demo.isDirectory()) continue;
        const dir = path.join(BASE, widget.name, demo.name);
        const id = widget.name + '/' + demo.name;
        const compPath = ['src/app/app.component.ts', 'src/app.component.ts'].map(p => path.join(dir, p)).find(fs.existsSync);
        if (!compPath) continue;

        const raw = read(compPath);
        if (raw === null) continue;
        const bom = raw.startsWith('﻿') ? '﻿' : '';
        let comp = stripBom(raw);
        if (!/@Component\(\{/.test(comp)) continue;

        // Imports left over from before the move to the jqwidgets-ng package:
        // "jqwidgets-scripts/jqwidgets-ts/angular_jqxfoo.ts" is not a dependency
        // of any demo, so it fails with TS2307 - and where the component also
        // imports the same symbol from jqwidgets-ng, with TS2300 on top.
        let legacyFixed = 0;
        comp = comp.replace(/^[ \t]*import\s*\{([^}]*)\}\s*from\s*['"]jqwidgets-scripts\/jqwidgets-ts\/angular_(jqx[a-z]+)(?:\.ts)?['"]\s*;?[ \t]*\r?\n/gmi,
            (line, names, widget) => {
                legacyFixed++;
                const wanted = names.split(',').map(s => s.trim()).filter(Boolean);
                const target = 'jqwidgets-ng/' + widget.toLowerCase();
                const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const already = new RegExp("^[ \\t]*import\\s*\\{([^}]*)\\}\\s*from\\s*['\"]" + escaped + "['\"]", 'm').exec(comp);
                // Already imported from the right place: the legacy line is pure duplication.
                if (already) {
                    const have = already[1].split(',').map(s => s.trim());
                    if (wanted.every(n => have.includes(n))) return '';
                }
                return `import { ${wanted.join(', ')} } from '${target}';\n`;
            });
        if (legacyFixed) legacyPaths.push(id);

        const tpl = stripBom(read(compPath.replace(/\.ts$/, '.html')) || '');
        const inline = (comp.match(/template:\s*`([\s\S]*?)`/) || [])[1] || '';
        const html = tpl + '\n' + inline;
        const body = comp.replace(/^[ \t]*import\s*\{[^}]*\}[^\n]*$/gm, '').replace(/^[ \t]*import[\s{][^\n]*$/gm, '');

        // What the component already has.
        const importsMatch = comp.match(/imports:\s*\[([\s\S]*?)\]/);
        const declared = importsMatch ? importsMatch[1].split(',').map(s => s.trim()).filter(Boolean) : [];
        const importedNames = new Set();
        const importSources = new Map(); // module specifier -> names
        // Leading whitespace and line breaks inside the braces are both real in
        // these files, so the statement is matched wherever it starts on a line.
        const importRe = /^[ \t]*import\s*\{([^}]*)\}\s*from\s*['"]([^'"]+)['"]\s*;?[ \t]*$/gm;
        let m;
        while ((m = importRe.exec(comp))) {
            const names = m[1].split(',').map(s => s.trim()).filter(Boolean);
            names.forEach(n => importedNames.add(n.split(/\s+as\s+/).pop()));
            importSources.set(m[2], names);
        }

        // What it needs.
        const needModules = [];
        const els = new Set();
        const elRe = /<(jqx[A-Za-z]+)[\s>/]/g;
        while ((m = elRe.exec(html))) els.add(m[1]);
        for (const el of els) {
            const mod = moduleFor(el);
            if (!declared.includes(mod)) needModules.push(mod);
        }
        if (/\[\(ngModel\)\]|\[ngModel\]|\bngModel\b/.test(html) && !declared.includes('FormsModule')) needModules.push('FormsModule');
        if (/\*ngIf|\*ngFor|\[ngClass\]|\[ngStyle\]|\*ngSwitch|\[ngSwitch\]|\|\s*(json|date|uppercase|lowercase|titlecase|number|currency|async|percent|slice)\b/.test(html)
            && !declared.includes('CommonModule')) needModules.push('CommonModule');

        const needSymbols = [];
        for (const sym of CORE_SYMBOLS) {
            if (new RegExp('(?<![\\w$])' + sym + '(?![\\w$])').test(body) && !importedNames.has(sym)) needSymbols.push({ name: sym, from: '@angular/core' });
        }
        const seen = new Set();
        const compRe = /\b(jqx[A-Za-z]+Component)\b/g;
        while ((m = compRe.exec(body))) {
            const n = m[1];
            if (seen.has(n) || importedNames.has(n)) continue;
            seen.add(n);
            needSymbols.push({ name: n, from: packageForComponent(n) });
        }

        const uniqModules = [...new Set(needModules)];
        if (!uniqModules.length && !needSymbols.length) {
            if (legacyFixed && !DRY) fs.writeFileSync(compPath, bom + comp);
            if (legacyFixed) results.push({ id, modules: [], symbols: [], legacy: legacyFixed });
            continue;
        }

        // 1) add the modules to the imports array, creating one when the
        //    decorator has none (a standalone component with no imports at all)
        let created = false;
        if (uniqModules.length) {
            if (importsMatch) {
                const merged = declared.concat(uniqModules);
                comp = comp.slice(0, importsMatch.index) +
                    'imports: [' + merged.join(', ') + ']' +
                    comp.slice(importsMatch.index + importsMatch[0].length);
            } else {
                const dec = comp.match(/@Component\(\{[ \t]*\r?\n([ \t]*)/);
                if (!dec) { skipped.push({ id, why: 'unreadable @Component decorator', need: uniqModules.join(', ') }); continue; }
                const indent = dec[1];
                comp = comp.replace(/@Component\(\{[ \t]*\r?\n/, m => m + indent + 'imports: [' + uniqModules.join(', ') + '],\n');
                created = true;
            }
        }

        // 2) make sure every added name is imported, merging into an existing statement when there is one
        const toImport = uniqModules.map(mod => ({
            name: mod,
            from: mod === 'FormsModule' ? '@angular/forms' : mod === 'CommonModule' ? '@angular/common' : packageFor(mod)
        })).concat(needSymbols).filter(x => !importedNames.has(x.name));

        const bySource = new Map();
        for (const x of toImport) {
            if (!bySource.has(x.from)) bySource.set(x.from, []);
            if (!bySource.get(x.from).includes(x.name)) bySource.get(x.from).push(x.name);
        }
        for (const [from, names] of bySource) {
            const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const existing = new RegExp("^[ \\t]*import\\s*\\{([^}]*)\\}\\s*from\\s*['\"]" + escaped + "['\"]\\s*;?[ \\t]*$", 'm').exec(comp);
            if (existing) {
                const have = existing[1].split(',').map(s => s.trim()).filter(Boolean);
                const add = names.filter(n => !have.includes(n));
                if (!add.length) continue;
                comp = comp.slice(0, existing.index) +
                    `import { ${have.concat(add).join(', ')} } from '${from}';` +
                    comp.slice(existing.index + existing[0].length);
            } else {
                const line = `import { ${names.join(', ')} } from '${from}';\n`;
                // "import" followed by whitespace or a brace: this must not match
                // the decorator's own "imports:" line, or the statement lands inside it.
                const lastImport = [...comp.matchAll(/^[ \t]*import[\s{][^\n]*\n/gm)].pop();
                const at = lastImport ? lastImport.index + lastImport[0].length : 0;
                comp = comp.slice(0, at) + line + comp.slice(at);
            }
        }

        if (!DRY) fs.writeFileSync(compPath, bom + comp);
        results.push({ id, modules: uniqModules, symbols: needSymbols.map(s => s.name), created, legacy: legacyFixed });
    }
}

console.log(`${results.length} Angular demos updated${DRY ? ' (dry run, nothing written)' : ''}\n`);
for (const r of results.slice(0, 40)) {
    console.log('  ' + r.id.padEnd(46) + [r.modules.join(', '), r.symbols.join(', ')].filter(Boolean).join('  +  ') + (r.legacy ? '  [legacy path fixed]' : '') + (r.created ? '   (imports array created)' : ''));
}
if (results.length > 40) console.log(`  … and ${results.length - 40} more`);
if (skipped.length) {
    console.log(`\n${skipped.length} need a look by hand:`);
    for (const s of skipped) console.log('  ! ' + s.id + ' (' + s.why + ') needs ' + s.need);
}
console.log('\nNext: node scripts/verify-demo-builds.js --fw angular --count 10');
