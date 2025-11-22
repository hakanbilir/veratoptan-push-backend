# Backend Yapılandırma Rehberi
# Backend Configuration Guide

## 📋 Yapılandırma Yöntemleri
## 📋 Configuration Methods

Backend servisini 3 farklı yöntemle yapılandırabilirsiniz:
You can configure the backend service in 3 different ways:

### 1. Environment Variables (Önerilen)
### 1. Environment Variables (Recommended)

`.env` dosyası oluşturun:
Create `.env` file:

```bash
cd backend
cp .env.example .env
```

`.env` dosyasını düzenleyin:
Edit `.env` file:

```env
# Server
PORT=3000
HOST=0.0.0.0
NODE_ENV=development

# Firebase
SERVICE_ACCOUNT_PATH=../config/secrets/veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json
FIREBASE_PROJECT_ID=veratoptan-c4d30
FIREBASE_PROJECT_NUMBER=989392397922

# CORS
CORS_ORIGINS=*
CORS_CREDENTIALS=true

# Logging
LOG_REQUESTS=true
LOG_LEVEL=info

# Notifications
ANDROID_CHANNEL_ID=new-products
NOTIFICATION_SOUND=notification.mp3
NOTIFICATION_PRIORITY=high

# Security
MAX_REQUEST_SIZE=10
RATE_LIMIT=60
```

### 2. Command Line Arguments
### 2. Komut Satırı Argümanları

```bash
PORT=4000 npm start
CORS_ORIGINS=http://localhost:8081 npm start
```

### 3. Varsayılan Değerler
### 3. Default Values

Eğer environment variable ayarlanmazsa, varsayılan değerler kullanılır:
If environment variables are not set, default values are used:

- `PORT=3000`
- `HOST=0.0.0.0`
- `SERVICE_ACCOUNT_PATH=../config/secrets/veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json`
- `CORS_ORIGINS=*` (tüm origin'lere izin verir)
- `LOG_REQUESTS=true`
- `LOG_LEVEL=info`

## ⚙️ Yapılandırma Seçenekleri
## ⚙️ Configuration Options

### Server Configuration
### Sunucu Yapılandırması

| Variable | Açıklama | Varsayılan |
|----------|----------|------------|
| `PORT` | Sunucu portu | `3000` |
| `HOST` | Sunucu host adresi | `0.0.0.0` |
| `NODE_ENV` | Ortam (development/production) | `development` |

### Firebase Configuration
### Firebase Yapılandırması

| Variable | Açıklama | Varsayılan |
|----------|----------|------------|
| `SERVICE_ACCOUNT_PATH` | Servis hesabı JSON dosya yolu | `../config/secrets/...` |
| `FIREBASE_PROJECT_ID` | Firebase Proje ID | `veratoptan-c4d30` |
| `FIREBASE_PROJECT_NUMBER` | Firebase Proje Numarası / GCM Sender ID | `989392397922` |

### CORS Configuration
### CORS Yapılandırması

| Variable | Açıklama | Varsayılan |
|----------|----------|------------|
| `CORS_ORIGINS` | İzin verilen origin'ler (virgülle ayrılmış) | `*` |
| `CORS_CREDENTIALS` | Kimlik bilgilerini etkinleştir | `true` |

**Örnek:**
```env
# Tüm origin'lere izin ver
CORS_ORIGINS=*

# Belirli origin'lere izin ver
CORS_ORIGINS=http://localhost:8081,https://your-app.com
```

### Logging Configuration
### Loglama Yapılandırması

| Variable | Açıklama | Varsayılan |
|----------|----------|------------|
| `LOG_REQUESTS` | İstek loglamayı etkinleştir | `true` |
| `LOG_LEVEL` | Log seviyesi (debug/info/warn/error) | `info` |

### Notification Defaults
### Bildirim Varsayılanları

| Variable | Açıklama | Varsayılan |
|----------|----------|------------|
| `ANDROID_CHANNEL_ID` | Android bildirim kanalı ID | `new-products` |
| `NOTIFICATION_SOUND` | Bildirim ses dosyası | `notification.mp3` |
| `NOTIFICATION_PRIORITY` | Bildirim önceliği (high/normal) | `high` |

### Security Configuration
### Güvenlik Yapılandırması

| Variable | Açıklama | Varsayılan |
|----------|----------|------------|
| `MAX_REQUEST_SIZE` | Maksimum istek boyutu (MB) | `10` |
| `RATE_LIMIT` | IP başına dakikada istek sayısı | `60` |

## 🔍 Yapılandırmayı Kontrol Etme
## 🔍 Checking Configuration

### 1. Config Endpoint
### 1. Config Endpoint

```bash
curl http://localhost:3000/config
```

**Response:**
```json
{
  "success": true,
  "config": {
    "server": {
      "port": 3000,
      "host": "0.0.0.0",
      "environment": "development"
    },
    "firebase": {
      "projectId": "veratoptan-c4d30",
      "serviceAccountPath": "../config/secrets/...",
      "serviceAccountExists": true
    },
    "cors": {
      "origins": "*",
      "credentials": true
    },
    "logging": {
      "requests": true,
      "level": "info"
    },
    "notifications": {
      "androidChannelId": "new-products",
      "sound": "notification.mp3",
      "priority": "high"
    }
  }
}
```

### 2. Debug Mode
### 2. Debug Modu

```env
LOG_LEVEL=debug
```

Debug modunda başlatıldığında, yapılandırma özeti konsola yazdırılır.
When started in debug mode, configuration summary is printed to console.

## 🚀 Production Yapılandırması
## 🚀 Production Configuration

Production için önerilen ayarlar:
Recommended settings for production:

```env
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# CORS - Sadece güvenilir origin'ler
CORS_ORIGINS=https://your-app.com,https://your-other-app.com
CORS_CREDENTIALS=true

# Logging
LOG_REQUESTS=true
LOG_LEVEL=warn

# Security
MAX_REQUEST_SIZE=5
RATE_LIMIT=30
```

## 📝 Örnek Yapılandırmalar
## 📝 Example Configurations

### Development (Geliştirme)
```env
NODE_ENV=development
PORT=3000
CORS_ORIGINS=*
LOG_LEVEL=debug
LOG_REQUESTS=true
```

### Production (Üretim)
```env
NODE_ENV=production
PORT=3000
CORS_ORIGINS=https://your-app.com
LOG_LEVEL=warn
LOG_REQUESTS=true
RATE_LIMIT=30
```

### Testing (Test)
```env
NODE_ENV=test
PORT=3001
LOG_LEVEL=error
LOG_REQUESTS=false
```

## 🔧 Yapılandırma Dosyası
## 🔧 Configuration File

Tüm yapılandırma `backend/config.js` dosyasında merkezi olarak yönetilir.
All configuration is centrally managed in `backend/config.js` file.

Yapılandırmayı değiştirmek için:
To change configuration:

1. `.env` dosyasını düzenleyin
2. veya environment variables ayarlayın
3. veya `config.js` dosyasını düzenleyin (gelişmiş kullanıcılar için)

## ✅ Yapılandırma Doğrulama
## ✅ Configuration Validation

Backend başlatıldığında yapılandırma otomatik olarak doğrulanır:
Configuration is automatically validated when backend starts:

- ✅ Port aralığı kontrolü (1-65535)
- ✅ Servis hesabı dosyası varlığı
- ✅ CORS origins formatı

Hata varsa, backend başlamaz ve hata mesajları gösterilir.
If there are errors, backend won't start and error messages are shown.

