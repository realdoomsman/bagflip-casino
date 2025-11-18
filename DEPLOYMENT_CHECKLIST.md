# 🚀 Complete Deployment Checklist

## Phase 1: Smart Contract Deployment (30 min)

### ✅ Step 1: Build Contracts
```bash
cd /path/to/FLIP
anchor build
```

**Expected output:**
```
Compiling flip-casino v0.1.0
Finished release [optimized] target(s)
```

### ✅ Step 2: Deploy to Devnet (Test First!)
```bash
# Set to devnet
solana config set --url devnet

# Airdrop SOL for deployment
solana airdrop 2

# Deploy
anchor deploy --provider.cluster devnet
```

**Save the Program ID:**
```
Program Id: FLiP7xK9vR3m2J8nH5pQ1wX4tY2sZ9aB3cD4eF5gH6i
```

### ✅ Step 3: Update All Configs
```bash
# Update Anchor.toml
[programs.devnet]
flip_casino = "FLiP7xK9vR3m2J8nH5pQ1wX4tY2sZ9aB3cD4eF5gH6i"

# Update app/.env.local
NEXT_PUBLIC_PROGRAM_ID=FLiP7xK9vR3m2J8nH5pQ1wX4tY2sZ9aB3cD4eF5gH6i

# Update backend/.env
PROGRAM_ID=FLiP7xK9vR3m2J8nH5pQ1wX4tY2sZ9aB3cD4eF5gH6i
```

---

## Phase 2: Token Launch on Pump.fun (15 min)

### ✅ Step 1: Prepare Assets
- Logo: 512x512 PNG of coin
- Name: FLIP Casino
- Symbol: FLIP
- Description: "Your supply is your balance. Play 50/50 VRF casino games."

### ✅ Step 2: Launch on Pump.fun
1. Go to pump.fun
2. Click "Create Token"
3. Upload logo
4. Fill in details
5. Add socials (Twitter, Telegram, Website)
6. Launch!

### ✅ Step 3: Initial Buy
```bash
# Buy 5-30 SOL worth
# This gives you 5-30% of supply
# Save for treasury
```

### ✅ Step 4: Wait for Graduation
```
Token needs to reach bonding curve cap
Then graduates to Raydium
Now you can buy more for treasury
```

### ✅ Step 5: Save Token Mint Address
```bash
# Get from pump.fun or Raydium
TOKEN_MINT=FLiPtokenMintAddressHere123456789

# Update all configs
NEXT_PUBLIC_TOKEN_MINT=FLiPtokenMintAddressHere123456789
```

---

## Phase 3: Treasury Setup (20 min)

### ✅ Step 1: Buy More Tokens
```bash
# Buy on Raydium/Jupiter
# Target: 30-50% of circulating supply
# Example: If 1B supply, buy 300-500M
```

### ✅ Step 2: Initialize Treasury
```bash
npm run init-treasury
```

**This creates:**
- Treasury PDA
- Treasury token account
- Initializes on-chain state

### ✅ Step 3: Fund Treasury
```bash
# Transfer tokens to treasury
spl-token transfer <TOKEN_MINT> 200000000 <TREASURY_TOKEN_ACCOUNT> \
  --fund-recipient

# Verify balance
spl-token balance <TOKEN_MINT> --owner <TREASURY_TOKEN_ACCOUNT>
```

**Expected:**
```
200000000 (200M tokens in treasury)
```

---

## Phase 4: Switchboard VRF Setup (30 min)

### ✅ Step 1: Install Switchboard
```bash
# Backend
cd backend
npm install @switchboard-xyz/solana.js

# Program
# Add to Cargo.toml:
switchboard-v2 = "0.4.0"
```

### ✅ Step 2: Create VRF Account
```bash
# Use Switchboard CLI or UI
# https://app.switchboard.xyz

# Or programmatically:
ts-node scripts/create-vrf-account.ts
```

### ✅ Step 3: Fund VRF Account
```bash
# VRF needs SOL for oracle payments
solana transfer <VRF_ACCOUNT> 0.1
```

### ✅ Step 4: Update Backend
```typescript
// backend/.env
SWITCHBOARD_QUEUE=<oracle_queue_pubkey>
VRF_ACCOUNT=<your_vrf_account>
```

### ✅ Step 5: Test VRF
```bash
# Run test game
npm run test:vrf

# Should see:
# ✅ VRF requested
# ✅ Oracle responded
# ✅ Random value received
# ✅ Game settled
```

---

## Phase 5: Frontend Deployment (15 min)

### ✅ Step 1: Build Frontend
```bash
cd app
npm run build
```

**Check for errors:**
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
```

### ✅ Step 2: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod

# Or use Vercel dashboard:
# 1. Connect GitHub repo
# 2. Set env variables
# 3. Deploy
```

### ✅ Step 3: Set Environment Variables
```
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_PROGRAM_ID=<your_program_id>
NEXT_PUBLIC_TOKEN_MINT=<your_token_mint>
NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
```

### ✅ Step 4: Custom Domain (Optional)
```bash
# Add domain in Vercel dashboard
# Example: flip.casino
# Update DNS records
# Wait for SSL certificate
```

---

## Phase 6: Backend Deployment (15 min)

### ✅ Step 1: Choose Platform
Options:
- Railway (easiest)
- Heroku
- DigitalOcean
- AWS/GCP

### ✅ Step 2: Deploy to Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up
```

### ✅ Step 3: Set Environment Variables
```
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
PROGRAM_ID=<your_program_id>
TOKEN_MINT=<your_token_mint>
TREASURY_AUTHORITY_KEYPAIR=<base64_encoded_keypair>
SWITCHBOARD_QUEUE=<oracle_queue>
PORT=3001
```

### ✅ Step 4: Test Backend
```bash
curl https://your-backend.railway.app/api/stats

