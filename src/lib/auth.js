'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { isFirebaseConfigured, auth as firebaseAuth, db } from './firebase';

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
      const { onAuthStateChanged } = require('firebase/auth');
      const { doc, getDoc } = require('firebase/firestore');

      const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Fetch user profile from Firestore
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: data.name || firebaseUser.displayName || '',
                role: data.role,
                classId: data.classId || null,
                className: data.className || '',
                linkedChildUid: data.linkedChildUid || null,
                points: data.points || 0,
                level: data.level || '',
                avatarUrl: data.avatarUrl || '/images/logo.jpg',
              });
            } else {
              // User exists in Auth but not in Firestore
              setUser(null);
            }
          } catch (err) {
            console.error('Error fetching user profile:', err);
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
        const { signInWithEmailAndPassword } = require('firebase/auth');
        const { doc, getDoc } = require('firebase/firestore');

        const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const userDoc = await getDoc(doc(db, 'users', credential.user.uid));

        if (!userDoc.exists()) {
          throw new Error('لم يتم العثور على حساب المستخدم في قاعدة البيانات');
        }

        const data = userDoc.data();
        const enrichedUser = {
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: data.name || credential.user.displayName || '',
          role: data.role,
          classId: data.classId || null,
          className: data.className || '',
          linkedChildUid: data.linkedChildUid || null,
          points: data.points || 0,
          level: data.level || '',
          avatarUrl: data.avatarUrl || '/images/logo.jpg',
        };

        setUser(enrichedUser);
        setLoading(false);
        return enrichedUser;
      } catch (error) {
        setLoading(false);
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
      const { signOut } = require('firebase/auth');
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
