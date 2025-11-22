#!/bin/bash
# Fly.io Secret Setup Script
# Fly.io Secret Kurulum Script'i

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 FLY.IO SECRET AYARLAMA"
echo "FLY.IO SECRET SETUP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if fly CLI is installed
# Fly CLI'nin yüklü olup olmadığını kontrol et
if ! command -v fly &> /dev/null; then
    echo "❌ Fly CLI bulunamadı!"
    echo "❌ Fly CLI not found!"
    echo ""
    echo "📥 Fly CLI'yi yüklemek için:"
    echo "📥 To install Fly CLI:"
    echo "   curl -L https://fly.io/install.sh | sh"
    echo ""
    echo "🔗 Veya manuel olarak: https://fly.io/docs/getting-started/installing-flyctl/"
    echo "🔗 Or manually: https://fly.io/docs/getting-started/installing-flyctl/"
    echo ""
    exit 1
fi

# Check if service account file exists
# Servis hesabı dosyasının var olup olmadığını kontrol et
SERVICE_ACCOUNT_FILE="config/veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json"

if [ ! -f "$SERVICE_ACCOUNT_FILE" ]; then
    echo "❌ Servis hesabı dosyası bulunamadı: $SERVICE_ACCOUNT_FILE"
    echo "❌ Service account file not found: $SERVICE_ACCOUNT_FILE"
    exit 1
fi

# Base64 encode service account JSON
# Servis hesabı JSON'unu base64 encode et
echo "📋 Service Account JSON'u Base64 encode ediyorum..."
echo "📋 Encoding Service Account JSON to Base64..."
BASE64_JSON=$(cat "$SERVICE_ACCOUNT_FILE" | base64 | tr -d '\n')

if [ -z "$BASE64_JSON" ]; then
    echo "❌ Base64 encoding başarısız!"
    echo "❌ Base64 encoding failed!"
    exit 1
fi

echo "✅ Base64 JSON hazırlandı (${#BASE64_JSON} karakter)"
echo "✅ Base64 JSON prepared (${#BASE64_JSON} characters)"
echo ""

# Set Fly.io secrets
# Fly.io secret'larını ayarla
echo "🚀 Fly.io secret'larını ayarlıyorum..."
echo "🚀 Setting Fly.io secrets..."
echo ""

fly secrets set \
    SERVICE_ACCOUNT_JSON="$BASE64_JSON" \
    FIREBASE_PROJECT_ID="veratoptan-c4d30" \
    FIREBASE_PROJECT_NUMBER="989392397922" \
    NODE_ENV="production" \
    PORT="3000"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ SECRET'LAR AYARLANDI"
echo "SECRETS SET"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# List secrets
# Secret'ları listele
echo "📋 Mevcut secret'lar:"
echo "📋 Current secrets:"
fly secrets list

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Backend'i deploy etmek için:"
echo "🚀 To deploy backend:"
echo "   fly deploy"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
