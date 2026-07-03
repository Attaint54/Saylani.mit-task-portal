'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  FiGrid,
  FiSearch,
  FiAlertCircle,
  FiUsers,
  FiBell,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiShield,
  FiPackage,
} from 'react-icons/fi';

const userLinks = [
  { href: '/dashboard', icon: FiGrid, label: 'Dashboard' },
  { href: '/lost-found', icon: FiSearch, label: 'Lost & Found' },
  { href: '/complaints', icon: FiAlertCircle, label: 'Complaints' },
  { href: '/volunteers', icon: FiUsers, label: 'Volunteers' },
  { href: '/notifications', icon: FiBell, label: 'Notifications' },
];

const adminLinks = [
  { href: '/admin', icon: FiShield, label: 'Admin Panel' },
  { href: '/admin/users', icon: FiUsers, label: 'Manage Users' },
  { href: '/admin/complaints', icon: FiAlertCircle, label: 'Manage Complaints' },
  { href: '/admin/lost-items', icon: FiPackage, label: 'Lost Items' },
  { href: '/admin/volunteers', icon: FiUsers, label: 'Volunteers' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const links = isAdmin ? [...userLinks, ...adminLinks] : userLinks;

  const sidebarVariants = {
    expanded: { width: 260 },
    collapsed: { width: 70 },
  };

  return (
    <motion.nav
      className="glass-sidebar d-flex flex-column"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
        overflow: 'hidden',
      }}
      variants={sidebarVariants}
      animate={collapsed ? 'collapsed' : 'expanded'}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="d-flex align-items-center gap-2"
            >
              <div
                className="rounded-circle"
                style={{
                  width: 32,
                  height: 32,
                  background: 'linear-gradient(135deg, #66b032, #0057a8)',
                }}
              />
              <span className="fw-bold" style={{ fontSize: '0.9rem', color: '#333' }}>
                Saylani Hub
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          className="btn btn-sm btn-link text-dark p-0"
          onClick={onToggle}
          style={{ textDecoration: 'none' }}
        >
          {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
        </button>
      </div>

      <div className="flex-grow-1 py-2" style={{ overflowY: 'auto' }}>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link-custom ${isActive ? 'active' : ''}`}
              style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
            >
              <Icon size={20} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                  >
                    {link.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </div>

      <div className="p-3 border-top">
        <button
          className="nav-link-custom w-100"
          style={{ justifyContent: collapsed ? 'center' : 'flex-start', border: 'none', background: 'none' }}
          onClick={logout}
        >
          <FiLogOut size={20} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.nav>
  );
}
