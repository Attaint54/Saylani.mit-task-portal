'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const COLORS = ['#66b032', '#0057a8', '#e67e22', '#e74c3c', '#9b59b6'];

export function ComplaintsChart({ data = [] }) {
  const defaultData = [
    { name: 'Internet', value: 0 },
    { name: 'Electricity', value: 0 },
    { name: 'Water', value: 0 },
    { name: 'Maintenance', value: 0 },
    { name: 'Cleaning', value: 0 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  return (
    <div className="stat-card">
      <h6 className="fw-bold mb-3">Complaints by Category</h6>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Bar dataKey="value" fill="#66b032" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatusPieChart({ data = [] }) {
  const defaultData = [
    { name: 'Submitted', value: 0 },
    { name: 'In Progress', value: 0 },
    { name: 'Resolved', value: 0 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  return (
    <div className="stat-card">
      <h6 className="fw-bold mb-3">Complaint Status</h6>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="d-flex justify-content-center gap-3 mt-2">
        {chartData.map((entry, i) => (
          <div key={i} className="d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i] }} />
            <span className="text-muted">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActivityChart({ data = [] }) {
  const defaultData = [
    { day: 'Mon', complaints: 0, lost: 0 },
    { day: 'Tue', complaints: 0, lost: 0 },
    { day: 'Wed', complaints: 0, lost: 0 },
    { day: 'Thu', complaints: 0, lost: 0 },
    { day: 'Fri', complaints: 0, lost: 0 },
    { day: 'Sat', complaints: 0, lost: 0 },
    { day: 'Sun', complaints: 0, lost: 0 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  return (
    <div className="stat-card">
      <h6 className="fw-bold mb-3">Weekly Activity</h6>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Line type="monotone" dataKey="complaints" stroke="#66b032" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="lost" stroke="#0057a8" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
