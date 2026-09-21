#!/bin/sh
# jQWidgets - start the local demo server and open the Demo Browser.
# Needs Node.js (https://nodejs.org). Nothing is installed; the server is a single script.
cd "$(dirname "$0")" || exit 1
if ! command -v node >/dev/null 2>&1; then
  echo
  echo "  Node.js was not found, so the Demo Browser will open straight from disk."
  echo "  Most demos work that way. Demos that load data with Ajax, the source view"
  echo "  and the StackBlitz export need a web server: install Node.js from"
  echo "  https://nodejs.org and run this file again."
  echo
  case "$(uname)" in
    Darwin) open "demos/index.htm" ;;
    *) xdg-open "demos/index.htm" 2>/dev/null || echo "  Open demos/index.htm in your browser." ;;
  esac
  exit 0
fi
exec node scripts/serve-demos.js "$@"
