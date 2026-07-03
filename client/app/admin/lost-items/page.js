'use client';

import { useState, useEffect } from 'react';
import { lostFoundAPI } from '@/services/api';
import Pagination from '@/components/ui/Pagination';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { FiSearch, FiTrash2, FiCheckCircle, FiPackage } from 'react-icons/fi';
import { formatDate, getStatusColor, truncateText } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function AdminLostItemsPage() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadItems();
  }, [search, filter]);

  const loadItems = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (filter) params.status = filter;

      const { data } = await lostFoundAPI.getAll(params);
      setItems(data.items);
      setPagination(data.pagination);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id) => {
    try {
      await lostFoundAPI.updateStatus(id, 'Found');
      toast.success('Status updated to Found');
      loadItems();
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      await lostFoundAPI.delete(id);
      toast.success('Item deleted');
      loadItems();
    } catch {}
  };

  return (
    <div className="page-transition">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Lost & Found Items</h4>
          <p className="text-muted mb-0 small">Manage all reported items</p>
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
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="form-select" style={{ maxWidth: 150 }} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Found">Found</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <EmptyState icon={<FiPackage size={48} />} title="No items found" />
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>User</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td><span className="fw-medium">{truncateText(item.title, 40)}</span></td>
                    <td className="text-muted small">{item.user?.name || 'Unknown'}</td>
                    <td><span className={`badge-${item.type === 'Lost' ? 'blue' : 'green'}`}>{item.type}</span></td>
                    <td><span className={`badge-${getStatusColor(item.status)}`}>{item.status}</span></td>
                    <td className="text-muted small">{formatDate(item.createdAt)}</td>
                    <td>
                      <div className="d-flex gap-1">
                        {item.status === 'Pending' && (
                          <button className="btn btn-sm btn-link text-success" onClick={() => handleStatusUpdate(item._id)}>
                            <FiCheckCircle size={14} />
                          </button>
                        )}
                        <button className="btn btn-sm btn-link text-danger" onClick={() => handleDelete(item._id)}>
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={pagination} onPageChange={loadItems} />
        </>
      )}
    </div>
  );
}
