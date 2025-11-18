# 🚀 Deploy BagFlip Casino - You're Almost There!

## ✅ Step 1: GitHub - DONE! ✅

Your code is live at: **https://github.com/realdoomsman/bagflip-casino**

---

## 🎯 Step 2: Deploy Frontend to Vercel (2 minutes)

### Option A: Using Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/new
   - Or click: https://vercel.com/new/realdoomsmans-projects

2. **Import Repository**
   - Click "Import" next to `realdoomsman/bagflip-casino`
   - Click "Import"

3. **Configure Project**
   ```
   Project Name: bagflip-casino
   Framework Preset: Next.js
   Root Directory: app
   Build Command: npm run build (auto-detected)
   Output Directory: .next (auto-detected)
   Install Command: npm install (auto-detected)
   ```

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
   NEXT_PUBLIC_WS_URL=ws://localhost:8080
   ```
   (We'll update these after backend deployment)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Copy your deployment URL (e.g., `https://bagflip-casino.vercel.app`)

### Option B: Using Vercel CLI

```bash
# From the app directory
cd app
vercel --prod

# Follow the prompts:
# - Link to existing project? No
# - Project name: bagflip-casino
# - Directory: . (current)
```

---

## 🚂 Step 3: Deploy Backend to Railway (2 minutes)

1. **Go to Railway**
   - Visit: https://railway.app/new

2. **Deploy from GitHub**
   - Click "Deploy from GitHub repo"
   - Select `realdoomsman/bagflip-casino`
   - Click "Deploy Now"

3. **Configure Service**
   - Click on the deployed service
   - Go to "Settings"
   - Set **Root Directory**: `backend`
   - Set **Start Command**: `npm start`

4. **Add PostgreSQL Database**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will auto-create and link it
   - Copy the `DATABASE_URL` from the database variables

5. **Add Environment Variables**
   Go to "Variables" tab and add:
   ```
   SOLANA_RPC_URL=https://api.devnet.solana.com
   SOLANA_NETWORK=devnet
   PORT=3001
   NODE_ENV=production
   DATABASE_URL=(auto-provided by Railway)
   ```

6. **Get Railway URL**
   - Go to "Settings" → "Networking"
   - Copy the public URL (e.g., `https://bagflip-casino-production.up.railway.app`)

---

## 🔗 Step 4: Connect Frontend & Backend (1 minute)

1. **Update Vercel Environment Variables**
   - Go to your Vercel project
   - Settings → Environment Variables
   - Update:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-railway-url.railway.app
   NEXT_PUBLIC_WS_URL=wss://your-railway-url.railway.app
   ```

2. **Redeploy Vercel**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

3. **Update Railway CORS**
   - Go to Railway project
   - Variables → Add:
   ```
   ALLOWED_ORIGINS=https://your-vercel-url.vercel.app
   ```

---

## ✅ Step 5: Test Your Deployment

1. **Visit Your Site**
   - Go to your Vercel URL
   - Should see the BagFlip Casino landing page

2. **Connect Wallet**
   - Click "Connect Wallet"
   - Connect your Solana wallet

3. **Get Devnet SOL**
   - Visit: https://faucet.solana.com
   - Request 2 SOL to your wallet

4. **Play a Game**
   - Click "PLAY NOW"
   - Choose a game
   - Place a bet
   - Watch it work!

---

## 🎉 You're Live!

Your casino is now deployed at:
- **Frontend**: https://your-project.vercel.app
- **Backend**: https://your-backend.railway.app
- **GitHub**: https://github.com/realdoomsman/bagflip-casino

---

## 📊 Quick Links

| Service | URL | Purpose |
|---------|-----|---------|
| Vercel Dashboard | https://vercel.com/dashboard | Manage frontend |
| Railway Dashboard | https://railway.app/dashboard | Manage backend |
| GitHub Repo | https://github.com/realdoomsman/bagflip-casino | Source code |
| Solana Faucet | https://faucet.solana.com | Get devnet SOL |

---

## 🔄 Auto-Deploy Setup

Both Vercel and Railway are now watching your GitHub repo:
- Push to `main` branch → Auto-deploys to production
- Create PR → Auto-creates preview deployment

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel and Railway will auto-deploy!
```

---

## 🐛 Troubleshooting

### Frontend Build Fails
```bash
# Test build locally first
cd app
npm run build
```

### Backend Not Starting
- Check Railway logs
- Verify environment variables
- Check DATABASE_URL is set

### Can't Connect Wallet
- Make sure you're on devnet
- Check browser console for errors
- Try refreshing the page

### Transactions Failing
- Get more devnet SOL
- Check wallet is connected
- Verify RPC endpoint is working

---

## 💡 Next Steps

1. **Deploy Solana Program** (Optional - currently using mock mode)
   ```bash
   cd programs/flip-casino
   anchor build
   anchor deploy --provider.cluster devnet
   ```

2. **Add Custom Domain** (Optional)
   - Vercel: Settings → Domains
   - Railway: Settings → Domains

3. **Monitor Performance**
   - Vercel Analytics
   - Railway Metrics
   - Solana Explorer

4. **Share Your Casino**
   - Tweet it
   - Post on Reddit
   - Share in Discord

---

## 🎰 Your Deployment URLs

Fill these in after deployment:

```
Frontend: https://_____________________.vercel.app
Backend:  https://_____________________.railway.app
GitHub:   https://github.com/realdoomsman/bagflip-casino ✅
```

---

**Good luck! May the flips be ever in your favor! 🎲💰**
