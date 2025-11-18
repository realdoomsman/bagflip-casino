# 🚀 Deployment Summary - BagFlip Casino

## Quick Reference

### 📋 What You Need
- [ ] GitHub account
- [ ] Vercel account (free)
- [ ] Railway account (free tier available)
- [ ] Solana wallet with devnet SOL

### ⚡ Quick Deploy (5 minutes)

```bash
# 1. Initialize and push to GitHub
./init-repo.sh
# Follow the prompts to add your GitHub remote

# 2. Deploy Frontend (Vercel)
# → Go to vercel.com/new
# → Import your GitHub repo
# → Root directory: app
# → Add environment variables (see below)
# → Deploy

# 3. Deploy Backend (Railway)
# → Go to railway.app
# → New Project → GitHub repo
# → Root directory: backend
# → Add environment variables
# → Deploy

# 4. Deploy Solana Program
cd programs/flip-casino
anchor build
anchor deploy --provider.cluster devnet
```

---

## 🌐 Deployment URLs

After deployment, you'll have:

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | `https://your-project.vercel.app` | User interface |
| Backend | `https://your-backend.railway.app` | API & WebSocket |
| Program | Solana Explorer | Smart contracts |

---

## 🔑 Environment Variables

### Vercel (Frontend)
```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=<from_anchor_deploy>
NEXT_PUBLIC_TREASURY_PUBKEY=<your_treasury>
NEXT_PUBLIC_BACKEND_URL=<railway_url>
NEXT_PUBLIC_WS_URL=<railway_ws_url>
NEXT_PUBLIC_SWITCHBOARD_PROGRAM_ID=SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f
```

### Railway (Backend)
```env
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
PROGRAM_ID=<from_anchor_deploy>
TREASURY_KEYPAIR=<base58_encoded>
DATABASE_URL=<auto_provided_by_railway>
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=<your_vercel_url>
```

---

## 📝 Step-by-Step Checklist

### Phase 1: Repository Setup ✅
- [x] Git initialized
- [x] .gitignore created
- [ ] Push to GitHub
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/bagflip-casino.git
  git branch -M main
  git push -u origin main
  ```

### Phase 2: Solana Program 🔗
- [ ] Build program
  ```bash
  cd programs/flip-casino
  anchor build
  ```
- [ ] Get devnet SOL
  ```bash
  solana airdrop 2
  ```
- [ ] Deploy to devnet
  ```bash
  anchor deploy --provider.cluster devnet
  ```
- [ ] Save Program ID
  ```bash
  solana address -k target/deploy/flip_casino-keypair.json
  ```

### Phase 3: Frontend (Vercel) 🎨
- [ ] Go to [vercel.com/new](https://vercel.com/new)
- [ ] Import GitHub repository
- [ ] Configure:
  - Framework: Next.js
  - Root Directory: `app`
  - Build Command: `npm run build`
  - Output Directory: `.next`
- [ ] Add environment variables (see above)
- [ ] Click Deploy
- [ ] Wait 2-3 minutes
- [ ] Copy deployment URL

### Phase 4: Backend (Railway) ⚙️
- [ ] Go to [railway.app](https://railway.app)
- [ ] New Project → Deploy from GitHub
- [ ] Select your repository
- [ ] Configure:
  - Root Directory: `backend`
  - Build Command: `npm install`
  - Start Command: `npm start`
- [ ] Add PostgreSQL database
  - Click "New" → "Database" → "PostgreSQL"
  - Railway auto-links it
- [ ] Add environment variables
- [ ] Deploy
- [ ] Copy Railway URL

### Phase 5: Connect Everything 🔌
- [ ] Update Vercel env vars with Railway URL
  ```env
  NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
  NEXT_PUBLIC_WS_URL=wss://your-backend.railway.app
  ```
- [ ] Redeploy Vercel (auto-triggers on env change)
- [ ] Update Railway env vars with Vercel URL
  ```env
  ALLOWED_ORIGINS=https://your-project.vercel.app
  ```

### Phase 6: Testing 🧪
- [ ] Visit your Vercel URL
- [ ] Connect wallet
- [ ] Get devnet SOL from [faucet](https://faucet.solana.com)
- [ ] Play a game
- [ ] Check transaction on [Solana Explorer](https://explorer.solana.com/?cluster=devnet)
- [ ] Verify live feed updates
- [ ] Test PvP mode

---

## 🐛 Common Issues & Fixes

### Build Fails on Vercel
**Problem**: TypeScript errors or missing dependencies
**Fix**: 
```bash
cd app
npm run build
# Fix any errors locally first
```

### Backend Not Connecting
**Problem**: CORS or WebSocket issues
**Fix**: Check Railway logs, verify ALLOWED_ORIGINS includes your Vercel URL

### Transactions Failing
**Problem**: Insufficient SOL or wrong program ID
**Fix**: 
- Get more devnet SOL
- Verify NEXT_PUBLIC_PROGRAM_ID matches deployed program
- Check treasury has funds

### WebSocket Not Working
**Problem**: Using ws:// instead of wss://
**Fix**: Use `wss://` for production Railway URLs

---

## 💰 Cost Breakdown

### Free Tier (Perfect for Testing)
- **Vercel**: Free (Hobby plan)
  - Unlimited deployments
  - 100GB bandwidth/month
  - Automatic SSL
- **Railway**: $5 free credit/month
  - Enough for low traffic
  - PostgreSQL included
- **Solana Devnet**: Free
  - Unlimited transactions
  - Free SOL from faucet
- **Total**: $0/month

### Production (Recommended)
- **Vercel Pro**: $20/month
  - Better performance
  - More bandwidth
  - Team features
- **Railway**: $20-50/month
  - Based on usage
  - Scales automatically
- **Solana Mainnet**: Pay per transaction
  - ~$0.00025 per transaction
  - Very affordable
- **Total**: ~$40-70/month

---

## 🔒 Security Checklist

Before going to mainnet:
- [ ] Treasury keypair stored securely (hardware wallet)
- [ ] Environment variables not in git
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Database credentials secured
- [ ] SSL/TLS enabled (auto on Vercel/Railway)
- [ ] Audit smart contracts
- [ ] Test with small amounts first

---

## 📊 Monitoring

### Vercel Analytics
- Enable in project settings
- Monitor page views, performance
- Track user engagement

### Railway Logs
- Real-time logs in dashboard
- Set up alerts for errors
- Monitor resource usage

### Solana Explorer
- Track all transactions
- Monitor treasury balance
- Verify VRF randomness

---

## 🎉 Post-Deployment

### Share Your Casino
- Tweet about it
- Post on Reddit (r/solana, r/SolanaDev)
- Share in Discord communities
- Add to Solana ecosystem lists

### Gather Feedback
- Monitor user behavior
- Track common issues
- Collect feature requests
- Iterate quickly

### Scale Up
- Monitor traffic
- Upgrade plans as needed
- Add more games
- Implement tournaments

---

## 📚 Resources

- **Full Guide**: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- **Checklist Script**: `./deploy-checklist.sh`
- **Init Script**: `./init-repo.sh`
- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Anchor Docs**: https://www.anchor-lang.com

---

## 🆘 Need Help?

1. Check [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed steps
2. Run `./deploy-checklist.sh` to verify setup
3. Check Railway/Vercel logs for errors
4. Review Solana Explorer for transaction details

---

## ✨ Success!

Once deployed, your casino will be:
- ✅ Live and accessible worldwide
- ✅ Auto-deploying on git push
- ✅ Scalable and performant
- ✅ Secure and reliable

**Your casino is ready to flip! 🎰💰**

Good luck and may the odds be ever in your favor! 🚀
