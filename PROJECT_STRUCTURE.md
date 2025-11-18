# $FLIP Casino - Project Structure

## Overview
Minimal implementation of the on-chain casino spec with all three games, PvP support, and Treasury mode.

## Directory Structure

```
/
├── programs/flip-casino/       # Anchor smart contracts
│   ├── src/
│   │   ├── lib.rs             # Main program entry
│   │   ├── state.rs           # Game, Treasury, PvPRoom structs
│   │   ├── errors.rs          # Custom errors
│   │   └── instructions/
│   │       ├── initialize_treasury.rs
│   │       ├── create_game.rs      # All 3 games
│   │       ├── settle_game.rs      # VRF settlement
│   │       └── pvp.rs              # PvP room logic
│   └── Cargo.toml
│
├── app/                        # Next.js frontend
│   ├── app/
│   │   ├── layout.tsx         # Root layout with wallet provider
│   │   ├── page.tsx           # Home page with game selection
│   │   └── globals.css        # Tailwind + neon styles
│   ├── components/
│   │   ├── WalletProvider.tsx
│   │   ├── Stats.tsx          # Treasury stats display
│   │   └── games/
│   │       ├── GameLayout.tsx # Shared game UI
│   │       ├── CoinFlip.tsx
│   │       ├── DiceGame.tsx
│   │       └── EvenOdd.tsx
│   ├── package.json
│   └── tailwind.config.ts
│
├── backend/                    # Node.js API + VRF handler
│   ├── src/
│   │   └── index.ts           # Express + WebSocket server
│   ├── package.json
│   └── .env.example
│
├── tests/
│   └── flip-casino.ts         # Anchor tests
│
├── Anchor.toml                # Anchor config
├── Cargo.toml                 # Workspace config
└── README.md
```

## Next Steps

### 1. Smart Contracts
- Replace placeholder program ID in `Anchor.toml`
- Integrate Switchboard VRF in `settle_game.rs` and `settle_pvp.rs`
- Add proper PDA derivation for escrow accounts
- Implement anti-cheat measures (cooldowns, rate limits)

### 2. Frontend
- Connect wallet adapter to actual program calls
- Implement real VRF result polling
- Add PvP lobby UI
- Add live feed of recent plays
- Implement mode switching (Treasury/PvP/Bot)

### 3. Backend
- Implement VRF callback handling
- Store game state in database
- Add WebSocket events for live updates
- Implement PvP matchmaking queue
- Add leaderboard tracking

### 4. Testing
- Write comprehensive Anchor tests
- Test edge cases (treasury drain, large wagers)
- Load test VRF latency
- Test PvP timeout scenarios

## Installation

### Smart Contracts
```bash
anchor build
anchor test
```

### Frontend
```bash
cd app
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

## Key Features Implemented

✅ Three 50/50 games (Coin Flip, Dice High/Low, Even/Odd)
✅ Treasury mode structure
✅ PvP room creation and joining
✅ Game settlement logic
✅ Neon-themed UI with animations
✅ Wallet integration
✅ WebSocket for live updates
✅ Stats display

## TODO

- [ ] Switchboard VRF integration
- [ ] PvP timeout handling (cancel room if no opponent)
- [ ] Proper escrow account management
- [ ] Rate limiting and anti-bot measures
- [ ] Leaderboard
- [ ] Transaction history
- [ ] Mobile responsive design
