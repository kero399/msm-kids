// src/lib/firebase.js
// Firebase configuration for MSM Kids Platform
// NEXT_PUBLIC_ keys are intentionally embedded as fallbacks — they are
// client-side credentials whose security is enforced by Firestore Security
// Rules, not by keeping them secret. This ensures Vercel deployments work
// without needing env vars configured in the dashboard.

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ── Embedded production config (Vercel-safe fallback) ──────────────────────
// These values are read from env vars if present (e.g. local dev, CI),
// otherwise fall back to the hardcoded production project values so Vercel
// builds succeed with zero dashboard configuration required.
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY            || 'AIzaSyDh9qwYqLt1anoH2dZbtTtviIuiD3wEKdQ',
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN        || 'msm-kids-704e9.firebaseapp.com',
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID         || 'msm-kids-704e9',
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET     || 'msm-kids-704e9.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '503190705901',
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID             || '1:503190705901:web:a33721984ff6f2521a9ee4',
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID     || 'G-N2FR2PP491',
};

// ── Mock mode ───────────────────────────────────────────────────────────────
// Defaults to FALSE — production always uses real Firebase.
// Only set NEXT_PUBLIC_FORCE_MOCK=true in .env.local to test mock flows locally.
const forceMock = process.env.NEXT_PUBLIC_FORCE_MOCK === 'true';

// isFirebaseConfigured is always true in production (hardcoded fallback ensures it)
export const isFirebaseConfigured = !forceMock && Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

// ── Initialize Firebase ─────────────────────────────────────────────────────
let app      = null;
let auth     = null;
let db       = null;
let storage  = null;
let analytics = null;
let analyticsPromise = null;

if (typeof window !== 'undefined' && isFirebaseConfigured) {
  app     = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth    = getAuth(app);
  db      = getFirestore(app);
  storage = getStorage(app);

  // Analytics is optional — gracefully skip if unsupported (e.g. ad-blockers)
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
