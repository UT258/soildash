#!/bin/bash

# SoilDash Quick Start Setup Script
# Runs both frontend and proxy servers in a demo setup

set -e

echo "╔════════════════════════════════════════╗"
echo "║  SoilDash Quick Start Setup             ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js v16+ from https://nodejs.org"
    exit 1
fi

echo "✓ Node.js $(node --version) found"
echo ""

# Frontend setup
echo "📦 Setting up frontend..."
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "   (dependencies already installed)"
fi

echo ""
echo "✓ Frontend ready"
echo ""

# Proxy setup
echo "📦 Setting up proxy server..."
if [ ! -d "proxy/node_modules" ]; then
    cd proxy
    npm install
    cd ..
else
    echo "   (dependencies already installed)"
fi

echo ""
echo "✓ Proxy ready"
echo ""

# Instructions
echo "╔════════════════════════════════════════╗"
echo "║  Setup Complete! Next Steps:            ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "Option 1: Run Frontend Only (Direct to Device)"
echo "  npm run dev"
echo "  Then open http://localhost:5173"
echo ""
echo "Option 2: Run Frontend + Proxy (Recommended)"
echo "  Terminal 1: npm run dev"
echo "  Terminal 2: cd proxy && node index.js"
echo "  Then open http://localhost:5173"
echo ""
echo "Option 3: Demo Mode (No Device Required)"
echo "  1. npm run dev"
echo "  2. Go to Settings"
echo "  3. Enable 'Demo mode'"
echo ""
echo "📝 See README.md for detailed configuration"
echo ""
