/**
 * Firebase Notification Backend Service
 * Firebase Bildirim Backend Servisi
 * 
 * This backend service uses Firebase Admin SDK to send notifications.
 * It provides a REST API endpoint that can be called from Expo apps.
 * 
 * Bu backend servisi, bildirim göndermek için Firebase Admin SDK kullanır.
 * Expo uygulamalarından çağrılabilecek bir REST API endpoint'i sağlar.
 */

const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const { config, validateConfig, getConfigSummary } = require('./config');
const tokenStorage = require('./storage');

// Validate configuration
// Yapılandırmayı doğrula
const validation = validateConfig();
if (!validation.valid) {
  console.error('❌ Yapılandırma hatası:');
  validation.errors.forEach(error => console.error(`  - ${error}`));
  console.error('💡 Lütfen .env dosyasını kontrol edin veya environment variables ayarlayın');
  process.exit(1);
}

// Load service account JSON
// Servis hesabı JSON'unu yükle
let serviceAccount;
try {
  serviceAccount = require(config.firebase.serviceAccountPath);
  console.log('✅ Servis hesabı yüklendi:', config.firebase.serviceAccountPath);
} catch (error) {
  console.error('❌ Servis hesabı dosyası yüklenemedi:', config.firebase.serviceAccountPath);
  console.error('💡 Lütfen SERVICE_ACCOUNT_PATH ortam değişkenini kontrol edin veya .env dosyası oluşturun');
  process.exit(1);
}

// Initialize Firebase Admin SDK
// Firebase Admin SDK'yı başlat
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: config.firebase.projectId,
  });
  console.log('✅ Firebase Admin SDK başlatıldı');
  console.log(`   Proje ID: ${config.firebase.projectId}`);
  console.log(`   Proje Numarası / Sender ID: ${config.firebase.projectNumber}`);
} catch (error) {
  console.error('❌ Firebase Admin SDK başlatılamadı:', error.message);
  process.exit(1);
}

// Load default/hardcoded tokens on startup
// Başlangıçta varsayılan/hardcode edilmiş token'ları yükle
if (config.tokens.autoLoad && config.tokens.defaultTokens.length > 0) {
  console.log('📱 Varsayılan token\'lar yükleniyor...');
  let loadedCount = 0;
  let skippedCount = 0;
  
  config.tokens.defaultTokens.forEach((token, index) => {
    try {
      // Check if token already exists
      // Token'ın zaten var olup olmadığını kontrol et
      const existing = tokenStorage.getTokenByToken(token);
      if (existing) {
        console.log(`   ⏭️  Token ${index + 1} zaten mevcut, atlanıyor`);
        skippedCount++;
      } else {
        // Add token with default device info
        // Varsayılan cihaz bilgisiyle token ekle
        tokenStorage.addToken(
          token,
          {
            ...config.tokens.defaultDeviceInfo,
            index: index + 1,
            loadedAt: new Date().toISOString(),
          },
          {
            source: 'hardcoded',
            autoLoaded: true,
          }
        );
        console.log(`   ✅ Token ${index + 1} yüklendi`);
        loadedCount++;
      }
    } catch (error) {
      console.error(`   ❌ Token ${index + 1} yüklenirken hata:`, error.message);
    }
  });
  
  console.log(`📊 Token yükleme özeti: ${loadedCount} yüklendi, ${skippedCount} atlandı`);
  console.log(`   Toplam token sayısı: ${tokenStorage.getTokenCount()}`);
}

const app = express();

// Middleware
// CORS configuration
const corsOptions = {
  origin: config.cors.origins === '*' ? true : config.cors.origins,
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions)); // Enable CORS for Expo app / Expo uygulaması için CORS'u etkinleştir
app.use(express.json({ limit: `${config.security.maxRequestSize}mb` })); // Parse JSON bodies / JSON gövdelerini ayrıştır
app.use(express.urlencoded({ extended: true, limit: `${config.security.maxRequestSize}mb` })); // Parse URL-encoded bodies

// Request logging middleware
// İstek loglama middleware'i
if (config.logging.requests) {
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const logLevel = config.logging.level;
    if (logLevel === 'debug' || logLevel === 'info') {
      console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
    }
    next();
  });
}

