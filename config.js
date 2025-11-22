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
    // Resolve to absolute path for better compatibility
    // Daha iyi uyumluluk için mutlak yola çözümle
    serviceAccountPath: process.env.SERVICE_ACCOUNT_PATH ? 
      (path.isAbsolute(process.env.SERVICE_ACCOUNT_PATH) ? 
        process.env.SERVICE_ACCOUNT_PATH : 
        path.resolve(process.cwd(), process.env.SERVICE_ACCOUNT_PATH)) :
      path.resolve(__dirname, '../config/secrets/veratoptan-c4d30-firebase-adminsdk-fbsvc-4f7165d9f5.json'),
    
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

  // Validate service account (either JSON env var or file path)
  // Servis hesabını doğrula (JSON env var veya dosya yolu)
  const fs = require('fs');
  
  // Check if SERVICE_ACCOUNT_JSON is set (for production)
  // SERVICE_ACCOUNT_JSON'un ayarlı olup olmadığını kontrol et (production için)
  if (process.env.SERVICE_ACCOUNT_JSON) {
    try {
      // Try to parse as JSON (either direct or base64 encoded)
      // JSON olarak parse etmeyi dene (direkt veya base64 kodlanmış)
      const jsonString = process.env.SERVICE_ACCOUNT_JSON;
      let parsedJson;
      
      try {
        // Try base64 decode first
        // Önce base64 decode dene
        const decoded = Buffer.from(jsonString, 'base64').toString('utf-8');
        parsedJson = JSON.parse(decoded);
      } catch (base64Error) {
        // If base64 fails, try direct JSON parse
        // Base64 başarısız olursa, direkt JSON parse dene
        parsedJson = JSON.parse(jsonString);
      }
      
      // Validate required fields
      // Gerekli alanları doğrula
      if (!parsedJson.type || parsedJson.type !== 'service_account') {
        errors.push('SERVICE_ACCOUNT_JSON must have type: "service_account"');
      }
      if (!parsedJson.project_id) {
        errors.push('SERVICE_ACCOUNT_JSON must have project_id');
      }
      if (!parsedJson.private_key) {
        errors.push('SERVICE_ACCOUNT_JSON must have private_key');
      }
    } catch (jsonError) {
      errors.push(`SERVICE_ACCOUNT_JSON is invalid JSON: ${jsonError.message}`);
      errors.push(`💡 Tip: SERVICE_ACCOUNT_JSON must be valid JSON string or base64 encoded JSON`);
    }
  } else {
    // Fallback to file path validation (for local development)
    // Dosya yolu doğrulamasına yedekle (yerel geliştirme için)
    const serviceAccountPath = config.firebase.serviceAccountPath;
    if (!fs.existsSync(serviceAccountPath)) {
      errors.push(`Service account file not found: ${serviceAccountPath}`);
      errors.push(`Current working directory: ${process.cwd()}`);
      errors.push(`Config file directory: ${__dirname}`);
      errors.push(`Resolved path: ${path.resolve(serviceAccountPath)}`);
      errors.push(``);
      errors.push(`💡 PRODUCTION ÇÖZÜMÜ / PRODUCTION SOLUTION:`);
      errors.push(`💡 Fly.io için: https://fly.io/apps/veratoptan-push-backend/secrets`);
      errors.push(`💡 1. "New Secret" butonuna tıklayın`);
      errors.push(`💡 2. Key: SERVICE_ACCOUNT_JSON`);
      errors.push(`💡 3. Value: Base64 encoded JSON (backend/setup-fly-secrets.sh script'i ile oluşturun)`);
      errors.push(``);
      errors.push(`💡 VEYA CLI ile / OR via CLI:`);
      errors.push(`💡 cd backend && ./setup-fly-secrets.sh`);
      errors.push(``);
      errors.push(`💡 Detaylı talimatlar: backend/FLY_IO_SETUP.md`);
    }
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

