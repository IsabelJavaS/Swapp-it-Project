# Firebase Deploy Script for PowerShell
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    FIREBASE DEPLOY SCRIPT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Firebase CLI
Write-Host "Checking Firebase CLI..." -ForegroundColor Yellow
try {
    $firebaseVersion = firebase --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Firebase CLI found! Version: $firebaseVersion" -ForegroundColor Green
    } else {
        throw "Firebase CLI not found"
    }
} catch {
    Write-Host "ERROR: Firebase CLI not found!" -ForegroundColor Red
    Write-Host "Please install Firebase CLI first:" -ForegroundColor Yellow
    Write-Host "npm install -g firebase-tools" -ForegroundColor White
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check login status
Write-Host "Checking login status..." -ForegroundColor Yellow
try {
    firebase projects:list 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Login successful!" -ForegroundColor Green
    } else {
        throw "Not logged in"
    }
} catch {
    Write-Host "Not logged in. Please login to Firebase..." -ForegroundColor Yellow
    firebase login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Login failed!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host ""
Write-Host "Current project: proyect-swapp-it" -ForegroundColor Cyan
Write-Host ""

# Start deployment
Write-Host "Starting deployment..." -ForegroundColor Yellow
Write-Host ""

firebase deploy --only hosting

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "    DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your site is now live at:" -ForegroundColor White
    Write-Host "https://proyect-swapp-it.web.app" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Please test the following:" -ForegroundColor Yellow
    Write-Host "1. Open the deployed site" -ForegroundColor White
    Write-Host "2. Check browser console for errors" -ForegroundColor White
    Write-Host "3. Test header functionality" -ForegroundColor White
    Write-Host "4. Test cart functionality" -ForegroundColor White
    Write-Host "5. Test authentication" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "    DEPLOYMENT FAILED!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check the error messages above." -ForegroundColor Yellow
    Write-Host ""
}

Read-Host "Press Enter to exit" 