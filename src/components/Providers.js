'use client';

import { AuthProvider } from '@/lib/auth';
import { ToastProvider } from '@/components/ui/Toast';

/**
 * Providers — wraps client-side providers for use in the server-component root layout.
 */
export default function Providers({ children }) {
  return (
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  );
}
