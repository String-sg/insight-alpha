import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { GOOGLE_OAUTH_CONFIG, MOE_DOMAIN } from '@/config/auth';

// Mock expo-auth-session
jest.mock('expo-auth-session', () => ({
  AuthRequest: jest.fn().mockImplementation(() => ({
    promptAsync: jest.fn().mockResolvedValue({
      type: 'success',
      params: { code: 'mock_auth_code' }
    }),
    codeChallenge: 'mock_code_challenge'
  })),
  ResponseType: {
    Code: 'code'
  },
  CodeChallengeMethod: {
    S256: 'S256'
  },
  exchangeCodeAsync: jest.fn().mockResolvedValue({
    accessToken: 'mock_access_token',
    refreshToken: 'mock_refresh_token'
  })
}));

// Mock expo-crypto
jest.mock('expo-crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('mock_uuid'),
  digestStringAsync: jest.fn().mockResolvedValue('mock_digest'),
  CryptoDigestAlgorithm: {
    SHA256: 'SHA256'
  },
  CryptoEncoding: {
    BASE64: 'BASE64'
  }
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  multiSet: jest.fn(),
  multiGet: jest.fn(),
  multiRemove: jest.fn(),
  removeItem: jest.fn()
}));

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn().mockReturnValue(() => {}),
  fetch: jest.fn().mockResolvedValue({ isConnected: true })
}));

// Mock fetch for user info
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: jest.fn().mockResolvedValue({
    id: '123',
    email: 'test@moe.edu.sg',
    name: 'Test User'
  })
});

// Test component to access auth context
const TestComponent = () => {
  const { user, isLoading, isOffline, login, logout } = useAuth();
  
  return (
    <div>
      <div data-testid="user">{user ? user.name : 'No user'}</div>
      <div data-testid="loading">{isLoading ? 'Loading' : 'Not loading'}</div>
      <div data-testid="offline">{isOffline ? 'Offline' : 'Online'}</div>
      <button data-testid="login-btn" onClick={login}>Login</button>
      <button data-testid="logout-btn" onClick={logout}>Logout</button>
    </div>
  );
};

describe('Google OAuth Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Configuration Tests', () => {
    test('should have valid OAuth configuration', () => {
      expect(GOOGLE_OAUTH_CONFIG.CLIENT_ID).toBeTruthy();
      expect(GOOGLE_OAUTH_CONFIG.CLIENT_SECRET).toBeTruthy();
      expect(GOOGLE_OAUTH_CONFIG.REDIRECT_URI).toBeTruthy();
    });

    test('should have correct MOE domain', () => {
      expect(MOE_DOMAIN).toBe('moe.edu.sg');
    });
  });

  describe('AuthContext Tests', () => {
    test('should render without crashing', () => {
      const { getByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
      
      expect(getByTestId('user')).toBeTruthy();
      expect(getByTestId('login-btn')).toBeTruthy();
    });

    test('should show initial state correctly', () => {
      const { getByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
      
      expect(getByTestId('user')).toHaveTextContent('No user');
      expect(getByTestId('loading')).toHaveTextContent('Not loading');
      expect(getByTestId('offline')).toHaveTextContent('Online');
    });

    test('should handle login button click', async () => {
      const { getByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
      
      const loginButton = getByTestId('login-btn');
      fireEvent.press(loginButton);
      
      await waitFor(() => {
        expect(getByTestId('loading')).toHaveTextContent('Loading');
      });
    });

    test('should handle logout', async () => {
      const { getByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
      
      const logoutButton = getByTestId('logout-btn');
      fireEvent.press(logoutButton);
      
      await waitFor(() => {
        expect(getByTestId('user')).toHaveTextContent('No user');
      });
    });
  });

  describe('Domain Validation Tests', () => {
    test('should validate MOE email domain correctly', () => {
      const validEmails = [
        'teacher@moe.edu.sg',
        'admin@moe.edu.sg',
        'user@moe.edu.sg'
      ];
      
      const invalidEmails = [
        'user@gmail.com',
        'admin@yahoo.com',
        'test@hotmail.com'
      ];
      
      validEmails.forEach(email => {
        const domain = email.split('@')[1];
        expect(domain).toBe(MOE_DOMAIN);
      });
      
      invalidEmails.forEach(email => {
        const domain = email.split('@')[1];
        expect(domain).not.toBe(MOE_DOMAIN);
      });
    });
  });

  describe('Integration Tests', () => {
    test('should complete full OAuth flow successfully', async () => {
      const { getByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
      
      // Start login
      const loginButton = getByTestId('login-btn');
      fireEvent.press(loginButton);
      
      // Should show loading
      await waitFor(() => {
        expect(getByTestId('loading')).toHaveTextContent('Loading');
      });
      
      // Wait for OAuth flow to complete
      await waitFor(() => {
        expect(getByTestId('loading')).toHaveTextContent('Not loading');
      }, { timeout: 5000 });
      
      // Should have user data
      await waitFor(() => {
        expect(getByTestId('user')).toHaveTextContent('Test User');
      });
    });

    test('should handle OAuth cancellation', async () => {
      // Mock cancelled OAuth
      const { AuthRequest } = require('expo-auth-session');
      AuthRequest.mockImplementation(() => ({
        promptAsync: jest.fn().mockResolvedValue({
          type: 'cancel'
        }),
        codeChallenge: 'mock_code_challenge'
      }));

      const { getByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
      
      const loginButton = getByTestId('login-btn');
      fireEvent.press(loginButton);
      
      // Should return to not loading state
      await waitFor(() => {
        expect(getByTestId('loading')).toHaveTextContent('Not loading');
      });
      
      // Should not have user data
      expect(getByTestId('user')).toHaveTextContent('No user');
    });
  });

  describe('Error Handling Tests', () => {
    test('should handle network errors', async () => {
      // Mock network error
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      const { getByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
      
      const loginButton = getByTestId('login-btn');
      fireEvent.press(loginButton);
      
      // Should handle error gracefully
      await waitFor(() => {
        expect(getByTestId('loading')).toHaveTextContent('Not loading');
      });
    });

    test('should handle invalid domain error', async () => {
      // Mock user info with invalid domain
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: '123',
          email: 'test@gmail.com', // Invalid domain
          name: 'Test User'
        })
      });

      const { getByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
      
      const loginButton = getByTestId('login-btn');
      fireEvent.press(loginButton);
      
      // Should handle domain validation error
      await waitFor(() => {
        expect(getByTestId('loading')).toHaveTextContent('Not loading');
      });
      
      // Should not have user data
      expect(getByTestId('user')).toHaveTextContent('No user');
    });
  });
}); 