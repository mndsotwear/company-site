@echo off
chcp 65001 >nul
cd /d "%~dp0.."
title Shahin Marine - Site
echo Make sure the "shahin-marine" service is started in DBngin.
call node scripts\create-db.mjs
call npx payload generate:importmap > logs\importmap.txt 2>&1
echo Site: http://localhost:3000   Admin: http://localhost:3000/admin
echo Press Ctrl+C or close this window to stop.
call npm run dev
