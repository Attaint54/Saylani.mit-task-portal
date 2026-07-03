'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { complaintsAPI } from '@/services/api';
import ImageUpload from '@/components/ui/ImageUpload';
import Pagination from '@/components/ui/Pagination';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { formatDate, getStatusColor, truncateText } from '@/utils/helpers';
import toast from 'react-hot-toast';

const categories = ['Internet', 'Electricity', 'Water', 'Maintenance', 'Cleaning', 'Other'];

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', category: '' });
  const [form, setForm] = useState({ title: '', description: '', category: 'Internet' });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComplaints();
  }, [search, filters]);

  const loadComplaints = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;

      const { data } = await complaintsAPI.getAll(params);
      setComplaints(data.complaints);
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
      formData.append('category', form.category);
      if (imageFile) formData.append('image', imageFile);

      if (editing) {
        await complaintsAPI.update(editing._id, formData);
        toast.success('Complaint updated');
      } else {
        await complaintsAPI.create(formData);
        toast.success('Complaint submitted');
      }

      setShowModal(false);
      setEditing(null);
      resetForm();
      loadComplaints();
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (complaint) => {
    setEditing(complaint);
    setForm({ title: complaint.title, description: complaint.description, category: complaint.category });
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await complaintsAPI.delete(id);
      toast.success('Complaint deleted');
      loadComplaints();
    } catch {}
  };

  const resetForm = () => {
    setForm({ title: '', description: '', category: 'Internet' });
    setImageFile(null);
  };

  const getCategoryColor = (cat) => {
    const colors = {
      Internet: '#66b032',
      Electricity: '#0057a8',
      Water: '#00bcd4',
      Maintenance: '#e67e22',
      Cleaning: '#9b59b6',
      Other: '#95a5a6',
    };
    return colors[cat] || '#95a5a6';
  };

  return (
    <div className="page-transition">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Complaints</h4>
          <p className="text-muted mb-0 small">Submit and track your complaints</p>
        </div>
        <button
          className="btn btn-saylani d-flex align-items-center gap-2"
          onClick={() => { resetForm(); setEditing(null); setShowModal(true); }}
        >
          <FiPlus /> New Complaint
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
            placeholder="Search complaints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-select"
          style={{ maxWidth: 150 }}
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select
          className="form-select"
          style={{ maxWidth: 150 }}
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
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
        <EmptyState icon={<FiAlertCircle size={48} />} title="No complaints" description="Submit a complaint to get started" />
      ) : (
        <>
          <div className="row g-3">
            {complaints.map((complaint, i) => (
              <motion.div
                key={complaint._id}
                className="col-md-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="stat-card h-100">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span
                      className="badge px-3 py-1"
                      style={{ background: `${getCategoryColor(complaint.category)}15`, color: getCategoryColor(complaint.category) }}
                    >
                      {complaint.category}
                    </span>
                    <span className={`badge-${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>
                  <h6 className="fw-bold mb-1">{complaint.title}</h6>
                  <p className="text-muted small mb-2">{truncateText(complaint.description, 120)}</p>
                  {complaint.image?.url && (
                    <img
                      src={complaint.image.url}
                      alt={complaint.title}
                      className="rounded mb-2"
                      style={{ width: '100%', height: 120, objectFit: 'cover' }}
                    />
                  )}
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <small className="text-muted">{formatDate(complaint.createdAt)}</small>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-link text-primary" onClick={() => handleEdit(complaint)}>
                        <FiEdit2 size={14} />
                      </button>
                      <button className="btn btn-sm btn-link text-danger" onClick={() => handleDelete(complaint._id)}>
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <Pagination pagination={pagination} onPageChange={loadComplaints} />
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
              <h5 className="fw-bold mb-3">{editing ? 'Edit Complaint' : 'New Complaint'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-medium">Category</label>
                  <select
                    className="form-select"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
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
                <div className="mb-4">
                  <label className="form-label small fw-medium">Image (optional)</label>
                  <ImageUpload onImageSelect={setImageFile} currentImage={editing?.image?.url} />
                </div>
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-light flex-grow-1" onClick={() => setShowModal(false)}>
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
