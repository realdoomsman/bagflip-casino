#!/bin/bash
# BagFlip Casino - Nginx + SSL Setup
# Usage: sudo bash gcp-nginx.sh api.bagflip.xyz

set -e

DOMAIN=$1

if [ -z "$DOMAIN" ]; then
    echo "Usage: sudo bash gcp-nginx.sh YOUR_DOMAIN"
    echo "Example: sudo bash gcp-nginx.sh api.bagflip.xyz"
    exit 1
fi

echo "=========================================="
echo "Setting up Nginx for: $DOMAIN"
echo "=========================================="

# Create Nginx config
echo "[1/4] Creating Nginx config..."
cat > /etc/nginx/sites-available/bagflip << EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # WebSocket support
        proxy_read_timeout 86400;
    }
}
EOF

# Enable site
echo "[2/4] Enabling site..."
ln -sf /etc/nginx/sites-available/bagflip /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
echo "[3/4] Restarting Nginx..."
nginx -t
systemctl restart nginx

# Setup SSL
echo "[4/4] Setting up SSL with Certbot..."
echo ""
echo "⚠️  Make sure DNS is pointing to this server before continuing!"
echo "   $DOMAIN -> $(curl -s ifconfig.me)"
echo ""
read -p "Press Enter when DNS is ready, or Ctrl+C to skip SSL..."

certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect || {
    echo ""
    echo "SSL setup failed. You can retry later with:"
    echo "  sudo certbot --nginx -d $DOMAIN"
}

echo ""
echo "=========================================="
echo "✅ Nginx configured for $DOMAIN"
echo "=========================================="
echo ""
echo "Test: curl https://$DOMAIN/api/stats"
echo ""
