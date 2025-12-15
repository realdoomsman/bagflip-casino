#!/bin/bash
# BagFlip Casino - Deploy Backend on GCP
# Run this from /var/www/bagflip after cloning

set -e

echo "=========================================="
echo "BagFlip Casino - Backend Deployment"
echo "=========================================="

cd /var/www/bagflip/backend

# Install dependencies
echo "[1/5] Installing dependencies..."
npm install

# Build TypeScript
echo "[2/5] Building TypeScript..."
npm run build

# Create data directory
echo "[3/5] Creating data directory..."
mkdir -p /var/www/bagflip/backend/data

# Check if .env exists
if [ ! -f /var/www/bagflip/backend/.env ]; then
    echo ""
    echo "⚠️  WARNING: .env file not found!"
    echo "Create it with: nano /var/www/bagflip/backend/.env"
    echo ""
    echo "Required contents:"
    echo "----------------------------------------"
    cat << 'EOF'
PORT=3001
NODE_ENV=production
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
PROGRAM_ID=YOUR_MAINNET_PROGRAM_ID
TREASURY_AUTHORITY_KEYPAIR=/var/www/bagflip/backend/treasury-keypair.json
VRF_MODE=simulated
DB_TYPE=sqlite
DB_PATH=/var/www/bagflip/backend/data/casino-prod.db
ALLOWED_ORIGINS=https://app.bagflip.xyz,https://bagflip.xyz,https://www.bagflip.xyz
PASSWORD_SALT=CHANGE_THIS_TO_RANDOM_STRING
EOF
    echo "----------------------------------------"
    exit 1
fi

# Start with PM2
echo "[4/5] Starting with PM2..."
cd /var/www/bagflip/backend
pm2 delete bagflip-backend 2>/dev/null || true
pm2 start dist/index.js --name bagflip-backend
pm2 save

# Setup PM2 startup
echo "[5/5] Setting up PM2 startup..."
pm2 startup | tail -1 | bash || true

echo ""
echo "=========================================="
echo "✅ Backend deployed successfully!"
echo "=========================================="
echo ""
echo "Check status: pm2 status"
echo "View logs:    pm2 logs bagflip-backend"
echo "Test API:     curl http://localhost:3001/api/stats"
echo ""
echo "NEXT: Configure Nginx with:"
echo "  sudo bash /var/www/bagflip/scripts/gcp-nginx.sh YOUR_DOMAIN"
echo ""
