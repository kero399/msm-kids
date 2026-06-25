'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { useClassStats, useAttendance } from '@/lib/hooks';
import StatCard from '@/components/ui/StatCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ServantDashboardPage() {
  const { user } = useAuth();
  const { stats, loading } = useClassStats(user?.classId);
  const { attendance, loading: attendanceLoading } = useAttendance(user?.classId);

  if (loading || attendanceLoading) {
    return <LoadingSpinner size="lg" text="جارٍ تحميل بيانات الفصل..." />;
  }

  const today = new Date().toISOString().split('T')[0];
  const todayRecords = attendance.filter((record) => record.date === today);
  const todayPresent = todayRecords.filter((record) => record.present).length;
  const todayAbsent = todayRecords.filter((record) => !record.present).length;
  const averagePoints = stats.totalChildren > 0 ? Math.round(stats.totalPoints / stats.totalChildren) : 0;

  return (
    <>
      {/* Class Info Header */}
      <motion.div
        className="dashboard-card"
        style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, var(--medium-blue), var(--sky-blue-dark))', color: 'var(--white)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="dashboard-card-body" style={{ textAlign: 'center', padding: '2rem' }}>
          <h2 style={{ color: 'var(--white)', marginBottom: '0.5rem' }}>
            {user?.className || 'فصلي'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>
            مرحباً {user?.displayName} 👋
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="stat-cards-grid">
        <StatCard icon="👦" value={stats.totalChildren} label="عدد الأطفال" color="medium-blue" delay={0} />
        <StatCard icon="📊" value={`${stats.attendanceRate}%`} label="نسبة الحضور" color="success" delay={0.1} />
        <StatCard icon="⭐" value={stats.totalPoints} label="إجمالي النقاط" color="light-yellow-dark" delay={0.2} />
        <StatCard icon="⚖️" value={averagePoints} label="متوسط نقاط الطفل" color="sky-blue" delay={0.3} />
      </div>

      <motion.div
        className="dashboard-card"
        style={{ marginBottom: '1.5rem' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <div className="dashboard-card-header">
          <h3>✅ حالة حضور اليوم</h3>
        </div>
        <div className="dashboard-card-body">
          {todayRecords.length === 0 ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <p style={{ color: 'var(--text-light)', margin: 0 }}>لم يتم تسجيل حضور اليوم بعد.</p>
              <a className="btn btn-primary" href="/servant/attendance">تسجيل الحضور الآن</a>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <span className="badge badge-green" style={{ padding: '0.5rem 1rem' }}>✅ حاضر: {todayPresent}</span>
              <span className="badge" style={{ padding: '0.5rem 1rem', background: 'rgba(252,129,129,0.12)', color: 'var(--danger)' }}>❌ غائب: {todayAbsent}</span>
              <span className="badge badge-yellow" style={{ padding: '0.5rem 1rem' }}>⭐ نقاط اليوم: +{todayPresent * 10}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Top Children */}
      <motion.div
        className="dashboard-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="dashboard-card-header">
          <h3>🏆 متتبع النقاط في فصلي</h3>
        </div>
        <div className="dashboard-card-body">
          {stats.topChildren.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>
              لا يوجد أطفال في الفصل بعد
            </p>
          ) : (
            <ul style={{ listStyle: 'none' }}>
              {stats.topChildren.map((child, i) => (
                <li
                  key={child.uid}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.65rem 0',
                    borderBottom: i < stats.topChildren.length - 1 ? '1px solid rgba(135,206,235,0.08)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                    </span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.9rem' }}>
                      {child.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="level-badge">{child.level || 'مبتدئ'}</span>
                    <span className="points-badge">⭐ {child.points || 0}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </>
  );
}
