#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Since we can't use sharp in this environment, we'll copy the existing icon
// In a real setup, you would use sharp or similar to resize the images

const sourceIcon = path.join(__dirname, '../assets/images/icon.png');
const publicDir = path.join(__dirname, '../public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// For now, copy the icon as-is to public directory
// In production, you'd want to generate proper sizes (192x192, 512x512, etc.)
const iconSizes = [
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 }
];

// Copy the icon for each size (in real implementation, resize them)
iconSizes.forEach(({ name }) => {
  const destPath = path.join(publicDir, name);
  try {
    fs.copyFileSync(sourceIcon, destPath);
    console.log(`Created ${name}`);
  } catch (error) {
    console.error(`Failed to create ${name}:`, error.message);
  }
});

// Copy favicon
const faviconSource = path.join(__dirname, '../assets/images/favicon.png');
if (fs.existsSync(faviconSource)) {
  fs.copyFileSync(faviconSource, path.join(publicDir, 'favicon.ico'));
  console.log('Created favicon.ico');
}

console.log('PWA icons generation complete!');