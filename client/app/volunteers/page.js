'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { volunteersAPI } from '@/services/api';
import Pagination from '@/components/ui/Pagination';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { FiPlus, FiTrash2, FiUsers } from 'react-icons/fi';
import { formatDate, getStatusColor } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', event: '', availability: [], phone: '', email: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadVolunteers();
  }, []);

  const loadVolunteers = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await volunteersAPI.getAll({ page, limit: 10 });
      setVolunteers(data.volunteers);
      setPagination(data.pagination);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.event || form.availability.length === 0) {
      toast.error('Please fill all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await volunteersAPI.register(form);
      toast.success('Registration submitted');
      setShowModal(false);
      resetForm();
      loadVolunteers();
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await volunteersAPI.delete(id);
      toast.success('Registration deleted');
      loadVolunteers();
    } catch {}
  };

  const toggleAvailability = (slot) => {
    setForm((prev) => ({
      ...prev,
      availability: prev.availability.includes(slot)
        ? prev.availability.filter((a) => a !== slot)
        : [...prev.availability, slot],
    }));
  };

  const resetForm = () => {
    setForm({ name: '', event: '', availability: [], phone: '', email: '' });
  };

  return (
    <div className="page-transition">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Volunteers</h4>
          <p className="text-muted mb-0 small">Register as a volunteer for events</p>
        </div>
        <button
          className="btn btn-saylani d-flex align-items-center gap-2"
          onClick={() => { resetForm(); setShowModal(true); }}
        >
          <FiPlus /> Register
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : volunteers.length === 0 ? (
        <EmptyState icon={<FiUsers size={48} />} title="No volunteers" description="Be the first to register as a volunteer" />
      ) : (
        <>
          <div className="row g-3">
            {volunteers.map((v, i) => (
              <motion.div
                key={v._id}
                className="col-md-6 col-lg-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="stat-card h-100">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-bold mb-0">{v.name}</h6>
                    <span className={`badge-${getStatusColor(v.status)}`}>
                      {v.status}
                    </span>
                  </div>
                  <p className="small text-muted mb-1">Event: <strong>{v.event}</strong></p>
                  <p className="small text-muted mb-2">
                    Availability: {v.availability?.join(', ')}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">{formatDate(v.createdAt)}</small>
                    <button className="btn btn-sm btn-link text-danger" onClick={() => handleDelete(v._id)}>
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <Pagination pagination={pagination} onPageChange={loadVolunteers} />
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
              style={{ width: '90%', maxWidth: 500 }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h5 className="fw-bold mb-3">Volunteer Registration</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-medium">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-medium">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-medium">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-medium">Event</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.event}
                    onChange={(e) => setForm({ ...form, event: e.target.value })}
                    placeholder="Event name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-medium">Availability</label>
                  <div className="d-flex gap-2">
                    {['Morning', 'Afternoon', 'Evening'].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        className={`btn btn-sm ${form.availability.includes(slot) ? 'btn-saylani' : 'btn-outline-secondary'}`}
                        onClick={() => toggleAvailability(slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-light flex-grow-1" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-saylani flex-grow-1" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Register'}
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
