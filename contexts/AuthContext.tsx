import { GOOGLE_OAUTH_CONFIG, MOE_DOMAIN, STORAGE_KEYS } from '@/config/auth';
import { logLogin, logUserEngagement } from '@/config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';

interface User {
  id: string;
  email: string;
  name: string;
  uuid: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isOffline: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configuration is now imported from config/auth.ts

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  // Check network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  // Generate UUID for user
  const generateUUID = (): string => {
    return Crypto.randomUUID();
  };

  // Validate email domain
  const validateEmailDomain = (email: string): boolean => {
    const domain = email.split('@')[1];
    return domain === MOE_DOMAIN;
  };

  // Show whitelist error
  const showWhitelistError = (email?: string) => {
    // Log domain validation failure
    logUserEngagement('domain_validation_failed', {
      attempted_email: email,
      allowed_domain: MOE_DOMAIN,
      platform: Platform.OS
    });
    
    Alert.alert(
      'Access Denied',
      'Oops you are not whitelisted, please email lee_kah_how@moe.edu.sg if you think this is a mistake',
      [
        {
          text: 'Try Again',
          onPress: () => login(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  // Show offline error
  const showOfflineError = () => {
    Alert.alert(
      'No Internet Connection',
      'Please check your internet connection and try again.',
      [
        {
          text: 'OK',
          style: 'cancel',
        },
      ]
    );
  };

  // Store tokens and user data
  const storeAuthData = async (accessToken: string, refreshToken: string, userData: User) => {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
        [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
        [STORAGE_KEYS.USER_UUID, userData.uuid],
        [STORAGE_KEYS.USER_DATA, JSON.stringify(userData)],
      ]);
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  };

  // Clear stored auth data
  const clearAuthData = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_UUID,
        STORAGE_KEYS.USER_DATA,
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  // Get user info from Google
  const getUserInfo = async (accessToken: string): Promise<User> => {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userInfo = await response.json();
    
    // Validate email domain
    if (!validateEmailDomain(userInfo.email)) {
      throw new Error(`INVALID_DOMAIN:${userInfo.email}`);
    }

    // Generate or retrieve UUID
    const existingUUID = await AsyncStorage.getItem(STORAGE_KEYS.USER_UUID);
    const uuid = existingUUID || generateUUID();

    return {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      uuid,
    };
  };

  // Login function
  const login = async () => {
    console.log('Login function called');
    console.log('OAuth config:', GOOGLE_OAUTH_CONFIG);
    
    if (isOffline) {
      console.log('Offline detected, showing error');
      showOfflineError();
      return;
    }

    try {
      console.log('Starting login process...');
      setIsLoading(true);

      if (Platform.OS === 'web') {
        // Web-specific OAuth flow
        await handleWebOAuth();
      } else {
        // Mobile-specific OAuth flow
        await handleMobileOAuth();
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.message.startsWith('INVALID_DOMAIN')) {
        const email = error.message.split(':')[1];
        showWhitelistError(email);
      } else {
        Alert.alert(
          'Login Failed',
          'An error occurred during login. Please try again.',
          [
            {
              text: 'Try Again',
              onPress: () => login(),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Web-specific OAuth flow
  const handleWebOAuth = async () => {
    // Generate PKCE challenge
    const codeVerifier = AuthSession.AuthRequest.generateRandomCodeVerifier();
    const codeChallenge = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      codeVerifier,
      { encoding: Crypto.CryptoEncoding.BASE64 }
    ).then(result => result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''));

    // Store code verifier for later use
    await AsyncStorage.setItem('code_verifier', codeVerifier);

    // Build OAuth URL
    const params = new URLSearchParams({
      client_id: GOOGLE_OAUTH_CONFIG.CLIENT_ID,
      redirect_uri: GOOGLE_OAUTH_CONFIG.REDIRECT_URI,
      response_type: 'code',
      scope: 'openid profile email',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    
    // Redirect to Google OAuth
    window.location.href = authUrl;
  };

  // Mobile-specific OAuth flow
  const handleMobileOAuth = async () => {
    // Generate PKCE code verifier and challenge using AuthSession utilities
    const codeVerifier = AuthSession.AuthRequest.generateRandomCodeVerifier();
    const codeChallenge = await AuthSession.AuthRequest.generateRandomCodeChallengeAsync(codeVerifier);

    // Store code verifier for later use
    await AsyncStorage.setItem('code_verifier', codeVerifier);

    // Create auth request
    const request = new AuthSession.AuthRequest({
      clientId: GOOGLE_OAUTH_CONFIG.CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: GOOGLE_OAUTH_CONFIG.REDIRECT_URI,
      responseType: AuthSession.ResponseType.Code,
      codeChallenge: codeChallenge,
      codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
    });

    // Start auth session
    const result = await request.promptAsync({
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    });

    if (result.type === 'success' && result.params.code) {
      await handleOAuthCallback(result.params.code);
    } else if (result.type === 'cancel') {
      console.log('Auth cancelled by user');
    }
  };

  // Handle OAuth callback (common for both web and mobile)
  const handleOAuthCallback = async (code: string) => {
    const codeVerifier = await AsyncStorage.getItem('code_verifier');
    
    try {
      // Exchange code for tokens
      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId: GOOGLE_OAUTH_CONFIG.CLIENT_ID,
          clientSecret: GOOGLE_OAUTH_CONFIG.CLIENT_SECRET,
          code: code,
          redirectUri: GOOGLE_OAUTH_CONFIG.REDIRECT_URI,
          extraParams: {
            code_verifier: codeVerifier!,
          },
        },
        {
          tokenEndpoint: 'https://oauth2.googleapis.com/token',
        }
      );

      // Get user info
      const userData = await getUserInfo(tokenResponse.accessToken);
      
      // Store auth data
      await storeAuthData(
        tokenResponse.accessToken,
        tokenResponse.refreshToken!,
        userData
      );

      setUser(userData);
      
      // Log successful login analytics
      logLogin('google_oauth', true, 'moe.edu.sg');
      logUserEngagement('user_login_success', {
        user_id: userData.uuid,
        email_domain: userData.email.split('@')[1],
        platform: Platform.OS
      });
      
      // Clear code verifier
      await AsyncStorage.removeItem('code_verifier');
    } catch (error) {
      // Log failed login analytics
      logLogin('google_oauth', false, 'unknown');
      logUserEngagement('user_login_failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        platform: Platform.OS
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Log logout analytics before clearing data
      if (user) {
        logUserEngagement('user_logout', {
          user_id: user.uuid,
          email_domain: user.email.split('@')[1],
          platform: Platform.OS
        });
      }
      
      await clearAuthData();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Check existing auth on app startup
  const checkAuth = async () => {
    try {
      // Check for OAuth callback on web
      if (Platform.OS === 'web') {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        
        if (code) {
          console.log('OAuth callback detected, processing code...');
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Process the OAuth callback
          await handleOAuthCallback(code);
          return;
        } else if (error) {
          console.error('OAuth error:', error);
          Alert.alert('OAuth Error', `Authentication failed: ${error}`);
          return;
        }
      }

      const [accessToken, userDataString] = await AsyncStorage.multiGet([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);

      if (accessToken[1] && userDataString[1]) {
        const userData = JSON.parse(userDataString[1]);
        
        // Validate token (you might want to add token validation here)
        setUser(userData);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isOffline,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 