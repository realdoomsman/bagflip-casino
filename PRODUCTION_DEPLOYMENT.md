# 🚀 PRODUCTION DEPLOYMENT GUIDE

## Overview

Complete step-by-step guide to deploy BagFlip Casino to production (mainnet).

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Required Accounts & Services
- [ ] Solana mainnet wallet with SOL for deployment
- [ ] Vercel account (frontend hosting)
- [ ] Railway/Render account (backend hosting)
- [ ] Domain: bagflip.xyz purchased
- [ ] PostgreSQL database (Supabase/Railway)
- [ ] RPC provider account (Helius/QuickNode recommended)

### Required Funds
- [ ] ~5 SOL for program deployment
- [ ] ~10 SOL for treasury authority wallet
- [ ] ~2 SOL for VRF account funding
- [ ] $FLIP tokens for treasury (e.g., 100M tokens)

---

## 🔧 STEP 1: SOLANA SMART CONTRACTS

### 1.1 Build Program

```bash
cd programs/flip-casino
anchor build
```

### 1.2 Update Program ID

```bash
# Get the program ID
anchor keys list

# Update in Anchor.toml
[programs.mainnet]
flip_casino = "YOUR_PROGRAM_ID_HERE"

# Update in lib.rs
declare_id!("YOUR_PROGRAM_ID_HERE");

# Rebuild
anchor build
```

### 1.3 Deploy to Mainnet

```bash
# Set Solana to mainnet
solana config set --url mainnet-beta

# Check balance (need ~5 SOL)
solana balance

# Deploy
anchor deploy --provider.cluster mainnet

# Verify deployment
solana program show YOUR_PROGRAM_ID
```

### 1.4 Initialize Treasury

```bash
# Update scripts/initialize-treasury.ts with mainnet config
# Run initialization
ts-node scripts/initialize-treasury.ts --cluster mainnet
```

### 1.5 Fund Treasury

```bash
# Transfer $FLIP tokens to treasury
spl-transfer YOUR_TOKEN_MINT 100000000 TREASURY_TOKEN_ACCOUNT \
  --owner ~/.config/solana/mainnet-authority.json \
  --fund-recipient
```

### 1.6 Setup Switchboard VRF

```bash
# Create VRF account
# Follow Switchboard docs: https://docs.switchboard.xyz/

# Fund VRF account with ~2 SOL
solana transfer VRF_ACCOUNT_ADDRESS 2 \
  --from ~/.config/solana/mainnet-authority.json

# Register callback with your program
```

**Important:** Save all addresses:
- ✅ Program ID
- ✅ Treasury PDA
- ✅ Treasury Token Account
- ✅ VRF Account
- ✅ Token Mint

---

## 🗄️ STEP 2: DATABASE SETUP

### Option A: Supabase (Recommended)

1. **Create Project:**
   - Go to https://supabase.com
   - Create new project
   - Choose region closest to your users
   - Note the connection string

2. **Get Connection String:**
   ```
   Settings → Database → Connection String (URI)
   postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   ```

3. **Test Connection:**
   ```bash
   psql "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
   ```

### Option B: Railway

1. **Add PostgreSQL:**
   - Create new project
   - Add PostgreSQL service
   - Copy DATABASE_URL from variables

2. **Configure:**
   - Set connection limit: 20
   - Enable SSL

---

## 🖥️ STEP 3: BACKEND DEPLOYMENT

### 3.1 Prepare Backend

```bash
cd backend

# Create production .env
cp .env.example .env.production

# Update .env.production with:
# - SOLANA_RPC_URL (mainnet)
# - PROGRAM_ID (from deployment)
# - TREASURY_AUTHORITY_KEYPAIR (secure path)
# - DATABASE_URL (from Supabase/Railway)
# - VRF_MODE=switchboard
# - ALLOWED_ORIGINS=https://bagflip.xyz
```

### 3.2 Deploy to Railway

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Initialize Project:**
   ```bash
   railway init
   railway link
   ```

3. **Add Environment Variables:**
   ```bash
   railway variables set PORT=3001
   railway variables set NODE_ENV=production
   railway variables set SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
   railway variables set PROGRAM_ID=YOUR_PROGRAM_ID
   railway variables set DATABASE_URL=YOUR_DATABASE_URL
   railway variables set VRF_MODE=switchboard
   railway variables set ALLOWED_ORIGINS=https://bagflip.xyz
   ```

