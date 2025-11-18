# $FLIP Casino Deployment Guide

## Prerequisites

- Solana CLI installed
- Anchor CLI installed (v0.29.0)
- Node.js 18+
- Rust toolchain

## Step 1: Build & Deploy Smart Contracts

```bash
# Build the program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Get your program ID
solana address -k target/deploy/flip_casino-keypair.json
```

## Step 2: Update Configuration

Update the program ID in:
- `Anchor.toml`
- `app/.env.local`
- `backend/.env`
- `app/lib/anchor/setup.ts`

## Step 3: Initialize Treasury

```bash
# Create and fund treasury
npm run init-treasury
```

This will:
- Create $FLIP token mint
- Create treasury token account
- Mint initial supply (100M tokens)
- Initialize treasury PDA

## Step 4: Start Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

Backend runs on:
- HTTP: `http://localhost:3001`
- WebSocket: `ws://localhost:8080`

## Step 5: Start Frontend

```bash
cd app
npm install
cp .env.local.example .env.local
# Edit .env.local with your values
npm run dev
```

Frontend runs on `http://localhost:3000`

## Environment Variables

### Backend (.env)
```
SOLANA_RPC_URL=https://api.devnet.solana.com
PROGRAM_ID=<your_program_id>
TREASURY_AUTHORITY_KEYPAIR=<path_to_keypair>
PORT=3001
```

### Frontend (.env.local)
```
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=<your_program_id>
NEXT_PUBLIC_TOKEN_MINT=<your_token_mint>
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

## Testing

```bash
# Run Anchor tests
anchor test

# Test individual games
anchor test --skip-build
```

## Production Deployment

### Smart Contracts (Mainnet)
```bash
anchor build --verifiable
anchor deploy --provider.cluster mainnet
```

### Frontend (Vercel)
```bash
cd app
vercel deploy --prod
```

### Backend (Railway/Heroku)
```bash
cd backend
# Deploy to your preferred hosting
```

## Switchboard VRF Integration

To integrate real VRF:

1. Create Switchboard VRF account
2. Fund the VRF account
3. Update `backend/src/vrf.ts` with Switchboard SDK
4. Configure VRF queue in `.env`

## Security Checklist

- [ ] Use hardware wallet for treasury authority
- [ ] Enable rate limiting on backend
- [ ] Set up monitoring and alerts
- [ ] Audit smart contracts
- [ ] Test with small amounts first
- [ ] Set up proper key management
- [ ] Configure CORS properly
- [ ] Enable SSL/TLS for production

## Troubleshooting

### Program deployment fails
- Check Solana balance: `solana balance`
- Airdrop if needed: `solana airdrop 2`

### Frontend can't connect to wallet
- Check wallet adapter configuration
- Verify network matches (devnet/mainnet)

### Backend VRF errors
- Verify Switchboard configuration
- Check VRF account has sufficient funds
- Review VRF queue permissions
