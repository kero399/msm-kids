'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

/**
 * ProtectedRoute — wraps pages that require authentication.
 * 
 * @param {string[]} allowedRoles - Array of roles allowed to access this page.
 *   e.g. ['admin'] or ['admin', 'servant']
 * @param {React.ReactNode} children - The page content.
 * @param {string} [fallback='/login'] - Redirect path when not authenticated.
 */
export default function ProtectedRoute({ allowedRoles = [], children, fallback = '/login' }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace(fallback);
      } else if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // User is logged in but wrong role
        router.replace('/');
      }
    }
  }, [user, loading, allowedRoles, fallback, router]);

  // Loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--light-gray)',
      }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  // Not authenticated or wrong role
  if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role))) {
    return null;
  }

  return children;
}
