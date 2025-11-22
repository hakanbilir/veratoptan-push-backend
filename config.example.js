/**
 * Backend Configuration Example
 * Backend Yapılandırma Örneği
 * 
 * Bu dosya, config.js için bir örnek yapılandırmadır.
 * Token'ları hardcode etmek için bu dosyayı referans alabilirsiniz.
 * 
 * This file is an example configuration for config.js.
 * You can use this file as a reference for hardcoding tokens.
 */

// Hardcode edilmiş token'ları buraya ekleyin
// Add your hardcoded tokens here
const HARDCODED_TOKENS = [
  // Örnek token'lar (kendi token'larınızı ekleyin)
  // Example tokens (add your own tokens)
  // 'YOUR_FCM_TOKEN_1',
  // 'YOUR_FCM_TOKEN_2',
  // 'YOUR_FCM_TOKEN_3',
];

// config.js'de tokens bölümünü şu şekilde güncelleyin:
// Update the tokens section in config.js as follows:
/*
tokens: {
  defaultTokens: HARDCODED_TOKENS, // veya doğrudan array: ['token1', 'token2']
  autoLoad: true,
  defaultDeviceInfo: {
    platform: 'ios', // veya 'android'
    appVersion: '1.0.0',
    source: 'hardcoded',
  },
}
*/

// Veya environment variable kullanın:
// Or use environment variable:
/*
# .env
DEFAULT_FCM_TOKENS=token1,token2,token3
AUTO_LOAD_TOKENS=true
DEFAULT_DEVICE_PLATFORM=ios
DEFAULT_APP_VERSION=1.0.0
*/

module.exports = {
  HARDCODED_TOKENS,
};

