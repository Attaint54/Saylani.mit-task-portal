'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { complaintsAPI, lostFoundAPI, volunteersAPI, notificationsAPI } from '@/services/api';
import StatsCards from '@/components/dashboard/StatsCards';
import { ComplaintsChart, StatusPieChart, ActivityChart } from '@/components/dashboard/Charts';
import { FiArrowRight, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import Link from 'next/link';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [complaintsRes, lostFoundRes, volunteersRes, notifRes] = await Promise.all([
        complaintsAPI.getAll({ limit: 100 }),
        lostFoundAPI.getAll({ limit: 100 }),
        volunteersAPI.getAll({ limit: 100 }),
        notificationsAPI.getAll({ limit: 10 }),
      ]);

      const complaints = complaintsRes.data.complaints || [];
      const lostItems = lostFoundRes.data.items || [];
      const volunteers = volunteersRes.data.volunteers || [];
      const notifications = notifRes.data.notifications || [];

      const byCategory = {};
      const byStatus = {};
      complaints.forEach((c) => {
        byCategory[c.category] = (byCategory[c.category] || 0) + 1;
        byStatus[c.status] = (byStatus[c.status] || 0) + 1;
      });

      setStats([
        {
          icon: FiAlertCircle,
          label: 'Active Complaints',
          value: complaints.filter((c) => c.status !== 'Resolved').length,
          color: '#66b032',
          bg: 'rgba(102,176,50,0.1)',
        },
        {
          icon: FiSearch,
          label: 'Lost & Found',
          value: lostItems.length,
          color: '#0057a8',
          bg: 'rgba(0,87,168,0.1)',
        },
        {
          icon: FiUsers,
          label: 'Volunteer Registrations',
          value: volunteers.length,
          color: '#e67e22',
          bg: 'rgba(230,126,34,0.1)',
        },
        {
          icon: FiClock,
          label: 'Unread Notifications',
          value: notifRes.data.unreadCount || 0,
          color: '#e74c3c',
          bg: 'rgba(231,76,60,0.1)',
        },
      ]);

      const allActivity = [
        ...complaints.map((c) => ({ ...c, type: 'complaint' })),
        ...lostItems.map((i) => ({ ...i, type: 'lost_found' })),
      ]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setRecentActivity(allActivity);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-transition">
      <div className="mb-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h4 className="fw-bold mb-1">
            Welcome back, <span className="gradient-text">{user?.name}</span>
          </h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Here's what's happening at Saylani Mass IT Hub
          </p>
        </motion.div>
      </div>

      <StatsCards stats={stats} />

      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <ComplaintsChart />
        </div>
        <div className="col-md-4">
          <StatusPieChart />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-7">
          <ActivityChart />
        </div>
        <div className="col-md-5">
          <div className="stat-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">Recent Activity</h6>
              <Link
                href="/notifications"
                className="text-decoration-none small"
                style={{ color: '#66b032' }}
              >
                View All <FiArrowRight size={14} />
              </Link>
            </div>
            {recentActivity.length === 0 ? (
              <p className="text-muted small text-center py-4">No recent activity</p>
            ) : (
              <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                {recentActivity.map((item, i) => (
                  <div key={i} className="d-flex align-items-start gap-2 mb-3 pb-2 border-bottom">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                      style={{
                        width: 32,
                        height: 32,
                        background: item.type === 'complaint' ? 'rgba(102,176,50,0.1)' : 'rgba(0,87,168,0.1)',
                        color: item.type === 'complaint' ? '#66b032' : '#0057a8',
                      }}
                    >
                      {item.type === 'complaint' ? <FiAlertCircle size={14} /> : <FiCheckCircle size={14} />}
                    </div>
                    <div>
                      <p className="mb-0" style={{ fontSize: '0.8rem', fontWeight: 500 }}>
                        {item.title}
                      </p>
                      <small className="text-muted">
                        {item.type === 'complaint' ? item.category : item.type}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="row g-3 mt-2">
        <div className="col-12">
          <div className="d-flex gap-3 flex-wrap">
            {[
              { href: '/complaints', label: 'Submit Complaint', color: '#66b032' },
              { href: '/lost-found', label: 'Report Lost/Found', color: '#0057a8' },
              { href: '/volunteers', label: 'Volunteer Now', color: '#e67e22' },
            ].map((btn) => (
              <Link
                key={btn.href}
                href={btn.href}
                className="btn d-flex align-items-center gap-2 card-hover"
                style={{
                  background: `${btn.color}10`,
                  color: btn.color,
                  border: `1px solid ${btn.color}20`,
                  borderRadius: 12,
                  padding: '12px 24px',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                {btn.label} <FiArrowRight />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
