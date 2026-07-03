'use client';

import { useState, useRef, useCallback } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';

export default function ImageUpload({ onImageSelect, currentImage, accept = 'image/*' }) {
  const [preview, setPreview] = useState(currentImage || null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const processFile = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => setPreview(event.target.result);
    reader.readAsDataURL(file);
    onImageSelect(file);
  }, [onImageSelect]);

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleRemove = () => {
    setPreview(null);
    onImageSelect(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleClick = () => fileRef.current?.click();

  return (
    <div className="d-flex flex-column align-items-center">
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="d-none"
      />

      {preview ? (
        <div className="position-relative" style={{ width: 120, height: 120 }}>
          <img
            src={preview}
            alt="Preview"
            className="rounded-circle"
            style={{ width: 120, height: 120, objectFit: 'cover', border: '3px solid #dee2e6' }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="btn btn-sm btn-danger position-absolute rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 28, height: 28, top: -4, right: -4, padding: 0 }}
          >
            <FiX size={14} />
          </button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className="d-flex flex-column align-items-center justify-content-center rounded-circle border text-center"
          style={{
            width: 120,
            height: 120,
            cursor: 'pointer',
            borderColor: dragOver ? '#66b032' : '#adb5bd',
            background: dragOver ? 'rgba(102,176,50,0.1)' : '#f8f9fa',
            borderStyle: 'dashed',
            borderWidth: 2,
            transition: 'all 0.2s',
          }}
        >
          <FiUpload size={24} style={{ color: dragOver ? '#66b032' : '#6c757d' }} />
          <small style={{ color: '#6c757d', fontSize: '0.7rem', marginTop: 4 }}>
            Drag & drop
          </small>
        </div>
      )}
    </div>
  );
}
