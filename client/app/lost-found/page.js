'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { lostFoundAPI } from '@/services/api';
import ImageUpload from '@/components/ui/ImageUpload';
import Pagination from '@/components/ui/Pagination';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { FiSearch, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatDate, getStatusColor, truncateText } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function LostFoundPage() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ type: '', status: '' });
  const [form, setForm] = useState({ title: '', description: '', type: 'Lost', contactInfo: '' });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadItems();
  }, [search, filters]);

  const loadItems = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;

      const { data } = await lostFoundAPI.getAll(params);
      setItems(data.items);
      setPagination(data.pagination);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      toast.error('Title and description are required');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('type', form.type);
      formData.append('contactInfo', form.contactInfo);
      if (imageFile) formData.append('image', imageFile);

      if (editing) {
        await lostFoundAPI.update(editing._id, formData);
        toast.success('Item updated');
      } else {
        await lostFoundAPI.create(formData);
        toast.success('Item reported');
      }

      setShowModal(false);
      setEditing(null);
      resetForm();
      loadItems();
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setForm({ title: item.title, description: item.description, type: item.type, contactInfo: item.contactInfo || '' });
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await lostFoundAPI.delete(id);
      toast.success('Item deleted');
      loadItems();
    } catch {}
  };

  const resetForm = () => {
    setForm({ title: '', description: '', type: 'Lost', contactInfo: '' });
    setImageFile(null);
  };

  return (
    <div className="page-transition">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Lost & Found</h4>
          <p className="text-muted mb-0 small">Report and search lost or found items</p>
        </div>
        <button
          className="btn btn-saylani d-flex align-items-center gap-2"
          onClick={() => { resetForm(); setEditing(null); setShowModal(true); }}
        >
          <FiPlus /> Report Item
        </button>
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
        <select
          className="form-select"
          style={{ maxWidth: 150 }}
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">All Types</option>
          <option value="Lost">Lost</option>
          <option value="Found">Found</option>
        </select>
        <select
          className="form-select"
          style={{ maxWidth: 150 }}
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Found">Found</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <EmptyState icon={<FiSearch size={48} />} title="No items found" description="Report a lost or found item to get started" />
      ) : (
        <>
          <div className="row g-3">
            {items.map((item, i) => (
              <motion.div
                key={item._id}
                className="col-md-6 col-lg-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="stat-card h-100">
                  {item.image?.url && (
                    <img
                      src={item.image.url}
                      alt={item.title}
                      className="w-100 rounded mb-3"
                      style={{ height: 180, objectFit: 'cover' }}
                    />
                  )}
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className={`badge-${item.type === 'Lost' ? 'blue' : 'green'}`}>
                      {item.type}
                    </span>
                    <span className={`badge-${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <h6 className="fw-bold mb-1">{item.title}</h6>
                  <p className="text-muted small mb-2">{truncateText(item.description, 80)}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">{formatDate(item.createdAt)}</small>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-link text-primary" onClick={() => handleEdit(item)}>
                        <FiEdit2 size={14} />
                      </button>
                      <button className="btn btn-sm btn-link text-danger" onClick={() => handleDelete(item._id)}>
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <Pagination pagination={pagination} onPageChange={loadItems} />
        </>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: 'rgba(0,0,0,0.5)', zIndex: 2000 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white rounded-4 p-4"
              style={{ width: '90%', maxWidth: 500, maxHeight: '90vh', overflow: 'auto' }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h5 className="fw-bold mb-3">{editing ? 'Edit Item' : 'Report Item'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-medium">Type</label>
                  <div className="d-flex gap-3">
                    {['Lost', 'Found'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`btn btn-sm ${form.type === t ? 'btn-saylani' : 'btn-outline-secondary'}`}
                        onClick={() => setForm({ ...form, type: t })}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-medium">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-medium">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-medium">Contact Info</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.contactInfo}
                    onChange={(e) => setForm({ ...form, contactInfo: e.target.value })}
                    placeholder="Phone or email"
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-medium">Image</label>
                  <ImageUpload
                    onImageSelect={setImageFile}
                    currentImage={editing?.image?.url}
                  />
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-light flex-grow-1"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-saylani flex-grow-1" disabled={submitting}>
                    {submitting ? 'Submitting...' : editing ? 'Update' : 'Submit'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
