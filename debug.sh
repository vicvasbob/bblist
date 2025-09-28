#!/bin/sh
echo "=== BABYLIST DEBUG SCRIPT ==="
echo "Environment: $NODE_ENV"
echo "Working directory: $(pwd)"
echo "User: $(whoami)"
echo ""

echo "=== DIRECTORY CONTENTS ==="
ls -la

echo ""
echo "=== NODE/NPM VERSIONS ==="
node --version
npm --version

echo ""
echo "=== PACKAGE.JSON CHECK ==="
if [ -f package.json ]; then
    echo "✅ package.json exists"
    echo "Scripts available:"
    cat package.json | grep -A 10 '"scripts"'
else
    echo "❌ package.json not found"
fi

echo ""
echo "=== PRISMA CLIENT CHECK ==="
if [ -d node_modules/.prisma ]; then
    echo "✅ Prisma client generated"
    ls -la node_modules/.prisma/
else
    echo "❌ Prisma client not found"
fi

echo ""
echo "=== NEXT.JS BUILD CHECK ==="
if [ -d .next ]; then
    echo "✅ .next directory exists"
    ls -la .next/
    if [ -f .next/BUILD_ID ]; then
        echo "BUILD_ID: $(cat .next/BUILD_ID)"
    else
        echo "❌ BUILD_ID missing"
    fi
else
    echo "❌ .next directory not found"
fi

echo ""
echo "=== ATTEMPTING BUILD ==="
NODE_ENV=production npm run build
echo "Build exit code: $?"

echo ""
echo "=== POST-BUILD CHECK ==="
if [ -d .next ]; then
    echo "✅ Build successful - .next created"
    ls -la .next/
    if [ -f .next/BUILD_ID ]; then
        echo "BUILD_ID: $(cat .next/BUILD_ID)"
    fi
else
    echo "❌ Build failed - no .next directory"
fi