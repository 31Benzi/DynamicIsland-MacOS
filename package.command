#!/bin/bash
cd "$(dirname "$0")"
echo "==========================================="
echo "   Dynamic Island - Build & Distribution"
echo "==========================================="
echo "1. Installing dependencies..."
npm install
echo ""
echo "2. Building the application (.dmg)..."
npm run dist
echo ""
echo "Done! Check the 'dist' folder for your .dmg file."
echo "You can share that file with others."
echo "==========================================="
read -n 1 -s -r -p "Press any key to close..."
