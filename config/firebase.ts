import analytics from '@react-native-firebase/analytics';
import { initializeApp } from '@react-native-firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.FIREBASE_APP_ID || "your-app-id",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "your-measurement-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics
const analyticsInstance = analytics();

// Enable analytics collection
analyticsInstance.setAnalyticsCollectionEnabled(true);

export { analyticsInstance as analytics, app };

// Analytics helper functions
export const logEvent = (eventName: string, parameters?: Record<string, any>) => {
  try {
    analyticsInstance.logEvent(eventName, parameters);
    console.log(`Analytics event logged: ${eventName}`, parameters);
  } catch (error) {
    console.error('Error logging analytics event:', error);
  }
};

// Common events for your app
export const logLogin = (method: string, success: boolean, domain?: string) => {
  logEvent('login', {
    method,
    success,
    domain,
    timestamp: new Date().toISOString()
  });
};

export const logContentViewed = (contentType: string, contentId: string, contentTitle?: string) => {
  logEvent('content_viewed', {
    content_type: contentType,
    content_id: contentId,
    content_title: contentTitle,
    timestamp: new Date().toISOString()
  });
};

export const logQuizCompleted = (quizId: string, score: number, totalQuestions: number) => {
  logEvent('quiz_completed', {
    quiz_id: quizId,
    score,
    total_questions: totalQuestions,
    percentage: Math.round((score / totalQuestions) * 100),
    timestamp: new Date().toISOString()
  });
};

export const logUserEngagement = (action: string, details?: Record<string, any>) => {
  logEvent('user_engagement', {
    action,
    ...details,
    timestamp: new Date().toISOString()
  });
}; 