# 🚀 Deploy BagFlip Casino NOW - 5 Minute Guide

## ⚡ Super Quick Deploy

### 1️⃣ Push to GitHub (1 min)
```bash
# Create repo at: https://github.com/new (name: bagflip-casino)

# Then run:
git remote add origin https://github.com/YOUR_USERNAME/bagflip-casino.git
git push -u origin main
```

### 2️⃣ Deploy Frontend - Vercel (2 min)
1. Go to: https://vercel.com/new
2. Click "Import" → Select your repo
3. Settings:
   - Root Directory: `app`
   - Framework: Next.js (auto-detected)
4. Add Environment Variables:
   ```
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
   ```
5. Click "Deploy" → Wait 2 minutes ✅

### 3️⃣ Deploy Backend - Railway (2 min)
1. Go to: https://railway.app
2. "New Project" → "Deploy from GitHub"
3. Select your repo
4. Settings:
   - Root Directory: `backend`
5. Add Database:
   - Click "New" → "PostgreSQL"
6. Add Environment Variables:
   ```
   SOLANA_RPC_URL=https://api.devnet.solana.com
   SOLANA_NETWORK=devnet
   PORT=3001
   NODE_ENV=production
   ```
7. Deploy → Wait 2 minutes ✅

### 4️⃣ Connect Them
1. Copy Railway URL (e.g., `https://xxx.railway.app`)
2. Go to Vercel → Settings → Environment Variables
3. Add:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://xxx.railway.app
   NEXT_PUBLIC_WS_URL=wss://xxx.railway.app
   ```
4. Redeploy Vercel (auto-triggers)

### 5️⃣ Deploy Solana Program (Optional - can use mock mode)
```bash
cd programs/flip-casino
anchor build
anchor deploy --provider.cluster devnet

# Copy the Program ID and add to Vercel env vars:
# NEXT_PUBLIC_PROGRAM_ID=<your_program_id>
```

---

## ✅ Done! Your Casino is Live!

Visit your Vercel URL: `https://your-project.vercel.app`

---

## 🎮 Test It

1. Visit your site
2. Click "Connect Wallet"
3. Get devnet SOL: https://faucet.solana.com
4. Play a game!

---

## 📚 Need More Help?

- **Full Guide**: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- **Checklist**: Run `./deploy-checklist.sh`
- **Summary**: [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)

---

## 💡 Pro Tips

- Start with mock mode (no Solana program needed)
- Deploy program later when ready
- Use free tiers for testing
- Upgrade when you get traffic

---

## 🆘 Quick Fixes

**Build fails?**
```bash
cd app && npm run build
# Fix errors locally first
```

**Backend not connecting?**
- Check Railway logs
- Verify environment variables
- Check CORS settings

**Transactions failing?**
- Get more devnet SOL
- Verify program ID
- Check wallet connection

---

## 🎉 You're Live!

Share your casino:
- Tweet it
- Post on Reddit
- Share in Discord

**Good luck! 🎰💰**
