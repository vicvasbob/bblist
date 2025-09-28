#!/bin/sh
echo "=== NPM CONNECTIVITY DIAGNOSTICS ==="

echo "1. Testing basic connectivity..."
ping -c 3 registry.npmjs.org || echo "❌ Cannot reach npm registry"

echo ""
echo "2. Testing DNS resolution..."
nslookup registry.npmjs.org || echo "❌ DNS resolution failed"

echo ""
echo "3. Testing HTTPS connectivity..."
wget -O /dev/null --timeout=10 https://registry.npmjs.org/ || echo "❌ HTTPS connection failed"

echo ""
echo "4. NPM configuration:"
npm config list

echo ""
echo "5. Testing npm ping..."
npm ping || echo "❌ NPM ping failed"

echo ""
echo "6. Trying to fetch a small package info..."
npm view tailwindcss version || echo "❌ Cannot fetch package info"

echo ""
echo "7. Alternative registries test..."
echo "Testing Taobao registry..."
npm config set registry https://registry.npm.taobao.org/
npm ping || echo "❌ Taobao registry failed"

echo "Restoring original registry..."
npm config set registry https://registry.npmjs.org/

echo ""
echo "=== DIAGNOSTICS COMPLETE ==="