// Health check endpoint
// Sağlık kontrolü endpoint'i
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend servisi çalışıyor',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint
// Kök endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Firebase Notification Backend Service',
    version: '1.0.0',
    environment: config.server.environment,
      endpoints: {
        health: 'GET /health',
        config: 'GET /config',
        sendNotification: 'POST /send-notification',
        tokens: 'GET /tokens',
        addToken: 'POST /tokens',
        getToken: 'GET /tokens/:id',
        deleteToken: 'DELETE /tokens/:id',
        sendToToken: 'POST /tokens/:id/send'
      },
    documentation: 'See README.md for API documentation'
  });
});

// Configuration endpoint (non-sensitive info only)
// Yapılandırma endpoint'i (sadece hassas olmayan bilgiler)
app.get('/config', (req, res) => {
  res.json({
    success: true,
    config: getConfigSummary()
  });
});

// ============================================
// Token Management Endpoints
// Token Yönetimi Endpoint'leri
// ============================================

/**
 * Get all stored tokens
 * Tüm kaydedilmiş token'ları al
 * GET /tokens
 */
app.get('/tokens', (req, res) => {
  try {
    const tokens = tokenStorage.getAllTokens();
    // Don't expose full token strings in list
    // Liste'de tam token string'lerini açığa çıkarma
    const tokensSummary = tokens.map(t => ({
      id: t.id,
      token: t.token.substring(0, 20) + '...', // Truncated for security
      deviceInfo: t.deviceInfo,
      createdAt: t.createdAt,
      lastUsed: t.lastUsed,
      metadata: t.metadata,
    }));

    res.json({
      success: true,
      count: tokens.length,
      tokens: tokensSummary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Token\'lar yüklenirken hata',
    });
  }
});

/**
 * Get token by ID
 * ID'ye göre token al
 * GET /tokens/:id
 */
app.get('/tokens/:id', (req, res) => {
  try {
    const token = tokenStorage.getTokenById(req.params.id);
    if (token) {
      res.json({
        success: true,
        token: {
          id: token.id,
          token: token.token, // Full token for this endpoint
          deviceInfo: token.deviceInfo,
          createdAt: token.createdAt,
          lastUsed: token.lastUsed,
          metadata: token.metadata,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Token bulunamadı',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Token yüklenirken hata',
    });
  }
});

/**
 * Store/Update FCM token
 * FCM token kaydet/güncelle
 * POST /tokens
 * Body: {
 *   token: string (required),
 *   deviceInfo?: object,
 *   metadata?: object
 * }
 */
app.post('/tokens', (req, res) => {
  try {
    const { token, deviceInfo, metadata } = req.body;

    // Validate token
    // Token'ı doğrula
    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'FCM token gereklidir',
      });
    }

    // Validate token format (basic check)
    // Token formatını doğrula (temel kontrol)
    const trimmedToken = token.trim();
    if (trimmedToken.length < 100 || trimmedToken.length > 200) {
      return res.status(400).json({
        success: false,
        error: 'Geçersiz FCM token formatı',
      });
    }

    // Add or update token
    // Token ekle veya güncelle
    const tokenData = tokenStorage.addToken(trimmedToken, deviceInfo, metadata);

    res.json({
      success: true,
      message: 'Token başarıyla kaydedildi',
      token: {
        id: tokenData.id,
        token: tokenData.token.substring(0, 20) + '...', // Truncated for response
        createdAt: tokenData.createdAt,
        lastUsed: tokenData.lastUsed,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Token kaydedilirken hata: ' + error.message,
    });
  }
});

/**
 * Delete token by ID
 * ID'ye göre token sil
 * DELETE /tokens/:id
 */
