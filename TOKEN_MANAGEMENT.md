# FCM Token Yönetimi API
# FCM Token Management API

Backend API'de FCM token'ları saklama ve yönetme endpoint'leri.
Endpoints for storing and managing FCM tokens in the backend API.

## 📋 API Endpoints
## 📋 API Endpoints

### 1. Token Kaydetme / Store Token
### 1. Store Token

```
POST /tokens
Content-Type: application/json

{
  "token": "FCM_TOKEN_HERE",
  "deviceInfo": {
    "platform": "ios",
    "appVersion": "1.0.0"
  },
  "metadata": {
    "userId": "user123",
    "deviceName": "iPhone 12"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token başarıyla kaydedildi",
  "token": {
    "id": "abc123",
    "token": "FCM_TOKEN_HERE...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastUsed": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Tüm Token'ları Listeleme / List All Tokens
### 2. List All Tokens

```
GET /tokens
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "tokens": [
    {
      "id": "abc123",
      "token": "FCM_TOKEN_HERE...",
      "deviceInfo": {
        "platform": "ios"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastUsed": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 3. Token Detayı / Token Details
### 3. Token Details

```
GET /tokens/:id
```

**Response:**
```json
{
  "success": true,
  "token": {
    "id": "abc123",
    "token": "FULL_FCM_TOKEN_HERE",
    "deviceInfo": {...},
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastUsed": "2024-01-01T00:00:00.000Z",
    "metadata": {...}
  }
}
```

### 4. Token Silme / Delete Token
### 4. Delete Token

```
DELETE /tokens/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Token başarıyla silindi"
}
```

### 5. Kaydedilmiş Token'a Bildirim Gönderme
### 5. Send Notification to Stored Token

```
POST /tokens/:id/send
Content-Type: application/json

{
  "title": "Bildirim Başlığı",
  "body": "Bildirim İçeriği",
  "data": {
    "key": "value"
  }
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "projects/veratoptan-c4d30/messages/0:1234567890",
  "tokenId": "abc123"
}
```

## 🧪 Test Örnekleri
## 🧪 Test Examples

### Token Kaydetme
### Store Token

```bash
curl -X POST http://localhost:3000/tokens \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_FCM_TOKEN",
    "deviceInfo": {
      "platform": "ios",
      "appVersion": "1.0.0"
    }
  }'
```

### Tüm Token'ları Listeleme
### List All Tokens

```bash
curl http://localhost:3000/tokens
```

### Token'a Bildirim Gönderme
### Send Notification to Token

```bash
curl -X POST http://localhost:3000/tokens/abc123/send \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Bildirimi",
    "body": "Bu bir test bildirimidir"
  }'
```

## 💾 Depolama
## 💾 Storage

Token'lar şu anda:
Tokens are currently stored in:

- **Bellekte (In-memory)**: Hızlı erişim için
- **Dosyada (File)**: `backend/tokens.json` - Kalıcı depolama

**Not:** Production için database (MongoDB, PostgreSQL, vb.) kullanmanız önerilir.
**Note:** For production, using a database (MongoDB, PostgreSQL, etc.) is recommended.

## 📱 Mobil Uygulamadan Kullanım
## 📱 Usage from Mobile App

Mobil uygulamanız token'ları backend'e kaydedebilir:
Your mobile app can store tokens in the backend:

```typescript
// Token kaydet
await axios.post('http://localhost:3000/tokens', {
  token: fcmToken,
  deviceInfo: {
    platform: Platform.OS,
    appVersion: '1.0.0'
  }
});

// Kaydedilmiş token'a bildirim gönder
await axios.post(`http://localhost:3000/tokens/${tokenId}/send`, {
  title: 'Başlık',
  body: 'İçerik'
});
```

## 🔒 Güvenlik Notları
## 🔒 Security Notes

- Token'lar `tokens.json` dosyasında saklanır
- Bu dosya `.gitignore`'da olmalıdır
- Production için şifreleme ekleyin
- API authentication ekleyin (API key, JWT, vb.)

