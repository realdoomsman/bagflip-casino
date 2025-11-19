# 🌐 Connect Custom Domain to Vercel

## Step-by-Step Guide

### 1️⃣ Add Domain in Vercel

1. Go to your Vercel project:
   https://vercel.com/realdoomsmans-projects/app/settings/domains

2. Click **"Add"** button

3. Enter your domain (e.g., `yourdomain.com`)

4. Click **"Add"**

---

### 2️⃣ Configure DNS Records

Vercel will show you DNS records to add. You'll need to add these in your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)

#### Option A: Using A Record (Recommended)
```
Type: A
Name: @ (or leave blank for root domain)
Value: 76.76.21.21
TTL: Auto or 3600
```

#### Option B: Using CNAME (for subdomain)
```
Type: CNAME
Name: www (or your subdomain)
Value: cname.vercel-dns.com
TTL: Auto or 3600
```

---

### 3️⃣ Add DNS Records in Your Registrar

#### If using **GoDaddy**:
1. Go to: https://dcc.godaddy.com/manage/YOURDOMAIN.com/dns
2. Click "Add" under DNS Records
3. Add the A record or CNAME as shown above
4. Save

#### If using **Namecheap**:
1. Go to: https://ap.www.namecheap.com/domains/list/
2. Click "Manage" next to your domain
3. Go to "Advanced DNS" tab
4. Add the A record or CNAME
5. Save

#### If using **Cloudflare**:
1. Go to: https://dash.cloudflare.com
2. Select your domain
3. Go to "DNS" tab
4. Add the A record or CNAME
5. Make sure proxy is OFF (gray cloud) for Vercel
6. Save

---

### 4️⃣ Verify Domain in Vercel

1. After adding DNS records, go back to Vercel
2. Click **"Verify"** or **"Refresh"**
3. Vercel will check if DNS is configured correctly
4. This can take 5 minutes to 48 hours (usually 5-30 minutes)

---

### 5️⃣ SSL Certificate (Automatic)

Once domain is verified:
- Vercel automatically provisions SSL certificate
- Your site will be accessible via HTTPS
- Usually takes 1-5 minutes

---

## 🎯 Quick Setup Examples

### Example 1: Root Domain (yourdomain.com)
```
Add in Vercel: yourdomain.com
Add in DNS:
  Type: A
  Name: @
  Value: 76.76.21.21
```

### Example 2: WWW Subdomain (www.yourdomain.com)
```
Add in Vercel: www.yourdomain.com
Add in DNS:
  Type: CNAME
  Name: www
  Value: cname.vercel-dns.com
```

### Example 3: Both Root and WWW
```
Add in Vercel: yourdomain.com (set as primary)
Add in Vercel: www.yourdomain.com (redirects to root)

Add in DNS:
  Type: A
  Name: @
  Value: 76.76.21.21
  
  Type: CNAME
  Name: www
  Value: cname.vercel-dns.com
```

---

## ⏱️ Timeline

- **DNS Propagation**: 5 minutes to 48 hours (usually 15-30 minutes)
- **SSL Certificate**: 1-5 minutes after verification
- **Total Time**: Usually 20-35 minutes

---

## ✅ Verification Checklist

- [ ] Domain added in Vercel
- [ ] DNS records added in registrar
- [ ] DNS propagation complete (check with: https://dnschecker.org)
- [ ] Domain verified in Vercel
- [ ] SSL certificate issued
- [ ] Site accessible via custom domain
- [ ] HTTPS working

---

## 🔍 Troubleshooting

### Domain Not Verifying
- Wait 15-30 minutes for DNS propagation
- Check DNS records are correct
- Use https://dnschecker.org to verify DNS
- Make sure no conflicting records exist

### SSL Certificate Not Issuing
- Make sure domain is verified first
- Wait 5 minutes after verification
- Check no CAA records blocking Let's Encrypt

### Site Not Loading
- Clear browser cache
- Try incognito/private mode
- Check DNS with: `nslookup yourdomain.com`
- Verify A record points to 76.76.21.21

---

## 📱 After Domain is Connected

Update your environment variables if needed:
```
ALLOWED_ORIGINS=https://yourdomain.com
```

Update Railway CORS settings to allow your domain.

---

## 💡 Pro Tips

1. **Use both root and www**: Add both and set one as primary
2. **Enable HTTPS redirect**: Vercel does this automatically
3. **Check DNS propagation**: Use https://dnschecker.org
4. **Cloudflare users**: Turn OFF proxy (gray cloud) initially
5. **Keep Vercel URL**: It still works as a backup

---

## 🆘 Need Help?

Common issues:
- **"Invalid Configuration"**: Check DNS records match exactly
- **"Pending Verification"**: Wait 15-30 minutes
- **"Certificate Error"**: Wait 5 minutes after verification

---

**What's your domain? I'll give you specific instructions!** 🌐
