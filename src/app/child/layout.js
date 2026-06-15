'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';

const childNavItems = [
  { href: '/child/dashboard', icon: '📊', label: 'لوحة التحكم' },
  { href: '/child/attendance', icon: '📅', label: 'حضورى' },
  { href: '/child/verses', icon: '📖', label: 'الآيات' },
  { href: '/child/quizzes', icon: '📝', label: 'الاختبارات' },
  { href: '/child/lessons', icon: '📚', label: 'الدروس' },
];

export default function ChildLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['child']}>
      <DashboardLayout navItems={childNavItems} panelTitle="بوابة البطل">
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
