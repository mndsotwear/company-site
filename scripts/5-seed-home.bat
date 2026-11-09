@echo off
chcp 65001 >nul
cd /d "%~dp0.."
call npm run seed:home > logs\seed.txt 2>&1
echo EXIT=%errorlevel% >> logs\seed.txt
exit
