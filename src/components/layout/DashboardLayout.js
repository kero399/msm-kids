'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, getDashboardPath } from '@/lib/auth';

/**
 * DashboardLayout — shared sidebar layout for admin and servant panels.
 *
 * @param {object[]} navItems - [{ href, icon, label }]
 * @param {string} panelTitle - e.g. "لوحة الإدارة" or "لوحة الخادم"
 * @param {React.ReactNode} children - Page content
 */
export default function DashboardLayout({ navItems = [], panelTitle = '', children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const roleBadgeMap = {
    admin: { label: 'مسؤول', className: 'role-badge-admin' },
    servant: { label: 'خادم', className: 'role-badge-servant' },
    parent: { label: 'ولي أمر', className: 'role-badge-parent' },
    child: { label: 'طفل', className: 'role-badge-child' },
  };

  const roleBadge = roleBadgeMap[user?.role] || { label: '', className: '' };

  return (
    <div className="dashboard-layout">
      {/* ====== Sidebar ====== */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <Link href="/" className="sidebar-logo">
            <img src="/images/logo.jpg" alt="MSM Kids" />
            <span>MSM Kids</span>
          </Link>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="إغلاق القائمة"
          >
            ✕
          </button>
        </div>

        {/* Panel Title */}
        <div className="sidebar-panel-title">
          <span>{panelTitle}</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span className="sidebar-link-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <img src={user?.avatarUrl || '/images/logo.jpg'} alt="" className="sidebar-user-avatar" />
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.displayName}</span>
              <span className={`role-badge ${roleBadge.className}`}>{roleBadge.label}</span>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            🚪 خروج
          </button>
        </div>
      </aside>

      {/* ====== Sidebar Overlay (mobile) ====== */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ====== Main Content ====== */}
      <main className="dashboard-main">
        {/* Top Bar */}
        <header className="dashboard-topbar">
          <button
            className="topbar-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="فتح القائمة"
          >
            <span /><span /><span />
          </button>
          <div className="topbar-info">
            <h1 className="topbar-title">{panelTitle}</h1>
          </div>
          <div className="topbar-user">
            <span className={`role-badge ${roleBadge.className}`}>{roleBadge.label}</span>
            <span className="topbar-user-name">{user?.displayName}</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
}
