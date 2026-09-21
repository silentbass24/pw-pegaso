/*
  jQWidgets demo catalog builder

  Walks the /demos tree and writes /demos/catalog.js, which the Demo Browser
  (/demos/index.htm) loads. It is a plain script (not JSON) so the browser
  works when index.htm is opened straight from disk (file://), where fetch()
  is blocked.

  Usage:  node scripts/build-demo-catalog.js
  Re-run whenever demos are added, removed or renamed.
  No dependencies beyond Node.js itself.
*/
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DEMOS = path.join(ROOT, 'demos');
const OUT = path.join(DEMOS, 'catalog.js');

// Files that are not worth shipping to StackBlitz or listing in the file tree.
const BINARY_EXT = new Set(['png', 'jpg', 'jpeg', 'gif', 'ico', 'bmp', 'webp',
    'woff', 'woff2', 'ttf', 'eot', 'otf', 'db', 'xlsx', 'pdf', 'zip', 'map']);
const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', '.angular', '.git', '.vscode']);

// Friendly widget names. Anything missing falls back to a capitalised id.
const WIDGET_NAMES = {
    bargauge: 'BarGauge', barcode: 'Barcode', bulletchart: 'BulletChart', button: 'Buttons',
    buttons: 'Buttons', buttongroup: 'ButtonGroup', calendar: 'Calendar', chart: 'Chart',
    chat: 'Chat (AI)', checkbox: 'CheckBox', checkboxgroup: 'CheckBoxGroup', colorpicker: 'ColorPicker',
    combobox: 'ComboBox', complexinput: 'ComplexInput', dataadapter: 'DataAdapter',
    datatable: 'DataTable', datetimeinput: 'DateTimeInput', docking: 'Docking',
    dockinglayout: 'DockingLayout', dockpanel: 'DockPanel', dragdrop: 'DragDrop', draw: 'Draw',
    dropdownbutton: 'DropDownButton', dropdownlist: 'DropDownList', editor: 'Editor',
    expander: 'Expander', fileupload: 'FileUpload', form: 'Form', formattedinput: 'FormattedInput',
    gantt: 'Gantt', gauge: 'Gauge', grid: 'Grid', heatmap: 'HeatMap', input: 'Input',
    kanban: 'Kanban', knob: 'Knob', knockout: 'Knockout', layout: 'Layout', lineargauge: 'LinearGauge',
    linkbutton: 'LinkButton', listbox: 'ListBox', listmenu: 'ListMenu', loader: 'Loader',
    maskedinput: 'MaskedInput', menu: 'Menu', navbar: 'NavBar', navigationbar: 'NavigationBar',
    notification: 'Notification', numberinput: 'NumberInput', panel: 'Panel',
    passwordinput: 'PasswordInput', picklist: 'PickList', pivotdesigner: 'PivotDesigner',
    pivotgrid: 'PivotGrid', popover: 'Popover', progressbar: 'ProgressBar', qrcode: 'QRCode',
    radiobutton: 'RadioButton', radiobuttongroup: 'RadioButtonGroup', rangeselector: 'RangeSelector',
    rating: 'Rating', repeatbutton: 'RepeatButton', response: 'Response',
    responsivepanel: 'ResponsivePanel', ribbon: 'Ribbon', scheduler: 'Scheduler',
    scrollbar: 'ScrollBar', scrollview: 'ScrollView', slider: 'Slider', sortable: 'Sortable',
    splitlayout: 'SplitLayout', splitter: 'Splitter', switchbutton: 'SwitchButton', tabs: 'Tabs',
    tagcloud: 'TagCloud', textarea: 'TextArea', timeline: 'Timeline', timepicker: 'TimePicker',
    togglebutton: 'ToggleButton', toolbar: 'ToolBar', tooltip: 'ToolTip', touch: 'Touch',
    tree: 'Tree', treegrid: 'TreeGrid', treemap: 'TreeMap', validator: 'Validator', window: 'Window',
    bootstrapjs: 'Bootstrap integration', requirejs: 'RequireJS'
};

