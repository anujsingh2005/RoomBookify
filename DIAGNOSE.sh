#!/bin/bash
# RoomBookify Diagnostic Script
# Run this to check all services

echo "================================================"
echo "  RoomBookify Network Diagnostics"
echo "================================================"
echo ""

# Check 1: Node.js
echo "[1/5] Checking Node.js..."
if command -v node &> /dev/null; then
    echo "✅ Node.js found: $(node --version)"
else
    echo "❌ Node.js not found. Install from https://nodejs.org/"
fi
echo ""

# Check 2: MySQL service
echo "[2/5] Checking MySQL..."
if command -v mysql &> /dev/null; then
    echo "✅ MySQL client found"
    echo "Testing connection..."
    mysql -u root -pAnuj2005@ -e "SELECT 1" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✅ MySQL connection successful"
    else
        echo "❌ Cannot connect to MySQL"
        echo "   Try: mysql -u root -p"
        echo "   Enter password: Anuj2005@"
    fi
else
    echo "❌ MySQL client not found"
fi
echo ""

# Check 3: Port 5000
echo "[3/5] Checking port 5000 (Backend)..."
if command -v lsof &> /dev/null; then
    if lsof -i :5000 > /dev/null; then
        echo "✅ Port 5000 is in use"
    else
        echo "❌ Port 5000 is not in use - Backend not running"
    fi
elif command -v netstat &> /dev/null; then
    if netstat -an | grep 5000 > /dev/null; then
        echo "✅ Port 5000 is in use"
    else
        echo "❌ Port 5000 is not in use - Backend not running"
    fi
else
    echo "⚠️  Cannot check port 5000"
fi
echo ""

# Check 4: Port 3000
echo "[4/5] Checking port 3000 (Frontend)..."
if command -v lsof &> /dev/null; then
    if lsof -i :3000 > /dev/null; then
        echo "✅ Port 3000 is in use"
    else
        echo "❌ Port 3000 is not in use - Frontend not running"
    fi
elif command -v netstat &> /dev/null; then
    if netstat -an | grep 3000 > /dev/null; then
        echo "✅ Port 3000 is in use"
    else
        echo "❌ Port 3000 is not in use - Frontend not running"
    fi
else
    echo "⚠️  Cannot check port 3000"
fi
echo ""

# Check 5: Backend health
echo "[5/5] Testing Backend API..."
if command -v curl &> /dev/null; then
    RESPONSE=$(curl -s http://localhost:5000/api/health)
    if [ ! -z "$RESPONSE" ]; then
        echo "✅ Backend is responding"
        echo "   Response: $RESPONSE"
    else
        echo "❌ Backend is not responding"
        echo "   Backend may not be running"
    fi
else
    echo "⚠️  curl not found, cannot test backend"
fi
echo ""

echo "================================================"
echo "  Diagnostic Complete"
echo "================================================"
