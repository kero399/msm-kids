// src/lib/firebase.js
// Firebase configuration for MSM Kids Platform
// Dual-mode: uses real Firebase when env vars are set, mock mode when empty

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

// Check if Firebase credentials are configured and not forced to mock mode
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  process.env.NEXT_PUBLIC_FORCE_MOCK !== 'true'
);

let app = null;
let auth = null;
let db = null;
let storage = null;
let analytics = null;
let analyticsPromise = null;

if (typeof window !== 'undefined' && isFirebaseConfigured) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  analyticsPromise = isSupported()
    .then((supported) => {
      if (!supported) return null;
      analytics = getAnalytics(app);
      return analytics;
    })
    .catch(() => null);
}

export { app, auth, db, storage, analytics, analyticsPromise };
export default firebaseConfig;
