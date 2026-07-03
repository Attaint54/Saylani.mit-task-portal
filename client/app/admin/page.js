'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { complaintsAPI, lostFoundAPI, volunteersAPI, usersAPI } from '@/services/api';
import StatsCards from '@/components/dashboard/StatsCards';
import { ComplaintsChart, StatusPieChart } from '@/components/dashboard/Charts';
import { FiUsers, FiAlertCircle, FiSearch, FiUserPlus } from 'react-icons/fi';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [usersRes, complaintsRes, lostRes, volRes] = await Promise.all([
        usersAPI.getAll({ limit: 1 }),
        complaintsAPI.getAll({ limit: 1 }),
        lostFoundAPI.getAll({ limit: 1 }),
        volunteersAPI.getAll({ limit: 1 }),
      ]);

      setStats([
        { icon: FiUsers, label: 'Total Users', value: usersRes.data.pagination?.total || 0, color: '#66b032', bg: 'rgba(102,176,50,0.1)' },
        { icon: FiAlertCircle, label: 'Total Complaints', value: complaintsRes.data.pagination?.total || 0, color: '#0057a8', bg: 'rgba(0,87,168,0.1)' },
        { icon: FiSearch, label: 'Lost & Found Items', value: lostRes.data.pagination?.total || 0, color: '#e67e22', bg: 'rgba(230,126,34,0.1)' },
        { icon: FiUserPlus, label: 'Volunteers', value: volRes.data.pagination?.total || 0, color: '#9b59b6', bg: 'rgba(155,89,182,0.1)' },
      ]);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-transition">
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Admin Dashboard</h4>
        <p className="text-muted mb-0 small">System overview and management</p>
      </div>

      <StatsCards stats={stats} />

      <div className="row g-3">
        <div className="col-md-6">
          <ComplaintsChart />
        </div>
        <div className="col-md-6">
          <StatusPieChart />
        </div>
      </div>
    </div>
  );
}
