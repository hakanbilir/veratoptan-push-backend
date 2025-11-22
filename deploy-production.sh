#!/bin/bash

# Production Deployment Script
# Production Deployment Script'i
#
# This script helps deploy the backend to production
# Bu script backend'i production'a deploy etmeye yardımcı olur

set -e  # Exit on error / Hata durumunda çık

echo "🚀 Production Deployment Script"
echo "🚀 Production Deployment Script'i"
echo ""

# Colors / Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if service account file exists
# Servis hesabı dosyasının var olup olmadığını kontrol et
SERVICE_ACCOUNT_FILE="../config/secrets/veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json"

if [ ! -f "$SERVICE_ACCOUNT_FILE" ]; then
    echo -e "${RED}❌ Service account dosyası bulunamadı: $SERVICE_ACCOUNT_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Service account dosyası bulundu${NC}"
echo ""

# Encode service account to base64
# Servis hesabını base64'e kodla
echo "📦 Service account JSON'u base64'e kodlanıyor..."
BASE64_JSON=$(cat "$SERVICE_ACCOUNT_FILE" | base64 | tr -d '\n')

if [ -z "$BASE64_JSON" ]; then
    echo -e "${RED}❌ Base64 encoding başarısız${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Base64 encoding tamamlandı${NC}"
echo ""

# Platform selection
# Platform seçimi
echo "Platform seçin / Select platform:"
echo "1) Fly.io"
echo "2) Heroku"
echo "3) Railway"
echo "4) Show base64 JSON only (Sadece base64 JSON göster)"
read -p "Seçim / Choice [1-4]: " PLATFORM

case $PLATFORM in
    1)
        echo ""
        echo "🚀 Fly.io Deployment"
        echo ""
        
        # Check if fly CLI is installed
        # Fly CLI'nin yüklü olup olmadığını kontrol et
        if ! command -v fly &> /dev/null; then
            echo -e "${RED}❌ Fly CLI bulunamadı. Lütfen yükleyin: https://fly.io/docs/getting-started/installing-flyctl/${NC}"
            exit 1
        fi
        
        echo "📋 Fly.io secrets ayarlanıyor..."
        fly secrets set SERVICE_ACCOUNT_JSON="$BASE64_JSON"
        fly secrets set FIREBASE_PROJECT_ID="veratoptan-c4d30"
        fly secrets set FIREBASE_PROJECT_NUMBER="989392397922"
        fly secrets set NODE_ENV="production"
        fly secrets set PORT="3000"
        
        echo ""
        echo -e "${GREEN}✅ Secrets ayarlandı${NC}"
        echo ""
        echo "🚀 Deploy ediliyor..."
        fly deploy
        
        echo ""
        echo -e "${GREEN}✅ Deployment tamamlandı!${NC}"
        echo ""
        echo "🧪 Health check test ediliyor..."
        fly status
        ;;
        
    2)
        echo ""
        echo "🚀 Heroku Deployment"
        echo ""
        
        # Check if heroku CLI is installed
        # Heroku CLI'nin yüklü olup olmadığını kontrol et
        if ! command -v heroku &> /dev/null; then
            echo -e "${RED}❌ Heroku CLI bulunamadı. Lütfen yükleyin: https://devcenter.heroku.com/articles/heroku-cli${NC}"
            exit 1
        fi
        
        read -p "Heroku app name / Heroku app adı: " HEROKU_APP
        
        echo "📋 Heroku config vars ayarlanıyor..."
        heroku config:set SERVICE_ACCOUNT_JSON="$BASE64_JSON" -a "$HEROKU_APP"
        heroku config:set FIREBASE_PROJECT_ID="veratoptan-c4d30" -a "$HEROKU_APP"
        heroku config:set FIREBASE_PROJECT_NUMBER="989392397922" -a "$HEROKU_APP"
        heroku config:set NODE_ENV="production" -a "$HEROKU_APP"
        
        echo ""
        echo -e "${GREEN}✅ Config vars ayarlandı${NC}"
        echo ""
        echo "🚀 Deploy ediliyor..."
        git push heroku main
        
        echo ""
        echo -e "${GREEN}✅ Deployment tamamlandı!${NC}"
        ;;
        
    3)
        echo ""
        echo "🚀 Railway Deployment"
        echo ""
        echo "Railway'de environment variables'ı manuel olarak ayarlayın:"
        echo "Set environment variables manually in Railway:"
        echo ""
        echo "1. Railway Dashboard'a gidin"
        echo "2. Project > Variables sekmesine gidin"
        echo "3. Aşağıdaki değişkenleri ekleyin:"
        echo ""
        echo "   SERVICE_ACCOUNT_JSON=$BASE64_JSON"
        echo "   FIREBASE_PROJECT_ID=veratoptan-c4d30"
        echo "   FIREBASE_PROJECT_NUMBER=989392397922"
        echo "   NODE_ENV=production"
        echo "   PORT=3000"
        ;;
        
    4)
        echo ""
        echo "📋 Base64 Encoded JSON:"
        echo ""
        echo "$BASE64_JSON"
        echo ""
        echo "💡 Bu değeri production platform'unuzda SERVICE_ACCOUNT_JSON olarak ayarlayın"
        ;;
        
    *)
        echo -e "${RED}❌ Geçersiz seçim${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ İşlem tamamlandı!${NC}"
echo ""
echo "📝 Sonraki adımlar:"
echo "   1. Health check test edin: curl https://your-app-url/health"
echo "   2. Config endpoint test edin: curl https://your-app-url/config"
echo "   3. Mobile app'te backend URL'i güncelleyin"
echo "   4. Bildirim göndermeyi test edin"

