'use client';

import { motion } from 'framer-motion';
import StatCard from '@/components/ui/StatCard';
import { useDashboardStats, useActivityLog, useChildren } from '@/lib/hooks';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminDashboardPage() {
  const { stats, loading: statsLoading } = useDashboardStats();
  const { logs, loading: logsLoading } = useActivityLog();
  const { children: allChildren, loading: childrenLoading } = useChildren();

  const topChildren = [...allChildren]
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  if (statsLoading) {
    return <LoadingSpinner size="lg" text="جارٍ تحميل البيانات..." />;
  }

  return (
    <>
      {/* Stats Row */}
      <div className="stat-cards-grid">
        <StatCard icon="👦" value={stats.totalChildren} label="إجمالي الأطفال" color="medium-blue" delay={0} />
        <StatCard icon="🙏" value={stats.totalServants} label="الخدّام النشطين" color="sky-blue-dark" delay={0.1} />
        <StatCard icon="🏫" value={stats.totalClasses} label="الفصول" color="dark-blue" delay={0.2} />
        <StatCard icon="📊" value={`${stats.attendanceRate}%`} label="نسبة الحضور" color="success" delay={0.3} />
      </div>

      {/* Two-column grid */}
      <div className="dashboard-grid">
        {/* Top Children */}
        <motion.div
          className="dashboard-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="dashboard-card-header">
            <h3>🏆 أفضل الأطفال</h3>
          </div>
          <div className="dashboard-card-body">
            {childrenLoading ? (
              <LoadingSpinner size="sm" />
            ) : topChildren.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>لا توجد بيانات بعد</p>
            ) : (
              <ul style={{ listStyle: 'none' }}>
                {topChildren.map((child, i) => (
                  <li
                    key={child.uid}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0',
                      borderBottom: i < topChildren.length - 1 ? '1px solid rgba(135,206,235,0.08)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                      </span>
                      <div>
                        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.9rem' }}>
                          {child.name}
                        </span>
                        <span className="level-badge" style={{ marginRight: '0.5rem' }}>
                          {child.level}
                        </span>
                      </div>
                    </div>
                    <span className="points-badge">⭐ {child.points}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>

        {/* Activity Log */}
        <motion.div
          className="dashboard-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="dashboard-card-header">
            <h3>📋 آخر الأنشطة</h3>
          </div>
          <div className="dashboard-card-body">
            {logsLoading ? (
              <LoadingSpinner size="sm" />
            ) : logs.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>لا توجد أنشطة حديثة</p>
            ) : (
              <ul className="activity-log">
                {logs.map((log) => (
                  <li key={log.id} className="activity-log-item">
                    <span className="activity-log-dot" />
                    <div className="activity-log-content">
                      <span className="activity-log-action">{log.action}</span>
                      <p className="activity-log-details">{log.details}</p>
                    </div>
                    <span className="activity-log-time">
                      {log.timestamp instanceof Date
                        ? log.timestamp.toLocaleDateString('ar-EG')
                        : ''}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