// Vocabulary used to split squashed demo names ("bindingtojsonstring" -> "Binding To Json String").
const WORDS = ('default functionality binding to json xml csv tsv array remote data string observable ' +
    'php mysql database js javascript jsarray cells cell rows row columns column selection editing edit ' +
    'filter filtering filterrow sort sorting grouping group paging pager virtual scrolling scroll resize ' +
    'reorder pinned frozen nested tables table keyboard navigation right left layout fluid size theme ' +
    'themes events methods api custom rendering renderer header footer aggregates auto height width ' +
    'add new bottom remove update delete grid tree list box combo drop down button buttons menu context ' +
    'integrated create component adaptive validation localization localizations format formatting ' +
    'hierarchy load state save export excel pdf print image images with without icons icon text ' +
    'checkbox check radio toggle multi multiple single line lines area bar pie donut stacked spline ' +
    'range selector annotations waterfall bubble scatter candlestick ohlc polar radar logarithmic axis ' +
    'axes labels label legend tooltips tooltip series style styling colors color scheme dynamic live ' +
    'update updates real time timer async ajax server side client responsive mobile touch drag drop ' +
    'drag-drop dragdrop sortable panel panels tab tabs window windows dialog modal popup docking ' +
    'expander collapsible ribbon toolbar tools tool splitter splitters horizontal vertical orientation ' +
    'items item children parent child template templates render rendered values value min max step ' +
    'ticks tick marks mark disabled enabled readonly required rtl direction align alignment number ' +
    'numbers input inputs masked password date dates time times picker calendar week weeks month months ' +
    'year years day days hour hours minute minutes second seconds appointments appointment view views ' +
    'resources resource all in one overview basic advanced simple full detail details show hide toggle ' +
    'visible hidden search searching autocomplete auto-complete suggestions suggest fixed fluid nested ' +
    'sparklines sparkline summary summaries computed conditional actions action bindings bound unbound ' +
    'source sources go big large small mini tiny huge million records record file files upload ' +
    'download progress bar bars gauge gauges knob rating stars star tag cloud heat map tree-map treemap ' +
    'kanban card cards board boards lane lanes swimlane task tasks project projects timeline gantt ' +
    'baseline milestones milestone dependencies dependency nonworking non-working working days ' +
    'chat ai assistant command ask classify summarize floating mock branding welcome messages message ' +
    'stream streaming typing avatars avatar dark light fluent material bootstrap tailwind office metro ' +
    'web classic flat energy blue black shiny arctic android windows phone summer orange fresh ' +
    'high contrast ui darkness lightness le frog overcast redmond smoothness start sunny glacier ' +
    'programmatic programmatically position positioning offset animation animations effects effect ' +
    'loading lazy on demand demand paginate infinite scroll chooser columnchooser merge merged cells ' +
    'span spanning span merged wrap wrapping nowrap ellipsis overflow selectionmode selectedindex ' +
    'index indexes indices deselect select selected key keys keyboard shortcut shortcuts hotkeys ' +
    'copy paste clipboard undo redo history quick quickstart getting started tutorial guide ' +
    'localstorage session storage cookie cookies url query hash link links anchor anchors iframe ' +
    'popup popups notification notifications alert alerts toast toasts confirm prompt ' +
    'percentage percent currency money price prices stock stocks trading sales orders order products ' +
    'product customers customer employees employee category categories beverages weather geo world ' +
    'europe usa us gdp nasdaq sp500 nflx goog tsla home ownership analytics website browsers browser ' +
    'share decade top ten').split(/\s+/).filter(Boolean);
