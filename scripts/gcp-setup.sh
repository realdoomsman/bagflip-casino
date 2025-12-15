#!/bin/bash
# BagFlip Casino - GCP VM Setup Script
# Run this AFTER SSH'ing into your new GCP VM

set -e  # Exit on error

echo "=========================================="
echo "BagFlip Casino - GCP Production Setup"
echo "=========================================="

# Update system
echo "[1/8] Updating system..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
echo "[2/8] Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install build tools
echo "[3/8] Installing build tools..."
sudo apt install -y build-essential python3 git

# Install PM2
echo "[4/8] Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "[5/8] Installing Nginx..."
sudo apt install -y nginx

# Install Certbot
echo "[6/8] Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx

# Create app directory
echo "[7/8] Creating app directory..."
sudo mkdir -p /var/www/bagflip
sudo chown $USER:$USER /var/www/bagflip

echo "[8/8] Setup complete!"
echo ""
echo "=========================================="
echo "NEXT STEPS:"
echo "=========================================="
echo "1. Clone your repo:"
echo "   cd /var/www/bagflip"
echo "   git clone https://github.com/realdoomsman/bagflip-casino.git ."
echo ""
echo "2. Run the deploy script:"
echo "   bash scripts/gcp-deploy.sh"
echo "=========================================="
