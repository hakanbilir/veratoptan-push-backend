/**
 * Backend Service Test Script
 * Backend Servisi Test Scripti
 * 
 * Tests the backend service endpoints
 * Backend servisi endpoint'lerini test eder
 */

const axios = require('axios');

const BASE_URL = process.env.BACKEND_URL || 'http://localhost:3000';

async function testHealthCheck() {
  try {
    console.log('🧪 Testing health check...');
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

async function testSendNotification() {
  try {
    console.log('🧪 Testing send notification...');
    const response = await axios.post(`${BASE_URL}/send-notification`, {
      token: 'TEST_TOKEN_HERE', // Replace with a real FCM token for actual test
      title: 'Test Bildirimi',
      body: 'Bu bir test bildirimidir',
      data: {
        test: 'true',
        timestamp: new Date().toISOString()
      }
    });
    console.log('✅ Send notification passed:', response.data);
    return true;
  } catch (error) {
    if (error.response) {
      console.error('❌ Send notification failed:', error.response.data);
    } else {
      console.error('❌ Send notification failed:', error.message);
    }
    return false;
  }
}

async function runTests() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🧪 Backend Service Tests');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`📍 Testing: ${BASE_URL}`);
  console.log('');

  const healthCheck = await testHealthCheck();
  console.log('');

  // Only test send notification if health check passes
  // Sağlık kontrolü başarılı olursa bildirim göndermeyi test et
  if (healthCheck) {
    await testSendNotification();
  }

  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('✅ Tests completed');
  console.log('═══════════════════════════════════════════════════════');
}

// Run tests
runTests().catch(console.error);

