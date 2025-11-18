#!/bin/bash

# BagFlip Casino - Local Testing Setup Script
# This script sets up a complete local testing environment

set -e

echo "🎮 BagFlip Casino - Local Testing Setup"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Add Solana to PATH
export PATH="/Users/doom/.local/share/solana/install/active_release/bin:$PATH"
export PATH="$HOME/.cargo/bin:$PATH"

# Step 1: Check if test validator is already running
echo -e "${YELLOW}Step 1: Checking for existing test validator...${NC}"
if lsof -Pi :8899 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${GREEN}✓ Test validator already running on port 8899${NC}"
else
    echo -e "${YELLOW}Starting Solana test validator...${NC}"
    echo "This will run in the background. To stop it later, run: pkill solana-test-validator"
    solana-test-validator > /tmp/solana-test-validator.log 2>&1 &
    VALIDATOR_PID=$!
    echo "Validator PID: $VALIDATOR_PID"
    
    # Wait for validator to start
    echo "Waiting for validator to start..."
    sleep 5
    
    if lsof -Pi :8899 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo -e "${GREEN}✓ Test validator started successfully${NC}"
    else
        echo -e "${RED}✗ Failed to start test validator${NC}"
        echo "Check logs at: /tmp/solana-test-validator.log"
        exit 1
    fi
fi
echo ""

# Step 2: Configure Solana CLI for localhost
echo -e "${YELLOW}Step 2: Configuring Solana CLI for localhost...${NC}"
solana config set --url localhost
echo -e "${GREEN}✓ Solana CLI configured for localhost${NC}"
echo ""

# Step 3: Check wallet balance and airdrop if needed
echo -e "${YELLOW}Step 3: Checking wallet balance...${NC}"
BALANCE=$(solana balance 2>/dev/null | awk '{print $1}')
echo "Current balance: $BALANCE SOL"

if (( $(echo "$BALANCE < 10" | bc -l) )); then
    echo "Airdropping 100 SOL for testing..."
    solana airdrop 100 || echo "Airdrop may have failed, but continuing..."
    sleep 2
    BALANCE=$(solana balance 2>/dev/null | awk '{print $1}')
    echo "New balance: $BALANCE SOL"
fi
echo -e "${GREEN}✓ Wallet has sufficient balance${NC}"
echo ""

# Step 4: Deploy the program
echo -e "${YELLOW}Step 4: Deploying program to local validator...${NC}"
if [ -f "target/deploy/flip_casino.so" ]; then
    echo "Deploying flip_casino program..."
    solana program deploy target/deploy/flip_casino.so --program-id target/deploy/flip_casino-keypair.json
    PROGRAM_ID=$(solana address -k target/deploy/flip_casino-keypair.json)
    echo -e "${GREEN}✓ Program deployed successfully${NC}"
    echo "Program ID: $PROGRAM_ID"
else
    echo -e "${RED}✗ Program binary not found. Run 'anchor build --no-idl' first${NC}"
    exit 1
fi
echo ""

# Step 5: Create local environment files
echo -e "${YELLOW}Step 5: Creating local environment files...${NC}"

# Backend .env
cat > backend/.env.local << EOF
# Local Testing Environment
NODE_ENV=development
PORT=3001

# Solana Configuration
SOLANA_RPC_URL=http://localhost:8899
PROGRAM_ID=$PROGRAM_ID
TREASURY_AUTHORITY=YOUR_WALLET_PUBLIC_KEY

# Database (SQLite for local testing)
DATABASE_TYPE=sqlite
DATABASE_PATH=./casino.db

# VRF Configuration (mock for local testing)
VRF_ENABLED=false
VRF_MOCK=true

# Security
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
EOF

echo -e "${GREEN}✓ Created backend/.env.local${NC}"

# Frontend .env
cat > app/.env.local << EOF
# Local Testing Environment
NEXT_PUBLIC_SOLANA_NETWORK=localhost
NEXT_PUBLIC_RPC_URL=http://localhost:8899
NEXT_PUBLIC_PROGRAM_ID=$PROGRAM_ID
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
EOF

echo -e "${GREEN}✓ Created app/.env.local${NC}"
echo ""

# Step 6: Initialize the treasury (if needed)
echo -e "${YELLOW}Step 6: Treasury initialization...${NC}"
echo "Note: You'll need to initialize the treasury manually using the frontend or CLI"
echo "This requires creating a token account and calling initialize_treasury"
echo ""

# Summary
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Local Testing Environment Ready!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Start the backend:  cd backend && npm run dev"
echo "2. Start the frontend: cd app && npm run dev"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Useful commands:"
echo "- View validator logs: tail -f /tmp/solana-test-validator.log"
echo "- Stop validator: pkill solana-test-validator"
echo "- Check program: solana program show $PROGRAM_ID"
echo "- View wallet: solana address"
echo ""
echo "Program ID: $PROGRAM_ID"
echo ""
