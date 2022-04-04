@echo off
:start
copy C:\whazzup.txt C:\WWW\map\public\online
timeout /t 30 /nobreak
goto start
pause