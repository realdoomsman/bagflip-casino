# 🚂 Deploy Backend to Railway - Step by Step

## 📋 Quick Checklist

Your backend is ready to deploy! Follow these exact steps:

---

## Step 1: Go to Railway

**Open this link:** https://railway.app/new

(If not logged in, sign in with GitHub)

---

## Step 2: Deploy from GitHub

1. Click **"Deploy from GitHub repo"**
2. You'll see a list of your repos
3. Find and click: **`realdoomsman/bagflip-casino`**
4. Click **"Deploy Now"**

Railway will start deploying...

---

## Step 3: Configure Root Directory

After deployment starts:

1. Click on the **service card** (it will say "bagflip-casino")
2. Go to **"Settings"** tab
3. Find **"Root Directory"**
4. Enter: `backend`
5. Click **"Save"** or it auto-saves

---

## Step 4: Add PostgreSQL Database

1. In your project, click **"New"** button (top right)
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Railway will create and link it automatically
5. The `DATABASE_URL` will be auto-added to your service

---

## Step 5: Add Environment Variables

1. Click on your **service** (not the database)
2. Go to **"Variables"** tab
3. Click **"New Variable"** and add these one by one:

```
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
PORT=3001
NODE_ENV=production
```

**Note:** `DATABASE_URL` should already be there (auto-added by Railway)

---

## Step 6: Wait for Deployment

1. Go to **"Deployments"** tab
2. Watch the build logs
3. Wait for status to show **"Success"** (takes 2-3 minutes)

---

## Step 7: Get Your Railway URL

1. Go to **"Settings"** tab
2. Scroll to **"Networking"** section
3. You'll see **"Public Networking"**
4. Copy the URL (looks like: `https://bagflip-casino-production.up.railway.app`)

**Save this URL!** You'll need it for the next step.

---

## Step 8: Update Vercel Environment Variables

1. Go to: https://vercel.com/realdoomsmans-projects/app/settings/environment-variables

2. Find `NEXT_PUBLIC_BACKEND_URL`:
   - Click **"Edit"**
   - Change value to: `https://your-railway-url.railway.app`
   - Click **"Save"**

3. Find `NEXT_PUBLIC_WS_URL`:
   - Click **"Edit"**
   - Change value to: `wss://your-railway-url.railway.app`
   - Click **"Save"**

4. After saving, Vercel will ask to redeploy
   - Click **"Redeploy"** or it will auto-redeploy

---

## Step 9: Test Your Casino! 🎰

1. Wait 1-2 minutes for Vercel to redeploy
2. Visit: https://app-nx25kpkir-realdoomsmans-projects.vercel.app
3. Connect your wallet
4. Click "PLAY NOW"
5. Choose a game
6. **IT SHOULD WORK!** 🎉

---

## 🐛 Troubleshooting

### Railway Build Fails
- Check the build logs in Railway
- Make sure Root Directory is set to `backend`
- Verify all environment variables are set

### Backend Not Starting
- Check Railway logs for errors
- Verify `PORT=3001` is set
- Make sure PostgreSQL is connected

### Frontend Still Not Working
- Verify Vercel env vars are updated
- Make sure you redeployed Vercel
- Check browser console for errors
- Try hard refresh (Cmd+Shift+R)

---

## 📊 Your Deployment Status

Fill this in as you go:

```
✅ Railway project created
✅ Root directory set to 'backend'
✅ PostgreSQL database added
✅ Environment variables added
✅ Deployment successful
✅ Railway URL copied: ___________________________
✅ Vercel env vars updated
✅ Vercel redeployed
✅ Casino tested and working!
```

---

## 🎉 Success!

Once complete, your casino will be:
- ✅ Frontend on Vercel
- ✅ Backend on Railway
- ✅ Database on Railway PostgreSQL
- ✅ Fully functional games
- ✅ Live feed working
- ✅ PvP rooms working

**Total time: ~5 minutes**

---

## 💰 Cost

Railway free tier includes:
- $5 credit per month
- Enough for development/testing
- Upgrade to $5/month for more resources

---

## 🆘 Need Help?

If you get stuck:
1. Check Railway logs (Deployments tab)
2. Check Vercel logs (Deployments tab)
3. Check browser console (F12)
4. Verify all URLs are correct

---

**Ready? Let's go! 🚀**

Start at: https://railway.app/new