app.delete('/tokens/:id', (req, res) => {
  try {
    const deleted = tokenStorage.deleteTokenById(req.params.id);
    if (deleted) {
      res.json({
        success: true,
        message: 'Token başarıyla silindi',
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Token bulunamadı',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Token silinirken hata',
    });
  }
});

/**
 * Send notification to stored token by ID
 * Kaydedilmiş token'a ID ile bildirim gönder
 * POST /tokens/:id/send
 * Body: {
 *   title: string (required),
 *   body: string (required),
 *   data?: object,
 *   android?: object,
 *   apns?: object
 * }
 */
app.post('/tokens/:id/send', async (req, res) => {
  try {
    const { title, body, data, android, apns } = req.body;

    // Validate required fields
    // Gerekli alanları doğrula
    if (!title || !body) {
      return res.status(400).json({
        success: false,
        error: 'Başlık ve içerik gereklidir',
      });
    }

    // Get token by ID
    // ID'ye göre token al
    const tokenData = tokenStorage.getTokenById(req.params.id);
    if (!tokenData) {
      return res.status(404).json({
        success: false,
        error: 'Token bulunamadı',
      });
    }

    // Build message payload
    // Mesaj payload'unu oluştur
    const message = {
      token: tokenData.token,
      notification: {
        title: String(title).substring(0, 100),
        body: String(body).substring(0, 500),
      },
      data: data || {},
      android: {
        priority: config.notifications.priority,
        notification: {
          sound: config.notifications.sound,
          channelId: config.notifications.androidChannelId,
          ...(android?.notification || {}),
        },
        ...(android || {}),
      },
      apns: {
        payload: {
          aps: {
            sound: config.notifications.sound,
            badge: 1,
            ...(apns?.payload?.aps || {}),
          },
          ...(apns?.payload || {}),
        },
        ...(apns || {}),
      },
    };

    // Ensure data values are strings
    // Data değerlerinin string olduğundan emin ol
    if (message.data) {
      message.data = Object.fromEntries(
        Object.entries(message.data).map(([key, value]) => [
          key,
          typeof value === 'object' ? JSON.stringify(value) : String(value)
        ])
      );
    }

    // Send notification
    // Bildirim gönder
    const response = await admin.messaging().send(message);
    
    // Update token last used
    // Token'ın son kullanım zamanını güncelle
    tokenStorage.updateTokenLastUsed(tokenData.token);
    
    console.log('✅ Bildirim gönderildi:', response);
    
    res.json({
      success: true,
      messageId: response,
      tokenId: tokenData.id,
    });
  } catch (error) {
    console.error('❌ Bildirim gönderilirken hata:', error);
    
    const errorCode = error.code || '';
    let statusCode = 500;
    let errorMessage = 'Bildirim gönderilemedi';

    if (errorCode === 'messaging/invalid-registration-token') {
      statusCode = 400;
      errorMessage = 'Geçersiz FCM token';
    } else if (errorCode === 'messaging/registration-token-not-registered') {
      statusCode = 400;
      errorMessage = 'FCM token kayıtlı değil';
    } else {
      errorMessage = error.message || 'Bildirim gönderilemedi';
    }
    
    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      errorCode: errorCode || 'UNKNOWN_ERROR'
    });
  }
});

/**
 * Send notification endpoint
 * Bildirim gönderme endpoint'i
 * 
 * POST /send-notification
 * 
 * Sends a notification using Firebase Cloud Messaging (FCM) REST API v1
 * Firebase Cloud Messaging (FCM) REST API v1 kullanarak bildirim gönderir
 * 
 * Reference: https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages
 * 
 * Body: {
 *   token?: string,           // FCM token (for single device)
 *   topic?: string,            // Topic name (for multiple devices)
 *   condition?: string,        // Condition expression (e.g., "'stock-GOOG' in topics")
 *   title: string,             // Notification title (max 100 chars)
 *   body: string,              // Notification body (max 500 chars)
 *   data?: object,             // Optional data payload (all values must be strings)
 *   android?: {                 // Optional Android-specific config
 *     priority?: 'high' | 'normal',
 *     notification?: {
 *       sound?: string,
 *       channelId?: string,
 *       // ... other Android notification options
 *     },
 *     ttl?: string,            // Time to live (e.g., "3600s")
 *     restricted_package_name?: string,
 *     direct_boot_ok?: boolean,
 *   },
 *   apns?: {                    // Optional iOS-specific config
 *     headers?: {               // APNS headers
 *       'apns-expiration'?: string,
 *       'apns-priority'?: string,
 *       // ... other APNS headers
 *     },
 *     payload?: {               // APNS payload
 *       aps?: {                  // APS dictionary
 *         sound?: string,
 *         badge?: number,
 *         // ... other APS options
 *       },
 *       // ... custom payload data
 *     },
 *     fcm_options?: {          // FCM options for iOS
 *       analytics_label?: string,
 *       image?: string,
 *     },
 *     live_activity_token?: string, // Apple Live Activity token
 *   },
 *   webpush?: {                 // Optional WebPush config (for web apps)
 *     notification?: {
 *       title?: string,
 *       body?: string,
 *       icon?: string,
 *       // ... other WebPush notification options
 *     },
 *     fcm_options?: {
 *       link?: string,
 *       analytics_label?: string,
 *     },
 *   },
 *   fcm_options?: {            // Platform-independent FCM options
 *     analytics_label?: string,
 *   }
 * }
 */
