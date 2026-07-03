'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { notificationsAPI } from '@/services/api';
import { FiBell, FiSun, FiMoon, FiMenu, FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDateTime } from '@/utils/helpers';
import Link from 'next/link';

export default function Navbar({ onMenuClick, darkMode, onDarkModeToggle }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const loadNotifications = async () => {
    try {
      const { data } = await notificationsAPI.getAll({ limit: 5 });
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {}
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      loadNotifications();
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      loadNotifications();
    } catch {}
  };

  return (
    <nav
      className="d-flex align-items-center justify-content-between px-4"
      style={{
        height: 64,
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 999,
      }}
    >
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-link text-dark p-0" onClick={onMenuClick}>
          <FiMenu size={22} />
        </button>
      </div>

      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-link text-dark p-1 position-relative"
          onClick={onDarkModeToggle}
          style={{ textDecoration: 'none' }}
        >
          {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>

        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            className="btn btn-link text-dark p-1 position-relative"
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ textDecoration: 'none' }}
          >
            <FiBell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 40,
                  width: 360,
                  maxHeight: 400,
                  background: '#fff',
                  borderRadius: 12,
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  overflow: 'hidden',
                  zIndex: 2000,
                }}
              >
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 fw-bold">Notifications</h6>
                  {unreadCount > 0 && (
                    <button
                      className="btn btn-sm btn-link text-decoration-none"
                      style={{ color: '#66b032', fontSize: '0.8rem' }}
                      onClick={handleMarkAllRead}
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted small">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        className="p-3 border-bottom"
                        style={{
                          background: notif.isRead ? 'transparent' : 'rgba(102,176,50,0.05)',
                          cursor: 'pointer',
                        }}
                        onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                      >
                        <div className="d-flex justify-content-between">
                          <strong style={{ fontSize: '0.85rem' }}>{notif.title}</strong>
                          <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                            {formatDateTime(notif.createdAt)}
                          </span>
                        </div>
                        <p className="mb-0 text-muted" style={{ fontSize: '0.8rem' }}>
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <Link
                  href="/notifications"
                  className="d-block text-center p-2 text-decoration-none small"
                  style={{ color: '#66b032', borderTop: '1px solid #eee' }}
                  onClick={() => setShowNotifications(false)}
                >
                  View All Notifications
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div ref={profileRef} style={{ position: 'relative' }}>
          <button
            className="btn btn-link text-dark p-0 d-flex align-items-center gap-2 text-decoration-none"
            onClick={() => setShowProfile(!showProfile)}
          >
            {user?.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt={user.name}
                className="rounded-circle"
                style={{ width: 34, height: 34, objectFit: 'cover', border: '2px solid rgba(102,176,50,0.3)' }}
              />
            ) : (
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: 34,
                  height: 34,
                  background: 'linear-gradient(135deg, #66b032, #0057a8)',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                {user?.name?.charAt(0) || <FiUser size={16} />}
              </div>
            )}
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 44,
                  width: 220,
                  background: '#fff',
                  borderRadius: 12,
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  zIndex: 2000,
                  padding: 16,
                }}
              >
                <div className="text-center mb-2">
                  {user?.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt={user.name}
                      className="rounded-circle mb-2"
                      style={{ width: 56, height: 56, objectFit: 'cover', border: '3px solid rgba(102,176,50,0.3)' }}
                    />
                  ) : (
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
                      style={{
                        width: 56,
                        height: 56,
                        background: 'linear-gradient(135deg, #66b032, #0057a8)',
                        color: '#fff',
                        fontSize: '1.2rem',
                        fontWeight: 600,
                      }}
                    >
                      {user?.name?.charAt(0) || <FiUser size={24} />}
                    </div>
                  )}
                  <strong style={{ fontSize: '0.9rem' }}>{user?.name}</strong>
                  <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>{user?.email}</p>
                  <span className="badge-green mt-1 d-inline-block">
                    {user?.role}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
