# FCM REST API v1 Kullanım Örnekleri
# FCM REST API v1 Usage Examples

Bu dokümantasyon, backend API'mizin FCM REST API v1 spesifikasyonuna göre kullanım örneklerini içerir.
This documentation contains usage examples for our backend API according to FCM REST API v1 specification.

**Referans / Reference:** [FCM REST API v1](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages)

## 📱 Temel Kullanım / Basic Usage

### Tek Cihaza Bildirim / Single Device Notification

```bash
curl -X POST http://localhost:3000/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "token": "FCM_TOKEN_HERE",
    "title": "Yeni Ürünler",
    "body": "Kampanya Paylaşım Ürünleri kategorisine yeni ürünler eklendi!"
  }'
```

### Konuya Bildirim / Topic Notification

```bash
curl -X POST http://localhost:3000/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "new-products",
    "title": "Yeni Ürünler",
    "body": "Kampanya Paylaşım Ürünleri kategorisine yeni ürünler eklendi!"
  }'
```

### Condition ile Bildirim / Condition Notification

```bash
curl -X POST http://localhost:3000/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "condition": "'stock-GOOG' in topics && 'price' in topics",
    "title": "Stok Güncellemesi",
    "body": "Google hisse senedi fiyatı güncellendi"
  }'
```

## 🔧 Gelişmiş Yapılandırma / Advanced Configuration

### Android Özel Yapılandırma / Android-Specific Config

```bash
curl -X POST http://localhost:3000/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "token": "FCM_TOKEN_HERE",
    "title": "Yeni Ürünler",
    "body": "Kampanya Paylaşım Ürünleri kategorisine yeni ürünler eklendi!",
    "android": {
      "priority": "high",
      "ttl": "3600s",
      "restricted_package_name": "com.veratoptan.mobile",
      "notification": {
        "sound": "notification.mp3",
        "channelId": "new-products",
        "click_action": "OPEN_PRODUCTS_ACTIVITY"
      }
    }
  }'
```

### iOS (APNS) Özel Yapılandırma / iOS (APNS) Specific Config

```bash
curl -X POST http://localhost:3000/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "token": "FCM_TOKEN_HERE",
    "title": "Yeni Ürünler",
    "body": "Kampanya Paylaşım Ürünleri kategorisine yeni ürünler eklendi!",
    "apns": {
      "headers": {
        "apns-expiration": "0",
        "apns-priority": "10"
      },
      "payload": {
        "aps": {
          "sound": "notification.mp3",
          "badge": 1,
          "category": "NEW_PRODUCTS_CATEGORY",
          "content-available": 1
        },
        "customKey": "customValue"
      },
      "fcm_options": {
        "analytics_label": "new_products_notification",
        "image": "https://example.com/image.jpg"
      }
    }
  }'
```

### Data Payload ile Bildirim / Notification with Data Payload

```bash
curl -X POST http://localhost:3000/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "token": "FCM_TOKEN_HERE",
    "title": "Yeni Ürünler",
    "body": "Kampanya Paylaşım Ürünleri kategorisine yeni ürünler eklendi!",
    "data": {
      "type": "new-products",
      "category": "kampanya-paylasim-urunleri",
      "categoryId": "NEW_PRODUCTS",
      "screen": "Home",
      "route": "Tabs"
    }
  }'
```

### WebPush Bildirimi / WebPush Notification

```bash
curl -X POST http://localhost:3000/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "token": "FCM_TOKEN_HERE",
    "title": "Yeni Ürünler",
    "body": "Kampanya Paylaşım Ürünleri kategorisine yeni ürünler eklendi!",
    "webpush": {
      "notification": {
        "title": "Yeni Ürünler",
        "body": "Kampanya Paylaşım Ürünleri kategorisine yeni ürünler eklendi!",
        "icon": "https://example.com/icon.png"
      },
      "fcm_options": {
        "link": "https://example.com/products",
        "analytics_label": "web_new_products"
      }
    }
  }'
```

### FCM Options ile Bildirim / Notification with FCM Options

```bash
curl -X POST http://localhost:3000/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "token": "FCM_TOKEN_HERE",
    "title": "Yeni Ürünler",
    "body": "Kampanya Paylaşım Ürünleri kategorisine yeni ürünler eklendi!",
    "fcm_options": {
      "analytics_label": "new_products_campaign"
    }
  }'
```

## 📊 Platform-Specific Örnekler / Platform-Specific Examples

### Android: Yüksek Öncelikli Bildirim / Android: High Priority Notification

```bash
curl -X POST http://localhost:3000/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "token": "FCM_TOKEN_HERE",
    "title": "Acil Bildirim",
    "body": "Bu yüksek öncelikli bir bildirimdir",
    "android": {
      "priority": "high",
      "notification": {
        "channelId": "urgent",
        "sound": "urgent.mp3"
      }
    }
  }'
```

### iOS: Live Activity Güncellemesi / iOS: Live Activity Update

```bash
curl -X POST http://localhost:3000/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "token": "FCM_TOKEN_HERE",
    "apns": {
      "live_activity_token": "LIVE_ACTIVITY_TOKEN_HERE",
      "payload": {
        "aps": {
          "content-state": {
            "event": "update",
            "timestamp": "2024-01-01T00:00:00Z"
          }
        }
      }
    }
  }'
```

## 🔗 Kaydedilmiş Token'a Bildirim / Send to Stored Token

### Token ID ile Bildirim Gönderme / Send Notification by Token ID

```bash
curl -X POST http://localhost:3000/tokens/TOKEN_ID/send \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Yeni Ürünler",
    "body": "Kampanya Paylaşım Ürünleri kategorisine yeni ürünler eklendi!",
    "data": {
      "type": "new-products"
    }
  }'
```

## 📚 Daha Fazla Bilgi / More Information

- [FCM REST API v1 Reference](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages)
- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Backend README](../backend/README.md)

