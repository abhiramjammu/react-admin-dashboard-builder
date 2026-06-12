@echo off
echo ===================================================
echo Starting your project and opening the browser...
echo Please wait a few seconds...
echo ===================================================

:: This command will start the development server and automatically 
:: open the default browser to your project's page.
call npm run dev -- --open

:: If the server stops or crashes, pause so you can see any error messages
pause