# Should return:
{
  "treasurySize": "200M",
  "flipsToday": 0,
  ...
}
```

---

## Phase 7: Testing (30 min)

### ✅ Test 1: Wallet Connection
1. Visit your site
2. Click "Connect Wallet"
3. Approve in Phantom
4. See balance displayed

### ✅ Test 2: Treasury Mode Game
1. Click "Coin Flip"
2. Enter wager (small amount!)
3. Choose Heads/Tails
4. Click PLAY
5. Watch animation
6. See result
7. Check wallet balance changed

### ✅ Test 3: PvP Mode
1. Create room
2. Set wager
3. Wait for opponent (or join from another wallet)
4. Game plays
5. Winner receives payout

### ✅ Test 4: Live Feed
1. Play multiple games
2. Check live feed updates
3. See wins/losses appear

### ✅ Test 5: Mobile
1. Open on phone
2. Test all games
3. Check responsive layout
4. Test wallet connection

---

## Phase 8: Launch Announcement (15 min)

### ✅ Twitter Thread
```
🎰 $FLIP Casino is LIVE on Solana

The first on-chain casino where your token supply IS your balance.

🪙 Coin Flip
🎲 Dice High/Low
🔢 Even/Odd

✅ 50/50 odds
✅ VRF verified
✅ Play vs Treasury or PvP

CA: [token address]
Play: https://flip.casino

Thread 🧵👇
```

### ✅ Telegram Announcement
```
🚨 CASINO IS LIVE 🚨

$FLIP holders can now gamble their supply!

Play now: [link]
Treasury: 200M $FLIP ready to pay winners

LFG! 🚀
```

### ✅ Discord/Reddit
- Post in relevant communities
- Share gameplay videos
- Offer first-player bonuses

---

## Phase 9: Monitoring (Ongoing)

### ✅ Set Up Alerts
```typescript
// Monitor treasury balance
if (treasuryBalance < 50M) {
  alert("Treasury low - refill needed")
}

// Monitor suspicious activity
if (sameUserWins > 10) {
  alert("Possible exploit - investigate")
}

// Monitor VRF costs
if (dailyVrfCost > $50) {
  alert("VRF costs high")
}
```

### ✅ Daily Checks
- [ ] Treasury balance
- [ ] Total games played
- [ ] Biggest wins/losses
- [ ] User complaints
- [ ] Transaction errors
- [ ] VRF success rate

### ✅ Weekly Tasks
- [ ] Withdraw treasury profits
- [ ] Update stats/leaderboard
- [ ] Marketing push
- [ ] Bug fixes
- [ ] Feature additions

---

## Phase 10: Scaling (Week 2+)

### ✅ Add Features
- [ ] Tournaments
- [ ] Leaderboards
- [ ] NFT rewards
- [ ] More games
- [ ] Referral system

### ✅ Optimize
- [ ] Reduce VRF costs
- [ ] Improve animations
- [ ] Add caching
- [ ] Optimize RPC calls

### ✅ Market
- [ ] Influencer partnerships
- [ ] Twitter spaces
- [ ] Meme contests
- [ ] Giveaways

---

## 🎯 Success Metrics

### Week 1 Goals:
- [ ] 100+ unique players
- [ ] 1,000+ games played
- [ ] $10K+ volume
- [ ] No critical bugs
- [ ] Treasury stable

### Month 1 Goals:
- [ ] 1,000+ unique players
- [ ] 50,000+ games played
- [ ] $500K+ volume
- [ ] Listed on CoinGecko
- [ ] 5,000+ Telegram members

### Month 3 Goals:
- [ ] 10,000+ unique players
- [ ] 500,000+ games played
- [ ] $5M+ volume
- [ ] Profitable (treasury growth > costs)
- [ ] Sustainable business

---

## 💰 Cost Breakdown

### One-Time Costs:
- Solana deployment: ~0.5 SOL ($50)
- Domain: $10/year
- Logo design: $50-200

### Monthly Costs:
- Vercel hosting: $0-20
- Railway backend: $5-20
- RPC calls: $0-50
- VRF fees: $20-100/day = $600-3000/month
- Marketing: $500-5000

### Total Monthly: $1,000-5,000

### Break-Even:
- Need ~$35/day profit
- At 1000 games/day with 0.5% edge
- Average wager $10 = $50/day profit
- ✅ Profitable from day 1

---

## 🚨 Emergency Procedures

### If Treasury Runs Low:
```bash
# 1. Pause games
anchor run pause-games

# 2. Refill treasury
spl-token transfer <MINT> 100000000 <TREASURY>

# 3. Resume games
anchor run resume-games
```

### If Exploit Detected:
```bash
# 1. Pause immediately
anchor run pause-games

# 2. Investigate logs
tail -f backend/logs/games.log

# 3. Fix vulnerability
# 4. Deploy patch
# 5. Resume with limits
```

### If VRF Fails:
```bash
# 1. Check Switchboard status
# 2. Verify VRF account funded
# 3. Retry failed games
# 4. Refund if necessary
```

---

## ✅ Final Checklist

Before going live:
- [ ] Contracts deployed and verified
- [ ] Token launched and liquid
- [ ] Treasury funded (200M+ tokens)
- [ ] VRF working and funded
- [ ] Frontend deployed and tested
- [ ] Backend deployed and monitored
- [ ] All games tested
- [ ] PvP tested
- [ ] Mobile tested
- [ ] Socials ready
- [ ] Announcement prepared
- [ ] Monitoring set up
- [ ] Emergency procedures documented

---

## 🎉 You're Ready to Launch!

Follow this checklist step by step and you'll have a fully functional, on-chain casino running in ~3 hours.

**Good luck! 🚀🎰**
