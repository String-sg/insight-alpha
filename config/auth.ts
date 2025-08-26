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
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? undefined,
  CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? undefined,
  REDIRECT_URI: 'http://localhost:8081/',
};

// Debug config

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