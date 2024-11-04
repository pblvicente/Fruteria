@echo off
    start cmd /k "json-server --watch ..\json\fruteria.json --port 3000"
    start cmd /k "sass --watch ..\scss\custom.scss ..\css\custom.css"
pause