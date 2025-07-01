# PWA Setup for MOE Onward

This document explains the Progressive Web App (PWA) setup for the MOE Onward podcast app.

## PWA Requirements ✓

The app now meets all PWA requirements:

1. **HTTPS** - Required for deployment (Vercel provides this automatically)
2. **Web App Manifest** - `/public/manifest.json` with app metadata and icons
3. **Service Worker** - `/public/service-worker.js` for offline functionality
4. **Responsive Design** - Already implemented with NativeWind
5. **App Icons** - Multiple sizes for different devices

## Files Created

### 1. `/public/manifest.json`
- Defines app name, colors, display mode
- Specifies app icons
- Sets start URL and orientation

### 2. `/public/service-worker.js`
- Enables offline caching
- Caches app shell and assets
- Provides offline fallback

### 3. `/public/index.html`
- Custom HTML template with PWA meta tags
- Service worker registration
- Apple-specific PWA tags

### 4. Icon Files
- `icon-192x192.png` - Standard PWA icon
- `icon-512x512.png` - High-res PWA icon
- `apple-touch-icon.png` - iOS home screen icon
- `favicon.ico` - Browser tab icon

## Build Process

### Local Build
```bash
npm run build:web
# or
npm run build:pwa
```

### Vercel Deployment
The `vercel.json` is configured to:
1. Build the Expo web app
2. Copy PWA files to dist folder
3. Set proper headers for manifest and service worker

## Testing PWA Installation

### Local Testing
1. Build the app: `npm run build:web`
2. Serve locally: `npx serve dist`
3. Open in Chrome: `http://localhost:3000`
4. Look for install prompt in address bar

### Production Testing
1. Deploy to Vercel
2. Visit the deployed URL
3. Chrome/Edge: Look for install icon in address bar
4. Mobile: Use "Add to Home Screen" in browser menu

### PWA Checklist
- [x] Valid manifest.json
- [x] Service worker registered
- [x] HTTPS (via Vercel)
- [x] Responsive viewport meta tag
- [x] Apple touch icons
- [x] Theme color meta tag
- [x] Start URL defined
- [x] Display mode set to standalone
- [x] Icons in multiple sizes

## Troubleshooting

### PWA Not Installing?
1. Check browser console for errors
2. Verify HTTPS is enabled (not on localhost)
3. Check manifest is valid: Chrome DevTools > Application > Manifest
4. Ensure service worker is registered: Chrome DevTools > Application > Service Workers

### Icons Not Showing?
1. Verify icon paths in manifest.json
2. Check that icons are copied to dist folder
3. Clear browser cache and retry

### Service Worker Issues?
1. Check console for registration errors
2. Verify service worker scope
3. Clear browser cache and unregister old workers

## Future Enhancements

1. **Better Icon Generation**: Use sharp or similar to generate proper sized icons
2. **Offline Pages**: Create custom offline fallback pages
3. **Background Sync**: Sync podcast progress when back online
4. **Push Notifications**: Notify users of new podcasts
5. **App Store Submission**: Use PWABuilder to submit to app stores