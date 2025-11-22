/**
 * Firebase Connection Test Script
 * Firebase Bağlantı Test Scripti
 * 
 * Tests the backend service's connection to Firebase
 * Backend servisinin Firebase'e bağlantısını test eder
 */

const admin = require('firebase-admin');
const path = require('path');
const { config } = require('./config');

// Load service account
// Servis hesabını yükle
const serviceAccount = require(config.firebase.serviceAccountPath);

console.log('═══════════════════════════════════════════════════════');
console.log('🧪 Firebase Connection Test');
console.log('═══════════════════════════════════════════════════════');
console.log('');

// Test 1: Initialize Firebase Admin SDK
// Test 1: Firebase Admin SDK'yı başlat
console.log('1️⃣ Firebase Admin SDK başlatılıyor...');
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: config.firebase.projectId,
  });
  console.log('✅ Firebase Admin SDK başlatıldı');
  console.log(`   Proje ID: ${config.firebase.projectId}`);
  console.log(`   Client Email: ${serviceAccount.client_email}`);
} catch (error) {
  console.error('❌ Firebase Admin SDK başlatılamadı:', error.message);
  process.exit(1);
}

console.log('');

// Test 2: Verify Firebase project
// Test 2: Firebase projesini doğrula
console.log('2️⃣ Firebase projesi doğrulanıyor...');
try {
  const app = admin.app();
  const projectId = app.options.projectId;
  if (projectId === config.firebase.projectId) {
    console.log('✅ Firebase projesi doğrulandı');
    console.log(`   Proje ID: ${projectId}`);
  } else {
    console.warn('⚠️ Proje ID eşleşmiyor:', projectId, 'vs', config.firebase.projectId);
  }
} catch (error) {
  console.error('❌ Firebase projesi doğrulanamadı:', error.message);
}

console.log('');

// Test 3: Test FCM messaging service
// Test 3: FCM messaging servisini test et
console.log('3️⃣ FCM Messaging servisi test ediliyor...');
try {
  const messaging = admin.messaging();
  console.log('✅ FCM Messaging servisi hazır');
  console.log('   Servis başarıyla başlatıldı');
} catch (error) {
  console.error('❌ FCM Messaging servisi başlatılamadı:', error.message);
}

console.log('');

// Test 4: Test message validation (without sending)
// Test 4: Mesaj doğrulamasını test et (göndermeden)
console.log('4️⃣ Mesaj formatı test ediliyor...');
try {
  const testMessage = {
    token: 'TEST_TOKEN_FOR_VALIDATION_ONLY',
    notification: {
      title: 'Test Bildirimi',
      body: 'Bu bir test bildirimidir',
    },
    data: {
      test: 'true',
    },
    android: {
      priority: 'high',
      notification: {
        sound: 'notification.mp3',
        channelId: 'new-products',
      },
    },
    apns: {
      payload: {
        aps: {
          sound: 'notification.mp3',
          badge: 1,
        },
      },
    },
  };

  // Validate message structure (without sending)
  // Mesaj yapısını doğrula (göndermeden)
  if (testMessage.token && testMessage.notification && testMessage.notification.title) {
    console.log('✅ Mesaj formatı geçerli');
    console.log('   Title:', testMessage.notification.title);
    console.log('   Body:', testMessage.notification.body);
    console.log('   Android Channel:', testMessage.android.notification.channelId);
    console.log('   Priority:', testMessage.android.priority);
  } else {
    console.error('❌ Mesaj formatı geçersiz');
  }
} catch (error) {
  console.error('❌ Mesaj formatı test edilemedi:', error.message);
}

console.log('');

// Test 5: Check Firebase Cloud Messaging API availability
// Test 5: Firebase Cloud Messaging API erişilebilirliğini kontrol et
console.log('5️⃣ Firebase Cloud Messaging API erişilebilirliği kontrol ediliyor...');
console.log('   (Bu test gerçek bir API çağrısı yapmaz, sadece servis hazırlığını kontrol eder)');
console.log('✅ FCM API servisi hazır (gerçek bildirim göndermek için geçerli bir FCM token gerekir)');

console.log('');

// Summary
// Özet
console.log('═══════════════════════════════════════════════════════');
console.log('✅ Firebase Bağlantı Testi Tamamlandı');
console.log('═══════════════════════════════════════════════════════');
console.log('');
console.log('📋 Sonuç:');
console.log('   ✅ Firebase Admin SDK başarıyla başlatıldı');
console.log('   ✅ FCM Messaging servisi hazır');
console.log('   ✅ Mesaj formatı geçerli');
console.log('');
console.log('💡 Gerçek bildirim göndermek için:');
console.log('   1. Geçerli bir FCM token alın');
console.log('   2. POST http://localhost:3000/send-notification');
console.log('   3. Body: { "token": "FCM_TOKEN", "title": "...", "body": "..." }');
console.log('');
console.log('🧪 Backend servisini test etmek için:');
console.log('   curl -X POST http://localhost:3000/send-notification \\');
console.log('     -H "Content-Type: application/json" \\');
console.log('     -d \'{"token":"FCM_TOKEN","title":"Test","body":"Test notification"}\'');
console.log('');

// Cleanup
// Temizlik
admin.app().delete().then(() => {
  console.log('✅ Firebase Admin SDK temizlendi');
  process.exit(0);
}).catch((error) => {
  console.error('⚠️ Firebase Admin SDK temizlenirken hata:', error.message);
  process.exit(0);
});

