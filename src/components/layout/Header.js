'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/about', label: 'عن الخدمة' },
  { href: '/news', label: 'الأخبار' },
  { href: '/activities', label: 'الأنشطة' },
  { href: '/trips', label: 'الرحلات' },
  { href: '/gallery', label: 'معرض الصور' },
  { href: '/contact', label: 'تواصل معنا' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo">
            <img src="/images/logo.jpg" alt="MSM Kids Logo" />
            <span>MSM Kids</span>
          </Link>

          <ul className="navbar-links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={pathname === link.href ? 'active' : ''}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="navbar-cta">
            <Link href="/login" className="btn btn-primary">
              تسجيل الدخول
            </Link>
          </div>

          <button
            className="navbar-mobile-toggle"
            onClick={() => setMobileOpen(true)}
            aria-label="فتح القائمة"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`mobile-nav ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      >
        <div
          className="mobile-nav-panel"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="mobile-nav-close"
            onClick={() => setMobileOpen(false)}
            aria-label="إغلاق القائمة"
          >
            ✕
          </button>

          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <img
              src="/images/logo.jpg"
              alt="MSM Kids"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                margin: '0 auto',
                objectFit: 'cover',
              }}
            />
            <p style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1.1rem',
              color: 'var(--dark-blue)',
              marginTop: '0.5rem',
            }}>
              MSM Kids
            </p>
          </div>

          <ul className="mobile-nav-links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={pathname === link.href ? 'active' : ''}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li style={{ marginTop: '1rem' }}>
              <Link href="/login" className="btn btn-primary" style={{ width: '100%' }}>
                تسجيل الدخول
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
