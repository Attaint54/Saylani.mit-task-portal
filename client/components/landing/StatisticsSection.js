'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const stats = [
  { value: 10000, suffix: '+', label: 'Students Enrolled', icon: '🎓' },
  { value: 500, suffix: '+', label: 'Courses Completed', icon: '📚' },
  { value: 50, suffix: '+', label: 'Expert Instructors', icon: '👨‍🏫' },
  { value: 95, suffix: '%', label: 'Success Rate', icon: '⭐' },
];

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to({ val: 0 }, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: function () {
              setCount(Math.round(this.targets()[0].val));
            },
          });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="display-4 fw-bold">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatisticsSection() {
  return (
    <section
      className="section-padding"
      style={{
        background: 'linear-gradient(135deg, #0057a8 0%, #66b032 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="row g-4">
          {stats.map((stat, i) => (
            <div key={i} className="col-6 col-lg-3">
              <motion.div
                className="text-center text-white p-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{stat.icon}</div>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                <p className="mb-0 mt-2" style={{ opacity: 0.9, fontSize: '1rem' }}>
                  {stat.label}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