app.post('/send-notification', async (req, res) => {
  try {
    const { token, topic, title, body, data, android, apns } = req.body;

    // Validate required fields
    // Gerekli alanları doğrula
    if (!title || !body) {
      return res.status(400).json({ 
        success: false,
        error: 'Başlık ve içerik gereklidir' 
      });
    }

    // Validate that either token, topic, or condition is provided (per FCM v1 spec)
    // Token, topic veya condition'ın sağlandığını doğrula (FCM v1 spesifikasyonuna göre)
    const { condition } = req.body;
    if (!token && !topic && !condition) {
      return res.status(400).json({ 
        success: false,
        error: 'Token, topic veya condition gereklidir' 
      });
    }

    // Build message payload according to FCM REST API v1 specification
    // FCM REST API v1 spesifikasyonuna göre mesaj payload'unu oluştur
    // Reference: https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages
    const message = {
      // Notification payload (optional, can be overridden by platform-specific configs)
      // Bildirim payload'u (opsiyonel, platform-spesifik yapılandırmalar tarafından geçersiz kılınabilir)
      notification: {
        title: String(title).substring(0, 100), // Max 100 chars per FCM v1 spec
        body: String(body).substring(0, 500), // Max 500 chars per FCM v1 spec
        // image: string (optional) - URL of image to display in notification
      },
      
      // Data payload (key-value pairs, all values must be strings)
      // Data payload'u (key-value çiftleri, tüm değerler string olmalı)
      data: data || {},
      
      // Android-specific configuration
      // Android'e özel yapılandırma
      android: {
        priority: config.notifications.priority, // 'high' or 'normal'
        notification: {
          sound: config.notifications.sound,
          channelId: config.notifications.androidChannelId,
          // Additional Android notification options can be merged
          // Ek Android bildirim seçenekleri birleştirilebilir
          ...(android?.notification || {}),
        },
        // Additional Android config options (ttl, restricted_package_name, etc.)
        // Ek Android yapılandırma seçenekleri (ttl, restricted_package_name, vb.)
        ...(android || {}),
      },
      
      // iOS (APNS) specific configuration
      // iOS (APNS) özel yapılandırma
      apns: {
        // APNS headers (apns-expiration, apns-priority, etc.)
        // Admin SDK sets defaults: apns-expiration=30 days, apns-priority=10
        // APNS başlıkları (apns-expiration, apns-priority, vb.)
        // Admin SDK varsayılanları ayarlar: apns-expiration=30 gün, apns-priority=10
        headers: {
          ...(apns?.headers || {}),
        },
        // APNS payload (aps dictionary + custom payload)
        // APNS payload'u (aps sözlüğü + özel payload)
        payload: {
          aps: {
            sound: config.notifications.sound,
            badge: 1,
            // Additional APS options can be merged
            // Ek APS seçenekleri birleştirilebilir
            ...(apns?.payload?.aps || {}),
          },
          // Custom payload data (merged with aps)
          // Özel payload verisi (aps ile birleştirilir)
          ...(apns?.payload || {}),
        },
        // Additional APNS config (fcm_options, live_activity_token, etc.)
        // Ek APNS yapılandırması (fcm_options, live_activity_token, vb.)
        ...(apns || {}),
      },
      
      // WebPush configuration (for web apps)
      // WebPush yapılandırması (web uygulamaları için)
      // Note: Currently not exposed in API, but Admin SDK supports it
      // Not: Şu anda API'de expose edilmedi, ancak Admin SDK destekliyor
      ...(req.body.webpush ? { webpush: req.body.webpush } : {}),
      
      // FCM options (platform-independent features)
      // FCM seçenekleri (platform-bağımsız özellikler)
      // Note: Currently not exposed in API, but Admin SDK supports it
      // Not: Şu anda API'de expose edilmedi, ancak Admin SDK destekliyor
      ...(req.body.fcm_options ? { fcm_options: req.body.fcm_options } : {}),
    };

    // Ensure data values are strings (Firebase requirement)
    // Data değerlerinin string olduğundan emin ol (Firebase gereksinimi)
    if (message.data) {
      message.data = Object.fromEntries(
        Object.entries(message.data).map(([key, value]) => [
          key,
          typeof value === 'object' ? JSON.stringify(value) : String(value)
        ])
      );
    }

    // Set target (token, topic, or condition) - per FCM v1 spec
    // Hedefi ayarla (token, topic veya condition) - FCM v1 spesifikasyonuna göre
    if (token) {
      message.token = token;
    } else if (topic) {
      message.topic = topic;
    } else if (condition) {
      message.condition = condition;
    }

    // Send notification using Firebase Admin SDK
    // Firebase Admin SDK kullanarak bildirim gönder
    const response = await admin.messaging().send(message);
    
    // Update token last used if token was provided
    // Token sağlandıysa token'ın son kullanım zamanını güncelle
    if (token) {
      tokenStorage.updateTokenLastUsed(token);
    }
    
    console.log('✅ Bildirim gönderildi:', response);
    
    res.json({ 
      success: true, 
      messageId: response 
    });
  } catch (error) {
    console.error('❌ Bildirim gönderilirken hata:', error);
    
    // Handle specific Firebase errors
    // Belirli Firebase hatalarını işle
    const errorCode = error.code || '';
    let statusCode = 500;
    let errorMessage = 'Bildirim gönderilemedi';

    if (errorCode === 'messaging/invalid-registration-token') {
      statusCode = 400;
      errorMessage = 'Geçersiz FCM token';
    } else if (errorCode === 'messaging/registration-token-not-registered') {
      statusCode = 400;
      errorMessage = 'FCM token kayıtlı değil';
    } else if (errorCode === 'messaging/invalid-argument') {
      statusCode = 400;
      errorMessage = 'Geçersiz parametre: ' + (error.message || '');
    } else if (errorCode === 'messaging/authentication-error') {
      statusCode = 401;
      errorMessage = 'Firebase kimlik doğrulama hatası';
    } else if (errorCode === 'messaging/server-unavailable') {
      statusCode = 503;
      errorMessage = 'Firebase sunucusu geçici olarak kullanılamıyor';
    } else if (errorCode === 'messaging/internal-error') {
      statusCode = 500;
      errorMessage = 'Firebase iç hatası';
    } else {
      errorMessage = error.message || 'Bildirim gönderilemedi';
    }
    
    res.status(statusCode).json({ 
      success: false,
      error: errorMessage,
      errorCode: errorCode || 'UNKNOWN_ERROR'
    });
  }
});

