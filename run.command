#!/bin/bash
cd "$(dirname "$0")"
echo "==========================================="
echo "      Starting Dynamic Island..."
echo "==========================================="

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies (first-time setup)..."
    npm install
fi

echo "Launching application..."
npm start
