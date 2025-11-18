#!/bin/bash

# BagFlip Casino - Repository Initialization Script
# This script helps you quickly set up and push to GitHub

echo "🎰 BagFlip Casino - Repository Setup"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if git is initialized
if [ ! -d .git ]; then
    echo -e "${BLUE}Initializing git repository...${NC}"
    git init
    echo -e "${GREEN}✓ Git initialized${NC}"
else
    echo -e "${GREEN}✓ Git already initialized${NC}"
fi

echo ""
echo -e "${BLUE}Creating initial commit...${NC}"

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: BagFlip Casino - Full-stack Solana casino with VRF

Features:
- Three 50/50 games (Coin Flip, Dice, Even/Odd)
- Treasury mode for instant play
- PvP mode with escrow
- VRF-powered randomness
- Live game feed
- Neon-themed UI
- Mobile responsive

Tech Stack:
- Solana/Anchor smart contracts
- Next.js 14 frontend
- Node.js backend with WebSocket
- Switchboard VRF integration"

echo -e "${GREEN}✓ Initial commit created${NC}"

echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo ""
echo "1. Create a GitHub repository:"
echo "   → Go to https://github.com/new"
echo "   → Name: bagflip-casino"
echo "   → Don't initialize with README"
echo ""
echo "2. Add remote and push:"
echo -e "   ${BLUE}git remote add origin https://github.com/YOUR_USERNAME/bagflip-casino.git${NC}"
echo -e "   ${BLUE}git branch -M main${NC}"
echo -e "   ${BLUE}git push -u origin main${NC}"
echo ""
echo "3. Deploy to Vercel:"
echo "   → Go to https://vercel.com/new"
echo "   → Import your GitHub repository"
echo "   → Follow VERCEL_DEPLOYMENT.md"
echo ""
echo "4. Deploy backend to Railway:"
echo "   → Go to https://railway.app"
echo "   → New Project → Deploy from GitHub"
echo "   → Set root directory to 'backend'"
echo ""
echo -e "${GREEN}🚀 Ready to deploy!${NC}"
echo ""
echo "Need help? Check out:"
echo "  📖 VERCEL_DEPLOYMENT.md - Full deployment guide"
echo "  ✅ deploy-checklist.sh - Verify deployment readiness"
echo ""