const EXTRA_WORDS = ('of in on by at no or and vs an as is it up ' +
    'display first last other others weekend weekends restrict restricted restricting cascading jsonp using ' +
    'double click clicks dblclick customized customize editors editor widgets deferred defered disable enable ' +
    'ever present customization support supports hide shows showing selected selecting changing change ' +
    'changes changed toggling toggled expand expanding expanded collapse collapsed collapsing grouped ' +
    'sorted filtered paged pinning freeze freezing resizing reordering reordered draggable droppable ' +
    'dragging dropping dropped nesting hierarchical inline dialog based mode modes type types ' +
    'renderers like excel word office google maps map location locations charts ' +
    'recurrence recurring recurrent exceptions exception reminder reminders agenda localized culture ' +
    'cultures globalization global local navigate navigating navigator shortcut mouse wheel hover ' +
    'hovering focus focused blur enter leave over out keydown keyup keypress key ' +
    'overview quickstart started tutorial samples sample example examples demo demos ' +
    'dynamically statically static remotely locally virtualization virtualized loaded preload ' +
    'preloading reload reloading refresh refreshing clear clearing reset resetting bind bound rebind ' +
    'unbind observables knockout angular react vue typescript xhr rest odata websocket aspnet mvc jsp ' +
    'node express templated templating html markup content contents sub subitems submenu submenus ' +
    'subgrid subgrids multiline multilevel levels level depth checked unchecked indeterminate three ' +
    'state states tristate radios thumb thumbs track tracks sliders ranges dual handles handle flip ' +
    'flipped rotate rotated rotation orientations positions positioned absolute relative sticky dock ' +
    'docked undock undocked closable close closing open opening reopen scrolled scrolls scrollbars ' +
    'pagers pagination paginated pages sizes sizing sized widths heights minimum maximum autosize ' +
    'autosizing fit fits fitting percentages ratio aspect responsiveness breakpoint breakpoints media ' +
    'queries query desktop tablet devices gestures gesture swipe pinch zoom zooming pan panning ' +
    'selectable selections multiselect multiselection singleselection checkboxes radiobuttons ' +
    'splitbutton menus popupmenu toolbars statusbar status toast info warning error errors success ' +
    'validate validating validators rules rule regex pattern patterns masks numeric decimal decimals ' +
    'integer integers float spin spinner spinbuttons increment decrement increments precision symbol ' +
    'symbols prefix suffix placeholder strength complexity email zip postal code codes generation ' +
    'generate generated generator png svg canvas exporting exported import importing imported ' +
    'previews cut stack colour colours pickers palette palettes hex rgb hsl hsv hsb alpha opacity ' +
    'gradient gradients shadow shadows border borders radius rounded corners corner fonts imagery ' +
    'badge badges chips chip hint hints help trees treeview treeitem node nodes leaf leaves root ' +
    'roots branch branches expandable expandall collapseall searchable filterable filtermenu ' +
    'condition operator operators contains equals starts ends between greater less than empty null ' +
    'notnull unique distinct aggregate aggregation sum avg average total totals subtotal subtotals ' +
    'footers headers caption captions titles subtitle legends gridlines crosshair crosshairs marker ' +
    'markers point points areas bars doughnut funnel boxplot rangecolumn sunburst annotation trend ' +
    'trends trendline trendlines regression forecast dashboards kpi kpis metric metrics analytic ' +
    'report reports reporting finance financial sale inventory invoice invoices user users profile ' +
    'profiles login logout register registration signup signin forms field fields textbox dropdown ' +
    'lists option options editable edits read optional invisible wizard stepper accordion sections ' +
    'section modals dialogs overlay overlays lightbox layouts split boards swimlane swimlanes ' +
    'baselines dependency assignment assignments holiday holidays workday workdays shift shifts ' +
    'datetime datepicker daterange timespan duration durations today now yesterday tomorrow past ' +
    'future ago timezone timezones utc iso assistants chats chatbot bot bots llm gpt openai ' +
    'anthropic claude gemini model models prompts completion completions summary classification ' +
    'commands answer answers question questions nlp natural language autofill ratings stars bullet ' +
    'selector selectors carousel loaders indicator indicators cloud clouds breadcrumb breadcrumbs ' +
    'sidebar sidebars drawer drawers uploads uploading richtext wysiwyg markdown resizable rotatable ' +
    'theming themed styled styles scss less customtheme ltr righttoleft lefttoright locale locales ' +
    'languages translation translations accessibility accessible aria wcag screenreader focusable ' +
    'performance fast thousands records dataset datasets adapters datafields datafield identifier ' +
    'primary foreign indices property properties apis option setting settings config configuration ' +
    'configurations initialize initialization init destroy dispose creating created removing removed ' +
    'updating updated insert inserting inserted deleting deleted adding added get set getter setter ' +
    'callback callbacks function functions promise promises async await sync integration integrate ' +
    'embedded embed embedding iframes standard minimal complete extended hundred jsarray ' +
    'ordering ordered arrow arrows up down pin unpin lock locked unlock unlocked span spanned ' +
    'grouping groups group ungroup ungrouped rowdetails rowdetail details detail expanders ' +
    'columnmenu columnchooser chooser autoheight autowidth height width fixedheight fixedwidth ' +
    'scrollmode scrollmodes logical physical virtualmode selectionmode editmode editmodes ' +
    'cellhover rowhover hovered altrows alt alternating striped stripes zebra ' +
    'everpresent bottomrow toprow newrow addrow deleterow updaterow selectrow ' +
    'cellrenderer cellsrenderer rowrenderer headerrenderer renderer aggregatesrenderer ' +
    'valueaxis categoryaxis xaxis yaxis seriesgroup seriesgroups seriesgroup ' +
    'weekview dayview monthview agendaview timelineview timelineweekview timelinedayview timelinemonthview ' +
    'appointment appointments resourcesview resources allday ' +
    'nonworkingdays nonworkinghours workinghours workingdays ' +
    'buttongroup checkboxgroup radiobuttongroup ' +
    'jqx jquery js javascript ts tsx vue ng').split(/\s+/).filter(Boolean);

