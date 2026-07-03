'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { notificationsAPI } from '@/services/api';
import Pagination from '@/components/ui/Pagination';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { FiBell, FiCheck, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import { formatDateTime } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await notificationsAPI.getAll({ page, limit: 20 });
      setNotifications(data.notifications);
      setPagination(data.pagination);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success('All marked as read');
    } catch {}
  };

  const handleDelete = async (id) => {
    try {
      await notificationsAPI.delete(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success('Notification deleted');
    } catch {}
  };

  const getTypeIcon = (type) => {
    const icons = {
      complaint: '🔴',
      lost_found: '🔍',
      volunteer: '👥',
      general: '📢',
    };
    return icons[type] || '📢';
  };

  return (
    <div className="page-transition">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Notifications</h4>
          <p className="text-muted mb-0 small">Stay updated with real-time notifications</p>
        </div>
        {notifications.some((n) => !n.isRead) && (
          <button
            className="btn btn-saylani-outline d-flex align-items-center gap-2"
            onClick={handleMarkAllRead}
            style={{ fontSize: '0.85rem' }}
          >
            <FiCheckCircle /> Mark All Read
          </button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : notifications.length === 0 ? (
        <EmptyState icon={<FiBell size={48} />} title="No notifications" description="You're all caught up!" />
      ) : (
        <>
          <div className="d-flex flex-column gap-2">
            {notifications.map((notif, i) => (
              <motion.div
                key={notif._id}
                className="stat-card d-flex align-items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                style={{
                  borderLeft: notif.isRead ? '3px solid transparent' : '3px solid #66b032',
                  background: notif.isRead ? 'transparent' : 'rgba(102,176,50,0.03)',
                }}
              >
                <div style={{ fontSize: '1.3rem' }}>{getTypeIcon(notif.type)}</div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="fw-bold mb-1" style={{ fontSize: '0.9rem' }}>
                        {notif.title}
                      </h6>
                      <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                        {notif.message}
                      </p>
                    </div>
                    <small className="text-muted text-nowrap ms-3" style={{ fontSize: '0.7rem' }}>
                      {formatDateTime(notif.createdAt)}
                    </small>
                  </div>
                  <div className="d-flex gap-2 mt-2">
                    {!notif.isRead && (
                      <button
                        className="btn btn-sm btn-link text-success p-0 text-decoration-none"
                        onClick={() => handleMarkAsRead(notif._id)}
                        style={{ fontSize: '0.8rem' }}
                      >
                        <FiCheck size={14} /> Mark read
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-link text-danger p-0 text-decoration-none"
                      onClick={() => handleDelete(notif._id)}
                      style={{ fontSize: '0.8rem' }}
                    >
                      <FiTrash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <Pagination pagination={pagination} onPageChange={loadNotifications} />
        </>
      )}
    </div>
  );
}
