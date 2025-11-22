# FCM REST API v1 Uyumluluk Dokümantasyonu
# FCM REST API v1 Compliance Documentation

Bu dokümantasyon, backend servisimizin [Firebase FCM REST API v1](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages) spesifikasyonuna uyumluluğunu açıklar.
This documentation describes our backend service's compliance with the [Firebase FCM REST API v1](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages) specification.

## 📋 Mevcut Durum / Current Status

Backend'imiz **Firebase Admin SDK** kullanıyor, bu da arka planda FCM REST API v1'i kullanıyor.
Our backend uses **Firebase Admin SDK**, which uses FCM REST API v1 under the hood.

## ✅ Desteklenen Özellikler / Supported Features

### Message Yapısı / Message Structure

| Özellik / Feature | Durum / Status | Notlar / Notes |
|-------------------|----------------|----------------|
| `token` | ✅ | Tek cihaza bildirim gönderme |
| `topic` | ✅ | Konuya bildirim gönderme |
| `condition` | ⚠️ | Admin SDK destekler, API'de henüz expose edilmedi |
| `notification` | ✅ | title, body destekleniyor |
| `data` | ✅ | Key-value pairs (string values) |
| `android` | ✅ | AndroidConfig kısmen destekleniyor |
| `apns` | ✅ | ApnsConfig kısmen destekleniyor |
| `webpush` | ❌ | Henüz desteklenmiyor |
| `fcm_options` | ❌ | Henüz desteklenmiyor |

### AndroidConfig

| Özellik / Feature | Durum / Status |
|-------------------|----------------|
| `priority` | ✅ |
| `notification` (sound, channelId) | ✅ |
| `ttl` | ❌ |
| `restricted_package_name` | ❌ |
| `direct_boot_ok` | ❌ |
| `data` | ❌ |

### ApnsConfig

| Özellik / Feature | Durum / Status |
|-------------------|----------------|
| `payload.aps` | ✅ |
| `headers` (apns-expiration, apns-priority) | ⚠️ | Admin SDK otomatik ayarlar |
| `fcm_options` | ❌ |
| `live_activity_token` | ❌ |

## 🔄 İyileştirme Önerileri / Improvement Suggestions

1. **WebPush desteği ekle** - Web uygulamaları için
2. **FcmOptions ekle** - Analytics label desteği
3. **Condition desteği** - API endpoint'ine ekle
4. **Gelişmiş AndroidConfig** - ttl, restricted_package_name
5. **Gelişmiş ApnsConfig** - headers, live_activity_token

## 📚 Referans / Reference

- [FCM REST API v1 Reference](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages)
- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)

