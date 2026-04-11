#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"
DEV_MODE=""
if [ "$1" == "--dev" ] || [ "$1" == "-d" ]; then
    DEV_MODE="true"
    echo "Starting in development mode..."
fi
if [ ! -d "node_modules" ]; then
    echo "First run detected. Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "Error: Failed to install dependencies"
        exit 1
    fi
fi
if [ -n "$DEV_MODE" ]; then
    npm run dev
else
    npm start
fi
