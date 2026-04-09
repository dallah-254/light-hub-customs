#!/bin/bash

# Pre-Deployment Verification Script
# Run this before deploying to Render

echo "🔍 Light Hub Customs - Pre-Deployment Check"
echo "==========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "render.yaml" ]; then
    echo "❌ Error: render.yaml not found. Are you in the project root?"
    exit 1
fi

echo "✅ Found render.yaml"

# Check for required files
echo ""
echo "📁 Checking required files..."

files=(
    "orders-api/package.json"
    "orders-api/server-dynamodb.js"
    "ecommerce-app/package.json"
    "ecommerce-app/src/config/api-config.js"
    "ecommerce-app/src/config/aws-config.js"
    "ecommerce-app/src/config/cognito-config.js"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ Missing: $file"
    fi
done

# Check for API_URL usage
echo ""
echo "🔗 Checking API URL configuration..."

if grep -q "import API_URL" "ecommerce-app/src/pages/Checkout.jsx" 2>/dev/null; then
    echo "  ✅ Checkout.jsx uses API_URL"
else
    echo "  ❌ Checkout.jsx missing API_URL import"
fi

if grep -q "import API_URL" "ecommerce-app/src/pages/Profile.jsx" 2>/dev/null; then
    echo "  ✅ Profile.jsx uses API_URL"
else
    echo "  ❌ Profile.jsx missing API_URL import"
fi

if grep -q "import API_URL" "ecommerce-app/src/pages/Orders.jsx" 2>/dev/null; then
    echo "  ✅ Orders.jsx uses API_URL"
else
    echo "  ❌ Orders.jsx missing API_URL import"
fi

# Check for hardcoded localhost
echo ""
echo "🔍 Checking for hardcoded localhost URLs..."

hardcoded=$(grep -r "localhost:3001" ecommerce-app/src --exclude-dir=node_modules 2>/dev/null | wc -l)

if [ "$hardcoded" -eq 0 ]; then
    echo "  ✅ No hardcoded localhost URLs found"
else
    echo "  ⚠️  Found $hardcoded hardcoded localhost references:"
    grep -r "localhost:3001" ecommerce-app/src --exclude-dir=node_modules 2>/dev/null | head -5
fi

# Check .gitignore
echo ""
echo "🔒 Checking .gitignore..."

if [ -f ".gitignore" ]; then
    if grep -q ".env" ".gitignore"; then
        echo "  ✅ .gitignore includes .env files"
    else
        echo "  ⚠️  .gitignore doesn't include .env files"
    fi
else
    echo "  ❌ .gitignore not found"
fi

# Check for node_modules
echo ""
echo "📦 Checking dependencies..."

if [ -d "orders-api/node_modules" ]; then
    echo "  ✅ Backend dependencies installed"
else
    echo "  ⚠️  Backend dependencies not installed (will be installed on Render)"
fi

if [ -d "ecommerce-app/node_modules" ]; then
    echo "  ✅ Frontend dependencies installed"
else
    echo "  ⚠️  Frontend dependencies not installed (will be installed on Render)"
fi

# Summary
echo ""
echo "==========================================="
echo "📋 Pre-Deployment Summary"
echo "==========================================="
echo ""
echo "Next steps:"
echo "1. Review any ❌ or ⚠️  items above"
echo "2. Commit your changes: git add . && git commit -m 'Ready for deployment'"
echo "3. Push to GitHub: git push origin main"
echo "4. Deploy on Render using render.yaml"
echo "5. Set environment variables in Render dashboard"
echo ""
echo "📚 See QUICK_START_RENDER.md for detailed instructions"
echo ""
