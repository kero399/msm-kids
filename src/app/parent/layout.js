'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';

const parentNavItems = [
  { href: '/parent/dashboard', icon: '📊', label: 'متابعة الطفل' },
  { href: '/parent/excuse', icon: '📝', label: 'تقديم عذر غياب' },
];

export default function ParentLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['parent']}>
      <DashboardLayout navItems={parentNavItems} panelTitle="بوابة ولي الأمر">
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
