'use client';

import { motion } from 'framer-motion';

/**
 * StatCard — dashboard statistic card with icon, value, and label.
 *
 * @param {string} icon - Emoji or icon character
 * @param {string|number} value - The stat number/value
 * @param {string} label - Description label
 * @param {string} [color] - Accent color (CSS variable name without --)
 * @param {number} [delay=0] - Animation delay
 */
export default function StatCard({ icon, value, label, color = 'medium-blue', delay = 0 }) {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div
        className="stat-card-icon"
        style={{ background: `var(--${color})` }}
      >
        {icon}
      </div>
      <div className="stat-card-info">
        <span className="stat-card-value">{value}</span>
        <span className="stat-card-label">{label}</span>
      </div>
    </motion.div>
  );
}
