# Fly.io Production Setup
# Fly.io Production Kurulumu

## 🔧 Sorun
## 🔧 Problem

Production'da backend başlatılamıyor çünkü `SERVICE_ACCOUNT_JSON` environment variable ayarlanmamış.
Backend cannot start in production because `SERVICE_ACCOUNT_JSON` environment variable is not set.

## ✅ Çözüm
## ✅ Solution

Fly.io'da `SERVICE_ACCOUNT_JSON` secret'ını ayarlayın.
Set `SERVICE_ACCOUNT_JSON` secret in Fly.io.

## 📋 Adımlar / Steps

### 1. Service Account JSON'u Base64 Encode Edin
### 1. Encode Service Account JSON to Base64

```bash
cd backend
cat config/veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json | base64
```

### 2. Fly.io Secret'larını Ayarlayın
### 2. Set Fly.io Secrets

**Yöntem 1: Fly.io CLI (Önerilen)**
**Method 1: Fly.io CLI (Recommended)**

```bash
# Service Account JSON (base64 encoded)
fly secrets set SERVICE_ACCOUNT_JSON="<base64_encoded_string>"

# Diğer environment variables
# Other environment variables
fly secrets set FIREBASE_PROJECT_ID="veratoptan-c4d30"
fly secrets set FIREBASE_PROJECT_NUMBER="989392397922"
fly secrets set NODE_ENV="production"
fly secrets set PORT="3000"
```

**Yöntem 2: Fly.io Dashboard**
**Method 2: Fly.io Dashboard**

1. https://fly.io/apps/veratoptan-push-backend/secrets adresine gidin
2. "New Secret" butonuna tıklayın
3. Aşağıdaki secret'ları ekleyin:

| Key | Value |
|-----|-------|
| `SERVICE_ACCOUNT_JSON` | `<base64_encoded_json_string>` |
| `FIREBASE_PROJECT_ID` | `veratoptan-c4d30` |
| `FIREBASE_PROJECT_NUMBER` | `989392397922` |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |

### 3. Deploy
### 3. Deploy

```bash
fly deploy
```

### 4. Test
### 4. Test

```bash
# Health check
curl https://veratoptan-push-backend.fly.dev/health

# Config
curl https://veratoptan-push-backend.fly.dev/config
```

## 🔍 Troubleshooting
## 🔍 Sorun Giderme

### Error: Service account file not found
### Hata: Servis hesabı dosyası bulunamadı

**Çözüm / Solution:**
- `SERVICE_ACCOUNT_JSON` secret'ının doğru ayarlandığından emin olun
- Base64 string'in tam olduğunu kontrol edin
- Secret'ları kontrol edin: `fly secrets list`

### Error: Invalid JSON
### Hata: Geçersiz JSON

**Çözüm / Solution:**
- Base64 string'i decode edip JSON'un geçerli olduğunu kontrol edin:
  ```bash
  echo "<base64_string>" | base64 -d | jq .
  ```

## 📝 Quick Setup Script
## 📝 Hızlı Kurulum Script'i

```bash
cd backend

# Base64 encode service account
BASE64_JSON=$(cat config/veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json | base64 | tr -d '\n')

# Set secrets
fly secrets set SERVICE_ACCOUNT_JSON="$BASE64_JSON"
fly secrets set FIREBASE_PROJECT_ID="veratoptan-c4d30"
fly secrets set FIREBASE_PROJECT_NUMBER="989392397922"
fly secrets set NODE_ENV="production"
fly secrets set PORT="3000"

# Deploy
fly deploy
```