4. **Add Treasury Keypair:**
   ```bash
   # Upload keypair as secret file
   railway volumes create
   railway volumes mount /secrets
   # Upload mainnet-authority.json to /secrets
   railway variables set TREASURY_AUTHORITY_KEYPAIR=/secrets/mainnet-authority.json
   ```

5. **Deploy:**
   ```bash
   railway up
   ```

6. **Get URLs:**
   ```bash
   railway domain
   # Note: HTTP URL and WebSocket URL (same domain)
   ```

### 3.3 Alternative: Render

1. **Create Web Service:**
   - Connect GitHub repo
   - Select `backend` directory
   - Build: `npm install && npm run build`
   - Start: `npm start`

2. **Add Environment Variables:**
   - Add all variables from Railway section
   - Upload keypair as secret file

3. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment

---

## 🌐 STEP 4: FRONTEND DEPLOYMENT

### 4.1 Prepare Frontend

```bash
cd app

# Create production .env
cp .env.example .env.production

# Update .env.production with:
# - NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
# - NEXT_PUBLIC_RPC_URL (Helius/QuickNode)
# - NEXT_PUBLIC_PROGRAM_ID (from deployment)
# - NEXT_PUBLIC_TOKEN_MINT (your $FLIP mint)
# - NEXT_PUBLIC_BACKEND_URL (from Railway)
# - NEXT_PUBLIC_WS_URL (from Railway, use wss://)
```

### 4.2 Test Build Locally

```bash
npm run build
npm start

# Test on http://localhost:3000
# Verify all features work
```

### 4.3 Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Or via GitHub:**
   - Push to GitHub
   - Import project in Vercel dashboard
   - Add environment variables
   - Deploy

4. **Add Environment Variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add all NEXT_PUBLIC_* variables
   - Redeploy

---

## 🌍 STEP 5: DOMAIN CONFIGURATION

### 5.1 Configure bagflip.xyz

1. **Add Domain to Vercel:**
   - Project Settings → Domains
   - Add `bagflip.xyz` and `www.bagflip.xyz`

2. **Update DNS Records:**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21 (Vercel IP)

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Wait for SSL:**
   - Vercel auto-provisions SSL
   - Usually takes 5-10 minutes

### 5.2 Update Backend CORS

```bash
# Update Railway environment
railway variables set ALLOWED_ORIGINS=https://bagflip.xyz,https://www.bagflip.xyz
```

---

## ✅ STEP 6: POST-DEPLOYMENT VERIFICATION

### 6.1 Smart Contract Tests

```bash
# Verify program is deployed
solana program show YOUR_PROGRAM_ID

# Check treasury balance
spl-token balance YOUR_TOKEN_MINT --owner TREASURY_TOKEN_ACCOUNT

# Test a small game (devnet first!)
```

### 6.2 Backend Health Check

```bash
# Test API endpoints
curl https://your-backend.railway.app/api/stats

# Test WebSocket
wscat -c wss://your-backend.railway.app

# Check database connection
# View Railway logs
railway logs
```

### 6.3 Frontend Tests

1. **Visit https://bagflip.xyz**
2. **Test Wallet Connection:**
   - Connect Phantom
   - Check balance display
   - Verify network (mainnet)

3. **Test Small Game:**
   - Play with minimum wager
   - Verify transaction
   - Check result

4. **Test PvP:**
   - Create room
   - Join from another wallet
   - Verify settlement

5. **Check Live Feed:**
   - Verify real-time updates
   - Check leaderboard
   - Verify stats

---

## 🔐 STEP 7: SECURITY HARDENING

### 7.1 Secure Treasury Authority

```bash
# Use hardware wallet (Ledger) for treasury authority
# Or use multi-sig wallet

# Backup keypair securely
gpg -c mainnet-authority.json
# Store encrypted backup in multiple locations
```

### 7.2 Enable Monitoring

```bash
# Setup error tracking (Sentry)
npm install @sentry/nextjs @sentry/node

# Add to frontend and backend
# Configure alerts for errors
```

### 7.3 Rate Limiting

```bash
# Already implemented in backend
# Verify it's working:
# - 10 requests/min for games
# - 5 requests/min for room creation
```

### 7.4 Database Backups

```bash
# Supabase: Enable automatic backups
# Railway: Enable daily backups

# Test restore procedure
```

---

## 📊 STEP 8: MONITORING & MAINTENANCE

### 8.1 Setup Monitoring

**Uptime Monitoring:**
- Use UptimeRobot or Pingdom
- Monitor frontend, backend, and WebSocket

