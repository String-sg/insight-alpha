# Google OAuth Setup Guide

This guide will walk you through setting up Google OAuth for the MOE Onward app.

## Prerequisites

- Google Cloud Console access
- Expo development environment
- Your Expo username

## Step 1: Google Cloud Console Setup

### 1.1 Create a New Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name: `moe-onward-app`
4. Click "Create"

### 1.2 Enable Google+ API
1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google+ API" or "Google Identity"
3. Click "Enable"

### 1.3 Configure OAuth Consent Screen
1. Go to "APIs & Services" → "OAuth consent screen"
2. **User Type**: External
3. **App name**: "MOE Onward"
4. **User support email**: Your email
5. **Developer contact information**: Your email
6. **Scopes**: Add `email` and `profile`

### 1.4 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. **Application type**: Web application
4. **Name**: "MOE Onward Web Client"
5. **Authorized JavaScript origins**:
   - `https://auth.expo.io`
6. **Authorized redirect URIs**:
   - `https://auth.expo.io/@YOUR_EXPO_USERNAME/moe-onward-app`
   - Replace `YOUR_EXPO_USERNAME` with your actual Expo username

### 1.5 Get Your Credentials
- Copy the **Client ID** and **Client Secret**
- Keep these secure and don't commit them to version control

## Step 2: Configure Environment Variables

### 2.1 Set Up Environment File
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and replace the placeholder values:
   ```bash
   # Your Google Cloud Console OAuth 2.0 Client ID
   GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
   
   # Your Google Cloud Console OAuth 2.0 Client Secret
   GOOGLE_CLIENT_SECRET=your-actual-client-secret
   
   # Your Expo username (used in redirect URI)
   EXPO_USERNAME=your-expo-username
   ```

### 2.2 Configuration Details
The `config/auth.ts` file automatically reads these environment variables. The configuration includes:
- **CLIENT_ID**: Your Google OAuth 2.0 Client ID
- **CLIENT_SECRET**: Your Google OAuth 2.0 Client Secret  
- **REDIRECT_URI**: Automatically generated using your Expo username
- **Security**: The `.env` file is gitignored to keep credentials secure

## Step 3: Testing

### 3.1 Run Tests
```bash
npm test
```

### 3.2 Manual Testing
1. Start the development server: `npm start`
2. Open the app on your device/simulator
3. Try logging in with:
   - ✅ Valid MOE email (@moe.edu.sg)
   - ❌ Non-MOE email (should show whitelist error)
   - ❌ Offline state (should show offline message)

## Step 4: Production Setup

### 4.1 Create Production OAuth Credentials
1. In Google Cloud Console, create separate OAuth credentials for production
2. **Application type**: Android and iOS (separate credentials for each)
3. **Package name**: Your app's package name
4. **SHA-1 certificate fingerprint**: Your app's signing certificate

### 4.2 Update Production Configuration
Update the configuration for production builds with the appropriate credentials.

## Features Implemented

### ✅ Authentication Flow
- Google OAuth integration
- Domain validation (@moe.edu.sg only)
- Token storage and management
- Session persistence (7 days)

### ✅ Error Handling
- Non-MOE email rejection with helpful error message
- Network connectivity detection
- Offline state handling
- User cancellation handling

### ✅ Security
- PKCE (Proof Key for Code Exchange)
- Secure token storage
- Domain whitelisting
- UUID generation for analytics

### ✅ User Experience
- Loading states
- Offline detection
- Retry mechanisms
- Protected routes

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Check that your redirect URI matches exactly
   - Ensure your Expo username is correct

2. **"Access denied" for valid MOE emails**
   - Verify the email domain validation logic
   - Check that the user's email is exactly @moe.edu.sg

3. **OAuth flow not starting**
   - Check network connectivity
   - Verify Google Cloud Console configuration
   - Ensure all required APIs are enabled

### Debug Mode
Enable debug logging by adding console.log statements in the AuthContext:

```typescript
console.log('OAuth config:', GOOGLE_OAUTH_CONFIG);
console.log('User info:', userInfo);
```

## Security Notes

- Never commit OAuth credentials to version control
- Use environment variables for production
- Regularly rotate client secrets
- Monitor OAuth usage in Google Cloud Console
- Implement rate limiting for production use

## Next Steps

1. **Analytics Integration**: Connect the UUID system to analytics
2. **Token Refresh**: Implement automatic token refresh
3. **User Preferences**: Store user preferences using the UUID
4. **Admin Panel**: Create admin interface for user management 