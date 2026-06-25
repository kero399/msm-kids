'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';

const servantNavItems = [
  { href: '/servant/dashboard', icon: '📊', label: 'لوحة التحكم' },
  { href: '/servant/children', icon: '👦', label: 'أطفال فصلي' },
  { href: '/servant/verses', icon: '📖', label: 'تسميع الآيات' },
  { href: '/servant/content', icon: '📚', label: 'الدروس' },
  { href: '/servant/news', icon: '📰', label: 'الأخبار' },
  { href: '/servant/attendance', icon: '✅', label: 'تسجيل الحضور' },
  { href: '/servant/excuses', icon: '📝', label: 'أعذار الغياب' },
  { href: '/servant/reports', icon: '📋', label: 'التقارير' },
];

export default function ServantLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['servant']}>
      <DashboardLayout navItems={servantNavItems} panelTitle="لوحة الخادم">
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
