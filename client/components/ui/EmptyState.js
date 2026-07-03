export default function EmptyState({ icon, title, description }) {
  return (
    <div className="text-center py-5">
      <div className="mb-3" style={{ fontSize: 48, opacity: 0.5 }}>
        {icon || '📭'}
      </div>
      <h5 className="text-muted mb-2">{title || 'No data found'}</h5>
      <p className="text-muted small">{description || 'There are no items to display yet.'}</p>
    </div>
  );
}
