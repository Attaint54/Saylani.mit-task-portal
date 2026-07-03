'use client';

export function SkeletonCard() {
  return (
    <div className="stat-card p-4">
      <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 8, marginBottom: 16 }} />
      <div className="skeleton" style={{ width: '60%', height: 16, marginBottom: 8 }} />
      <div className="skeleton" style={{ width: '40%', height: 24 }} />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="d-flex gap-3 p-3 border-bottom">
          <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} />
          <div className="flex-grow-1">
            <div className="skeleton" style={{ width: '40%', height: 14, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: '60%', height: 12 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
