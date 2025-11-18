#!/bin/bash

# BagFlip Casino - Deployment Checklist Script
# This script helps verify everything is ready for deployment

echo "🎰 BagFlip Casino - Deployment Checklist"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check functions
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

echo "📦 Checking Repository..."
if [ -d .git ]; then
    check_pass "Git repository initialized"
else
    check_fail "Git repository not initialized"
    echo "  Run: git init"
fi

echo ""
echo "📁 Checking Project Structure..."
[ -d "app" ] && check_pass "Frontend directory exists" || check_fail "Frontend directory missing"
[ -d "backend" ] && check_pass "Backend directory exists" || check_fail "Backend directory missing"
[ -d "programs" ] && check_pass "Programs directory exists" || check_fail "Programs directory missing"

echo ""
echo "📄 Checking Configuration Files..."
[ -f ".gitignore" ] && check_pass ".gitignore exists" || check_warn ".gitignore missing"
[ -f "app/.env.example" ] && check_pass "Frontend .env.example exists" || check_warn "Frontend .env.example missing"
[ -f "backend/.env.example" ] && check_pass "Backend .env.example exists" || check_warn "Backend .env.example missing"

echo ""
echo "🔧 Checking Dependencies..."
if [ -f "app/package.json" ]; then
    check_pass "Frontend package.json exists"
    if [ -d "app/node_modules" ]; then
        check_pass "Frontend dependencies installed"
    else
        check_warn "Frontend dependencies not installed"
        echo "  Run: cd app && npm install"
    fi
else
    check_fail "Frontend package.json missing"
fi

if [ -f "backend/package.json" ]; then
    check_pass "Backend package.json exists"
    if [ -d "backend/node_modules" ]; then
        check_pass "Backend dependencies installed"
    else
        check_warn "Backend dependencies not installed"
        echo "  Run: cd backend && npm install"
    fi
else
    check_fail "Backend package.json missing"
fi

echo ""
echo "🔨 Checking Build..."
echo "  Testing frontend build..."
cd app
if npm run build > /dev/null 2>&1; then
    check_pass "Frontend builds successfully"
else
    check_fail "Frontend build failed"
    echo "  Run: cd app && npm run build"
fi
cd ..

echo ""
echo "⚙️ Checking Anchor Program..."
if command -v anchor &> /dev/null; then
    check_pass "Anchor CLI installed"
    if [ -f "programs/flip-casino/Cargo.toml" ]; then
        check_pass "Anchor program exists"
    else
        check_fail "Anchor program missing"
    fi
else
    check_warn "Anchor CLI not installed"
    echo "  Install: https://www.anchor-lang.com/docs/installation"
fi

echo ""
echo "🔐 Security Checks..."
if [ -f ".env" ]; then
    check_warn ".env file found in root (should not be committed)"
fi
if [ -f "app/.env" ]; then
    check_warn "app/.env file found (should not be committed)"
fi
if [ -f "backend/.env" ]; then
    check_warn "backend/.env file found (should not be committed)"
fi

echo ""
echo "📋 Pre-Deployment Checklist:"
echo ""
echo "Frontend (Vercel):"
echo "  [ ] GitHub repository created and pushed"
echo "  [ ] Vercel account created"
echo "  [ ] Environment variables prepared"
echo "  [ ] Build tested locally"
echo ""
echo "Backend (Railway):"
echo "  [ ] Railway account created"
echo "  [ ] Database plan selected"
echo "  [ ] Environment variables prepared"
echo "  [ ] WebSocket support verified"
echo ""
echo "Solana Program:"
echo "  [ ] Program built successfully"
echo "  [ ] Devnet SOL available in wallet"
echo "  [ ] Treasury keypair secured"
echo "  [ ] Program ID ready to deploy"
echo ""
echo "📚 Next Steps:"
echo "  1. Review VERCEL_DEPLOYMENT.md"
echo "  2. Push code to GitHub"
echo "  3. Deploy to Vercel"
echo "  4. Deploy to Railway"
echo "  5. Deploy Solana program"
echo "  6. Update environment variables"
echo "  7. Test deployment"
echo ""
echo "🚀 Ready to deploy? Good luck!"
