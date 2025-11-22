# Production Deployment Checklist
# Production Deployment Kontrol Listesi

## 🔐 Security & Configuration
## 🔐 Güvenlik & Yapılandırma

### ✅ Environment Variables / Secrets
### ✅ Ortam Değişkenleri / Secret'lar

- [ ] `SERVICE_ACCOUNT_JSON` ayarlandı (base64 encoded veya direct JSON)
- [ ] `FIREBASE_PROJECT_ID` ayarlandı
- [ ] `FIREBASE_PROJECT_NUMBER` ayarlandı
- [ ] `NODE_ENV=production` ayarlandı
- [ ] `CORS_ORIGINS` production domain'leri ile güncellendi (wildcard yerine)
- [ ] `RATE_LIMIT` production için uygun değere ayarlandı
- [ ] `LOG_LEVEL` production için uygun seviyeye ayarlandı

### ✅ Service Account
### ✅ Servis Hesabı

- [ ] Service account JSON base64 encode edildi
- [ ] `SERVICE_ACCOUNT_JSON` secret olarak ayarlandı
- [ ] Service account dosyası git'e commit edilmedi (`.gitignore` kontrol edildi)

## 🚀 Deployment Platform
## 🚀 Deployment Platform'u

### Fly.io
- [ ] `fly.toml` güncellendi
- [ ] Health check endpoint yapılandırıldı
- [ ] Secrets ayarlandı: `fly secrets set SERVICE_ACCOUNT_JSON="..."`
- [ ] Deploy edildi: `fly deploy`
- [ ] Health check test edildi: `curl https://your-app.fly.dev/health`

### Heroku
- [ ] `Procfile` kontrol edildi
- [ ] Config vars ayarlandı: `heroku config:set SERVICE_ACCOUNT_JSON="..."`
- [ ] Deploy edildi: `git push heroku main`
- [ ] Health check test edildi: `curl https://your-app.herokuapp.com/health`

### Railway
- [ ] Environment variables dashboard'dan ayarlandı
- [ ] Auto-deploy aktif
- [ ] Health check test edildi

## 🧪 Testing
## 🧪 Test

- [ ] Health check endpoint çalışıyor: `GET /health`
- [ ] Config endpoint çalışıyor: `GET /config`
- [ ] Token kayıt çalışıyor: `POST /tokens`
- [ ] Bildirim gönderme çalışıyor: `POST /send-notification`
- [ ] CORS doğru çalışıyor (Expo app'ten istek atılabiliyor)
- [ ] Rate limiting çalışıyor (429 response test edildi)

## 📊 Monitoring
## 📊 İzleme

- [ ] Logs izleniyor (Fly.io: `fly logs`, Heroku: `heroku logs --tail`)
- [ ] Error tracking aktif (opsiyonel: Sentry, LogRocket, vb.)
- [ ] Health check monitoring aktif
- [ ] Uptime monitoring aktif (opsiyonel: UptimeRobot, Pingdom, vb.)

## 🔒 Security Review
## 🔒 Güvenlik İncelemesi

- [ ] HTTPS zorunlu (force_https: true)
- [ ] Security headers aktif (X-Content-Type-Options, X-Frame-Options, vb.)
- [ ] Rate limiting aktif
- [ ] Request size limits ayarlandı
- [ ] CORS origins production domain'leri ile sınırlandırıldı
- [ ] Sensitive data loglarda görünmüyor

## 📱 Mobile App Configuration
## 📱 Mobil Uygulama Yapılandırması

- [ ] Expo app'te backend URL production URL'i ile güncellendi
- [ ] `app.json` veya `AsyncStorage`'da backend URL doğru
- [ ] FCM token alma test edildi
- [ ] Bildirim gönderme test edildi

## 📝 Documentation
## 📝 Dokümantasyon

- [ ] Production URL dokümante edildi
- [ ] Environment variables dokümante edildi
- [ ] API endpoints dokümante edildi
- [ ] Troubleshooting guide hazır

## ✅ Final Checks
## ✅ Son Kontroller

- [ ] Tüm testler geçti
- [ ] Production URL çalışıyor
- [ ] Mobile app production backend'e bağlanabiliyor
- [ ] Bildirimler başarıyla gönderiliyor
- [ ] Logs temiz (kritik hata yok)

---

## 🆘 Troubleshooting
## 🆘 Sorun Giderme

### Service Account Hatası
```bash
# Base64 JSON'u kontrol et
echo $SERVICE_ACCOUNT_JSON | base64 -d | jq .

# Fly.io'da secret'ı yeniden ayarla
fly secrets set SERVICE_ACCOUNT_JSON="$(cat config/secrets/veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json | base64)"
```

### Health Check Başarısız
```bash
# Logs kontrol et
fly logs

# Health endpoint'i manuel test et
curl https://your-app.fly.dev/health
```

### CORS Hatası
```bash
# CORS_ORIGINS'i kontrol et
fly secrets list

# Güncelle
fly secrets set CORS_ORIGINS="https://your-domain.com"
```

