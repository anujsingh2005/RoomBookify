#!/bin/bash
# RoomBookify Quick Start Script for macOS/Linux
# This script starts both backend and frontend servers

echo ""
echo "========================================"
echo "  RoomBookify - Quick Start"
echo "========================================"
echo ""

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if MySQL is running
echo "Checking MySQL service..."
if ! pgrep -x "mysqld" > /dev/null; then
    echo "Warning: MySQL might not be running"
    echo "You can usually start it with: brew services start mysql"
    echo "Continuing anyway..."
fi

echo ""
echo "Starting Backend Server..."
echo ""
cd "$(dirname "$0")/backend"
npm start &
BACKEND_PID=$!

sleep 3

echo ""
echo "Starting Frontend Server..."
echo ""
cd "$(dirname "$0")/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "  Servers are starting..."
echo "========================================"
echo ""
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for both processes
wait
