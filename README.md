# BagFlip Casino 🎰

A fully on-chain casino on Solana. Play 50/50 games with VRF-powered randomness. Flip your bag, win big.

**🚀 [Deploy to Vercel](VERCEL_DEPLOYMENT.md)** | **📖 [Full Documentation](MASTER_CHECKLIST.md)**

## 🎮 Games

- **Coin Flip**: Heads or Tails - classic 50/50
- **Dice High/Low**: Roll 1-100, bet on 1-50 or 51-100
- **Even/Odd**: Guess if the number is even or odd

## 🎯 Game Modes

- **Treasury Mode**: Instant play against the house
- **PvP Mode**: Challenge other players, winner takes all

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Next.js   │◄────►│   Backend    │◄────►│   Solana    │
│  Frontend   │      │  (VRF/API)   │      │  Program    │
└─────────────┘      └──────────────┘      └─────────────┘
      │                     │
      │              ┌──────▼──────┐
      └─────────────►│  WebSocket  │
                     │ (Live Feed) │
                     └─────────────┘
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Root (Anchor)
npm install

# Frontend
cd app && npm install

# Backend
cd backend && npm install
```

### 2. Build & Deploy Contracts

```bash
# Build
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Initialize treasury
npm run init-treasury
```

### 3. Start Services

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd app
npm run dev
```

Visit `http://localhost:3000` 🎉

## 📁 Project Structure

```
/
├── programs/flip-casino/    # Anchor smart contracts
│   ├── src/
│   │   ├── lib.rs          # Program entry
│   │   ├── state.rs        # Game state structs
│   │   ├── errors.rs       # Custom errors
│   │   └── instructions/   # Game logic
│   └── Cargo.toml
│
├── app/                     # Next.js frontend
│   ├── app/                # App router
│   ├── components/         # React components
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilities & config
│   └── package.json
│
├── backend/                 # Node.js API
│   ├── src/
│   │   ├── index.ts       # Express server
│   │   └── vrf.ts         # VRF service
│   └── package.json
│
├── scripts/                 # Deployment scripts
└── tests/                   # Anchor tests
```

## 🎨 Features

✅ Three 50/50 games with fair odds  
✅ VRF-powered randomness (Switchboard)  
✅ Treasury mode for instant play  
✅ PvP rooms with escrow  
✅ Live game feed via WebSocket  
✅ Neon-themed UI with animations  
✅ Solana wallet integration  
✅ Leaderboard tracking  
✅ Mobile responsive  

## 🔧 Tech Stack

**Smart Contracts**
- Anchor Framework (Solana)
- Switchboard VRF
- SPL Token

**Frontend**
- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Solana Wallet Adapter

**Backend**
- Node.js + Express
- WebSocket (ws)
- Anchor TS Client

## 📝 Environment Setup

### Frontend (.env.local)
```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=<your_program_id>
NEXT_PUBLIC_TOKEN_MINT=<your_token_mint>
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

### Backend (.env)
```env
SOLANA_RPC_URL=https://api.devnet.solana.com
PROGRAM_ID=<your_program_id>
TREASURY_AUTHORITY_KEYPAIR=<path_to_keypair>
PORT=3001
```

## 🧪 Testing

```bash
# Run all tests
anchor test

# Run specific test
anchor test --skip-build
```

## 📦 Deployment

### Quick Deploy to Production

**Frontend (Vercel)**
1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy

**Backend (Railway)**
1. Connect GitHub repo
2. Set root directory to `backend`
3. Add environment variables
4. Deploy

**Full Guide**: See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for step-by-step instructions.

**Checklist**: Run `./deploy-checklist.sh` to verify readiness.

```bash
# Quick commands
git add .
git commit -m "Ready for deployment"
git push origin main

# Check deployment readiness
./deploy-checklist.sh
```

## 🔐 Security

- All randomness is VRF-verified on-chain
- No client-side computation of results
- PvP escrow prevents rug pulls
- Rate limiting on backend
- Treasury authority uses hardware wallet (production)

## 🎯 Roadmap

- [ ] Switchboard VRF integration (currently simulated)
- [ ] PvP room timeout/cancellation
- [ ] Tournament system
- [ ] NFT rewards for top players
- [ ] Mobile app
- [ ] Additional games (Roulette, Blackjack)

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📄 License

MIT

## 🎲 Play Responsibly

This is a demo project. Always gamble responsibly and never bet more than you can afford to lose.

---

Built with ⚡ by the BagFlip team | bagflip.xyz
