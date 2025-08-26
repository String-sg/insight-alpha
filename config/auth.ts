// Google OAuth Configuration
// Replace these with your actual credentials from Google Cloud Console

export const GOOGLE_OAUTH_CONFIG = {
  CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual client ID
  CLIENT_SECRET: 'YOUR_GOOGLE_CLIENT_SECRET', // Replace with your actual client secret
  REDIRECT_URI: 'https://auth.expo.io/@your-expo-username/moe-onward-app', // Replace with your actual redirect URI
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