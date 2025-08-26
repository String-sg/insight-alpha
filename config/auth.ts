// Google OAuth Configuration
// Replace these with your actual credentials from Google Cloud Console

// Environment variables are loaded by Expo automatically
// Make sure to restart the development server after changing .env

const EXPO_USERNAME = process.env.EXPO_USERNAME || 'kahhow';

export const GOOGLE_OAUTH_CONFIG = {
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '976215026609-koq4ev5ppenqk34864qjg3evts2393ko.apps.googleusercontent.com',
  CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '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',
  REDIRECT_URI: `https://auth.expo.io/@${EXPO_USERNAME}/moe-onward-app`,
};

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