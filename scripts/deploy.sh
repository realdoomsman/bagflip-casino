#!/bin/bash

echo "🚀 Deploying BagFlip Casino..."

# Build smart contracts
echo "📦 Building Anchor program..."
anchor build

# Deploy to devnet
echo "🌐 Deploying to Solana devnet..."
anchor deploy --provider.cluster devnet

# Get program ID
PROGRAM_ID=$(solana address -k target/deploy/flip_casino-keypair.json)
echo "✅ Program deployed: $PROGRAM_ID"

# Update Anchor.toml with new program ID
sed -i '' "s/FLiPxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/$PROGRAM_ID/g" Anchor.toml

# Update frontend config
sed -i '' "s/FLiPxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/$PROGRAM_ID/g" app/.env.local

echo "✅ Deployment complete!"
echo "Program ID: $PROGRAM_ID"
echo ""
echo "Next steps:"
echo "1. Initialize treasury: anchor run initialize-treasury"
echo "2. Start backend: cd backend && npm run dev"
echo "3. Start frontend: cd app && npm run dev"