// Harvest words the demo authors already separated with hyphens/underscores anywhere in /demos.
function harvestWords() {
    const found = new Set();
    const visit = (dir, depth) => {
        if (depth > 3) return;
        let ents; try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
        for (const ent of ents) {
            if (SKIP_DIRS.has(ent.name)) continue;
            const stem = ent.name.replace(/\.[a-z0-9]+$/i, '');
            if (/[-_]/.test(stem)) for (const p of stem.toLowerCase().split(/[-_]+/)) if (p.length >= 3 && /^[a-z]+$/.test(p)) found.add(p);
            if (ent.isDirectory()) visit(path.join(dir, ent.name), depth + 1);
        }
    };
    visit(DEMOS, 0);
    return [...found];
}
const CURATED_SET = new Set([...WORDS, ...EXTRA_WORDS, 'way', 'ways', 'twoway', 'like', 'ide', 'non', 'nondate',
    'xaxis', 'yaxis', 'serverside', 'clientside', 'popups', 'dashboard', 'interval', 'intervals', 'placement',
    'inversed', 'inverted', 'initial', 'class', 'classes', 'serie', 'missing', 'exponential', 'notation',
    'uppercase', 'lowercase', 'hexadecimal', 'hexadecimals', 'landscape', 'portrait', 'separate', 'switch',
    'every', 'conditions', 'localize', 'localizing'].map(w => w.toLowerCase()));
// Compounds that read better split.
for (const w of ['newrow', 'righttoleft', 'lefttoright', 'filterrow', 'columnchooser', 'aggregatesrenderer']) CURATED_SET.delete(w);
const ALL_WORDS = [...CURATED_SET, ...harvestWords()];
const WORD_SET = new Set(ALL_WORDS.map(w => w.toLowerCase()));
const MAX_WORD = Math.max(...ALL_WORDS.map(w => w.length));

