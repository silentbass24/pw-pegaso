@echo off
cd /d C:\Users\Workstation\Documents\Laurea Informatica\Tesi\project-work

REM Installa dipendenze (usa la venv)
call be\.venv\Scripts\activate
pip install -r be\requirements.txt
deactivate

REM Avvia backend in nuova finestra (venv attivato)
start "" cmd /k "cd /d C:\Users\Workstation\Documents\Laurea Informatica\Tesi\project-work && call be\.venv\Scripts\activate && python -m be.webserver"

REM Avvia Tailwind watcher in nuova finestra
start "" cmd /k "cd /d C:\Users\Workstation\Documents\Laurea Informatica\Tesi\project-work && .\fe\tailwindcss.exe -i .\fe\styles\input.css -o .\fe\styles\output.css --watch --content \"fe/index.html\" \"fe/styles/**/*.css\""

start "" cmd /k "cd /d C:\Users\Workstation\Documents\Laurea Informatica\Tesi\project-work && call fe\pages\dashboard.html"

pause