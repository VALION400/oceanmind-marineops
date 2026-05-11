#!/bin/bash

# OceanMind Configuration Validator
# This script checks if your environment is properly configured

echo "=========================================="
echo "  OceanMind Configuration Validator"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall status
ALL_GOOD=true

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2 exists"
        return 0
    else
        echo -e "${RED}✗${NC} $2 missing: $1"
        ALL_GOOD=false
        return 1
    fi
}

# Function to check variable in file
check_env_var() {
    local file=$1
    local var=$2
    local desc=$3
    
    if grep -q "^${var}=" "$file" 2>/dev/null; then
        local value=$(grep "^${var}=" "$file" | cut -d'=' -f2-)
        if [[ "$value" == *"your_"* ]] || [[ "$value" == *"example"* ]] || [ -z "$value" ]; then
            echo -e "${YELLOW}⚠${NC} $desc needs real value (currently: ${value:0:20}...)"
            return 1
        else
            echo -e "${GREEN}✓${NC} $desc configured"
            return 0
        fi
    else
        echo -e "${RED}✗${NC} $desc not found in $file"
        ALL_GOOD=false
        return 1
    fi
}

echo "1. Checking Backend Configuration..."
echo "-----------------------------------"
check_file "/home/roararena/Desktop/OceanMind/.env" "Backend .env file"
if [ -f "/home/roararena/Desktop/OceanMind/.env" ]; then
    check_env_var "/home/roararena/Desktop/OceanMind/.env" "SUPABASE_URL" "Supabase URL"
    check_env_var "/home/roararena/Desktop/OceanMind/.env" "SUPABASE_KEY" "Supabase Key"
    check_env_var "/home/roararena/Desktop/OceanMind/.env" "TWILIO_ACCOUNT_SID" "Twilio Account SID"
    check_env_var "/home/roararena/Desktop/OceanMind/.env" "TWILIO_AUTH_TOKEN" "Twilio Auth Token"
    check_env_var "/home/roararena/Desktop/OceanMind/.env" "OPENAI_API_KEY" "OpenAI API Key"
fi
echo ""

echo "2. Checking Frontend Configuration..."
echo "-----------------------------------"
check_file "/home/roararena/Desktop/OceanMind/dashboard/.env.local" "Frontend .env.local file"
if [ -f "/home/roararena/Desktop/OceanMind/dashboard/.env.local" ]; then
    check_env_var "/home/roararena/Desktop/OceanMind/dashboard/.env.local" "NEXT_PUBLIC_SUPABASE_URL" "Supabase URL (Frontend)"
    check_env_var "/home/roararena/Desktop/OceanMind/dashboard/.env.local" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "Supabase Anon Key (Frontend)"
fi
echo ""

echo "3. Checking Services Status..."
echo "-----------------------------------"

# Check backend
if curl -s http://localhost:3002/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Backend server running on port 3002"
else
    echo -e "${RED}✗${NC} Backend server NOT running on port 3002"
    ALL_GOOD=false
fi

# Check frontend
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "307\|200"; then
    echo -e "${GREEN}✓${NC} Dashboard server running on port 3000"
else
    echo -e "${RED}✗${NC} Dashboard server NOT running on port 3000"
    ALL_GOOD=false
fi
echo ""

echo "4. Checking Project Structure..."
echo "-----------------------------------"
check_file "/home/roararena/Desktop/OceanMind/db/schema.sql" "Database schema"
check_file "/home/roararena/Desktop/OceanMind/src/index.ts" "Backend entry point"
check_file "/home/roararena/Desktop/OceanMind/dashboard/src/app/login/page.tsx" "Login page"
check_file "/home/roararena/Desktop/OceanMind/dashboard/src/app/dashboard/page.tsx" "Dashboard overview"
echo ""

echo "5. Checking Documentation..."
echo "-----------------------------------"
doc_count=$(ls -1 /home/roararena/Desktop/OceanMind/*.md 2>/dev/null | wc -l)
if [ "$doc_count" -ge 5 ]; then
    echo -e "${GREEN}✓${NC} Documentation files present ($doc_count files)"
else
    echo -e "${YELLOW}⚠${NC} Only $doc_count documentation files found (expected 5+)"
fi
echo ""

echo "=========================================="
echo "  Summary"
echo "=========================================="
echo ""

if [ "$ALL_GOOD" = true ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Your system is properly configured."
    echo "Next steps:"
    echo "  1. Run database schema in Supabase SQL Editor"
    echo "  2. Test backend: curl http://localhost:3002/health"
    echo "  3. Open dashboard: http://localhost:3000"
else
    echo -e "${YELLOW}⚠ Some configuration is needed${NC}"
    echo ""
    echo "To fix:"
    echo "  1. Update .env files with your API credentials"
    echo "  2. See COMPLETE_SETUP_GUIDE.md for step-by-step instructions"
    echo "  3. Restart services after updating credentials"
fi
echo ""
echo "Documentation:"
echo "  - Setup Guide: COMPLETE_SETUP_GUIDE.md"
echo "  - Quick Start: QUICK_START.md"
echo "  - Final Status: FINAL_STATUS.md"
echo ""
