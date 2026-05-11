@echo off
title Hindo Digital — Demarrage des serveurs
color 0A

echo ============================================
echo    HINDO DIGITAL — Demarrage des serveurs
echo ============================================
echo.

echo [1/2] Demarrage du backend Laravel (port 8000)...
cd /d "%~dp0backend"
start "Laravel API — Hindo Digital" cmd /k "php artisan serve --port=8000"

timeout /t 2 /nobreak >nul

echo [2/2] Demarrage du frontend React (port 3000)...
cd /d "%~dp0frontend"
start "React Frontend — Hindo Digital" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ============================================
echo  Serveurs lances avec succes !
echo.
echo  - API Laravel : http://localhost:8000
echo  - Site React  : http://localhost:3000
echo ============================================
echo.
echo Ouverture du site dans le navigateur...
timeout /t 4 /nobreak >nul
start "" "http://localhost:3000"
