# 🎰 Connect bagflip.xyz to Vercel

## Step-by-Step Instructions for bagflip.xyz

---

## 1️⃣ Add Domain in Vercel (2 minutes)

1. **Go to Vercel Domains Settings:**
   https://vercel.com/realdoomsmans-projects/app/settings/domains

2. **Click "Add" button**

3. **Enter:** `bagflip.xyz`

4. **Click "Add"**

5. **Also add:** `www.bagflip.xyz` (optional but recommended)

Vercel will now show you the DNS records you need to add.

---

## 2️⃣ DNS Records to Add

Vercel will show you these records. You need to add them in your domain registrar.

### For Root Domain (bagflip.xyz):
```
Type: A
Name: @ (or leave blank)
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

### For WWW Subdomain (www.bagflip.xyz):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

---

## 3️⃣ Where Did You Buy bagflip.xyz?

Choose your registrar below:

### If using **GoDaddy**:

1. Go to: https://dcc.godaddy.com/manage/bagflip.xyz/dns
2. Scroll to "DNS Records"
3. Click "Add" button
4. Add the A record:
   - Type: A
   - Name: @
   - Value: 76.76.21.21
   - TTL: 1 Hour
5. Click "Add" again for CNAME:
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com
   - TTL: 1 Hour
6. Click "Save"

### If using **Namecheap**:

1. Go to: https://ap.www.namecheap.com/domains/list/
2. Click "Manage" next to bagflip.xyz
3. Go to "Advanced DNS" tab
4. Click "Add New Record"
5. Add A Record:
   - Type: A Record
   - Host: @
   - Value: 76.76.21.21
   - TTL: Automatic
6. Add CNAME Record:
   - Type: CNAME Record
   - Host: www
   - Value: cname.vercel-dns.com
   - TTL: Automatic
7. Click "Save All Changes"

### If using **Cloudflare**:

1. Go to: https://dash.cloudflare.com
2. Select bagflip.xyz
3. Go to "DNS" → "Records"
4. Click "Add record"
5. Add A Record:
   - Type: A
   - Name: @
   - IPv4 address: 76.76.21.21
   - Proxy status: DNS only (gray cloud) ⚠️ IMPORTANT
   - TTL: Auto
6. Add CNAME Record:
   - Type: CNAME
   - Name: www
   - Target: cname.vercel-dns.com
   - Proxy status: DNS only (gray cloud) ⚠️ IMPORTANT
   - TTL: Auto
7. Click "Save"

**Note for Cloudflare:** Make sure proxy is OFF (gray cloud icon) for both records!

### If using **Other Registrar**:

1. Log into your domain registrar
2. Find DNS settings or DNS management
3. Add the A record and CNAME record as shown above
4. Save changes

---

## 4️⃣ Wait for DNS Propagation (15-30 minutes)

After adding DNS records:

1. **Wait 15-30 minutes** for DNS to propagate worldwide
2. **Check propagation status:** https://dnschecker.org/#A/bagflip.xyz
3. You should see `76.76.21.21` appearing in different locations

---

## 5️⃣ Verify in Vercel

1. Go back to Vercel domains page
2. Click **"Refresh"** or **"Verify"** next to bagflip.xyz
3. Once DNS propagates, Vercel will show ✅ Verified
4. SSL certificate will be automatically issued (1-5 minutes)

---

## 6️⃣ Test Your Domain

Once verified and SSL is issued:

1. Visit: **https://bagflip.xyz**
2. Visit: **https://www.bagflip.xyz**
3. Both should load your casino! 🎰

---

## ✅ Final Checklist

- [ ] Added bagflip.xyz in Vercel
- [ ] Added www.bagflip.xyz in Vercel (optional)
- [ ] Added A record (@ → 76.76.21.21) in DNS
- [ ] Added CNAME record (www → cname.vercel-dns.com) in DNS
- [ ] Waited 15-30 minutes for DNS propagation
- [ ] Verified domain in Vercel (shows ✅)
- [ ] SSL certificate issued (shows 🔒)
- [ ] Tested https://bagflip.xyz - works!
- [ ] Tested https://www.bagflip.xyz - works!

---

## 🎯 Expected Timeline

| Step | Time |
|------|------|
| Add domain in Vercel | 1 minute |
| Add DNS records | 2 minutes |
| DNS propagation | 15-30 minutes |
| SSL certificate | 1-5 minutes |
| **Total** | **20-40 minutes** |

---

## 🐛 Troubleshooting

### "Invalid Configuration" in Vercel
- Double-check DNS records are exactly as shown
- Make sure no typos in IP address or CNAME
- Wait a bit longer for DNS propagation

### Domain Not Verifying
- Check DNS with: https://dnschecker.org/#A/bagflip.xyz
- Should show 76.76.21.21 in multiple locations
- If not showing, check DNS records in registrar
- Wait up to 48 hours (usually 15-30 minutes)

### SSL Certificate Not Issuing
- Make sure domain is verified first (✅ in Vercel)
- Wait 5 minutes after verification
- Try clicking "Refresh" in Vercel

### Cloudflare Users
- **CRITICAL:** Turn OFF proxy (gray cloud icon)
- Orange cloud = Cloudflare proxy (won't work with Vercel)
- Gray cloud = DNS only (correct for Vercel)

---

## 🔄 Update Backend CORS

Once domain is working, update Railway environment variables:

```
ALLOWED_ORIGINS=https://bagflip.xyz,https://www.bagflip.xyz
```

This allows your backend to accept requests from your custom domain.

---

## 🎉 Success!

Once complete, your casino will be live at:
- ✅ https://bagflip.xyz
- ✅ https://www.bagflip.xyz
- 🔒 SSL/HTTPS automatic
- 🚀 Fast global CDN
- 📱 Mobile-friendly

**Your BagFlip Casino will be live on your custom domain!** 🎰💰

---

## 📞 Need Help?

If you get stuck:
1. Check DNS propagation: https://dnschecker.org/#A/bagflip.xyz
2. Verify DNS records match exactly
3. Wait full 30 minutes before troubleshooting
4. Check Vercel deployment logs

---

**Ready? Start with Step 1 above!** 🚀
