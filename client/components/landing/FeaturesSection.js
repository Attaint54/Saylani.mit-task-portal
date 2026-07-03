'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FiMonitor,
  FiUsers,
  FiSearch,
  FiAlertCircle,
  FiBell,
  FiShield,
} from 'react-icons/fi';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    icon: FiMonitor,
    title: 'Interactive Dashboard',
    description: 'Track your progress, manage activities, and stay organized with a modern dashboard.',
    color: '#66b032',
  },
  {
    icon: FiSearch,
    title: 'Lost & Found',
    description: 'Report lost items or found belongings with smart matching and notifications.',
    color: '#0057a8',
  },
  {
    icon: FiAlertCircle,
    title: 'Complaint Management',
    description: 'Submit and track complaints across multiple categories with real-time updates.',
    color: '#66b032',
  },
  {
    icon: FiUsers,
    title: 'Volunteer Programs',
    description: 'Register for events, manage availability, and contribute to the community.',
    color: '#0057a8',
  },
  {
    icon: FiBell,
    title: 'Real-time Notifications',
    description: 'Stay updated with instant notifications powered by Socket.IO technology.',
    color: '#66b032',
  },
  {
    icon: FiShield,
    title: 'Admin Control',
    description: 'Comprehensive admin panel for managing users, complaints, and system settings.',
    color: '#0057a8',
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="section-padding"
      style={{ background: '#f8f9fa' }}
    >
      <div className="container">
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="badge-green px-3 py-1 mb-3 d-inline-block">Features</span>
          <h2 className="fw-bold mb-3" style={{ fontSize: '2.5rem' }}>
            Everything You Need
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: 500 }}>
            A comprehensive platform designed to enhance your campus experience
          </p>
        </motion.div>

        <div className="row g-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="col-md-6 col-lg-4">
                <div
                  ref={(el) => (cardsRef.current[i] = el)}
                  className="card-hover p-4 h-100"
                  style={{
                    background: '#fff',
                    borderRadius: 16,
                    border: '1px solid rgba(0,0,0,0.05)',
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: 56,
                      height: 56,
                      background: `${feature.color}15`,
                      color: feature.color,
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <h5 className="fw-bold mb-2">{feature.title}</h5>
                  <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
