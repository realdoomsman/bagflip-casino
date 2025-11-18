# 🚀 Quick Start Guide

Get $FLIP Casino running in 5 minutes!

## Prerequisites

```bash
# Check installations
solana --version    # Should be 1.17+
anchor --version    # Should be 0.29+
node --version      # Should be 18+
```

If missing, install:
- Solana: https://docs.solana.com/cli/install-solana-cli-tools
- Anchor: https://www.anchor-lang.com/docs/installation
- Node: https://nodejs.org/

## Step 1: Clone & Install (1 min)

```bash
# Install all dependencies
npm install
cd app && npm install && cd ..
cd backend && npm install && cd ..
```

## Step 2: Local Validator (1 min)

```bash
# Terminal 1: Start local validator
solana-test-validator
```

## Step 3: Deploy Contracts (2 min)

```bash
# Terminal 2: Build and deploy
anchor build
anchor deploy

# Initialize treasury
npm run init-treasury
```

## Step 4: Start Services (1 min)

```bash
# Terminal 3: Backend
cd backend
cp .env.example .env
npm run dev

# Terminal 4: Frontend
cd app
cp .env.local.example .env.local
npm run dev
```

## Step 5: Play! 🎮

1. Open http://localhost:3000
2. Connect your Phantom wallet
3. Switch to Devnet in wallet settings
4. Get devnet SOL: `solana airdrop 2`
5. Play games!

## Troubleshooting

**"Wallet not connected"**
- Make sure wallet is on Devnet
- Refresh page after connecting

**"Insufficient funds"**
```bash
solana airdrop 2
```

**"Program not found"**
- Check program deployed: `solana program show <PROGRAM_ID>`
- Redeploy: `anchor deploy`

**Backend not responding**
- Check backend is running on port 3001
- Check CORS settings

## Next Steps

- Read [README.md](./README.md) for full documentation
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Check [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for architecture

## Demo Mode

The app works in demo mode without deployed contracts:
- Games use simulated randomness
- No actual token transfers
- Perfect for UI testing

To enable real on-chain games, deploy contracts and update `.env` files.

---

Need help? Open an issue on GitHub!
