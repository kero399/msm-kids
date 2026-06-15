'use client';

import { motion, AnimatePresence } from 'framer-motion';

/**
 * Modal — overlay dialog with animation.
 *
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {function} onClose - Called when backdrop or X is clicked
 * @param {string} title - Modal header text
 * @param {React.ReactNode} children - Modal body content
 * @param {string} [maxWidth='480px'] - Max width of the modal card
 */
export default function Modal({ isOpen, onClose, title, children, maxWidth = '480px' }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth }}
          >
            <div className="modal-header">
              <h3>{title}</h3>
              <button
                className="modal-close"
                onClick={onClose}
                aria-label="إغلاق"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
