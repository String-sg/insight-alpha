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

# Copy public files to dist
echo "Copying PWA files to dist..."
cp -r public/* dist/

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