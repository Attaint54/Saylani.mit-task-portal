'use client';

import { AuthProvider } from '@/context/AuthContext';
import AppShell from '@/components/layout/AppShell';
import { usePathname } from 'next/navigation';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  return (
    <ErrorBoundary>
      <AuthProvider>
        {isLanding ? (
          children
        ) : (
          <AppShell>{children}</AppShell>
        )}
      </AuthProvider>
    </ErrorBoundary>
  );
}
