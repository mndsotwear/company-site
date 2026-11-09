@echo off
chcp 65001 >nul
cd /d "%~dp0.."
set LOG=logs\check.txt
echo === CHECK %date% %time% === > %LOG%
echo --- node --- >> %LOG%
where node >> %LOG% 2>&1
node -v >> %LOG% 2>&1
echo --- npm --- >> %LOG%
call npm -v >> %LOG% 2>&1
call npm config get registry >> %LOG% 2>&1
echo --- npm reach --- >> %LOG%
call npm view next version >> %LOG% 2>&1
echo --- docker --- >> %LOG%
where docker >> %LOG% 2>&1
docker version --format "{{.Server.Version}}" >> %LOG% 2>&1
echo --- postgres --- >> %LOG%
where psql >> %LOG% 2>&1
sc query state= all ^| findstr /i postgres >> %LOG% 2>&1
dir "C:\Program Files\PostgreSQL" >> %LOG% 2>&1
echo --- git --- >> %LOG%
git --version >> %LOG% 2>&1
echo === DONE === >> %LOG%
exit
