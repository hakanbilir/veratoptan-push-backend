# Firebase Yapılandırması
# Firebase Configuration

Backend servisinin Firebase yapılandırması.
Firebase configuration for the backend service.

## 📋 Firebase Bilgileri / Firebase Information

| Özellik / Property | Değer / Value | Açıklama / Description |
|-------------------|---------------|------------------------|
| **Project ID** | `veratoptan-c4d30` | Firebase Proje ID'si |
| **Project Number / Sender ID** | `989392397922` | GCM Sender ID / FCM Project Number |
| **Service Account** | `veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json` | Servis hesabı dosyası |

## 🔧 Yapılandırma / Configuration

### Environment Variables

```bash
# .env
FIREBASE_PROJECT_ID=veratoptan-c4d30
FIREBASE_PROJECT_NUMBER=989392397922
SERVICE_ACCOUNT_PATH=../config/secrets/veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json
```

### config.js

```javascript
firebase: {
  projectId: 'veratoptan-c4d30',
  projectNumber: '989392397922',
  serviceAccountPath: '../config/secrets/veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json',
}
```

## 📱 Sender ID Kullanımı / Sender ID Usage

**Project Number / Sender ID** (`989392397922`) şu amaçlarla kullanılır:
**Project Number / Sender ID** (`989392397922`) is used for:

1. **FCM Token Oluşturma** - Mobil uygulamalarda FCM token almak için
2. **GCM Sender ID** - Android'de GCM entegrasyonu için
3. **Firebase Console** - Proje numarası olarak görüntülenir

## 🔍 Yapılandırmayı Kontrol Etme / Checking Configuration

### Backend Başlangıç Logları

Backend başlatıldığında şu bilgileri göreceksiniz:
When backend starts, you'll see this information:

```
✅ Firebase Admin SDK başlatıldı
   Proje ID: veratoptan-c4d30
   Proje Numarası / Sender ID: 989392397922
```

### Config Endpoint

```bash
curl http://localhost:3000/config
```

**Response:**
```json
{
  "success": true,
  "config": {
    "firebase": {
      "projectId": "veratoptan-c4d30",
      "projectNumber": "989392397922",
      "serviceAccountPath": "...",
      "serviceAccountExists": true
    }
  }
}
```

## 📚 İlgili Dokümantasyon / Related Documentation

- [Firebase Console](https://console.firebase.google.com/)
- [FCM Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Backend Configuration Guide](./CONFIGURATION.md)

