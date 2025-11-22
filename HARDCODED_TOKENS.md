# Hardcoded Tokens Yapılandırması
# Hardcoded Tokens Configuration

Backend'de varsayılan FCM token'larını hardcode ederek başlangıçta otomatik yükleyebilirsiniz.
You can hardcode default FCM tokens in the backend to automatically load them on startup.

## 🔧 Yapılandırma Yöntemleri / Configuration Methods

### Yöntem 1: Environment Variable (Önerilen / Recommended)
### Method 1: Environment Variable (Recommended)

`.env` dosyasında `DEFAULT_FCM_TOKENS` değişkenini kullanın:
Use the `DEFAULT_FCM_TOKENS` variable in `.env` file:

```bash
# .env
DEFAULT_FCM_TOKENS=token1,token2,token3
AUTO_LOAD_TOKENS=true
```

### Yöntem 2: config.js'de Hardcode
### Method 2: Hardcode in config.js

`backend/config.js` dosyasında `tokens.defaultTokens` array'ine token'ları ekleyin:
Add tokens to the `tokens.defaultTokens` array in `backend/config.js`:

```javascript
tokens: {
  defaultTokens: [
    'YOUR_FCM_TOKEN_1',
    'YOUR_FCM_TOKEN_2',
    'YOUR_FCM_TOKEN_3',
  ],
  autoLoad: true,
}
```

## 📋 Yapılandırma Seçenekleri / Configuration Options

| Değişken / Variable | Açıklama / Description | Varsayılan / Default |
|---------------------|------------------------|----------------------|
| `DEFAULT_FCM_TOKENS` | Virgülle ayrılmış FCM token'ları / Comma-separated FCM tokens | `[]` |
| `AUTO_LOAD_TOKENS` | Başlangıçta otomatik yükle / Auto-load on startup | `true` |
| `DEFAULT_DEVICE_PLATFORM` | Varsayılan platform / Default platform | `unknown` |
| `DEFAULT_APP_VERSION` | Varsayılan uygulama versiyonu / Default app version | `1.0.0` |

## 🚀 Kullanım / Usage

### 1. Token'ları Yapılandır / Configure Tokens

**Seçenek A: .env dosyası**
```bash
# .env
DEFAULT_FCM_TOKENS=token1,token2,token3
```

**Seçenek B: config.js**
```javascript
// backend/config.js
tokens: {
  defaultTokens: [
    'token1',
    'token2',
    'token3',
  ],
}
```

### 2. Backend'i Başlat / Start Backend

```bash
cd backend
npm start
```

Backend başlangıcında token'lar otomatik olarak yüklenecek:
Tokens will be automatically loaded on backend startup:

```
📱 Varsayılan token'lar yükleniyor...
   ✅ Token 1 yüklendi
   ✅ Token 2 yüklendi
   ✅ Token 3 yüklendi
📊 Token yükleme özeti: 3 yüklendi, 0 atlandı
   Toplam token sayısı: 3
```

### 3. Token'ları Kontrol Et / Check Tokens

```bash
curl http://localhost:3000/tokens
```

## 🔍 Token Detayları / Token Details

Hardcode edilmiş token'lar şu bilgilerle yüklenir:
Hardcoded tokens are loaded with the following information:

```json
{
  "id": "auto-generated-id",
  "token": "FCM_TOKEN",
  "deviceInfo": {
    "platform": "unknown",
    "appVersion": "1.0.0",
    "source": "hardcoded",
    "index": 1,
    "loadedAt": "2024-01-01T00:00:00.000Z"
  },
  "metadata": {
    "source": "hardcoded",
    "autoLoaded": true
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastUsed": "2024-01-01T00:00:00.000Z"
}
```

## ⚠️ Güvenlik Notları / Security Notes

1. **Production'da dikkatli kullanın** / **Use carefully in production**
   - Token'ları `.env` dosyasında saklayın, `config.js`'de hardcode etmeyin
   - Store tokens in `.env` file, don't hardcode in `config.js`

2. **Git'e commit etmeyin** / **Don't commit to Git**
   - `.env` dosyasını `.gitignore`'a ekleyin
   - Add `.env` file to `.gitignore`

3. **Token'ları düzenli olarak güncelleyin** / **Update tokens regularly**
   - FCM token'ları zamanla değişebilir
   - FCM tokens can change over time

## 📝 Örnek Yapılandırma / Example Configuration

### .env Örneği / .env Example

```bash
# Development tokens
DEFAULT_FCM_TOKENS=dev_token_1,dev_token_2
AUTO_LOAD_TOKENS=true
DEFAULT_DEVICE_PLATFORM=ios
DEFAULT_APP_VERSION=1.0.0
```

### config.js Örneği / config.js Example

```javascript
tokens: {
  defaultTokens: [
    'cXyZ123...', // Test device 1
    'aBc456...', // Test device 2
  ],
  autoLoad: true,
  defaultDeviceInfo: {
    platform: 'ios',
    appVersion: '1.0.0',
    source: 'hardcoded',
  },
}
```

## 🔄 Token Yönetimi / Token Management

### Token'ları Listele / List Tokens

```bash
curl http://localhost:3000/tokens
```

### Token'a Bildirim Gönder / Send Notification to Token

```bash
# Token ID ile
curl -X POST http://localhost:3000/tokens/TOKEN_ID/send \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test",
    "body": "Test notification"
  }'
```

### Token Sil / Delete Token

```bash
curl -X DELETE http://localhost:3000/tokens/TOKEN_ID
```

## 💡 İpuçları / Tips

1. **Test için hardcode kullanın** / **Use hardcode for testing**
   - Geliştirme ve test için uygundur
   - Suitable for development and testing

2. **Production'da API kullanın** / **Use API in production**
   - Production'da token'ları API üzerinden yönetin
   - Manage tokens via API in production

3. **Token'ları düzenli kontrol edin** / **Check tokens regularly**
   - Geçersiz token'ları temizleyin
   - Clean up invalid tokens

