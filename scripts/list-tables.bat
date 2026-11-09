@echo off
cd /d "%~dp0.."
node scripts\list-tables.mjs > logs\tables.txt 2>&1
exit
