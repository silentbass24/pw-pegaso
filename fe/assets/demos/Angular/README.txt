jQWidgets Angular demos
=======================

Each folder is a complete Angular 19 project (standalone components, Angular CLI)
that uses the jqwidgets-ng package, so it needs nothing outside its own folder.

Quickest look, nothing to install
---------------------------------
Open the Demo Browser (double-click start-demos.cmd at the root of the SDK),
choose the Angular tab, pick a demo and press "Open in StackBlitz".

Running a demo locally
----------------------
1. Open a demo folder in a terminal, for example:
       cd grid\defaultfunctionality
2. Install its dependencies once:
       npm install
3. Start the dev server:
       npm start
   The Angular CLI prints the address, normally http://localhost:4200/

To produce a static build instead:
       npm run build          -> writes dist/

Installing once for many demos
------------------------------
Every demo has the same dependency tree. If you want to try several, install
in one of them and link that node_modules into the others rather than
installing 863 times (on Windows: mklink /J node_modules ..\..\grid\defaultfunctionality\node_modules).
scripts/smoke-ng-demos.js at the SDK root does exactly this to build all of them.

What is in a demo
-----------------
   src/app/app.component.ts     the demo itself - the widget and its data
   src/app/app.component.html   the template
   src/main.ts                  bootstraps the standalone component
   src/globals.d.ts             the jQWidgets typings the jqwidgets-ng package
                                does not pull in by itself
   src/assets/                  data files the demo fetches at runtime, and its
                                images; copied into the build by angular.json

Notes
-----
- The widgets come from the jqwidgets-ng package (import ... from
  'jqwidgets-ng/jqxgrid'). All demos target the same jQWidgets release as this
  SDK.
- A demo that creates a widget by name at runtime (jqwidgets.createInstance)
  imports that widget's bundle explicitly, because each jqwidgets-ng entry
  point only loads its own widget.
- The demos need no network access. Data, images and globalization files are
  in the demo folder.
- The whole set can be built and loaded in a real browser with
       node scripts/smoke-ng-demos.js
  from the SDK root (see scripts/verify-demos.js for the full check).
