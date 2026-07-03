'use client';

export default function LoadingSpinner({ size = 40 }) {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
      <div
        className="spinner-border"
        style={{
          width: size,
          height: size,
          color: '#66b032',
        }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
