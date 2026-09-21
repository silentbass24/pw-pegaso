jQWidgets Vue demos
===================

Each folder is a complete Vue 2 + webpack project that uses the jqwidgets-scripts
package, so it needs nothing outside its own folder.

These demos are Vue 2.5. Vue 2 reached end of life in December 2023; a Vue 3 +
Vite version of this set is planned (see MODERNIZATION-PLAN.md at the SDK root).
Until then they still install and build on current Node.js.

Quickest look, nothing to install
---------------------------------
Open the Demo Browser (double-click start-demos.cmd at the root of the SDK),
choose the Vue tab, pick a demo and press "Open in StackBlitz".

Running a demo locally
----------------------
1. Open a demo folder in a terminal, for example:
       cd grid\defaultfunctionality
2. Install its dependencies once:
       npm install
3. Build the bundle:
       npm run build          -> writes dist/main.bundle.js
4. Serve the folder and open index.htm. There is no dev server in these
   projects; any static server works, for example from the demo folder:
       npx serve .
   or from the SDK root:
       node scripts/serve-demos.js
   and browse to demos/Vue.js/grid/defaultfunctionality/index.htm.

What is in a demo
-----------------
   App.vue            the demo itself - the widget and its data
   main.js            mounts App
   index.htm          the page: loads jqx.base.css, the bundle, and any data script
   webpack.config.js  the build
   *.txt, *.xml ...   data files the demo fetches at runtime, if it has any

Notes
-----
- The widgets come from the jqwidgets-scripts package (import ... from
  "jqwidgets-scripts/jqwidgets-vue/vue_jqx*.vue"). All demos target the same
  jQWidgets release as this SDK.
- The demos need no network access. Data, images and generatedata.js are in
  the demo folder.
- The whole set can be built and loaded in a real browser with
       node scripts/smoke-vue-demos.js
  from the SDK root (see scripts/verify-demos.js for the full check).
