# Build VE AI Desktop App for Windows
Write-Host "Building VE AI Desktop App for Windows..." -ForegroundColor Green
Write-Host ""

Write-Host "Cleaning previous builds..." -ForegroundColor Yellow
npm run clean:build:win

Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "Rebuilding sharp for Windows..." -ForegroundColor Yellow
npm rebuild sharp --platform=win32 --arch=x64

Write-Host "Building the app..." -ForegroundColor Yellow
npm run build:win

Write-Host "Building Windows package..." -ForegroundColor Yellow
npm run package:win:unsigned

Write-Host "Build complete! Check the dist folder for the Windows installer." -ForegroundColor Green
Read-Host "Press Enter to continue..."
