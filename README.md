# Firebase Notification Backend Service
# Firebase Bildirim Backend Servisi

Production-ready backend service for sending Firebase Cloud Messaging notifications.
Firebase Cloud Messaging bildirimleri göndermek için production-ready backend servisi.

## ✨ Özellikler / Features

- ✅ Firebase Admin SDK ile HTTP v1 API kullanımı
- ✅ RESTful API endpoint'leri
- ✅ CORS desteği
- ✅ Hata yönetimi ve validasyon
- ✅ Request logging
- ✅ Health check endpoint
- ✅ Production deployment hazır

## 📦 Kurulum / Installation

```bash
cd backend
npm install
```

## ⚙️ Yapılandırma / Configuration

### Environment Variables (Opsiyonel)
### Ortam Değişkenleri (Optional)

`.env` dosyası oluşturun (`.env.example` dosyasını kopyalayın):
Create `.env` file (copy from `.env.example`):

```bash
cp ..env.example .env
```

Varsayılan değerler:
Default values:
- `PORT=3000`
- `SERVICE_ACCOUNT_PATH=../config/secrets/veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json`
- `CORS_ORIGINS=*` (tüm origin'lere izin verir)
- `LOG_REQUESTS=true`

### Servis Hesabı Dosyası
### Service Account File

Backend servisi, Firebase Admin SDK için servis hesabı JSON dosyasını kullanır.
The backend service uses the service account JSON file for Firebase Admin SDK.

Varsayılan yol: `../config/secrets/veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json`
Default path: `../config/secrets/veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json`

## 🚀 Çalıştırma / Running

### Development (Geliştirme)
```bash
npm run dev
```

### Production (Üretim)
```bash
npm start
```

Backend servisi `http://localhost:3000` adresinde çalışacaktır.
Backend service will run at `http://localhost:3000`.

## 📡 API Endpoints

### Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Backend servisi çalışıyor",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### Root
```
GET /
```

**Response:**
```json
{
  "service": "Firebase Notification Backend Service",
  "version": "1.0.0",
  "endpoints": {
    "health": "GET /health",
    "sendNotification": "POST /send-notification"
  }
}
```

### Send Notification
```
POST /send-notification
Content-Type: application/json
```

**Request Body:**
```json
{
  "token": "FCM_TOKEN_HERE",  // veya "topic": "topic-name"
  "title": "Bildirim Başlığı",
  "body": "Bildirim İçeriği",
  "data": {
    "key1": "value1",
    "key2": "value2"
  },
  "android": {  // Opsiyonel / Optional
    "notification": {
      "sound": "notification.mp3",
      "channelId": "new-products"
    }
  },
  "apns": {  // Opsiyonel / Optional
    "payload": {
      "aps": {
        "sound": "notification.mp3",
        "badge": 1
      }
    }
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "messageId": "projects/veratoptan-c4d30/messages/0:1234567890"
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": "Hata mesajı",
  "errorCode": "ERROR_CODE"
}
```

## Expo Uygulaması Yapılandırması
## Expo App Configuration

Expo uygulamanızda backend URL'ini ayarlayın:
Set the backend URL in your Expo app:

1. **Ayarlar ekranından** (Settings screen):
   - Backend URL alanına `http://localhost:3000` girin (geliştirme için)
   - Production için: `https://your-backend-url.com`

2. **app.json'dan**:
```json
{
  "expo": {
    "extra": {
      "backendUrl": "http://localhost:3000"
    }
  }
}
```

## 🧪 Test Etme / Testing

```bash
# Test script'i çalıştırın
# Run test script
npm test

# veya manuel test
# or manual test
curl http://localhost:3000/health
```

## 🌐 Production Deployment
## 🌐 Production Dağıtımı

Detaylı deployment rehberi için: [DEPLOYMENT.md](./DEPLOYMENT.md)
For detailed deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)

**Hızlı Seçenekler / Quick Options:**
- **Heroku**: `heroku create && git push heroku main`
- **Railway**: GitHub repo'yu bağlayın, otomatik deploy
- **Google Cloud Run**: `gcloud run deploy`
- **DigitalOcean**: App Platform kullanın

Production URL'ini Expo uygulamanıza ekleyin.
Add production URL to your Expo app.

## 📋 Özellikler / Features

- ✅ **Firebase HTTP v1 API** - En güncel API
- ✅ **Error Handling** - Kapsamlı hata yönetimi
- ✅ **Request Validation** - İstek doğrulama
- ✅ **CORS Support** - Cross-origin desteği
- ✅ **Logging** - İstek loglama
- ✅ **Health Check** - Sağlık kontrolü
- ✅ **Production Ready** - Production için hazır

## 🔍 Sorun Giderme / Troubleshooting

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

