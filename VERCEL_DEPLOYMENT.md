# 🚀 Vercel Deployment Guide - BagFlip Casino

## Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- Git installed locally

---

## 📦 Step 1: Prepare Repository

### 1.1 Initialize Git (if not done)
```bash
git init
git add .
git commit -m "Initial commit: BagFlip Casino"
```

### 1.2 Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository named `bagflip-casino`
3. Don't initialize with README (we already have one)

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/bagflip-casino.git
git branch -M main
git push -u origin main
```

---

## 🌐 Step 2: Deploy Frontend to Vercel

### 2.1 Import Project
1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your GitHub repository `bagflip-casino`
4. Click "Import"

### 2.2 Configure Build Settings
```
Framework Preset: Next.js
Root Directory: app
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### 2.3 Environment Variables
Add these in Vercel dashboard under "Environment Variables":

```env
# Solana Network
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com

# Program IDs (replace with your deployed program IDs)
NEXT_PUBLIC_PROGRAM_ID=YOUR_PROGRAM_ID_HERE
NEXT_PUBLIC_TREASURY_PUBKEY=YOUR_TREASURY_PUBKEY_HERE

# Backend API (will be set after backend deployment)
NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
NEXT_PUBLIC_WS_URL=wss://your-backend.railway.app

# Switchboard VRF
NEXT_PUBLIC_SWITCHBOARD_PROGRAM_ID=SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f
```

### 2.4 Deploy
1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Your frontend will be live at `https://your-project.vercel.app`

---

## 🔧 Step 3: Deploy Backend (Railway)

### 3.1 Why Railway?
- Vercel doesn't support WebSockets well
- Railway is perfect for Node.js backends
- Free tier available

### 3.2 Deploy to Railway
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Set root directory to `backend`

### 3.3 Railway Environment Variables
```env
# Solana
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet

# Program
PROGRAM_ID=YOUR_PROGRAM_ID_HERE
TREASURY_KEYPAIR=YOUR_TREASURY_KEYPAIR_BASE58

# Database (Railway will auto-provide)
DATABASE_URL=postgresql://...

# Server
PORT=3001
NODE_ENV=production

# CORS
ALLOWED_ORIGINS=https://your-project.vercel.app
```

### 3.4 Railway Build Settings
```
Build Command: npm install
Start Command: npm start
```

### 3.5 Get Backend URL
After deployment, Railway will give you a URL like:
`https://your-backend.up.railway.app`

### 3.6 Update Vercel Environment Variables
Go back to Vercel and update:
```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend.up.railway.app
NEXT_PUBLIC_WS_URL=wss://your-backend.up.railway.app
```

Then redeploy the frontend.

---

## 📝 Step 4: Deploy Solana Program

### 4.1 Build Program
```bash
cd programs/flip-casino
anchor build
```

### 4.2 Deploy to Devnet
```bash
# Make sure you have SOL in your wallet
solana airdrop 2

# Deploy
anchor deploy --provider.cluster devnet
```

### 4.3 Get Program ID
```bash
solana address -k target/deploy/flip_casino-keypair.json
```

### 4.4 Update Environment Variables
Update both Vercel and Railway with the new `PROGRAM_ID`

---

## 🗄️ Step 5: Setup Database

### 5.1 Railway PostgreSQL
1. In Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will auto-create and link it
4. Copy the `DATABASE_URL` to your backend env vars

### 5.2 Run Migrations
```bash
# SSH into Railway or run locally with production DB
npm run migrate
```

---

## ✅ Step 6: Verify Deployment

### 6.1 Check Frontend
- Visit your Vercel URL
- Connect wallet
- Check if games load

### 6.2 Check Backend
```bash
curl https://your-backend.railway.app/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

### 6.3 Check WebSocket
Open browser console on your site:
```javascript
const ws = new WebSocket('wss://your-backend.railway.app')
ws.onopen = () => console.log('Connected!')
```

### 6.4 Test Game
1. Connect wallet
2. Get devnet SOL: https://faucet.solana.com
3. Play a game
4. Check transaction on Solana Explorer

---

## 🔒 Step 7: Security Checklist

- [ ] Environment variables set correctly
- [ ] Treasury keypair secured (not in git)
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Database credentials secured
- [ ] API endpoints protected
- [ ] WebSocket authentication (if needed)

---

## 📊 Step 8: Monitoring

### Vercel Analytics
- Enable in Vercel dashboard
- Monitor page views, performance

### Railway Logs
- View real-time logs in Railway dashboard
- Set up log alerts

### Solana Explorer
- Monitor program transactions
- Check treasury balance

---

## 🔄 Step 9: Continuous Deployment

### Auto-Deploy on Push
Both Vercel and Railway auto-deploy when you push to main:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Vercel and Railway will automatically:
1. Pull latest code
2. Run build
3. Deploy new version
4. Zero-downtime deployment

---

## 🐛 Troubleshooting

### Build Fails on Vercel
```bash
# Check build logs
# Common issues:
- Missing environment variables
- TypeScript errors
- Missing dependencies
```

### Backend Not Connecting
```bash
# Check Railway logs
# Verify:
- PORT is set correctly
- Database URL is valid
- CORS allows your frontend domain
```

### WebSocket Issues
```bash
# Railway supports WebSockets by default
# Make sure you're using wss:// not ws://
# Check CORS and allowed origins
```

### Transaction Fails
```bash
# Check:
- Wallet has SOL
- Program ID is correct
- Treasury has funds
- RPC endpoint is responsive
```

---

## 📱 Step 10: Custom Domain (Optional)

### Vercel Custom Domain
1. Go to Project Settings → Domains
2. Add your domain (e.g., bagflip.casino)
3. Update DNS records as instructed
4. SSL auto-configured

### Railway Custom Domain
1. Go to Settings → Domains
2. Add custom domain
3. Update DNS CNAME record
4. SSL auto-configured

---

## 💰 Cost Estimate

### Free Tier (Development)
- **Vercel**: Free (Hobby plan)
- **Railway**: $5/month credit (enough for small traffic)
- **Solana Devnet**: Free
- **Total**: ~$0-5/month

### Production (Paid)
- **Vercel Pro**: $20/month
- **Railway**: $20-50/month (based on usage)
- **Solana Mainnet**: Transaction fees only
- **Total**: ~$40-70/month

---

## 🚀 Quick Deploy Commands

```bash
# 1. Commit and push
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Deploy program
cd programs/flip-casino
anchor build
anchor deploy --provider.cluster devnet

# 3. Get program ID
solana address -k target/deploy/flip_casino-keypair.json

# 4. Update env vars in Vercel and Railway dashboards

# 5. Trigger redeployment (or wait for auto-deploy)
```

---

## 📚 Resources

- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Anchor Docs](https://www.anchor-lang.com)
- [Solana Docs](https://docs.solana.com)

---

## ✨ Post-Deployment

### Share Your Casino
- Tweet your deployment
- Share on Discord
- Add to Solana ecosystem list

### Monitor Performance
- Check Vercel Analytics
- Monitor Railway metrics
- Track Solana transactions

### Iterate
- Gather user feedback
- Add new games
- Improve UI/UX
- Scale as needed

---

## 🎉 You're Live!

Your BagFlip Casino is now deployed and accessible worldwide! 🚀

**Frontend**: https://your-project.vercel.app
**Backend**: https://your-backend.railway.app
**Program**: View on Solana Explorer

Good luck and may the flips be ever in your favor! 💰🎲
