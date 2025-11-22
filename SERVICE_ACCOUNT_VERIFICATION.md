# Servis Hesabı Doğrulama
# Service Account Verification

Firebase Admin SDK servis hesabı bilgileri ve doğrulama.
Firebase Admin SDK service account information and verification.

## 🔑 Servis Hesabı Bilgileri / Service Account Information

| Özellik / Property | Değer / Value |
|-------------------|---------------|
| **Private Key ID** | `4f7165d9f56e81eab135921ffe38b4e3f64c62aa` |
| **Client Email** | `firebase-adminsdk-fbsvc@veratoptan-c4d30.iam.gserviceaccount.com` |
| **Project ID** | `veratoptan-c4d30` |
| **Project Number** | `989392397922` |
| **Dosya Yolu / File Path** | `config/secrets/veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json` |

## ✅ Doğrulama / Verification

### Backend Yapılandırması / Backend Configuration

Backend servisi şu yapılandırmayı kullanır:
Backend service uses the following configuration:

```javascript
// backend/config.js
firebase: {
  projectId: 'veratoptan-c4d30',
  projectNumber: '989392397922',
  serviceAccountPath: '../config/secrets/veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json',
}
```

### Servis Hesabı Dosyası Kontrolü / Service Account File Check

Servis hesabı dosyası şu bilgileri içerir:
Service account file contains the following information:

```json
{
  "type": "service_account",
  "project_id": "veratoptan-c4d30",
  "private_key_id": "4f7165d9f56e81eab135921ffe38b4e3f64c62aa",
  "client_email": "firebase-adminsdk-fbsvc@veratoptan-c4d30.iam.gserviceaccount.com",
  "client_id": "102290802313263042738",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

## 🔍 Doğrulama Komutları / Verification Commands

### 1. Servis Hesabı Dosyasını Kontrol Et / Check Service Account File

```bash
cd backend
node -e "const sa = require('../config/secrets/veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json'); console.log('Private Key ID:', sa.private_key_id);"
```

**Beklenen Çıktı / Expected Output:**
```
Private Key ID: 4f7165d9f56e81eab135921ffe38b4e3f64c62aa
```

### 2. Backend Yapılandırmasını Kontrol Et / Check Backend Configuration

```bash
cd backend
node -e "const { config } = require('./config'); console.log('Service Account Path:', config.firebase.serviceAccountPath);"
```

### 3. Firebase Bağlantısını Test Et / Test Firebase Connection

```bash
cd backend
npm run test:firebase
```

## ⚠️ Güvenlik Notları / Security Notes

1. **Private Key ID Hassas Bilgidir**
   - Bu bilgiyi public repository'lere commit etmeyin
   - Don't commit this information to public repositories

2. **Servis Hesabı Dosyası**
   - `.gitignore` dosyasında olmalıdır
   - Should be in `.gitignore` file

3. **Environment Variables**
   - Production'da environment variables kullanın
   - Use environment variables in production

## 📚 İlgili Dokümantasyon / Related Documentation

- [Firebase Admin SDK Setup](https://firebase.google.com/docs/admin/setup)
- [Service Account Keys](https://console.cloud.google.com/iam-admin/serviceaccounts)
- [Backend Configuration Guide](./CONFIGURATION.md)

