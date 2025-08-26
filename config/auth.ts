// Load environment variables only in Node.js environment
if (typeof window === 'undefined') {
  require('dotenv/config');
}

// Google OAuth Configuration
// Replace these with your actual credentials from Google Cloud Console

// Environment variables are loaded by dotenv (server-side) or Expo (client-side)
// Make sure to restart the development server after changing .env

const EXPO_USERNAME = process.env.EXPO_USERNAME || 'kahhow';
const PROJECT_SLUG = process.env.EXPO_PROJECT_SLUG || 'your-project-slug';

// Production fallback - remove once env vars are working
const PROD_CLIENT_ID = '976215026609-koq4ev5ppenqk34864qjg3evts2393ko.apps.googleusercontent.com';
const PROD_CLIENT_SECRET = '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';

// Debug environment variables
console.log('Environment check:', {
  NODE_ENV: process.env.NODE_ENV,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET',
  isBrowser: typeof window !== 'undefined'
});

export const GOOGLE_OAUTH_CONFIG = {
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID || PROD_CLIENT_ID, // Always use fallback for now
  CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || PROD_CLIENT_SECRET, // Always use fallback for now
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