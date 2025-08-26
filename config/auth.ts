// Google OAuth Configuration
// Replace these with your actual credentials from Google Cloud Console

// Environment variables are loaded by Expo automatically
// Make sure to restart the development server after changing .env

const EXPO_USERNAME = process.env.EXPO_USERNAME || 'kahhow';
const PROJECT_SLUG = process.env.EXPO_PROJECT_SLUG || 'your-project-slug';

// Debug environment variables
console.log('Environment variables check:');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET');

export const GOOGLE_OAUTH_CONFIG = {
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  REDIRECT_URI: process.env.NODE_ENV === 'production' 
    ? 'https://insight.string.sg/' // Your production domain
    : 'http://localhost:8081/',
};

// Debug config
console.log('OAuth Config:', {
  CLIENT_ID: GOOGLE_OAUTH_CONFIG.CLIENT_ID ? 'SET' : 'NOT SET',
  CLIENT_SECRET: GOOGLE_OAUTH_CONFIG.CLIENT_SECRET ? 'SET' : 'NOT SET',
  REDIRECT_URI: GOOGLE_OAUTH_CONFIG.REDIRECT_URI
});

// Domain validation
export const MOE_DOMAIN = 'moe.edu.sg';

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER_UUID: 'auth_user_uuid',
  USER_DATA: 'auth_user_data',
} as const;

// Session configuration
export const SESSION_CONFIG = {
  TOKEN_EXPIRY_DAYS: 7,
  AUTO_REFRESH: true,
} as const; 