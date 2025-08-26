// Test script to verify environment configuration
// Note: This script only works in Node.js environment, not in Expo/React Native

console.log('Testing environment configuration...');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '***SET***' : 'NOT SET');
console.log('EXPO_USERNAME:', process.env.EXPO_USERNAME);

// Test the auth config
const { GOOGLE_OAUTH_CONFIG } = require('../config/auth.js');

console.log('\nOAuth Configuration:');
console.log('CLIENT_ID:', GOOGLE_OAUTH_CONFIG.CLIENT_ID);
console.log('CLIENT_SECRET:', GOOGLE_OAUTH_CONFIG.CLIENT_SECRET ? '***SET***' : 'NOT SET');
console.log('REDIRECT_URI:', GOOGLE_OAUTH_CONFIG.REDIRECT_URI);

console.log('\nConfiguration status:');
if (GOOGLE_OAUTH_CONFIG.CLIENT_ID && GOOGLE_OAUTH_CONFIG.CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID') {
  console.log('✅ CLIENT_ID is configured');
} else {
  console.log('❌ CLIENT_ID needs to be configured');
}

if (GOOGLE_OAUTH_CONFIG.CLIENT_SECRET && GOOGLE_OAUTH_CONFIG.CLIENT_SECRET !== 'YOUR_GOOGLE_CLIENT_SECRET') {
  console.log('✅ CLIENT_SECRET is configured');
} else {
  console.log('❌ CLIENT_SECRET needs to be configured');
}

if (GOOGLE_OAUTH_CONFIG.REDIRECT_URI && !GOOGLE_OAUTH_CONFIG.REDIRECT_URI.includes('your-expo-username')) {
  console.log('✅ REDIRECT_URI is configured');
} else {
  console.log('❌ REDIRECT_URI needs to be configured');
} 