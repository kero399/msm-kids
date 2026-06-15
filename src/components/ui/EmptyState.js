'use client';

/**
 * EmptyState — friendly placeholder when no data is available.
 *
 * @param {string} icon - Emoji icon
 * @param {string} title - Main message
 * @param {string} [description] - Secondary description
 * @param {string} [actionLabel] - Button text
 * @param {function} [onAction] - Button click handler
 */
export default function EmptyState({ icon = '📭', title, description, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon">{icon}</span>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
      {actionLabel && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
