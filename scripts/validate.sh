#!/bin/bash

echo "🔍 Running comprehensive validation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command succeeded
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1 passed${NC}"
    else
        echo -e "${RED}❌ $1 failed${NC}"
        exit 1
    fi
}

echo "📝 Step 1: TypeScript type checking (strict mode)..."
bun run type-check:strict
check_status "TypeScript type checking"

echo "🧹 Step 2: Linting..."
bun run lint
check_status "Linting"

echo "🎨 Step 3: Format checking..."
bun run format
check_status "Format checking"

echo "🏗️  Step 4: Build test..."
bun run build
check_status "Build test"

echo -e "${GREEN}🎉 All validations passed! Your code is ready for commit/push.${NC}"
