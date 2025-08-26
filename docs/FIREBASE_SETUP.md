# Firebase Analytics Setup Guide

## 🔥 **Step 1: Create Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `moe-insight-app`
4. Enable Google Analytics (recommended)
5. Choose Analytics account or create new one
6. Click "Create project"

## 🔥 **Step 2: Add Your App**

### For Web (Primary)
1. Click "Add app" → Web icon (</>)
2. Register app: `moe-insight-web`
3. Copy the config object

### For iOS (Optional)
1. Click "Add app" → iOS icon
2. Register app with your bundle ID
3. Download `GoogleService-Info.plist`

### For Android (Optional)
1. Click "Add app" → Android icon
2. Register app with your package name
3. Download `google-services.json`

## 🔥 **Step 3: Update Environment Variables**

Add these to your `.env` file:

```bash
# Firebase Configuration
FIREBASE_API_KEY=your-api-key-from-firebase-console
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=your-app-id
FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## 🔥 **Step 4: Enable Analytics**

1. In Firebase Console, go to "Analytics" → "Dashboard"
2. Analytics will start collecting data automatically
3. You can view events in "Events" tab

## 📊 **What Gets Tracked**

### Automatic Events
- ✅ User engagement
- ✅ Session duration
- ✅ App opens/closes
- ✅ Screen views

### Custom Events (Already Implemented)
- ✅ `login` - OAuth login attempts
- ✅ `user_engagement` - User actions
- ✅ `domain_validation_failed` - Non-MOE email attempts
- ✅ `user_logout` - User logout events

### Events You Can Add
- ✅ `content_viewed` - Podcast/quiz views
- ✅ `quiz_completed` - Quiz completion
- ✅ `content_engagement` - User interactions

## 🎯 **View Analytics**

1. Go to Firebase Console → Analytics
2. View real-time data in "Dashboard"
3. Check "Events" for custom events
4. Analyze user behavior in "User properties"

## 🔧 **Testing**

1. Run your app: `npm start`
2. Perform login/logout actions
3. Check Firebase Console for events
4. Events appear within 24 hours (real-time available)

## 📱 **Mobile Setup (Optional)**

For iOS/Android, you'll need to:
1. Add native Firebase SDKs
2. Configure native files
3. Build with EAS or Expo dev builds

For now, web analytics will work immediately! 