'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { motion } from 'framer-motion';

const publicPaths = ['/', '/login', '/signup'];

export default function AppShell({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const isPublic = publicPaths.includes(pathname);
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        setDarkMode(true);
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }
  }, []);

  useEffect(() => {
    if (!loading && !user && !isPublic) {
      router.push('/login');
    }
  }, [user, loading, isPublic, router]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  if (loading && !isPublic) {
    return <LoadingSpinner size={60} />;
  }

  if (isPublic || isAuthPage) {
    return <>{children}</>;
  }

  if (!user) {
    return <LoadingSpinner size={60} />;
  }

  return (
    <div className="d-flex">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div
        style={{
          marginLeft: collapsed ? 70 : 260,
          flex: 1,
          minHeight: '100vh',
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Navbar
          onMenuClick={() => setCollapsed(!collapsed)}
          darkMode={darkMode}
          onDarkModeToggle={toggleDarkMode}
        />
        <motion.main
          className="p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
