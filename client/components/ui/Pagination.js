'use client';

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.pages <= 1) return null;

  const { page, pages } = pagination;

  const getPages = () => {
    const items = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(pages, page + 2);

    if (start > 1) items.push(1);
    if (start > 2) items.push('...');

    for (let i = start; i <= end; i++) items.push(i);

    if (end < pages - 1) items.push('...');
    if (end < pages) items.push(pages);

    return items;
  };

  return (
    <nav className="d-flex justify-content-center mt-4">
      <ul className="pagination pagination-sm">
        <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(page - 1)}>
            <FiChevronLeft />
          </button>
        </li>
        {getPages().map((item, i) => (
          <li key={i} className={`page-item ${item === page ? 'active' : ''} ${item === '...' ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => item !== '...' && onPageChange(item)}
              style={item === page ? { background: '#66b032', borderColor: '#66b032', color: '#fff' } : {}}
            >
              {item}
            </button>
          </li>
        ))}
        <li className={`page-item ${page >= pages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(page + 1)}>
            <FiChevronRight />
          </button>
        </li>
      </ul>
    </nav>
  );
}
