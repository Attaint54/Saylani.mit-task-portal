'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usersAPI } from '@/services/api';
import Pagination from '@/components/ui/Pagination';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { FiSearch, FiTrash2, FiShield, FiUser, FiUserCheck } from 'react-icons/fi';
import { formatDate } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadUsers();
  }, [search]);

  const loadUsers = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await usersAPI.getAll({ page, limit: 20, search });
      setUsers(data.users);
      setPagination(data.pagination);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await usersAPI.delete(id);
      toast.success('User deleted');
      loadUsers();
    } catch {}
  };

  const handleRoleToggle = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await usersAPI.updateRole(id, newRole);
      toast.success(`Role updated to ${newRole}`);
      loadUsers();
    } catch {}
  };

  return (
    <div className="page-transition">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Manage Users</h4>
          <p className="text-muted mb-0 small">View and manage all registered users</p>
        </div>
      </div>

      <div className="d-flex gap-3 mb-4">
        <div className="input-group" style={{ maxWidth: 300 }}>
          <span className="input-group-text bg-white">
            <FiSearch size={16} className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : users.length === 0 ? (
        <EmptyState icon={<FiUser size={48} />} title="No users found" />
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: 32, height: 32, background: 'rgba(102,176,50,0.1)', color: '#66b032', fontSize: '0.8rem' }}
                        >
                          {u.name?.charAt(0)}
                        </div>
                        <span className="fw-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="text-muted">{u.email}</td>
                    <td>
                      <span className={`badge-${u.role === 'admin' ? 'blue' : 'green'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="text-muted small">{formatDate(u.createdAt)}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-link"
                          style={{ color: '#66b032' }}
                          onClick={() => handleRoleToggle(u._id, u.role)}
                          title="Toggle role"
                        >
                          {u.role === 'admin' ? <FiUserCheck size={14} /> : <FiShield size={14} />}
                        </button>
                        <button
                          className="btn btn-sm btn-link text-danger"
                          onClick={() => handleDelete(u._id)}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={pagination} onPageChange={loadUsers} />
        </>
      )}
    </div>
  );
}
