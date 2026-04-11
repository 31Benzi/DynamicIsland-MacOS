#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi
if [ -f "main.js" ] && [ ! -d "src" ]; then
    export ELECTRON_MAIN="main.js"
fi
echo "Starting Dynamic Island..."
npm start
