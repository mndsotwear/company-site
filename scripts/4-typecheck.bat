@echo off
chcp 65001 >nul
cd /d "%~dp0.."
set LOG=logs\typecheck.txt
echo === TYPES %date% %time% === > %LOG%
call npx payload generate:types >> %LOG% 2>&1
echo TYPES=%errorlevel% >> %LOG%
call npx payload generate:importmap >> %LOG% 2>&1
echo IMPORTMAP=%errorlevel% >> %LOG%
call npx tsc --noEmit >> %LOG% 2>&1
echo TSC=%errorlevel% >> %LOG%
echo === DONE === >> %LOG%
exit
