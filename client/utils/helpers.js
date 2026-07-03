export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status) => {
  const colors = {
    Submitted: 'warning',
    'In Progress': 'info',
    Resolved: 'success',
    Pending: 'warning',
    Found: 'success',
    Registered: 'info',
    Approved: 'success',
    Rejected: 'danger',
  };
  return colors[status] || 'secondary';
};

export const truncateText = (text, length = 100) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
