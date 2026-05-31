'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';

const roles = [
  { id: 'child', icon: '👦', label: 'طفل' },
  { id: 'parent', icon: '👨‍👩‍👦', label: 'ولي أمر' },
  { id: 'servant', icon: '🙏', label: 'خادم' },
  { id: 'admin', icon: '👨‍💼', label: 'مسؤول' },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`جارٍ تسجيل الدخول كـ ${roles.find((r) => r.id === selectedRole)?.label}... 🔐`);
  };

  return (
    <>
      <Header />

      <div className="login-page">
        <motion.div
          className="login-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {/* Logo */}
          <Image
            src="/images/logo.jpg"
            alt="شعار خدمة ماري مرقس"
            width={100}
            height={100}
            className="hero-logo"
          />

          {/* Title */}
          <h1>تسجيل الدخول</h1>
          <p>اختر نوع الحساب للدخول</p>

          {/* Role Selection */}
          <div className="login-roles">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                className={`login-role-btn${selectedRole === role.id ? ' selected' : ''}`}
                onClick={() => setSelectedRole(role.id)}
              >
                <span className="role-icon">{role.icon}</span>
                {role.label}
              </button>
            ))}
          </div>

          {/* Login Form */}
          <AnimatePresence>
            {selectedRole && (
              <motion.form
                className="login-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <div className="form-group">
                  <label className="form-label">البريد الإلكتروني أو اسم المستخدم</label>
                  <input
                    className="form-input"
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">كلمة المرور</label>
                  <input
                    className="form-input"
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <p style={{ textAlign: 'left', marginBottom: '1rem' }}>
                  <a
                    href="#"
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--medium-blue)',
                      fontWeight: 500,
                    }}
                  >
                    نسيت كلمة المرور؟
                  </a>
                </p>

                <button type="submit" className="btn btn-primary">
                  دخول
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Bottom Text */}
          <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
            ليس لديك حساب؟{' '}
            <Link
              href="/contact"
              style={{ color: 'var(--medium-blue)', fontWeight: 600 }}
            >
              تواصل مع خادمك
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
