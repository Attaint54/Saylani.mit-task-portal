'use client';

import { useState, useEffect } from 'react';
import { volunteersAPI } from '@/services/api';
import Pagination from '@/components/ui/Pagination';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { FiSearch, FiTrash2, FiCheckCircle, FiXCircle, FiUsers } from 'react-icons/fi';
import { formatDate, getStatusColor } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadVolunteers();
  }, [search, filter]);

  const loadVolunteers = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (filter) params.status = filter;

      const { data } = await volunteersAPI.getAll(params);
      setVolunteers(data.volunteers);
      setPagination(data.pagination);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await volunteersAPI.updateStatus(id, status);
      toast.success(`Volunteer ${status.toLowerCase()}`);
      loadVolunteers();
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this registration?')) return;
    try {
      await volunteersAPI.delete(id);
      toast.success('Registration deleted');
      loadVolunteers();
    } catch {}
  };

  return (
    <div className="page-transition">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Manage Volunteers</h4>
          <p className="text-muted mb-0 small">Review and manage volunteer registrations</p>
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
            placeholder="Search volunteers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="form-select" style={{ maxWidth: 150 }} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="Registered">Registered</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : volunteers.length === 0 ? (
        <EmptyState icon={<FiUsers size={48} />} title="No volunteers" />
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Event</th>
                  <th>Availability</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((v) => (
                  <tr key={v._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, background: 'rgba(102,176,50,0.1)', color: '#66b032', fontSize: '0.8rem' }}>
                          {v.name?.charAt(0)}
                        </div>
                        <span className="fw-medium">{v.name}</span>
                      </div>
                    </td>
                    <td className="text-muted small">{v.event}</td>
                    <td className="small">{v.availability?.join(', ')}</td>
                    <td><span className={`badge-${getStatusColor(v.status)}`}>{v.status}</span></td>
                    <td className="text-muted small">{formatDate(v.createdAt)}</td>
                    <td>
                      <div className="d-flex gap-1">
                        {v.status === 'Registered' && (
                          <>
                            <button className="btn btn-sm btn-link text-success" onClick={() => handleStatusUpdate(v._id, 'Approved')}>
                              <FiCheckCircle size={14} />
                            </button>
                            <button className="btn btn-sm btn-link text-danger" onClick={() => handleStatusUpdate(v._id, 'Rejected')}>
                              <FiXCircle size={14} />
                            </button>
                          </>
                        )}
                        <button className="btn btn-sm btn-link text-danger" onClick={() => handleDelete(v._id)}>
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={pagination} onPageChange={loadVolunteers} />
        </>
      )}
    </div>
  );
}
