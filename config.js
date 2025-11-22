/**
 * Backend Configuration
 * Backend Yapılandırması
 * 
 * Centralized configuration management for the backend service
 * Backend servisi için merkezi yapılandırma yönetimi
 */

const path = require('path');
require('dotenv').config();

/**
 * Get configuration with environment variable fallbacks
 * Ortam değişkeni yedeklemeleriyle yapılandırmayı al
 */
const config = {
  // Server Configuration
  // Sunucu Yapılandırması
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
    environment: process.env.NODE_ENV || 'development',
  },

  // Firebase Configuration
  // Firebase Yapılandırması
  firebase: {
    // Service account file path
    // Servis hesabı dosya yolu
    serviceAccountPath: process.env.SERVICE_ACCOUNT_PATH || 
      path.join(__dirname, '../config/secrets/veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json'),
    
    // Project ID (optional, can be read from service account)
    // Proje ID (opsiyonel, servis hesabından okunabilir)
    projectId: process.env.FIREBASE_PROJECT_ID || 'veratoptan-c4d30',
    
    // Project Number / GCM Sender ID
    // Proje Numarası / GCM Gönderen ID
    // This is used for FCM messaging and is required for some operations
    // FCM mesajlaşma için kullanılır ve bazı işlemler için gereklidir
    projectNumber: process.env.FIREBASE_PROJECT_NUMBER || '989392397922',
  },

  // CORS Configuration
  // CORS Yapılandırması
  cors: {
    // Allowed origins (comma-separated or '*' for all)
    // İzin verilen origin'ler (virgülle ayrılmış veya '*' tümü için)
    origins: process.env.CORS_ORIGINS ? 
      process.env.CORS_ORIGINS.split(',').map(origin => origin.trim()) : 
      '*',
    
    // Enable credentials
    // Kimlik bilgilerini etkinleştir
    credentials: process.env.CORS_CREDENTIALS !== 'false',
  },

  // Logging Configuration
  // Loglama Yapılandırması
  logging: {
    // Enable request logging
    // İstek loglamayı etkinleştir
    requests: process.env.LOG_REQUESTS !== 'false',
    
    // Log level (debug, info, warn, error)
    // Log seviyesi (debug, info, warn, error)
    level: process.env.LOG_LEVEL || 'info',
  },

  // Notification Defaults
  // Bildirim Varsayılanları
  notifications: {
    // Default Android channel ID
    // Varsayılan Android kanal ID
    androidChannelId: process.env.ANDROID_CHANNEL_ID || 'new-products',
    
    // Default notification sound
    // Varsayılan bildirim sesi
    sound: process.env.NOTIFICATION_SOUND || 'notification.mp3',
    
    // Default priority
    // Varsayılan öncelik
    priority: process.env.NOTIFICATION_PRIORITY || 'high',
  },

  // Security Configuration
  // Güvenlik Yapılandırması
  security: {
    // Request size limit (in MB)
    // İstek boyutu limiti (MB cinsinden)
    maxRequestSize: parseInt(process.env.MAX_REQUEST_SIZE || '10', 10),
    
    // Rate limiting (requests per minute per IP)
    // Hız sınırlama (IP başına dakikada istek sayısı)
    rateLimit: parseInt(process.env.RATE_LIMIT || '60', 10),
  },

  // Default FCM Tokens (hardcoded for testing/development)
  // Varsayılan FCM Token'ları (test/geliştirme için hardcode edilmiş)
  tokens: {
    // Load tokens from environment variable (comma-separated) or use defaults
    // Ortam değişkeninden token'ları yükle (virgülle ayrılmış) veya varsayılanları kullan
    defaultTokens: process.env.DEFAULT_FCM_TOKENS ? 
      process.env.DEFAULT_FCM_TOKENS.split(',').map(t => t.trim()).filter(t => t.length > 0) : 
      [
        // Add your default FCM tokens here
        // Varsayılan FCM token'larınızı buraya ekleyin
        // Example: 'YOUR_FCM_TOKEN_1',
        // Example: 'YOUR_FCM_TOKEN_2',
      ],
    
    // Auto-load tokens on startup
    // Başlangıçta token'ları otomatik yükle
    autoLoad: process.env.AUTO_LOAD_TOKENS !== 'false',
    
    // Default device info for hardcoded tokens
    // Hardcode edilmiş token'lar için varsayılan cihaz bilgisi
    defaultDeviceInfo: {
      platform: process.env.DEFAULT_DEVICE_PLATFORM || 'unknown',
      appVersion: process.env.DEFAULT_APP_VERSION || '1.0.0',
      source: 'hardcoded',
    },
  },
};

/**
 * Validate configuration
 * Yapılandırmayı doğrula
 */
function validateConfig() {
  const errors = [];

  // Validate port
  // Port'u doğrula
  if (config.server.port < 1 || config.server.port > 65535) {
    errors.push('Port must be between 1 and 65535');
  }

  // Validate service account path
  // Servis hesabı yolunu doğrula
  const fs = require('fs');
  if (!fs.existsSync(config.firebase.serviceAccountPath)) {
    errors.push(`Service account file not found: ${config.firebase.serviceAccountPath}`);
  }

  // Validate CORS origins
  // CORS origin'lerini doğrula
  if (config.cors.origins !== '*' && !Array.isArray(config.cors.origins)) {
    errors.push('CORS_ORIGINS must be a comma-separated list or "*"');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get configuration summary (without sensitive data)
 * Yapılandırma özetini al (hassas veriler olmadan)
 */
function getConfigSummary() {
  return {
    server: {
      port: config.server.port,
      host: config.server.host,
      environment: config.server.environment,
    },
    firebase: {
      projectId: config.firebase.projectId,
      projectNumber: config.firebase.projectNumber,
      serviceAccountPath: config.firebase.serviceAccountPath,
      serviceAccountExists: require('fs').existsSync(config.firebase.serviceAccountPath),
    },
    cors: {
      origins: config.cors.origins === '*' ? '*' : config.cors.origins.length + ' origins',
      credentials: config.cors.credentials,
    },
    logging: {
      requests: config.logging.requests,
      level: config.logging.level,
    },
    notifications: {
      androidChannelId: config.notifications.androidChannelId,
      sound: config.notifications.sound,
      priority: config.notifications.priority,
    },
    tokens: {
      autoLoad: config.tokens.autoLoad,
      defaultTokensCount: config.tokens.defaultTokens.length,
      // Don't expose actual tokens in summary
      // Özet'te gerçek token'ları açığa çıkarma
    },
  };
}

module.exports = {
  config,
  validateConfig,
  getConfigSummary,
};

