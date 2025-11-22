# Hızlı Başlangıç: Hardcode Token'lar
# Quick Start: Hardcode Tokens

Backend'de token'ları hardcode etmek için hızlı kılavuz.
Quick guide for hardcoding tokens in the backend.

## 🚀 Hızlı Kurulum / Quick Setup

### Adım 1: Token'ları Ekle / Step 1: Add Tokens

`backend/config.js` dosyasını açın ve `tokens.defaultTokens` array'ine token'larınızı ekleyin:
Open `backend/config.js` file and add your tokens to the `tokens.defaultTokens` array:

```javascript
tokens: {
  defaultTokens: [
    'YOUR_FCM_TOKEN_1',
    'YOUR_FCM_TOKEN_2',
    'YOUR_FCM_TOKEN_3',
  ],
  autoLoad: true, // Otomatik yükle / Auto-load
}
```

### Adım 2: Backend'i Başlat / Step 2: Start Backend

```bash
cd backend
npm start
```

Token'lar otomatik olarak yüklenecek:
Tokens will be automatically loaded:

```
📱 Varsayılan token'lar yükleniyor...
   ✅ Token 1 yüklendi
   ✅ Token 2 yüklendi
   ✅ Token 3 yüklendi
📊 Token yükleme özeti: 3 yüklendi, 0 atlandı
   Toplam token sayısı: 3
```

### Adım 3: Token'ları Kontrol Et / Step 3: Check Tokens

```bash
curl http://localhost:3000/tokens
```

## 📝 Örnek Yapılandırma / Example Configuration

### config.js Örneği / config.js Example

```javascript
// backend/config.js
tokens: {
  defaultTokens: [
    'cXyZ123abcDEF456ghiJKL789mnoPQR012stuVWX345yzaBcD678efG',
    'aBc456defGHI789jklMNO012pqrSTU345vwxYZ678abcDEF012ghiJ',
  ],
  autoLoad: true,
  defaultDeviceInfo: {
    platform: 'ios',
    appVersion: '1.0.0',
    source: 'hardcoded',
  },
}
```

### .env Örneği / .env Example

```bash
# .env
DEFAULT_FCM_TOKENS=token1,token2,token3
AUTO_LOAD_TOKENS=true
DEFAULT_DEVICE_PLATFORM=ios
DEFAULT_APP_VERSION=1.0.0
```

## 🧪 Test / Test

### Token'a Bildirim Gönder / Send Notification to Token

```bash
# Önce token ID'yi alın / First get token ID
curl http://localhost:3000/tokens

# Token ID ile bildirim gönderin / Send notification with token ID
curl -X POST http://localhost:3000/tokens/TOKEN_ID/send \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Bildirimi",
    "body": "Bu bir test bildirimidir"
  }'
```

## 📚 Daha Fazla Bilgi / More Information

- [HARDCODED_TOKENS.md](./HARDCODED_TOKENS.md) - Detaylı dokümantasyon
- [TOKEN_MANAGEMENT.md](./TOKEN_MANAGEMENT.md) - Token yönetimi API'si

