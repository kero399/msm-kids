'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';

const adminNavItems = [
  { href: '/admin/dashboard', icon: '📊', label: 'لوحة التحكم' },
  { href: '/admin/classes', icon: '🏫', label: 'إدارة الفصول' },
  { href: '/admin/servants', icon: '🙏', label: 'إدارة الخدّام' },
  { href: '/admin/children', icon: '👦', label: 'إدارة الأطفال' },
  { href: '/admin/excuses', icon: '📝', label: 'أعذار الغياب' },
  { href: '/admin/news', icon: '📰', label: 'الأخبار' },
  { href: '/admin/content', icon: '📚', label: 'الدروس' },
  { href: '/admin/reports', icon: '📋', label: 'التقارير' },
  { href: '/admin/trips', icon: '✈️', label: 'إدارة الرحلات' },
  { href: '/admin/settings', icon: '⚙️', label: 'الإعدادات' },
];

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout navItems={adminNavItems} panelTitle="لوحة الإدارة">
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
