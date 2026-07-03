'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { complaintsAPI } from '@/services/api';
import Pagination from '@/components/ui/Pagination';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { FiSearch, FiTrash2, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import { formatDate, getStatusColor, truncateText } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadComplaints();
  }, [search, filter]);

  const loadComplaints = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (filter) params.status = filter;

      const { data } = await complaintsAPI.getAll(params);
      setComplaints(data.complaints);
      setPagination(data.pagination);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await complaintsAPI.updateStatus(id, status);
      toast.success(`Status updated to ${status}`);
      loadComplaints();
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this complaint?')) return;
    try {
      await complaintsAPI.delete(id);
      toast.success('Complaint deleted');
      loadComplaints();
    } catch {}
  };

  return (
    <div className="page-transition">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Manage Complaints</h4>
          <p className="text-muted mb-0 small">View and manage all user complaints</p>
        </div>
      </div>

      <div className="d-flex gap-3 mb-4 flex-wrap">
        <div className="input-group" style={{ maxWidth: 300 }}>
          <span className="input-group-text bg-white">
            <FiSearch size={16} className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search complaints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-select"
          style={{ maxWidth: 150 }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Submitted">Submitted</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : complaints.length === 0 ? (
        <EmptyState icon={<FiAlertCircle size={48} />} title="No complaints" />
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>User</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <span className="fw-medium">{truncateText(c.title, 40)}</span>
                    </td>
                    <td className="text-muted small">{c.user?.name || 'Unknown'}</td>
                    <td>
                      <span className="badge-blue small">{c.category}</span>
                    </td>
                    <td>
                      <span className={`badge-${getStatusColor(c.status)}`}>{c.status}</span>
                    </td>
                    <td className="text-muted small">{formatDate(c.createdAt)}</td>
                    <td>
                      <div className="d-flex gap-1">
                        {c.status === 'Submitted' && (
                          <button className="btn btn-sm btn-link text-info" onClick={() => handleStatusUpdate(c._id, 'In Progress')}>
                            <FiClock size={14} />
                          </button>
                        )}
                        {c.status !== 'Resolved' && (
                          <button className="btn btn-sm btn-link text-success" onClick={() => handleStatusUpdate(c._id, 'Resolved')}>
                            <FiCheckCircle size={14} />
                          </button>
                        )}
                        <button className="btn btn-sm btn-link text-danger" onClick={() => handleDelete(c._id)}>
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={pagination} onPageChange={loadComplaints} />
        </>
      )}
    </div>
  );
}
