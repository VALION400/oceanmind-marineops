#!/bin/bash

# OceanMind GitHub Setup Script
# This script will help you add your SSH key to GitHub and push the code

echo "=========================================="
echo "  OceanMind GitHub Setup"
echo "=========================================="
echo ""

# Display SSH public key
echo "📋 Your SSH Public Key:"
echo "----------------------------------------"
cat ~/.ssh/id_ed25519.pub
echo "----------------------------------------"
echo ""

echo "⚠️  IMPORTANT: You need to add this key to GitHub"
echo ""
echo "Follow these steps:"
echo ""
echo "1. Open this URL in your browser:"
echo "   https://github.com/settings/keys"
echo ""
echo "2. Click 'New SSH key' (green button)"
echo ""
echo "3. Fill in:"
echo "   - Title: OceanMind Development"
echo "   - Key: Copy the ENTIRE line shown above"
echo "     (from 'ssh-ed25519' to 'valentine@roar-arena.com')"
echo ""
echo "4. Click 'Add SSH key'"
echo ""
echo "5. If prompted, enter your GitHub password"
echo ""

read -p "✅ Press Enter AFTER you've added the key to GitHub..."

echo ""
echo "🔍 Testing SSH connection..."
ssh -T git@github.com 2>&1 | grep -q "successfully authenticated" && {
    echo "✅ SSH connection successful!"
    echo ""
    echo "🚀 Pushing code to GitHub..."
    cd /home/roararena/Desktop/OceanMind
    git push -u origin main
    echo ""
    echo "✅ DONE! Your code is now on GitHub!"
    echo "   Visit: https://github.com/VALION400/oceanmind-marineops"
} || {
    echo "❌ SSH test failed. The key might not be added correctly."
    echo ""
    echo "Alternative: Use HTTPS with Personal Access Token"
    echo ""
    echo "1. Go to: https://github.com/settings/tokens"
    echo "2. Generate new token (classic)"
    echo "3. Select scope: repo (full control)"
    echo "4. Copy the token"
    echo ""
    read -p "Enter your Personal Access Token: " TOKEN
    
    if [ -n "$TOKEN" ]; then
        echo ""
        echo "🚀 Configuring Git and pushing..."
        cd /home/roararena/Desktop/OceanMind
        git remote set-url origin https://VALION400:${TOKEN}@github.com/VALION400/oceanmind-marineops.git
        git push -u origin main
        echo ""
        echo "✅ DONE! Your code is now on GitHub!"
        echo "   Visit: https://github.com/VALION400/oceanmind-marineops"
    else
        echo "❌ No token provided. Setup aborted."
        exit 1
    fi
}