function segment(token) {
    // Dynamic programme: cheapest split into known words. Curated words cost 1, numbers 1,
    // words only seen by the harvester cost more the longer they are, so "default functionality"
    // beats the harvested compound "defaultfunctionality" and "add new row" beats "add newrow".
    const n = token.length;
    const best = new Array(n + 1).fill(null); // {cost, pieces}
    best[n] = { cost: 0, pieces: [] };
    for (let i = n - 1; i >= 0; i--) {
        for (let len = 1; len <= Math.min(MAX_WORD, n - i); len++) {
            const piece = token.substr(i, len);
            let cost;
            if (/^d+$/.test(piece)) cost = 1;
            else if (CURATED_SET.has(piece)) cost = 1;
            else if (WORD_SET.has(piece)) cost = 1 + len / 5;
            else continue;
            const rest = best[i + len];
            if (!rest) continue;
            const total = cost + rest.cost;
            if (!best[i] || total < best[i].cost - 1e-9) best[i] = { cost: total, pieces: [piece, ...rest.pieces] };
        }
    }
    return best[0] ? best[0].pieces : null;
}

function prettyName(raw) {
    // "typescript-grid-editing" -> "Editing"; "bindingtojsonstring" -> "Binding To Json String"
    let s = raw.replace(/\.htm[l]?$/i, '');
    const parts = s.replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(/[-_\s]+/).filter(Boolean);
    const words = [];
    for (const p of parts) {
        const lower = p.toLowerCase();
        if (lower.length <= 3) { words.push(lower); continue; }
        const seg = segment(lower);
        if (seg && seg.length <= 8) words.push(...seg); else words.push(lower);
    }
    return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function widgetName(id) {
    const key = id.replace(/^jqx/, '').toLowerCase();
    return WIDGET_NAMES[key] || key.charAt(0).toUpperCase() + key.slice(1);
}

function readTitle(file) {
    // Returns {title, desc} from <title id='Description'> and <meta name="description">.
    let html;
    try { html = fs.readFileSync(file, 'utf8'); } catch (e) { return {}; }
    const clean = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const d = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
    return { title: t ? clean(t[1]).slice(0, 400) : undefined, desc: d ? clean(d[1]).slice(0, 300) : undefined };
}

function listDirs(dir) {
    try {
        return fs.readdirSync(dir, { withFileTypes: true })
            .filter(d => d.isDirectory() && !SKIP_DIRS.has(d.name)).map(d => d.name).sort();
    } catch (e) { return []; }
}
function listHtm(dir) {
    try {
        return fs.readdirSync(dir).filter(f => {
            if (!/\.htm[l]?$/i.test(f) || /^index\.htm[l]?$/i.test(f)) return false;
            // Several demos fetch JSON from a file that carries a .htm extension
            // (jqxtree/ajax.htm and friends). Those are data, not demos, and
            // listing them puts raw JSON in front of the reader.
            try {
                const head = fs.readFileSync(path.join(dir, f), 'utf8').replace(/^﻿/, '').slice(0, 400);
                return /<html|<head|<!doctype|<body/i.test(head);
            } catch (e) { return false; }
        }).sort();
    } catch (e) { return []; }
}
function walkTextFiles(dir, base = dir, acc = []) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        if (ent.isDirectory()) { if (!SKIP_DIRS.has(ent.name)) walkTextFiles(path.join(dir, ent.name), base, acc); continue; }
        const ext = ent.name.split('.').pop().toLowerCase();
        if (BINARY_EXT.has(ext)) continue;
        acc.push(path.relative(base, path.join(dir, ent.name)).split(path.sep).join('/'));
    }
    return acc.sort();
}
function readJson(file) { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return null; } }

