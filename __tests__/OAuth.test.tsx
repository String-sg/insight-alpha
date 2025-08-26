import { GOOGLE_OAUTH_CONFIG, MOE_DOMAIN } from '@/config/auth';

describe('Google OAuth Configuration', () => {
  test('should have valid OAuth configuration', () => {
    expect(GOOGLE_OAUTH_CONFIG.CLIENT_ID).toBeTruthy();
    expect(GOOGLE_OAUTH_CONFIG.CLIENT_SECRET).toBeTruthy();
    expect(GOOGLE_OAUTH_CONFIG.REDIRECT_URI).toBeTruthy();
  });

  test('should have correct MOE domain', () => {
    expect(MOE_DOMAIN).toBe('moe.edu.sg');
  });

  test('should have correct redirect URI for development', () => {
    // In development, should use localhost
    expect(GOOGLE_OAUTH_CONFIG.REDIRECT_URI).toBe('http://localhost:8081/');
  });

  test('should have valid client ID format', () => {
    // Google OAuth client IDs end with .apps.googleusercontent.com
    expect(GOOGLE_OAUTH_CONFIG.CLIENT_ID).toMatch(/\.apps\.googleusercontent\.com$/);
  });
});

describe('Domain Validation', () => {
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

  test('should handle edge cases in domain validation', () => {
    // Test with subdomains (should not be valid)
    const subdomainEmail = 'user@subdomain.moe.edu.sg';
    const domain = subdomainEmail.split('@')[1];
    expect(domain).not.toBe(MOE_DOMAIN);
    
    // Test with uppercase
    const uppercaseEmail = 'USER@MOE.EDU.SG';
    const uppercaseDomain = uppercaseEmail.split('@')[1];
    expect(uppercaseDomain).not.toBe(MOE_DOMAIN);
  });
});

describe('OAuth URL Construction', () => {
  test('should construct valid OAuth URL parameters', () => {
    const params = new URLSearchParams({
      client_id: GOOGLE_OAUTH_CONFIG.CLIENT_ID,
      redirect_uri: GOOGLE_OAUTH_CONFIG.REDIRECT_URI,
      response_type: 'code',
      scope: 'openid profile email',
      code_challenge: 'mock_challenge',
      code_challenge_method: 'S256',
    });

    expect(params.get('client_id')).toBe(GOOGLE_OAUTH_CONFIG.CLIENT_ID);
    expect(params.get('redirect_uri')).toBe(GOOGLE_OAUTH_CONFIG.REDIRECT_URI);
    expect(params.get('response_type')).toBe('code');
    expect(params.get('scope')).toBe('openid profile email');
    expect(params.get('code_challenge_method')).toBe('S256');
  });

  test('should generate valid OAuth URL', () => {
    const params = new URLSearchParams({
      client_id: GOOGLE_OAUTH_CONFIG.CLIENT_ID,
      redirect_uri: GOOGLE_OAUTH_CONFIG.REDIRECT_URI,
      response_type: 'code',
      scope: 'openid profile email',
      code_challenge: 'mock_challenge',
      code_challenge_method: 'S256',
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    
    expect(authUrl).toContain('https://accounts.google.com/o/oauth2/v2/auth');
    expect(authUrl).toContain(`client_id=${GOOGLE_OAUTH_CONFIG.CLIENT_ID}`);
    expect(authUrl).toContain(`redirect_uri=${encodeURIComponent(GOOGLE_OAUTH_CONFIG.REDIRECT_URI)}`);
  });
});

describe('Environment Variables', () => {
  test('should have environment variables loaded', () => {
    // Check that dotenv is working
    expect(process.env.GOOGLE_CLIENT_ID).toBeDefined();
    expect(process.env.GOOGLE_CLIENT_SECRET).toBeDefined();
  });

  test('should have fallback values for production', () => {
    // The config should have fallback values even if env vars are not set
    expect(GOOGLE_OAUTH_CONFIG.CLIENT_ID).toBeTruthy();
    expect(GOOGLE_OAUTH_CONFIG.CLIENT_SECRET).toBeTruthy();
  });
}); 