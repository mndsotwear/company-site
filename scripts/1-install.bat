@echo off
chcp 65001 >nul
cd /d "%~dp0.."
set LOG=logs\install.txt
echo === INSTALL %date% %time% === > %LOG%
call npm install --no-audit --no-fund >> %LOG% 2>&1
echo EXIT=%errorlevel% >> %LOG%
call node scripts\create-db.mjs >> %LOG% 2>&1
echo DB=%errorlevel% >> %LOG%
echo === DONE === >> %LOG%
exit