// ---------- JavaScript & jQuery ----------
function buildJs() {
    const base = path.join(DEMOS, 'Javascript & JQuery');
    const groups = [];
    const docs = listDirs(path.join(base, 'documentation'));
    // jQuery Mobile is not offered any more: neither the mobiledemos set nor the
    // jquerymobile integration folder. The folders stay on disk for anyone who
    // still needs them; they are just not in the browser.
    const DROPPED = new Set(['documentation', 'mobiledemos', 'jquerymobile']);
    for (const folder of listDirs(base)) {
        if (DROPPED.has(folder)) continue;
        const demos = listHtm(path.join(base, folder)).map(file => {
            const meta = readTitle(path.join(base, folder, file));
            return { file, name: prettyName(file), title: meta.title, desc: meta.desc };
        });
        if (!demos.length) continue;
        const api = docs.includes(folder) && fs.existsSync(path.join(base, 'documentation', folder, folder + '-api.htm'))
            ? `documentation/${folder}/${folder}-api.htm` : undefined;
        groups.push({ id: folder, name: widgetName(folder), api, demos });
    }
    return { label: 'JavaScript', base: 'Javascript & JQuery', groups };
}

// ---------- TypeScript ----------
function buildTs() {
    const base = path.join(DEMOS, 'Typescript');
    const groups = [];
    for (const folder of listDirs(base)) {
        const demos = listHtm(path.join(base, folder)).map(file => {
            const meta = readTitle(path.join(base, folder, file));
            const stem = file.replace(/\.htm[l]?$/i, '').replace(new RegExp('^typescript-' + folder + '-?'), '') || 'default';
            return { file, name: prettyName(stem), title: meta.title, desc: meta.desc };
        });
        if (demos.length) groups.push({ id: folder, name: widgetName(folder), demos });
    }
    return { label: 'TypeScript', base: 'Typescript', groups };
}

// ---------- Angular / React / Vue (one project per demo) ----------
function buildProjects(label, baseName, opts) {
    const base = path.join(DEMOS, baseName);
    const fileSets = [];
    const fileSetIndex = new Map();
    const groups = [];
    let skippedBinary = 0;
    for (const widget of listDirs(base)) {
        if (widget === 'sampledata' || widget === 'temp') continue;
        const demos = [];
        for (const demo of listDirs(path.join(base, widget))) {
            const dir = path.join(base, widget, demo);
            const pkg = readJson(path.join(dir, 'package.json'));
            if (!pkg) continue; // not a project (e.g. shared data folders)
            const files = walkTextFiles(dir);
            const key = files.join('\n');
            let fs_ = fileSetIndex.get(key);
            if (fs_ === undefined) { fs_ = fileSets.length; fileSets.push(files); fileSetIndex.set(key, fs_); }
            const allDeps = Object.assign({}, pkg.dependencies, pkg.devDependencies);
            const main = opts.mainCandidates.find(c => files.includes(c));
            demos.push({
                id: demo, name: prettyName(demo), fs: fs_, main,
                fw: allDeps[opts.fwPackage], jqx: allDeps['jqwidgets-ng'] || allDeps['jqwidgets-scripts'] || allDeps['jqwidgets-framework'],
                start: pkg.scripts && (pkg.scripts.start ? 'npm start' : pkg.scripts.dev ? 'npm run dev' : pkg.scripts.build ? 'npm run build' : undefined)
            });
        }
        if (demos.length) groups.push({ id: widget, name: widgetName(widget), demos });
    }
    return { label, base: baseName, fileSets, groups, fwPackage: opts.fwPackage, startHint: opts.startHint, stackblitz: opts.stackblitz };
}

// Titles for framework demos come from the matching JavaScript demo when the names line up.
function borrowTitles(jsCatalog, fwCatalog) {
    const byKey = new Map();
    for (const g of jsCatalog.groups) for (const d of g.demos) byKey.set(g.id + '/' + d.file.replace(/\.htm[l]?$/i, '').replace(/[-_]/g, '').toLowerCase(), d);
    const candidates = (id) => ['jqx' + id, 'jqx' + id.replace(/s$/, ''), id === 'buttons' ? 'jqxbutton' : null,
        /button$/.test(id) ? 'jqxbutton' : null, id === 'lineargauge' ? 'jqxgauge' : null].filter(Boolean);
    let borrowed = 0;
    for (const g of fwCatalog.groups) {
        for (const d of g.demos) {
            const norm = d.id.replace(/[-_]/g, '').toLowerCase();
            for (const c of candidates(g.id)) {
                const js = byKey.get(c + '/' + norm);
                if (js) { d.title = js.title; d.desc = js.desc; d.js = c + '/' + js.file; borrowed++; break; }
            }
        }
    }
    return borrowed;
}

