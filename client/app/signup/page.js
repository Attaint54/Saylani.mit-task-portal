'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { AuthScene } from '@/components/three/Scene3D';
import ImageUpload from '@/components/ui/ImageUpload';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [avatar, setAvatar] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name || form.name.length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone, avatar);
      router.push('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#0a0a1a',
      }}
    >
      <AuthScene />

      <motion.div
        className="position-relative"
        style={{ zIndex: 2, width: '100%', maxWidth: 480, padding: '0 20px' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div
          className="glass-card p-4"
          style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(30px)' }}
        >
          <div className="text-center mb-4">
            <div
              className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
              style={{
                width: 64,
                height: 64,
                background: 'linear-gradient(135deg, #66b032, #0057a8)',
              }}
            >
              <span className="text-white fw-bold" style={{ fontSize: '1.2rem' }}>S</span>
            </div>
            <h4 className="fw-bold text-white mb-1">Create Account</h4>
            <p className="text-white-50 small">Join Saylani Mass IT Hub</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4 d-flex justify-content-center">
              <ImageUpload onImageSelect={setAvatar} />
            </div>
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
                  <FiUser style={{ color: 'rgba(255,255,255,0.5)' }} />
                </span>
                <input
                  type="text"
                  className={`form-control bg-transparent border-start-0 ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="Full Name"
                  style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              {errors.name && <small className="text-danger">{errors.name}</small>}
            </div>

            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
                  <FiMail style={{ color: 'rgba(255,255,255,0.5)' }} />
                </span>
                <input
                  type="email"
                  className={`form-control bg-transparent border-start-0 ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Email"
                  style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              {errors.email && <small className="text-danger">{errors.email}</small>}
            </div>

            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
                  <FiPhone style={{ color: 'rgba(255,255,255,0.5)' }} />
                </span>
                <input
                  type="tel"
                  className="form-control bg-transparent border-start-0"
                  placeholder="Phone (optional)"
                  style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
                  <FiLock style={{ color: 'rgba(255,255,255,0.5)' }} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control bg-transparent border-start-0 ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Password"
                  style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  className="input-group-text bg-transparent border-start-0"
                  style={{ borderColor: 'rgba(255,255,255,0.2)' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff style={{ color: 'rgba(255,255,255,0.5)' }} /> : <FiEye style={{ color: 'rgba(255,255,255,0.5)' }} />}
                </button>
              </div>
              {errors.password && <small className="text-danger">{errors.password}</small>}
            </div>

            <button
              type="submit"
              className="btn btn-saylani w-100 d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                <>
                  Create Account <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-3 mb-0" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#66b032', textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
