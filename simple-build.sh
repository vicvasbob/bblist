#!/bin/sh
echo "=== SIMPLE BUILD SCRIPT ==="

echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo ""

echo "1. Testing basic registry access..."
npm ping && echo "✅ NPM ping successful" || echo "❌ NPM ping failed"

echo ""
echo "2. Clearing npm cache..."
npm cache clean --force

echo ""
echo "3. Installing dependencies..."
npm install --verbose

echo ""
echo "4. Verifying TailwindCSS..."
npm list tailwindcss || echo "❌ TailwindCSS not found"

echo ""
echo "5. Running build..."
NODE_ENV=production npm run build

echo ""
echo "6. Verifying build..."
if [ -d .next ] && [ -f .next/BUILD_ID ]; then
    echo "✅ Build successful!"
    echo "BUILD_ID: $(cat .next/BUILD_ID)"
else
    echo "❌ Build failed!"
    exit 1
fi