function themes() {
    const dir = path.join(ROOT, 'jqwidgets', 'styles');
    return fs.readdirSync(dir)
        .map(f => (f.match(/^jqx\.([a-z0-9_-]+)\.css$/i) || [])[1]).filter(Boolean)
        .filter(t => t !== 'base' && !/-ie$/.test(t) && t !== 'fluent_old').sort();
}

function version() {
    const m = fs.readFileSync(path.join(ROOT, 'ReleaseNotes.txt'), 'utf8').match(/jQWidgets v([\d.]+) Release, ([^\n\r]+)/);
    return { version: m ? m[1] : 'unknown', date: m ? m[2].trim() : '' };
}

// ---------- main ----------
const t0 = Date.now();
const js = buildJs();
const ts = buildTs();
const angular = buildProjects('Angular', 'Angular', {
    fwPackage: '@angular/core', mainCandidates: ['src/app/app.component.ts', 'src/app/app.component.html'],
    startHint: 'npm install && npm start', stackblitz: { startCommand: 'npm start', ok: true }
});
const react = buildProjects('React', 'React-TSX', {
    fwPackage: 'react', mainCandidates: ['src/App.tsx', 'src/App.jsx', 'src/index.tsx'],
    startHint: 'npm install && npm run dev', stackblitz: { startCommand: 'npm run dev', ok: true }
});
const vue = buildProjects('Vue', 'Vue.js', {
    fwPackage: 'vue', mainCandidates: ['App.vue', 'src/App.vue', 'main.js'],
    startHint: 'npm install && npm start   (builds dist/, then serve index.htm)',
    // These build locally on current Node, but webpack 3 has no dev server here and
    // StackBlitz's container is not something we verify per release.
    stackblitz: { startCommand: 'npm start', ok: false, note: 'These projects are Vue 2 + webpack 3. They install and build locally, but the export is not verified in StackBlitz - Vue 3 migration is Phase 2 in MODERNIZATION-PLAN.md.' }
});
const borrowed = { angular: borrowTitles(js, angular), react: borrowTitles(js, react), vue: borrowTitles(js, vue) };

const count = (c) => c.groups.reduce((n, g) => n + g.demos.length, 0);
const catalog = {
    ...version(),
    generated: new Date().toISOString(),
    themes: themes(),
    frameworks: { js, ts, angular, react, vue },
    counts: { js: count(js), ts: count(ts), angular: count(angular), react: count(react), vue: count(vue) }
};

const header = `/* Generated by scripts/build-demo-catalog.js on ${catalog.generated}. Do not edit by hand. */\n`;
fs.writeFileSync(OUT, header + 'window.JQX_DEMO_CATALOG = ' + JSON.stringify(catalog) + ';\n');

const kb = Math.round(fs.statSync(OUT).size / 1024);
console.log(`Wrote ${path.relative(ROOT, OUT)} (${kb} KB) in ${Date.now() - t0} ms`);
console.log(`  JavaScript: ${catalog.counts.js} demos in ${js.groups.length} widgets`);
console.log(`  TypeScript: ${catalog.counts.ts} demos in ${ts.groups.length} widgets`);
console.log(`  Angular:    ${catalog.counts.angular} projects in ${angular.groups.length} widgets, ${angular.fileSets.length} distinct file sets, ${borrowed.angular} titles borrowed`);
console.log(`  React:      ${catalog.counts.react} projects in ${react.groups.length} widgets, ${react.fileSets.length} distinct file sets, ${borrowed.react} titles borrowed`);
console.log(`  Vue:        ${catalog.counts.vue} projects in ${vue.groups.length} widgets, ${vue.fileSets.length} distinct file sets, ${borrowed.vue} titles borrowed`);
console.log(`  Themes:     ${catalog.themes.length}`);
