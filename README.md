# BagFlip

Provably fair gaming platform built on Solana using Switchboard VRF for verifiable randomness.

## Features

- **Coin Flip** - Classic 50/50 odds
- **Dice Roll** - Roll 1-100, pick high or low
- **Even/Odd** - Guess even or odd
- **PvP Mode** - Challenge other players directly

All games use Switchboard VRF (Verifiable Random Function) to ensure outcomes are provably fair and cannot be manipulated.

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS, Framer Motion
- **Backend**: Node.js, Express, WebSocket
- **Blockchain**: Solana, Anchor Framework
- **Randomness**: Switchboard VRF

## Getting Started

### Prerequisites

- Node.js 18+
- Rust & Cargo
- Solana CLI
- Anchor CLI

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/bagflip.git
cd bagflip

# Install frontend dependencies
cd app
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Development

```bash
# Start the frontend
cd app
npm run dev

# Start the backend (in another terminal)
cd backend
npm run dev
```

Frontend runs on `http://localhost:3000`
Backend runs on `http://localhost:3001`

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

## Project Structure

```
├── app/                 # Next.js frontend
│   ├── app/            # App router pages
│   ├── components/     # React components
│   └── hooks/          # Custom hooks
├── backend/            # Express backend
│   └── src/            # Server source code
├── programs/           # Solana programs (Anchor)
│   └── flip-casino/    # Main casino program
└── tests/              # Integration tests
```

## Deployment

### Frontend (Vercel)

```bash
cd app
vercel
```

### Backend (Railway/Render)

Deploy the `backend` directory to your preferred hosting platform.

### Smart Contracts

```bash
anchor build
anchor deploy --provider.cluster devnet
```

## License

MIT
