#!/bin/bash

# Fly.io Secrets Setup Script
# Fly.io Secret'larını Ayarlama Script'i

echo "🚀 Fly.io Secrets Setup"
echo ""

# Base64 encode service account
BASE64_JSON=$(cat config/veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json | base64 | tr -d '\n')

echo "📦 Setting secrets..."
echo ""

# Set secrets
fly secrets set SERVICE_ACCOUNT_JSON="$BASE64_JSON"
fly secrets set FIREBASE_PROJECT_ID="veratoptan-c4d30"
fly secrets set FIREBASE_PROJECT_NUMBER="989392397922"
fly secrets set NODE_ENV="production"
fly secrets set PORT="3000"

echo ""
echo "✅ Secrets ayarlandı!"
echo ""
echo "🚀 Deploy ediliyor..."
fly deploy
