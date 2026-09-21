jQWidgets React demos
=====================

Each folder is a complete Vite + React 19 + TypeScript project that uses the
jqwidgets-scripts package, so it needs nothing outside its own folder.

Quickest look, nothing to install
---------------------------------
Open the Demo Browser (double-click start-demos.cmd at the root of the SDK),
choose the React tab, pick a demo and press "Open in StackBlitz". The project
opens and runs in the browser.

Running a demo locally
----------------------
1. Open a demo folder in a terminal, for example:
       cd grid\defaultfunctionality
2. Install its dependencies once:
       npm install
3. Start the dev server:
       npm run dev
   Vite prints the address, normally http://localhost:5173/

To produce a static build instead:
       npm run build          -> writes dist/
       npm run preview        -> serves dist/ so you can check it

What is in a demo
-----------------
   src/App.tsx      the demo itself - the widget and its data
   src/main.tsx     mounts App and imports jqx.base.css plus the theme the demo uses
   index.html       the page Vite serves
   public/          data files the demo fetches at runtime, if it has any

Notes
-----
- The widgets come from the jqwidgets-scripts package (import ... from
  'jqwidgets-scripts/jqwidgets-react-tsx/...'). The version is pinned in each
  package.json; all demos target the same jQWidgets release as this SDK.
- The demos need no network access. Data and images are in the demo folder.
- The whole set can be built and loaded in a real browser with
       node scripts/smoke-react-demos.js
  from the SDK root (see scripts/verify-demos.js for the full check).
