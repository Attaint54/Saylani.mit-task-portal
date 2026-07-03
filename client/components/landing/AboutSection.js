'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiTarget, FiEye, FiHeart } from 'react-icons/fi';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-content',
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-padding"
      style={{ background: '#fff' }}
    >
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <div className="about-content">
              <motion.span
                className="badge-green px-3 py-1 mb-3 d-inline-block"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                About Us
              </motion.span>
              <h2 className="fw-bold mb-4" style={{ fontSize: '2.5rem' }}>
                Empowering the Next Generation of{' '}
                <span className="gradient-text">Tech Leaders</span>
              </h2>
              <p className="text-muted mb-4" style={{ fontSize: '1.05rem', lineHeight: 1.8 }}>
                Saylani Mass IT Training Program is a flagship initiative by Saylani Welfare
                International Trust, dedicated to providing free, quality IT education to the
                youth. Our mission is to bridge the digital divide and create opportunities
                for thousands of students.
              </p>

              <div className="d-flex flex-column gap-3">
                {[
                  { icon: FiTarget, title: 'Our Mission', desc: 'Provide accessible IT education to empower youth with future-ready skills.' },
                  { icon: FiEye, title: 'Our Vision', desc: 'A world where every individual has the opportunity to thrive in the digital economy.' },
                  { icon: FiHeart, title: 'Our Values', desc: 'Integrity, excellence, and community service at the core of everything we do.' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={i}
                      className="d-flex gap-3 p-3 rounded"
                      style={{ background: '#f8f9fa' }}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                        style={{ width: 44, height: 44, background: 'rgba(102,176,50,0.1)', color: '#66b032' }}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">{item.title}</h6>
                        <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>{item.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div
              className="position-relative rounded-4 overflow-hidden"
              style={{
                height: 500,
                background: 'linear-gradient(135deg, #66b032 0%, #0057a8 100%)',
                borderRadius: 24,
              }}
            >
              <div
                className="position-absolute top-50 start-50 translate-middle text-white text-center"
                style={{ zIndex: 2 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 100 }}
                  className="display-1 fw-bold"
                >
                  10K+
                </motion.div>
                <p className="mb-0" style={{ fontSize: '1.2rem', opacity: 0.9 }}>
                  Students Trained
                </p>
              </div>

              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="position-absolute rounded-circle"
                  style={{
                    width: 60 + i * 40,
                    height: 60 + i * 40,
                    border: '1px solid rgba(255,255,255,0.15)',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ scale: 0, opacity: 0.6 }}
                  whileInView={{ scale: 1, opacity: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 1 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
