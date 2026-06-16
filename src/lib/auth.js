'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { isFirebaseConfigured, auth as firebaseAuth, db } from './firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  isFirebaseMode: false,
});

// ============================================
// Mock Users for Development
// ============================================
const MOCK_USERS = {
  admin: {
    uid: 'mock-admin-001',
    email: 'admin@msmkids.com',
    displayName: 'المسؤول أ. فادي شكري',
    role: 'admin',
    classId: null,
    points: 0,
    level: '',
    avatarUrl: '/images/logo.jpg',
  },
  servant: {
    uid: 'mock-servant-001',
    email: 'servant@msmkids.com',
    displayName: 'الخادم مينا ألبير',
    role: 'servant',
    classId: 'class-001',
    className: 'الصف الأول',
    points: 0,
    level: '',
    avatarUrl: '/images/logo.jpg',
  },
  parent: {
    uid: 'mock-parent-001',
    email: 'parent@msmkids.com',
    displayName: 'أبو كيرلس رفعت',
    role: 'parent',
    classId: null,
    linkedChildUid: 'mock-child-001',
    points: 0,
    level: '',
    avatarUrl: '/images/logo.jpg',
  },
  child: {
    uid: 'mock-child-001',
    email: 'child@msmkids.com',
    displayName: 'كيرلس رفعت',
    role: 'child',
    classId: 'class-001',
    points: 750,
    level: 'بطل',
    avatarUrl: '/images/logo.jpg',
  },
};

// ============================================
// Helper: find user profile in Firestore
// Tries 3 strategies: by UID doc, by email query, then auto-creates
// ============================================
async function findOrCreateUserProfile(firebaseUser, selectedRole) {
  // Strategy 1: Direct lookup by UID (the expected case after seeding)
  console.log('[Auth] Looking up Firestore user doc by UID:', firebaseUser.uid);
  const userDocRef = doc(db, 'users', firebaseUser.uid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    console.log('[Auth] Found user by UID ✅');
    return { id: userDoc.id, ...userDoc.data() };
  }

  // Strategy 2: Query by email (handles case where doc ID ≠ Auth UID)
  console.log('[Auth] UID doc not found, querying by email:', firebaseUser.email);
  const emailQuery = query(
    collection(db, 'users'),
    where('email', '==', firebaseUser.email)
  );
  const emailSnapshot = await getDocs(emailQuery);
  if (!emailSnapshot.empty) {
    const matchedDoc = emailSnapshot.docs[0];
    const matchedData = matchedDoc.data();
    console.log('[Auth] Found user by email ✅ (doc id:', matchedDoc.id, ')');

    // Fix: copy profile to the correct UID-keyed document for future lookups
    await setDoc(userDocRef, { ...matchedData, email: firebaseUser.email }, { merge: true });
    console.log('[Auth] Copied profile to UID-keyed doc for future fast lookups');

    return { id: firebaseUser.uid, ...matchedData };
  }

  // Strategy 3: Auto-provision a new profile from Auth data + selected role
  console.log('[Auth] No Firestore profile found at all. Auto-creating with role:', selectedRole);
  const newProfile = {
    name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
    email: firebaseUser.email,
    role: selectedRole,
    classId: null,
    className: '',
    points: 0,
    level: 'مبتدئ',
    avatarUrl: '/images/logo.jpg',
    createdAt: serverTimestamp(),
    autoProvisioned: true,
  };
  await setDoc(userDocRef, newProfile, { merge: true });
  console.log('[Auth] Auto-provisioned user profile ✅');

  return { id: firebaseUser.uid, ...newProfile };
}

// ============================================
// Auth Provider
// ============================================
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFirebaseMode = isFirebaseConfigured;

  // ---- Restore session on mount ----
  useEffect(() => {
    if (isFirebaseMode && firebaseAuth) {
      // Real Firebase listener
      const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const profile = await findOrCreateUserProfile(firebaseUser, 'child');
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: profile.name || firebaseUser.displayName || '',
              role: profile.role,
              classId: profile.classId || null,
              className: profile.className || '',
              linkedChildUid: profile.linkedChildUid || null,
              points: profile.points || 0,
              level: profile.level || '',
              avatarUrl: profile.avatarUrl || '/images/logo.jpg',
            });
          } catch (err) {
            console.error('[Auth] Error restoring session:', err);
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Mock mode — check localStorage
      try {
        const savedUser = localStorage.getItem('msm_mock_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        // localStorage not available (SSR)
      }
      setLoading(false);
    }
  }, [isFirebaseMode]);

  // ---- Login ----
  const login = useCallback(async (email, password, role = 'child') => {
    setLoading(true);

    if (isFirebaseMode && firebaseAuth) {
      // Real Firebase login
      try {
        console.log('[Auth] Signing in with Firebase Auth...');
        const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        console.log('[Auth] Firebase Auth sign-in succeeded. UID:', credential.user.uid);

        // Find or create the Firestore profile
        const profile = await findOrCreateUserProfile(credential.user, role);

        const enrichedUser = {
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: profile.name || credential.user.displayName || '',
          role: profile.role,
          classId: profile.classId || null,
          className: profile.className || '',
          linkedChildUid: profile.linkedChildUid || null,
          points: profile.points || 0,
          level: profile.level || '',
          avatarUrl: profile.avatarUrl || '/images/logo.jpg',
        };

        setUser(enrichedUser);
        setLoading(false);
        return enrichedUser;
      } catch (error) {
        setLoading(false);
        console.error('[Auth] Login error:', error.code, error.message);
        // Translate common Firebase error codes to Arabic
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
          throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }
        if (error.code === 'auth/too-many-requests') {
          throw new Error('تم حظر الحساب مؤقتاً بسبب محاولات كثيرة. حاول لاحقاً');
        }
        throw error;
      }
    } else {
      // Mock mode
      await new Promise((resolve) => setTimeout(resolve, 600));

      const mockUser = MOCK_USERS[role];
      if (!mockUser) {
        setLoading(false);
        throw new Error('نوع الحساب غير صالح');
      }

      setUser(mockUser);
      localStorage.setItem('msm_mock_user', JSON.stringify(mockUser));
      setLoading(false);
      return mockUser;
    }
  }, [isFirebaseMode]);

  // ---- Logout ----
  const logout = useCallback(async () => {
    setLoading(true);

    if (isFirebaseMode && firebaseAuth) {
      await signOut(firebaseAuth);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 300));
      localStorage.removeItem('msm_mock_user');
    }

    setUser(null);
    setLoading(false);
  }, [isFirebaseMode]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isFirebaseMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// ============================================
// Role-based redirect helper
// ============================================
export function getDashboardPath(role) {
  switch (role) {
    case 'admin': return '/admin/dashboard';
    case 'servant': return '/servant/dashboard';
    case 'parent': return '/parent/dashboard';
    case 'child': return '/child/dashboard';
    default: return '/';
  }
}
