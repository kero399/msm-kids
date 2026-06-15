'use client';

import { useAuth } from '@/lib/auth';

/**
 * RoleGuard — conditionally renders children based on the current user's role.
 * 
 * Usage:
 *   <RoleGuard roles={['admin', 'servant']}>
 *     <button>Admin/Servant only action</button>
 *   </RoleGuard>
 */
export default function RoleGuard({ roles = [], children, fallback = null }) {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
    return fallback;
  }

  return children;
}
