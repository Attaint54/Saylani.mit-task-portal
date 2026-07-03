'use client';

import { motion } from 'framer-motion';
import { FiAlertCircle, FiSearch, FiUsers, FiBell } from 'react-icons/fi';

const cards = [
  { icon: FiAlertCircle, label: 'Active Complaints', value: '0', color: '#66b032', bg: 'rgba(102,176,50,0.1)' },
  { icon: FiSearch, label: 'Lost Items', value: '0', color: '#0057a8', bg: 'rgba(0,87,168,0.1)' },
  { icon: FiUsers, label: 'Volunteers', value: '0', color: '#e67e22', bg: 'rgba(230,126,34,0.1)' },
  { icon: FiBell, label: 'Notifications', value: '0', color: '#e74c3c', bg: 'rgba(231,76,60,0.1)' },
];

export default function StatsCards({ stats }) {
  const data = stats || cards;

  return (
    <div className="row g-3 mb-4">
      {data.map((card, i) => {
        const Icon = card.icon || cards[i].icon;
        return (
          <div key={i} className="col-md-6 col-xl-3">
            <motion.div
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded"
                  style={{
                    width: 48,
                    height: 48,
                    background: card.bg || cards[i].bg,
                    color: card.color || cards[i].color,
                  }}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                    {card.label}
                  </p>
                  <h4 className="fw-bold mb-0">{card.value}</h4>
                </div>
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
