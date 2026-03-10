@echo off
echo Creating portfolio deployment package...
echo.

REM Create a temporary folder for deployment
if exist "deploy-temp" rmdir /s /q "deploy-temp"
mkdir "deploy-temp"

REM Copy all necessary files
copy "index.html" "deploy-temp\"
copy "style.css" "deploy-temp\"
copy "script.js" "deploy-temp\"
copy "mediaqueries.css" "deploy-temp\"
copy "_redirects" "deploy-temp\"
copy "netlify.toml" "deploy-temp\"
copy "site.webmanifest" "deploy-temp\"
copy "robots.txt" "deploy-temp\"

REM Copy assets folder if it exists
if exist "assets" xcopy "assets" "deploy-temp\assets\" /e /i

REM Create zip file
powershell -command "Compress-Archive -Path 'deploy-temp\*' -DestinationPath 'portfolio-deploy.zip' -Force"

REM Clean up
rmdir /s /q "deploy-temp"

echo.
echo ✅ Portfolio deployment package created: portfolio-deploy.zip
echo.
echo 🚀 Next steps:
echo 1. Go to https://netlify.com
echo 2. Sign up/login
echo 3. Drag and drop portfolio-deploy.zip
echo 4. Your site will be live in 30 seconds!
echo.
echo Press any key to open Netlify...
pause >nul
start https://netlify.com




