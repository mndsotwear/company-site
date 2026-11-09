@echo off
cd /d "%~dp0.."
curl -L -s -o public\images\hero.webp "https://shahinmarine.com/wp-content/uploads/2026/11/%%D9%%87%%DB%%8C%%D8%%B1%%D9%%88-%%D8%%B9%%DA%%A9%%D8%%B3-%%D8%%A7%%D8%%B5%%D9%%84%%DB%%8C.webp" > logs\hero.txt 2>&1
echo EXIT=%errorlevel% >> logs\hero.txt
exit
