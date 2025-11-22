/**
 * Simple Token Storage
 * Basit Token Depolama
 * 
 * Stores FCM tokens in memory and optionally persists to file
 * FCM token'larını bellekte saklar ve isteğe bağlı olarak dosyaya kaydeder
 */

const fs = require('fs');
const path = require('path');

const STORAGE_FILE = path.join(__dirname, 'tokens.json');

// In-memory storage
// Bellekte depolama
// Token data structure: { id, token, deviceInfo?, createdAt, lastUsed?, metadata? }
let tokens = [];

/**
 * Load tokens from file
 * Token'ları dosyadan yükle
 */
function loadTokens() {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf8');
      tokens = JSON.parse(data);
      console.log(`✅ ${tokens.length} token yüklendi`);
    } else {
      tokens = [];
      console.log('📝 Yeni token depolama dosyası oluşturulacak');
    }
  } catch (error) {
    console.error('❌ Tokenlar yüklenirken hata:', error.message);
    tokens = [];
  }
}

/**
 * Save tokens to file
 * Token'ları dosyaya kaydet
 */
function saveTokens() {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(tokens, null, 2), 'utf8');
  } catch (error) {
    console.error('❌ Tokenlar kaydedilirken hata:', error.message);
  }
}

/**
 * Generate unique ID
 * Benzersiz ID oluştur
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Add or update token
 * Token ekle veya güncelle
 */
function addToken(token, deviceInfo, metadata) {
  // Check if token already exists
  // Token'ın zaten var olup olmadığını kontrol et
  const existingIndex = tokens.findIndex(t => t.token === token);
  
  const tokenData = {
    id: existingIndex >= 0 ? tokens[existingIndex].id : generateId(),
    token,
    deviceInfo,
    createdAt: existingIndex >= 0 ? tokens[existingIndex].createdAt : new Date().toISOString(),
    lastUsed: new Date().toISOString(),
    metadata,
  };

  if (existingIndex >= 0) {
    // Update existing token
    // Mevcut token'ı güncelle
    tokens[existingIndex] = tokenData;
  } else {
    // Add new token
    // Yeni token ekle
    tokens.push(tokenData);
  }

  saveTokens();
  return tokenData;
}

/**
 * Get all tokens
 * Tüm token'ları al
 */
function getAllTokens() {
  return tokens;
}

/**
 * Get token by ID
 * ID'ye göre token al
 */
function getTokenById(id) {
  return tokens.find(t => t.id === id);
}

/**
 * Get token by token string
 * Token string'ine göre token al
 */
function getTokenByToken(token) {
  return tokens.find(t => t.token === token);
}

/**
 * Delete token by ID
 * ID'ye göre token sil
 */
function deleteTokenById(id) {
  const index = tokens.findIndex(t => t.id === id);
  if (index >= 0) {
    tokens.splice(index, 1);
    saveTokens();
    return true;
  }
  return false;
}

/**
 * Delete token by token string
 * Token string'ine göre token sil
 */
function deleteTokenByToken(token) {
  const index = tokens.findIndex(t => t.token === token);
  if (index >= 0) {
    tokens.splice(index, 1);
    saveTokens();
    return true;
  }
  return false;
}

/**
 * Update token last used timestamp
 * Token'ın son kullanım zamanını güncelle
 */
function updateTokenLastUsed(token) {
  const tokenData = getTokenByToken(token);
  if (tokenData) {
    tokenData.lastUsed = new Date().toISOString();
    saveTokens();
  }
}

/**
 * Get token count
 * Token sayısını al
 */
function getTokenCount() {
  return tokens.length;
}

// Initialize: Load tokens on startup
// Başlatma: Başlangıçta token'ları yükle
loadTokens();

module.exports = {
  addToken,
  getAllTokens,
  getTokenById,
  getTokenByToken,
  deleteTokenById,
  deleteTokenByToken,
  updateTokenLastUsed,
  getTokenCount,
};

