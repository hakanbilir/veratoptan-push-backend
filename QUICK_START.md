# Backend Servisi Hızlı Başlangıç
# Backend Service Quick Start

## 🚀 3 Adımda Başlatın
## 🚀 Start in 3 Steps

### 1. Bağımlılıkları Yükleyin
### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Servis Hesabı Dosyasını Kontrol Edin
### 2. Check Service Account File

Dosya yolu: `../config/secrets/veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json`
File path: `../config/secrets/veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json`

Dosyanın var olduğundan emin olun.
Make sure the file exists.

### 3. Backend Servisini Başlatın
### 3. Start Backend Service

```bash
npm start
```

Backend servisi `http://localhost:3000` adresinde çalışacaktır!
Backend service will run at `http://localhost:3000`!

## ✅ Test Edin
## ✅ Test

### Health Check
```bash
curl http://localhost:3000/health
```

### Browser'da Açın
```
http://localhost:3000/health
```

## 📱 Mobil Uygulamayı Bağlayın
## 📱 Connect Mobile App

1. **Expo Go'da:**
   - Ayarlar > Backend URL
   - `http://localhost:3000` girin (aynı bilgisayarda)
   - veya `http://YOUR_LOCAL_IP:3000` (farklı cihazda)

2. **app.json'da:**
```json
{
  "expo": {
    "extra": {
      "backendUrl": "http://localhost:3000"
    }
  }
}
```

## 🎉 Hazır!
## 🎉 Ready!

Backend servisi çalışıyor ve mobil uygulamanız bağlanabilir!
Backend service is running and your mobile app can connect!

## 📚 Daha Fazla Bilgi
## 📚 More Information

- [README.md](./README.md) - Detaylı dokümantasyon
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment
- [test.js](./test.js) - Test script

