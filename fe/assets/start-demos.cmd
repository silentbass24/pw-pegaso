@echo off
rem jQWidgets - start the local demo server and open the Demo Browser.
rem Needs Node.js (https://nodejs.org). Nothing is installed; the server is a single script.
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Node.js was not found, so the Demo Browser will open straight from disk.
  echo   Most demos work that way. Demos that load data with Ajax, the source view
  echo   and the StackBlitz export need a web server: install Node.js from
  echo   https://nodejs.org and run this file again.
  echo.
  start "" "%~dp0demos\index.htm"
  exit /b 0
)
node "%~dp0scripts\serve-demos.js" %*
