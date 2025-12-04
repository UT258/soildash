@echo off
REM SoilDash Quick Start Setup Script for Windows
REM Runs both frontend and proxy servers in a demo setup

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════╗
echo ║  SoilDash Quick Start Setup             ║
echo ╚════════════════════════════════════════╝
echo.

REM Check Node.js
where /q node
if errorlevel 1 (
    echo ❌ Node.js not found. Please install from https://nodejs.org
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js %NODE_VERSION% found
echo.

REM Frontend setup
echo 📦 Setting up frontend...
if not exist "node_modules" (
    call npm install
) else (
    echo    (dependencies already installed)
)

echo.
echo ✓ Frontend ready
echo.

REM Proxy setup
echo 📦 Setting up proxy server...
if not exist "proxy\node_modules" (
    cd proxy
    call npm install
    cd ..
) else (
    echo    (dependencies already installed)
)

echo.
echo ✓ Proxy ready
echo.

REM Instructions
echo ╔════════════════════════════════════════╗
echo ║  Setup Complete! Next Steps:            ║
echo ╚════════════════════════════════════════╝
echo.
echo Option 1: Run Frontend Only
echo   npm run dev
echo   Then open http://localhost:5173
echo.
echo Option 2: Run Frontend + Proxy ^(Recommended^)
echo   Terminal 1: npm run dev
echo   Terminal 2: cd proxy ^& node index.js
echo   Then open http://localhost:5173
echo.
echo Option 3: Demo Mode ^(No Device Required^)
echo   1. npm run dev
echo   2. Go to Settings
echo   3. Enable "Demo mode"
echo.
echo 📝 See README.md for detailed configuration
echo.

pause
