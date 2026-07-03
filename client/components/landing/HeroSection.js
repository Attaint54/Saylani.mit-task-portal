'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import Link from 'next/link';
import { LandingScene } from '@/components/three/Scene3D';
import { FiArrowRight, FiPlay } from 'react-icons/fi';

export default function HeroSection() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );
      gsap.fromTo(
        subtitleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: 'power3.out' }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#0a0a1a',
      }}
    >
      <LandingScene />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(102,176,50,0.15) 0%, rgba(0,87,168,0.15) 100%)',
          zIndex: 1,
        }}
      />

      <div
        className="container text-center position-relative"
        style={{ zIndex: 2 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-4"
        >
          <span
            className="badge-green px-4 py-2"
            style={{ fontSize: '0.9rem', letterSpacing: 1 }}
          >
            Welcome to the Future of Learning
          </span>
        </motion.div>

        <h1
          ref={titleRef}
          className="display-3 fw-bold mb-4"
          style={{
            color: '#fff',
            textShadow: '0 0 40px rgba(102,176,50,0.3)',
          }}
        >
          <span className="gradient-text">Saylani Mass</span>
          <br />
          <span style={{ color: '#fff' }}>IT Hub</span>
        </h1>

        <p
          ref={subtitleRef}
          className="lead mb-5 mx-auto"
          style={{
            color: 'rgba(255,255,255,0.7)',
            maxWidth: 600,
            fontSize: '1.15rem',
          }}
        >
          Empowering the youth with cutting-edge IT skills. Join thousands of learners
          building their future through technology.
        </p>

        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link
            href="/signup"
            className="btn btn-saylani btn-lg d-flex align-items-center gap-2"
          >
            Get Started <FiArrowRight />
          </Link>
          <Link
            href="/login"
            className="btn btn-saylani-outline btn-lg d-flex align-items-center gap-2"
            style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
          >
            <FiPlay /> Watch Overview
          </Link>
        </div>

        <motion.div
          className="mt-5 d-flex gap-4 justify-content-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {[
            { number: '10K+', label: 'Students' },
            { number: '50+', label: 'Courses' },
            { number: '95%', label: 'Success Rate' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <h3 className="fw-bold mb-0" style={{ color: '#66b032' }}>{stat.number}</h3>
              <small style={{ color: 'rgba(255,255,255,0.5)' }}>{stat.label}</small>
            </div>
          ))}
        </motion.div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          animation: 'bounce 2s infinite',
        }}
      >
        <div
          style={{
            width: 24,
            height: 40,
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: 12,
            position: 'relative',
          }}
        >
          <div
            style={{
              width: 4,
              height: 8,
              background: '#66b032',
              borderRadius: 2,
              position: 'absolute',
              top: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              animation: 'scrollDown 2s infinite',
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
          40% { transform: translateX(-50%) translateY(-10px); }
          60% { transform: translateX(-50%) translateY(-5px); }
        }
        @keyframes scrollDown {
          0% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(15px); }
        }
      `}</style>
    </section>
  );
}
