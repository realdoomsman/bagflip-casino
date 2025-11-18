# 🔧 BagFlip Casino - Current Issues & Fixes

## 📊 Current Status

### Issues Found:
1. ❌ **Treasury Almost Empty**: 0.999995 SOL (needs more for payouts)
2. ❌ **Rate Limiting**: Devnet RPC is rate limiting requests (429 errors)
3. ❌ **Failed Payouts**: Can't send payouts due to insufficient treasury balance
4. ⚠️ **Wallet Mismatch**: Connected wallet may not have SOL

### What's Working:
✅ Backend running on devnet
✅ Frontend running on devnet
✅ Games accepting wagers
✅ VRF generating results
✅ Database storing games

## 🔨 Fixes Needed

### Fix 1: Fund the Treasury (URGENT)
The treasury needs more SOL to pay winners.

**Option A: Use Web Faucet**
1. Go to https://faucet.solana.com/
2. Paste: `GpWkVYPmc5rRFRXCRhdHH2zcSYExy19vwYeeG8GunVF7`
3. Request multiple airdrops (get 5-10 SOL)

**Option B: Transfer from Another Wallet**
If you have SOL in another wallet:
```bash
solana transfer GpWkVYPmc5rRFRXCRhdHH2zcSYExy19vwYeeG8GunVF7 5 --allow-unfunded-recipient
```

### Fix 2: Rate Limiting Issues
Devnet RPC is rate limiting. Solutions:

**Option A: Use a Different RPC (Recommended)**
Get a free RPC from:
- QuickNode: https://www.quicknode.com/ (free tier)
- Helius: https://www.helius.dev/ (free tier)
- Alchemy: https://www.alchemy.com/ (free tier)

Then update `backend/.env.local`:
```
SOLANA_RPC_URL=https://your-custom-rpc-url
```

**Option B: Add Retry Logic**
Already implemented, but rate limits are aggressive.

**Option C: Switch Back to Localhost**
For testing without rate limits:
```bash
# Start local validator
solana-test-validator

# Update configs to localhost
# backend/.env.local: SOLANA_RPC_URL=http://localhost:8899
# app/.env.local: NEXT_PUBLIC_RPC_URL=http://localhost:8899
```

### Fix 3: Wallet Connection
Make sure you're using a wallet with SOL:

**Check your connected wallet balance:**
```bash
# Replace with your wallet address
solana balance YOUR_WALLET_ADDRESS
```

**If it has 0 SOL, get devnet SOL:**
1. Go to https://faucet.solana.com/
2. Paste your wallet address
3. Request airdrop

## 🎯 Recommended Action Plan

### Immediate (Do Now):
1. **Fund Treasury**: Get 10 SOL into `GpWkVYPmc5rRFRXCRhdHH2zcSYExy19vwYeeG8GunVF7`
2. **Fund Your Wallet**: Make sure your playing wallet has 2-3 SOL
3. **Restart Backend**: After funding, restart to clear errors

### Short Term (Next):
1. **Get Custom RPC**: Sign up for free RPC to avoid rate limits
2. **Update RPC URLs**: In both backend and frontend configs
3. **Test Thoroughly**: Play a few games to verify everything works

### Long Term (Before Launch):
1. **Deploy Smart Contract**: Get the actual on-chain program working
2. **Use Mainnet**: Switch to real SOL on mainnet
3. **Production RPC**: Use paid RPC with higher limits
4. **Monitor Treasury**: Set up alerts for low balance

## 🚀 Quick Fix Script

Run this to check everything:

```bash
# Check treasury balance
solana balance GpWkVYPmc5rRFRXCRhdHH2zcSYExy19vwYeeG8GunVF7

# Check your wallet balance (replace with your address)
solana balance YOUR_WALLET_ADDRESS

# Check if on devnet
solana config get

# Restart backend
pkill -f "ts-node src/index.ts"
cd backend && npm run dev
```

## 📝 Current Configuration

**Treasury Wallet**: `GpWkVYPmc5rRFRXCRhdHH2zcSYExy19vwYeeG8GunVF7`
**Balance**: 0.999995 SOL ⚠️ (needs 10+ SOL)

**Network**: Devnet
**RPC**: https://api.devnet.solana.com (rate limited)

**Backend**: Running on port 3001
**Frontend**: Running on port 3000

## ⚡ Emergency: Switch Back to Localhost

If you want to test without devnet issues:

```bash
# Stop everything
pkill solana-test-validator
pkill -f "ts-node src/index.ts"
pkill -f "next dev"

# Start local validator
solana-test-validator &

# Update backend/.env.local
SOLANA_RPC_URL=http://localhost:8899

# Update app/.env.local  
NEXT_PUBLIC_RPC_URL=http://localhost:8899
NEXT_PUBLIC_SOLANA_NETWORK=localhost

# Airdrop to treasury
solana airdrop 100 GpWkVYPmc5rRFRXCRhdHH2zcSYExy19vwYeeG8GunVF7

# Restart services
cd backend && npm run dev &
cd app && npm run dev &
```

---

**Bottom Line**: The app works, but the treasury needs more SOL and devnet RPC is rate limiting. Fund the treasury and consider getting a custom RPC endpoint.
