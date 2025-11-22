# Backend Servisi Deployment Rehberi
# Backend Service Deployment Guide

## 🚀 Hızlı Deployment Seçenekleri
## 🚀 Quick Deployment Options

### 1. Heroku (Önerilen - Kolay)
### 1. Heroku (Recommended - Easy)

```bash
# Heroku CLI'yi yükleyin (https://devcenter.heroku.com/articles/heroku-cli)
# Install Heroku CLI (https://devcenter.heroku.com/articles/heroku-cli)

cd backend

# Heroku'ya giriş yapın
# Login to Heroku
heroku login

# Yeni bir Heroku app oluşturun
# Create a new Heroku app
heroku create notification-backend

# Git repository başlatın (eğer yoksa)
# Initialize git repository (if not exists)
git init
git add .
git commit -m "Initial commit"

# Heroku'ya deploy edin
# Deploy to Heroku
git push heroku main

# Servis hesabı dosyasını Heroku'ya ekleyin
# Add service account file to Heroku
# Not: Heroku'da dosya sistemi geçici olduğu için environment variable kullanın
# Note: Since Heroku's file system is temporary, use environment variable
```

**Heroku Config Vars:**
```bash
# Servis hesabı JSON'unu base64 encode edin
# Encode service account JSON to base64
cat ../config/secrets/veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json | base64

# Heroku'ya ekleyin
# Add to Heroku
heroku config:set SERVICE_ACCOUNT_JSON="<base64_encoded_json>"
```

**Not:** Heroku'da dosya sistemi geçici olduğu için servis hesabı JSON'unu environment variable olarak saklamanız gerekir.

### 2. Railway (Otomatik Deploy)
### 2. Railway (Auto Deploy)

1. [Railway.app](https://railway.app) hesabı oluşturun
2. "New Project" > "Deploy from GitHub repo"
3. GitHub repo'nuzu seçin
4. `backend` klasörünü root olarak ayarlayın
5. Environment variables ekleyin:
   - `SERVICE_ACCOUNT_PATH`: Servis hesabı dosyasının yolu
6. Otomatik deploy olacaktır!

### 3. Google Cloud Run
### 3. Google Cloud Run

```bash
# Google Cloud CLI'yi yükleyin
# Install Google Cloud CLI
# https://cloud.google.com/sdk/docs/install

# Giriş yapın
# Login
gcloud auth login

# Proje oluşturun
# Create project
gcloud projects create notification-backend

# Cloud Run'ı etkinleştirin
# Enable Cloud Run
gcloud services enable run.googleapis.com

# Deploy edin
# Deploy
gcloud run deploy notification-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### 4. DigitalOcean App Platform
### 4. DigitalOcean App Platform

1. [DigitalOcean](https://www.digitalocean.com) hesabı oluşturun
2. "Apps" > "Create App"
3. GitHub repo'nuzu bağlayın
4. Root directory: `backend`
5. Build command: `npm install`
6. Run command: `npm start`
7. Environment variables ekleyin
8. Deploy!

### 5. Vercel (Serverless Functions)
### 5. Vercel (Serverless Functions)

```bash
# Vercel CLI'yi yükleyin
# Install Vercel CLI
npm install -g vercel

cd backend

# Deploy edin
# Deploy
vercel
```

**Not:** Vercel serverless functions kullanır, bazı değişiklikler gerekebilir.

## 📋 Deployment Checklist
## 📋 Deployment Checklist

### Öncesi / Before
- [ ] `package.json` güncel
- [ ] `.env.example` oluşturuldu
- [ ] Servis hesabı JSON dosyası hazır
- [ ] Git repository hazır
- [ ] Test edildi (local)

### Deployment Sırasında / During
- [ ] Environment variables ayarlandı
- [ ] Servis hesabı dosyası yapılandırıldı
- [ ] Port yapılandırması doğru
- [ ] CORS ayarları yapıldı

### Sonrası / After
- [ ] Health check endpoint test edildi
- [ ] Send notification endpoint test edildi
- [ ] Production URL mobil uygulamaya eklendi
- [ ] Loglar kontrol edildi

## 🔧 Environment Variables
## 🔧 Environment Variables

Production'da şu environment variables'ları ayarlayın:
Set these environment variables in production:

```bash
PORT=3000
SERVICE_ACCOUNT_PATH=/path/to/service-account.json
CORS_ORIGINS=https://your-app.com,https://your-other-app.com
LOG_REQUESTS=true
NODE_ENV=production
```

## 📱 Mobil Uygulamayı Güncelleme
## 📱 Update Mobile App

Production URL'ini mobil uygulamaya ekleyin:
Add production URL to mobile app:

**app.json:**
```json
{
  "expo": {
    "extra": {
      "backendUrl": "https://your-backend.herokuapp.com"
    }
  }
}
```

**veya Ayarlar ekranından:**
- Backend URL: `https://your-backend.herokuapp.com`

## 🧪 Test Etme
## 🧪 Testing

```bash
# Health check
curl https://your-backend.herokuapp.com/health

# Send notification
curl -X POST https://your-backend.herokuapp.com/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "token": "FCM_TOKEN",
    "title": "Test",
    "body": "Test notification"
  }'
```

## 🔍 Sorun Giderme
## 🔍 Troubleshooting

### Backend başlamıyor
- Servis hesabı dosyası yolunu kontrol edin
- Environment variables'ları kontrol edin
- Port'un kullanılabilir olduğundan emin olun

### CORS hatası
- `CORS_ORIGINS` environment variable'ını kontrol edin
- Mobil uygulama URL'ini ekleyin

### Firebase hatası
- Servis hesabı JSON'unun geçerli olduğundan emin olun
- Firebase proje ID'sini kontrol edin

