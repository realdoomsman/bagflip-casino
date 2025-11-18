#!/bin/bash

echo "🚀 BagFlip Casino - Devnet Deployment"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Setup Solana
echo -e "${BLUE}Step 1: Setting up Solana devnet...${NC}"
solana config set --url devnet
echo ""

echo -e "${BLUE}Getting your wallet address...${NC}"
WALLET_ADDRESS=$(solana address)
echo "Wallet: $WALLET_ADDRESS"
echo ""

echo -e "${BLUE}Requesting devnet SOL airdrop...${NC}"
solana airdrop 2
echo ""

echo -e "${BLUE}Checking balance...${NC}"
solana balance
echo ""

# Step 2: Build
echo -e "${BLUE}Step 2: Building Anchor program...${NC}"
anchor build
echo ""

# Step 3: Get Program ID
echo -e "${BLUE}Step 3: Getting program ID...${NC}"
anchor keys list
echo ""
echo -e "${GREEN}⚠️  COPY THE PROGRAM ID ABOVE!${NC}"
echo ""
read -p "Press enter to continue after copying the program ID..."

# Step 4: Deploy
echo -e "${BLUE}Step 4: Deploying to devnet...${NC}"
anchor deploy --provider.cluster devnet
echo ""

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your PROGRAM_ID"
echo "2. Update app/.env.local with your PROGRAM_ID"
echo "3. Run: cd backend && npm install && npm run dev"
echo "4. Run: cd app && npm install && npm run dev"
echo "5. Open: http://localhost:3000"
echo ""
