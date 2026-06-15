'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { useAuth, getDashboardPath } from '@/lib/auth';
import { useToast } from '@/components/ui/Toast';

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
  const [loading, setLoading] = useState(false);
  const { login, isFirebaseMode } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      showToast('الرجاء اختيار نوع الحساب', 'error');
      return;
    }

    setLoading(true);
    try {
      const user = await login(credentials.username, credentials.password, selectedRole);
      showToast(`مرحباً ${user.displayName}! 🎉`, 'success');
      // Redirect based on role
      const dashboardPath = getDashboardPath(user.role);
      router.push(dashboardPath);
    } catch (err) {
      showToast(err.message || 'حدث خطأ أثناء تسجيل الدخول', 'error');
    }
    setLoading(false);
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
          <img
            src="/images/logo.jpg"
            alt="شعار خدمة ماري مرقس"
            className="hero-logo"
          />

          {/* Title */}
          <h1>تسجيل الدخول</h1>
          <p>اختر نوع الحساب للدخول</p>

          {/* Dev mode indicator */}
          {!isFirebaseMode && (
            <div style={{
              background: 'rgba(255,241,118,0.2)', border: '1px solid rgba(255,241,118,0.4)',
              borderRadius: 'var(--radius-md)', padding: '0.5rem 1rem', marginBottom: '1rem',
              fontSize: '0.8rem', color: '#B8860B',
            }}>
              🔧 وضع التطوير — الدخول بدون كلمة مرور
            </div>
          )}

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
                    required={isFirebaseMode}
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
                    required={isFirebaseMode}
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

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'جارٍ الدخول...' : 'دخول'}
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
