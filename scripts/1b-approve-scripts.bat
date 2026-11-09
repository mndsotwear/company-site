@echo off
chcp 65001 >nul
cd /d "%~dp0.."
set LOG=logs\approve.txt
echo === APPROVE === > %LOG%
call npm install-scripts approve sharp esbuild @parcel/watcher @swc/core >> %LOG% 2>&1
echo EXIT1=%errorlevel% >> %LOG%
call npm rebuild >> %LOG% 2>&1
echo EXIT2=%errorlevel% >> %LOG%
call npm install-scripts ls >> %LOG% 2>&1
echo === DONE === >> %LOG%
exit
