#!/bin/bash

# This script adds PWA meta tags to the Expo-generated index.html

echo "Adding PWA meta tags to index.html..."

# Add PWA meta tags before the closing </head> tag
sed -i.bak 's|<link rel="icon" href="/favicon.ico" /></head>|<link rel="icon" href="/favicon.ico" /><meta name="theme-color" content="#f1f5f9" /><meta name="description" content="Educational podcast listening app with quizzes" /><meta name="apple-mobile-web-app-capable" content="yes" /><meta name="apple-mobile-web-app-status-bar-style" content="default" /><meta name="apple-mobile-web-app-title" content="MOE Onward" /><link rel="manifest" href="/manifest.json" /><link rel="apple-touch-icon" href="/apple-touch-icon.png" /></head>|' dist/index.html

# Remove backup file
rm -f dist/index.html.bak

echo "PWA tags added successfully!"