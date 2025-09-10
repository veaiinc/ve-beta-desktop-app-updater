@echo off
echo Building VE AI Desktop App for Windows...
echo.

echo Cleaning previous builds...
call npm run clean:build:win

echo Installing dependencies...
call npm install

echo Rebuilding sharp for Windows...
call npm rebuild sharp --platform=win32 --arch=x64

echo Building the app...
call npm run build:win

echo Building Windows package...
call npm run package:win:unsigned

echo Build complete! Check the dist folder for the Windows installer.
pause