**Error Tracking:**
- Sentry for frontend and backend
- Alert on critical errors

**Analytics:**
- Google Analytics or Plausible
- Track user engagement

### 8.2 Treasury Monitoring

```bash
# Create monitoring script
# Check treasury balance daily
# Alert if balance < threshold

# Monitor for unusual activity
# Track win/loss ratios
```

### 8.3 Database Maintenance

```bash
# Weekly cleanup
DELETE FROM games WHERE settled = TRUE AND timestamp < (NOW() - INTERVAL '30 days');
DELETE FROM live_feed_events WHERE timestamp < (NOW() - INTERVAL '7 days');

# Monthly vacuum
VACUUM ANALYZE;
```

---

## 🚨 ROLLBACK PROCEDURE

### If Issues Occur:

1. **Frontend Issues:**
   ```bash
   # Revert to previous deployment
   vercel rollback
   ```

2. **Backend Issues:**
   ```bash
   # Rollback Railway deployment
   railway rollback
   ```

3. **Smart Contract Issues:**
   ```bash
   # Cannot rollback on-chain
   # Deploy new version with fixes
   # Update PROGRAM_ID everywhere
   ```

4. **Database Issues:**
   ```bash
   # Restore from backup
   pg_restore -d bagflip_casino backup.sql
   ```

---

## 📝 DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] All tests passing
- [ ] Security audit complete
- [ ] Backup all keypairs
- [ ] Fund all accounts
- [ ] Test on devnet

### Smart Contracts
- [ ] Build program
- [ ] Update program ID
- [ ] Deploy to mainnet
- [ ] Initialize treasury
- [ ] Fund treasury with $FLIP
- [ ] Setup VRF account
- [ ] Verify deployment

### Database
- [ ] Create PostgreSQL database
- [ ] Test connection
- [ ] Run migrations
- [ ] Setup backups

### Backend
- [ ] Update environment variables
- [ ] Upload treasury keypair
- [ ] Deploy to Railway/Render
- [ ] Test API endpoints
- [ ] Test WebSocket
- [ ] Verify database connection

### Frontend
- [ ] Update environment variables
- [ ] Test build locally
- [ ] Deploy to Vercel
- [ ] Configure domain
- [ ] Test SSL
- [ ] Verify all features

### Post-Deployment
- [ ] Test end-to-end flow
- [ ] Verify treasury operations
- [ ] Check monitoring
- [ ] Setup alerts
- [ ] Document all addresses
- [ ] Announce launch

---

## 🎉 LAUNCH CHECKLIST

### Soft Launch (Day 1-7)
- [ ] Announce to small group
- [ ] Monitor closely
- [ ] Limit treasury to 10M $FLIP
- [ ] Fix any issues quickly

### Public Launch (Day 8+)
- [ ] Twitter announcement
- [ ] Solana community posts
- [ ] Increase treasury to 100M $FLIP
- [ ] Marketing campaign
- [ ] Monitor and scale

---

## 📞 SUPPORT & MAINTENANCE

### Daily Tasks
- Check treasury balance
- Monitor error logs
- Review user feedback
- Check uptime

### Weekly Tasks
- Database cleanup
- Review analytics
- Update documentation
- Security review

### Monthly Tasks
- Full security audit
- Performance optimization
- Feature updates
- Community engagement

---

## 🎯 SUCCESS METRICS

### Track These KPIs:
- Total games played
- Total volume wagered
- Active users (daily/weekly)
- Treasury profit/loss
- Average wager size
- User retention
- Error rate
- Uptime percentage

---

## 📚 USEFUL COMMANDS

### Solana
```bash
# Check program
solana program show PROGRAM_ID

# Check treasury balance
spl-token balance TOKEN_MINT --owner TREASURY_ACCOUNT

# View recent transactions
solana transaction-history TREASURY_ACCOUNT
```

### Backend
```bash
# View logs
railway logs --tail

# Restart service
railway restart

# Check database
railway run psql $DATABASE_URL
```

### Frontend
```bash
# View deployment logs
vercel logs

# Check build
vercel inspect URL
```

---

## 🎉 CONGRATULATIONS!

Your BagFlip Casino is now live on mainnet! 🚀

**Live at:** https://bagflip.xyz

**Next Steps:**
1. Monitor closely for first 24 hours
2. Gather user feedback
3. Fix any issues immediately
4. Scale treasury as needed
5. Enjoy your success! 🎰💰

---

**Status:** Ready for production deployment! 🚀
