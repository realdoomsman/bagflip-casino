# 🌐 Devnet Setup Complete!

## ✅ Configuration Updated

Your BagFlip Casino is now configured for **Solana Devnet** (real network, test SOL).

### Current Status:
- ✅ Solana CLI: Switched to devnet
- ✅ Backend: Configured for devnet RPC
- ✅ Frontend: Configured for devnet
- ⚠️ Treasury: Needs devnet SOL

### Treasury Wallet:
**Address**: `7Rd1pbFoj1Y9dQT4sJa6x5ZPnpNZ3dBd7M3FqRSdndi2`
**Current Balance**: 0 SOL (on devnet)

## 🚰 Get Devnet SOL for Treasury

The command-line faucet is rate-limited. Use one of these methods:

### Method 1: Web Faucet (Recommended)
1. Go to https://faucet.solana.com/
2. Paste treasury address: `7Rd1pbFoj1Y9dQT4sJa6x5ZPnpNZ3dBd7M3FqRSdndi2`
3. Click "Request Airdrop"
4. Repeat a few times to get 5-10 SOL

### Method 2: QuickNode Faucet
1. Go to https://faucet.quicknode.com/solana/devnet
2. Paste treasury address
3. Complete captcha
4. Get 0.5 SOL per request

### Method 3: Command Line (when not rate-limited)
```bash
solana airdrop 1 7Rd1pbFoj1Y9dQT4sJa6x5ZPnpNZ3dBd7M3FqRSdndi2
```

### Method 4: Transfer from Your Wallet
If you have devnet SOL in your wallet:
```bash
solana transfer 7Rd1pbFoj1Y9dQT4sJa6x5ZPnpNZ3dBd7M3FqRSdndi2 5 --allow-unfunded-recipient
```

## 🔄 Restart Services

Once treasury has SOL, restart the services:

```bash
# Stop current processes
pkill -f "ts-node src/index.ts"
pkill -f "next dev"

# Start backend
cd backend && npm run dev &

# Start frontend  
cd app && npm run dev &
```

Or just restart them in your IDE.

## ✅ Verify Setup

Check treasury balance:
```bash
solana balance 7Rd1pbFoj1Y9dQT4sJa6x5ZPnpNZ3dBd7M3FqRSdndi2
```

Check your wallet is on devnet:
- Open Phantom/Solflare
- Click settings
- Switch network to "Devnet"
- Request airdrop for your wallet too

## 🎮 Ready to Play on Devnet!

Once treasury has SOL:
1. Open http://localhost:3000
2. Connect wallet (make sure it's on Devnet!)
3. Play games with real devnet transactions
4. All transactions visible on Solana Explorer

### View Transactions:
- Treasury: https://explorer.solana.com/address/7Rd1pbFoj1Y9dQT4sJa6x5ZPnpNZ3dBd7M3FqRSdndi2?cluster=devnet
- Your games will appear on-chain!

## 📊 Differences from Localhost

**Devnet (Current):**
- ✅ Real Solana network
- ✅ Transactions on blockchain
- ✅ Visible on explorer
- ✅ Persistent (doesn't reset)
- ⚠️ Slower (network latency)
- ⚠️ Rate limits on faucet
- ⚠️ Free but limited SOL

**Localhost (Previous):**
- ✅ Instant transactions
- ✅ Unlimited SOL
- ✅ No rate limits
- ❌ Resets when stopped
- ❌ Not on real network

## 🚀 Next Steps

1. **Get devnet SOL** for treasury (use web faucet)
2. **Restart services** (backend + frontend)
3. **Switch wallet to devnet** in Phantom/Solflare
4. **Test the casino** with real devnet transactions!

---

**Your casino is now on a real Solana network!** 🎰

Just need to fund the treasury and you're ready to go!
