@echo off
title Precificador e Orcamentos — Servidor Local
cd /d "%~dp0"
echo Iniciando Precificador e Orcamentos em http://127.0.0.1:3456 ...
start "" /b cmd /c "timeout /t 1 /nobreak >nul && start http://127.0.0.1:3456"
node server.mjs
pause
