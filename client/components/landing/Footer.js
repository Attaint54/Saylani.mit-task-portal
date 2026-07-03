'use client';

import Link from 'next/link';
import { FiGithub, FiTwitter, FiLinkedin, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer
      style={{
        background: '#0a0a1a',
        color: 'rgba(255,255,255,0.8)',
      }}
    >
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="rounded-circle"
                style={{
                  width: 36,
                  height: 36,
                  background: 'linear-gradient(135deg, #66b032, #0057a8)',
                }}
              />
              <h5 className="fw-bold mb-0 text-white">Saylani Mass IT Hub</h5>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
              Empowering youth through free, quality IT education. Join us in building a
              brighter digital future.
            </p>
            <div className="d-flex gap-3">
              {[FiGithub, FiTwitter, FiLinkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: 38,
                    height: 38,
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    textDecoration: 'none',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#66b032'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="col-6 col-lg-2">
            <h6 className="fw-bold text-white mb-3">Quick Links</h6>
            <div className="d-flex flex-column gap-2">
              {['Home', 'Features', 'About', 'Contact'].map((link) => (
                <Link
                  key={link}
                  href={link === 'Home' ? '/' : `#${link.toLowerCase()}`}
                  style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem' }}
                  className="hover-link"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          <div className="col-6 col-lg-2">
            <h6 className="fw-bold text-white mb-3">Services</h6>
            <div className="d-flex flex-column gap-2">
              {['Dashboard', 'Lost & Found', 'Complaints', 'Volunteers'].map((link) => (
                <Link
                  key={link}
                  href="#"
                  style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem' }}
                  className="hover-link"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          <div className="col-lg-4">
            <h6 className="fw-bold text-white mb-3">Contact Us</h6>
            <div className="d-flex flex-column gap-3">
              {[
                { icon: FiMapPin, text: 'Bahadurabad, Karachi, Pakistan' },
                { icon: FiPhone, text: '+92 21 111-729-526' },
                { icon: FiMail, text: 'info@saylani.com' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
                    <Icon size={16} style={{ color: '#66b032' }} />
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container py-3">
          <div className="row align-items-center">
            <div className="col text-center">
              <p className="mb-0" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                &copy; {new Date().getFullYear()} Saylani Mass IT Hub. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-link:hover {
          color: #66b032 !important;
        }
      `}</style>
    </footer>
  );
}
