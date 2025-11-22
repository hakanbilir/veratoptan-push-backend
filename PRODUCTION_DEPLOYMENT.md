# Production Deployment Guide
# Production Deployment Rehberi

## 🔑 Service Account Configuration
## 🔑 Servis Hesabı Yapılandırması

Production ortamlarında (Fly.io, Heroku, Railway, vb.) service account dosyasını environment variable olarak ayarlamanız gerekir.
In production environments (Fly.io, Heroku, Railway, etc.), you need to set the service account file as an environment variable.

### Yöntem 1: JSON String (Önerilen)
### Method 1: JSON String (Recommended)

```bash
# Service account JSON dosyasını okuyun
# Read the service account JSON file
cat config/secrets/veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json

# Environment variable olarak ayarlayın (tüm JSON'u tek satırda)
# Set as environment variable (entire JSON in one line)
export SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"veratoptan-c4d30",...}'
```

### Yöntem 2: Base64 Encoded (Güvenli)
### Method 2: Base64 Encoded (Secure)

```bash
# Service account JSON'u base64 encode edin
# Encode service account JSON to base64
cat config/secrets/veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json | base64

# Environment variable olarak ayarlayın
# Set as environment variable
export SERVICE_ACCOUNT_JSON="<base64_encoded_string>"
```

## 🚀 Fly.io Deployment

### 1. Service Account JSON'u Base64 Encode Edin
### 1. Encode Service Account JSON to Base64

```bash
cd backend
cat ../config/secrets/veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json | base64
```

### 2. Fly.io Secret Olarak Ayarlayın
### 2. Set as Fly.io Secret

```bash
# Fly.io CLI ile
# With Fly.io CLI
fly secrets set SERVICE_ACCOUNT_JSON="<base64_encoded_string>"

# Veya Fly.io Dashboard'dan
# Or from Fly.io Dashboard
# https://fly.io/apps/<your-app>/secrets
```

### 3. Diğer Environment Variables
### 3. Other Environment Variables

```bash
fly secrets set FIREBASE_PROJECT_ID="veratoptan-c4d30"
fly secrets set FIREBASE_PROJECT_NUMBER="989392397922"
fly secrets set PORT="3000"
```

### 4. Deploy
### 4. Deploy

```bash
fly deploy
```

## 🚀 Heroku Deployment

### 1. Service Account JSON'u Base64 Encode Edin
### 1. Encode Service Account JSON to Base64

```bash
cd backend
cat ../config/secrets/veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json | base64
```

### 2. Heroku Config Vars Olarak Ayarlayın
### 2. Set as Heroku Config Vars

```bash
heroku config:set SERVICE_ACCOUNT_JSON="<base64_encoded_string>" -a <your-app-name>
heroku config:set FIREBASE_PROJECT_ID="veratoptan-c4d30" -a <your-app-name>
heroku config:set FIREBASE_PROJECT_NUMBER="989392397922" -a <your-app-name>
```

## 🚀 Railway Deployment

1. Railway Dashboard'a gidin
2. Project > Variables sekmesine gidin
3. `SERVICE_ACCOUNT_JSON` ekleyin (base64 encoded veya direct JSON)
4. `FIREBASE_PROJECT_ID` ve `FIREBASE_PROJECT_NUMBER` ekleyin

## 🔍 Verification
## 🔍 Doğrulama

Deployment sonrası health check:

```bash
curl https://your-app-url.com/health
```

Config endpoint:

```bash
curl https://your-app-url.com/config
```

## ⚠️ Important Notes
## ⚠️ Önemli Notlar

1. **Never commit service account files to git**
   - Servis hesabı dosyalarını git'e commit etmeyin
2. **Use environment variables in production**
   - Production'da environment variable kullanın
3. **Base64 encoding is recommended for security**
   - Güvenlik için base64 encoding önerilir
4. **Service account JSON must be valid JSON**
   - Servis hesabı JSON'u geçerli JSON olmalıdır

## 📝 Example: Getting Base64 Encoded Service Account
## 📝 Örnek: Base64 Kodlanmış Servis Hesabı Alma

```bash
# Local development
cd /Users/hakanbilir/Documents/development/notificationapp

# Encode service account
cat config/secrets/veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json | base64

# Copy the output and use it as SERVICE_ACCOUNT_JSON
```

## 🔧 Troubleshooting
## 🔧 Sorun Giderme

### Error: Service account file not found
### Hata: Servis hesabı dosyası bulunamadı

**Çözüm / Solution:**
1. `SERVICE_ACCOUNT_JSON` environment variable'ını kontrol edin
2. Base64 encoded ise, decode edip JSON'un geçerli olduğunu kontrol edin
3. Direct JSON ise, JSON formatının doğru olduğunu kontrol edin

### Error: Invalid JSON
### Hata: Geçersiz JSON

**Çözüm / Solution:**
1. JSON string'in tırnak işaretlerinin doğru escape edildiğinden emin olun
2. Base64 encoded kullanıyorsanız, encoding'in doğru olduğundan emin olun

