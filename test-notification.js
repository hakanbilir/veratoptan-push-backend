/**
 * Send Test Notification Script
 * Test Bildirimi Gönderme Scripti
 * 
 * Sends a test notification to verify Firebase integration
 * Firebase entegrasyonunu doğrulamak için test bildirimi gönderir
 */

const axios = require('axios');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

// Get FCM token from command line argument or use test token
// Komut satırı argümanından FCM token al veya test token kullan
const FCM_TOKEN = process.argv[2] || process.env.FCM_TOKEN;

if (!FCM_TOKEN || FCM_TOKEN === 'TEST_TOKEN') {
  console.log('═══════════════════════════════════════════════════════');
  console.log('⚠️  FCM Token Gerekli');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  console.log('Kullanım / Usage:');
  console.log('  node test-notification.js <FCM_TOKEN>');
  console.log('');
  console.log('veya / or:');
  console.log('  FCM_TOKEN=your_token_here node test-notification.js');
  console.log('');
  console.log('💡 FCM token almak için:');
  console.log('   1. Mobil uygulamayı açın');
  console.log('   2. Ayarlar > FCM Token bölümünden token\'ı kopyalayın');
  console.log('');
  process.exit(1);
}

async function testSendNotification() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🧪 Test Bildirimi Gönderme');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  console.log(`📍 Backend URL: ${BACKEND_URL}`);
  console.log(`📱 FCM Token: ${FCM_TOKEN.substring(0, 20)}...`);
  console.log('');

  const payload = {
    token: FCM_TOKEN,
    title: '🧪 Test Bildirimi',
    body: 'Backend servisi Firebase ile başarıyla çalışıyor!',
    data: {
      test: 'true',
      timestamp: new Date().toISOString(),
      source: 'backend-test',
    },
  };

  try {
    console.log('📤 Bildirim gönderiliyor...');
    console.log('   Payload:', JSON.stringify(payload, null, 2));
    console.log('');

    const response = await axios.post(
      `${BACKEND_URL}/send-notification`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 seconds
      }
    );

    console.log('✅ Bildirim başarıyla gönderildi!');
    console.log('');
    console.log('📋 Response:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ Test Başarılı!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('💡 Cihazınızda bildirimi kontrol edin');
    console.log('');

  } catch (error) {
    console.error('❌ Bildirim gönderilemedi!');
    console.error('');

    if (error.response) {
      // Server responded with error
      // Sunucu hata ile yanıt verdi
      console.error('📋 Hata Detayları:');
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      // Request made but no response
      // İstek yapıldı ama yanıt yok
      console.error('📋 Hata: Backend servisine bağlanılamadı');
      console.error('   URL:', BACKEND_URL);
      console.error('   Backend servisinin çalıştığından emin olun');
    } else {
      // Error setting up request
      // İstek kurulurken hata
      console.error('📋 Hata:', error.message);
    }

    console.error('');
    console.error('🔍 Sorun Giderme:');
    console.error('   1. Backend servisinin çalıştığını kontrol edin');
    console.error('   2. FCM token\'ın geçerli olduğunu kontrol edin');
    console.error('   3. Firebase yapılandırmasını kontrol edin');
    console.error('');

    process.exit(1);
  }
}

// Run test
// Testi çalıştır
testSendNotification();

