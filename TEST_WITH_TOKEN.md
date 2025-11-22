# FCM Token ile Test Etme
# Testing with FCM Token

## 🧪 Gerçek Bildirim Gönderme
## 🧪 Send Real Notification

FCM token'ınız varsa, backend servisinin Firebase ile etkileşimini test edebilirsiniz.
If you have an FCM token, you can test the backend service's interaction with Firebase.

## 📋 Yöntem 1: Test Script ile
## 📋 Method 1: Using Test Script

```bash
cd backend
npm run test:notification YOUR_FCM_TOKEN_HERE
```

**Örnek:**
```bash
npm run test:notification "dK3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1..."
```

## 📋 Yöntem 2: curl ile
## 📋 Method 2: Using curl

```bash
curl -X POST http://localhost:3000/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_FCM_TOKEN_HERE",
    "title": "🧪 Test Bildirimi",
    "body": "Backend Firebase ile başarıyla çalışıyor!",
    "data": {
      "test": "true",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  }'
```

## 📋 Yöntem 3: Mobil Uygulamadan
## 📋 Method 3: From Mobile App

1. Mobil uygulamayı açın
2. **Gönder** sekmesine gidin
3. **"FCM Token'a Gönder"** seçeneğini seçin
4. FCM token'ınızı girin (veya kaydedilmiş token'lardan seçin)
5. Başlık ve içerik yazın
6. **"Bildirim Gönder"** butonuna tıklayın

## 📱 FCM Token Nasıl Alınır?
## 📱 How to Get FCM Token?

### Android
1. Firebase Console > Cloud Messaging > New notification
2. Test message gönderin
3. Cihazınızda bildirim alın
4. Logcat'te token'ı görün: `FCM Registration Token: ...`

### iOS
1. Firebase Console > Cloud Messaging > New notification
2. Test message gönderin
3. Cihazınızda bildirim alın
4. Xcode console'da token'ı görün

### Expo Go
1. Uygulamayı açın
2. FCM token'ı almak için Firebase SDK kullanın
3. Token'ı AsyncStorage'a kaydedin

## ✅ Test Sonuçları
## ✅ Test Results

### Başarılı Response (200)
```json
{
  "success": true,
  "messageId": "projects/veratoptan-c4d30/messages/0:1234567890"
}
```

### Hata Response (400/500)
```json
{
  "success": false,
  "error": "Hata mesajı",
  "errorCode": "ERROR_CODE"
}
```

## 🔍 Yaygın Hatalar
## 🔍 Common Errors

### "Geçersiz FCM token"
- Token süresi dolmuş olabilir
- Token formatı yanlış olabilir
- Yeni bir token alın

### "FCM token kayıtlı değil"
- Uygulama cihazdan kaldırılmış olabilir
- Token geçersiz hale gelmiş olabilir
- Yeni bir token alın

### "Backend servisine bağlanılamadı"
- Backend servisinin çalıştığından emin olun
- URL'in doğru olduğunu kontrol edin
- `curl http://localhost:3000/health` ile test edin

## 💡 İpucu
## 💡 Tip

Test için geçici bir FCM token kullanabilirsiniz. Gerçek cihazınızdan token almak için:
For testing, you can use a temporary FCM token. To get a token from your real device:

1. Mobil uygulamayı cihazınıza yükleyin
2. Uygulamayı açın
3. FCM token'ı kaydedin
4. Backend'den test edin

