#!/bin/bash

echo "Building PWA for MOE Onward..."

# Generate PWA icons if they don't exist
if [ ! -f "public/icon-192x192.png" ]; then
  echo "Generating PWA icons..."
  node scripts/generate-pwa-icons.js
fi

# Build the web version
echo "Building web export..."
npx expo export --platform web

# Copy PWA files to dist (but not index.html)
echo "Copying PWA files to dist..."
cp public/manifest.json dist/
cp public/service-worker.js dist/
cp public/icon-192x192.png dist/
cp public/icon-512x512.png dist/
cp public/apple-touch-icon.png dist/
cp public/favicon.ico dist/

# Inject PWA tags into the Expo-generated index.html
echo "Injecting PWA configuration into index.html..."
sed -i.bak '/<\/head>/i\
<!-- PWA Meta Tags -->\
<meta name="theme-color" content="#000000" />\
<meta name="description" content="Educational podcast listening app with quizzes" />\
<meta name="apple-mobile-web-app-capable" content="yes" />\
<meta name="apple-mobile-web-app-status-bar-style" content="default" />\
<meta name="apple-mobile-web-app-title" content="MOE Onward" />\
<link rel="manifest" href="/manifest.json" />\
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />\
<script>\
if ("serviceWorker" in navigator && window.location.hostname !== "localhost") {\
  window.addEventListener("load", () => {\
    navigator.serviceWorker.register("/service-worker.js")\
      .then(registration => console.log("ServiceWorker registration successful"))\
      .catch(err => console.log("ServiceWorker registration failed: ", err));\
  });\
}\
</script>
' dist/index.html
rm dist/index.html.bak

echo "PWA build complete! Files are in the dist/ directory."
echo ""
echo "To test the PWA locally:"
echo "  npx serve dist"
echo ""
echo "PWA checklist:"
echo "✓ manifest.json"
echo "✓ service-worker.js"
echo "✓ Icons (192x192, 512x512)"
echo "✓ Apple touch icon"
echo "✓ Meta tags in HTML"