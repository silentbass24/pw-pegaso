/*
  One command for the whole demo pass: apply every fixer, then prove the demos work.

  The fixers each repair one class of defect and are idempotent, but they have an
  order - a template's tags must be respelled before the module for that tag is
  looked up, the bundles a demo creates by name must be imported before the
  dataAdapter shim decides whether it is still needed - and that order lived in one
  person's head. Now it lives here.

  Usage
    node scripts/verify-demos.js                 # fix, rebuild the catalog, then sweep every set
    node scripts/verify-demos.js --fix           # fixers and catalog only (a few seconds)
    node scripts/verify-demos.js --dry-run       # report what the fixers would change
    node scripts/verify-demos.js --sweep js      # one sweep: js | angular | react | vue
    node scripts/verify-demos.js --sweep all     # the four sweeps, one after another

  The sweeps run one at a time on purpose: two at once share CPU and the browser
  profiles, and that produced hundreds of false failures. Budget roughly ten
  minutes for JavaScript and an hour or more for each of Angular, React and Vue.

  The Angular fixers read the truth about widget names and bundles out of an
  installed jqwidgets-ng. They look in ./node_modules first and then in the Angular
  sweep's shared install (C:/jqxng/_tpl). If neither exists, run the Angular sweep
  once - it installs the tree - or `npm install --no-save jqwidgets-ng@27` here.
*/
'use strict';

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const DRY = argv.includes('--dry-run');
const FIX_ONLY = argv.includes('--fix');
const SWEEP = arg('sweep', null);           // js | angular | react | vue | all

// In dependency order. Each is safe to re-run.
const FIXERS = [
    ['align-demo-versions.js',              'pin every demo to jQWidgets 27, add the typings shim, standalone bootstrap'],
    ['fix-angular-assets.js',               'copy src/assets into the Angular build output'],
    ['fix-angular-selector-case.js',        'spell every jqx tag the way the package declares its selector'],
    ['fix-angular-import-paths.js',         'import each jqwidgets-ng symbol from the folder that exports it'],
    ['fix-angular-duplicate-imports.js',    'drop the same name imported twice'],
    ['fix-angular-imports.js',              'import the modules and symbols a component uses'],
    ['fix-angular-template-modules.js',     'list in `imports` every module the template needs'],
    ['fix-angular-component-imports.js',    'import what the `imports` array names'],
    ['fix-angular-createinstance-modules.js', 'load the widgets a demo creates by name at runtime'],
    ['fix-angular-jqxdata-import.js',       'load jqx.dataAdapter where no bundle provides it'],
    ['fix-angular-early-event-handlers.js', 'guard handlers the widgets fire before @ViewChild is set'],
    ['fix-angular-globalization.js',        'ship Globalize and the culture files locally'],
    ['fix-react19-render.js',               'move off ReactDOM.render, which React 19 removed'],
    ['fix-react-theme-css.js',              'import the theme stylesheet each React demo names'],
    ['fix-react-cra-leftovers.js',          'remove the dead create-react-app files that break tsc'],
    ['fix-vue-demo-data.js',                'copy the data file each Vue demo asks for'],
    ['fix-vue-generatedata.js',             'load generatedata.js locally instead of from jqwidgets.com'],
    ['fix-js-logo-injection.js',            'remove the logo block spliced inside <script> in the print demos'],
    ['fix-demo-remote-images.js',           'serve every image from the SDK instead of jqwidgets.com'],
];

const SWEEPS = {
    js:      ['smoke-js-demos.js'],
    angular: ['smoke-ng-demos.js', '--keep-going'],
    react:   ['smoke-react-demos.js', '--keep-going'],
    vue:     ['smoke-vue-demos.js', '--keep-going'],
};

function run(script, extra, label) {
    const args = [path.join(__dirname, script), ...extra];
    const r = spawnSync(process.execPath, args, { cwd: ROOT, stdio: 'inherit' });
    if (r.status !== 0) {
        console.log(`\n!! ${script} exited with ${r.status}${label ? '   (' + label + ')' : ''}`);
        return false;
    }
    return true;
}

function heading(text) {
    console.log('\n' + '='.repeat(78) + '\n' + text + '\n' + '='.repeat(78));
}

let ok = true;

if (!SWEEP) {
    const ng = [path.join(ROOT, 'node_modules', 'jqwidgets-ng'), 'C:/jqxng/_tpl/node_modules/jqwidgets-ng'].some(p => fs.existsSync(p));
    if (!ng) {
        console.log('jqwidgets-ng is not installed anywhere the Angular fixers can read it.');
        console.log('Run the Angular sweep once (node scripts/smoke-ng-demos.js --limit 1) or `npm install --no-save jqwidgets-ng@27` here, then retry.');
        process.exit(2);
    }

    heading(DRY ? 'Fixers (dry run - nothing is written)' : 'Fixers');
    for (const [script, what] of FIXERS) {
        if (!fs.existsSync(path.join(__dirname, script))) { console.log(`\n-- ${script} is missing, skipped`); continue; }
        console.log(`\n-- ${script}: ${what}`);
        if (!run(script, DRY ? ['--dry-run'] : [], what)) ok = false;
    }

    if (!DRY) {
        heading('Demo Browser catalog');
        if (!run('build-demo-catalog.js', [], 'catalog')) ok = false;
    }
}

if (!FIX_ONLY && !DRY) {
    const which = SWEEP === 'all' || !SWEEP ? Object.keys(SWEEPS) : [SWEEP];
    for (const name of which) {
        if (!SWEEPS[name]) { console.log(`no such sweep: ${name} (js | angular | react | vue | all)`); process.exit(2); }
        const [script, ...extra] = SWEEPS[name];
        heading(`Sweep: ${name}`);
        if (!run(script, extra, name)) ok = false;
    }
}

console.log('');
console.log(ok ? 'done - everything passed' : 'done - something above needs attention');
process.exit(ok ? 0 : 1);