// Error handling middleware
// Hata işleme middleware'i
app.use((err, req, res, next) => {
  console.error('❌ Beklenmeyen hata:', err);
  res.status(500).json({
    success: false,
    error: 'Sunucu hatası',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
// 404 işleyici
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint bulunamadı',
    path: req.path
  });
});

// Start server
// Sunucuyu başlat
app.listen(config.server.port, config.server.host, () => {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🚀 Firebase Notification Backend Service');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`📍 Port: ${config.server.port}`);
  console.log(`🌐 Host: ${config.server.host}`);
  console.log(`🔧 Environment: ${config.server.environment}`);
  console.log(`🌐 URL: http://localhost:${config.server.port}`);
  console.log(`💚 Health: http://localhost:${config.server.port}/health`);
  console.log(`⚙️  Config: http://localhost:${config.server.port}/config`);
  console.log(`📱 Expo URL: http://localhost:${config.server.port}`);
  console.log(`📝 API: POST http://localhost:${config.server.port}/send-notification`);
  console.log('═══════════════════════════════════════════════════════');
  console.log('✅ Backend servisi hazır!');
  console.log('═══════════════════════════════════════════════════════');
  
  // Print configuration summary
  // Yapılandırma özetini yazdır
  if (config.logging.level === 'debug') {
    console.log('📋 Yapılandırma Özeti:');
    console.log(JSON.stringify(getConfigSummary(), null, 2));
  }
});

// Graceful shutdown
// Zarif kapanış
process.on('SIGTERM', () => {
  console.log('⚠️ SIGTERM sinyali alındı, sunucu kapatılıyor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('⚠️ SIGINT sinyali alındı, sunucu kapatılıyor...');
  process.exit(0);
});

