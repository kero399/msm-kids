'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({
  user: null,
  loading: false,
  login: async () => {},
  logout: async () => {},
  selectRole: () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's a saved mock user in localStorage
    const savedUser = localStorage.getItem('msm_mock_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password, role = 'child') => {
    setLoading(true);
    // Mimic API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    let displayName = 'مستخدم تجريبي';
    let avatarUrl = '/images/logo.jpg';

    if (role === 'child') {
      displayName = 'كيرلس رفعت';
    } else if (role === 'parent') {
      displayName = 'أبو كيرلس رفعت';
    } else if (role === 'servant') {
      displayName = 'الخادم مينا ألبير';
    } else if (role === 'admin') {
      displayName = 'المسؤول أ. فادي شكري';
    }

    const mockUser = {
      uid: `mock-uid-${role}`,
      email: `${role}@msmkids.com`,
      displayName,
      role,
      points: role === 'child' ? 750 : 0,
      level: role === 'child' ? '🏆 بطل' : '',
      avatarUrl
    };

    setUser(mockUser);
    localStorage.setItem('msm_mock_user', JSON.stringify(mockUser));
    setLoading(false);
    return mockUser;
  };

  const logout = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setUser(null);
    localStorage.removeItem('msm_mock_user');
    setLoading(false);
  };

  const selectRole = (role) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('msm_mock_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, selectRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
