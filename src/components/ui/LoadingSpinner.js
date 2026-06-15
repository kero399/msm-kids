'use client';

export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = {
    sm: { width: 24, border: 3 },
    md: { width: 40, border: 4 },
    lg: { width: 56, border: 5 },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className="loading-spinner-wrapper">
      <div
        className="loading-spinner"
        style={{ width: s.width, height: s.width, borderWidth: s.border }}
      />
      {text && <p className="loading-spinner-text">{text}</p>}
    </div>
  );
}
