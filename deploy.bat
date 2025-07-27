@echo off
echo ========================================
echo    FIREBASE DEPLOY SCRIPT
echo ========================================
echo.

echo Checking Firebase CLI...
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Firebase CLI not found!
    echo Please install Firebase CLI first:
    echo npm install -g firebase-tools
    pause
    exit /b 1
)

echo Firebase CLI found!
echo.

echo Checking login status...
firebase projects:list >nul 2>&1
if %errorlevel% neq 0 (
    echo Not logged in. Please login to Firebase...
    firebase login
    if %errorlevel% neq 0 (
        echo Login failed!
        pause
        exit /b 1
    )
)

echo Login successful!
echo.

echo Current project: proyect-swapp-it
echo.

echo Starting deployment...
echo.

firebase deploy --only hosting

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo    DEPLOYMENT SUCCESSFUL!
    echo ========================================
    echo.
    echo Your site is now live at:
    echo https://proyect-swapp-it.web.app
    echo.
    echo Please test the following:
    echo 1. Open the deployed site
    echo 2. Check browser console for errors
    echo 3. Test header functionality
    echo 4. Test cart functionality
    echo 5. Test authentication
    echo.
) else (
    echo.
    echo ========================================
    echo    DEPLOYMENT FAILED!
    echo ========================================
    echo.
    echo Please check the error messages above.
    echo.
)

pause 