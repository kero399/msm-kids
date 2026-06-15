'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { useChildren } from '@/lib/hooks';
import { recordAttendance, getAttendanceByClass } from '@/lib/firestore';
import { useToast } from '@/components/ui/Toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ServantAttendancePage() {
  const { user } = useAuth();
  const { children, loading: childrenLoading } = useChildren(user?.classId);
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [attendanceMap, setAttendanceMap] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [pastSessions, setPastSessions] = useState([]);

  // Initialize attendance map when children load
  useEffect(() => {
    if (children.length > 0) {
      const map = {};
      children.forEach((c) => {
        map[c.uid] = null; // null = not marked yet
      });
      setAttendanceMap(map);
    }
  }, [children]);

  // Load past attendance
  useEffect(() => {
    async function loadPast() {
      if (user?.classId) {
        const records = await getAttendanceByClass(user.classId);
        // Group by date
        const byDate = {};
        records.forEach((r) => {
          if (!byDate[r.date]) byDate[r.date] = { date: r.date, present: 0, absent: 0, total: 0 };
          byDate[r.date].total++;
          if (r.present) byDate[r.date].present++;
          else byDate[r.date].absent++;
        });
        setPastSessions(Object.values(byDate).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8));
      }
    }
    loadPast();
  }, [user?.classId]);

  const toggleAttendance = (childUid, status) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [childUid]: prev[childUid] === status ? null : status,
    }));
  };

  const markAll = (status) => {
    const map = {};
    children.forEach((c) => { map[c.uid] = status; });
    setAttendanceMap(map);
  };

  const handleSubmit = async () => {
    const unmarked = Object.values(attendanceMap).filter((v) => v === null);
    if (unmarked.length > 0) {
      showToast(`يوجد ${unmarked.length} طفل لم يتم تحديد حضوره`, 'error');
      return;
    }

    setSubmitting(true);
    try {
      const records = Object.entries(attendanceMap).map(([childUid, present]) => ({
        childUid,
        present,
      }));
      await recordAttendance(user.classId, selectedDate, records, user.uid);
      showToast('تم تسجيل الحضور بنجاح ✅', 'success');
    } catch (err) {
      showToast('حدث خطأ أثناء تسجيل الحضور', 'error');
    }
    setSubmitting(false);
  };

  const markedCount = Object.values(attendanceMap).filter((v) => v !== null).length;
  const presentCount = Object.values(attendanceMap).filter((v) => v === true).length;
  const absentCount = Object.values(attendanceMap).filter((v) => v === false).length;

  if (childrenLoading) {
    return <LoadingSpinner size="lg" text="جارٍ تحميل الأطفال..." />;
  }

  return (
    <>
      <div className="page-action-header">
        <h2>✅ تسجيل الحضور</h2>
        <input
          className="form-input"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ maxWidth: '200px' }}
        />
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <span className="badge badge-blue" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
          📋 الإجمالي: {children.length}
        </span>
        <span className="badge badge-green" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
          ✅ حاضر: {presentCount}
        </span>
        <span className="badge" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', background: 'rgba(252,129,129,0.12)', color: 'var(--danger)' }}>
          ❌ غائب: {absentCount}
        </span>
      </div>

      {/* Bulk Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <button className="btn btn-secondary" style={{ fontSize: '0.85rem' }} onClick={() => markAll(true)}>
          ✅ الكل حاضر
        </button>
        <button className="btn btn-secondary" style={{ fontSize: '0.85rem' }} onClick={() => markAll(false)}>
          ❌ الكل غائب
        </button>
      </div>

      {/* Attendance List */}
      <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
        <ul className="attendance-list">
          {children.map((child) => (
            <li key={child.uid} className="attendance-item">
              <div className="attendance-child-info">
                <span className="attendance-avatar">{child.avatarId || '👦'}</span>
                <span className="attendance-child-name">{child.name}</span>
              </div>
              <div className="attendance-toggle">
                <button
                  className={`attendance-btn ${attendanceMap[child.uid] === true ? 'present' : ''}`}
                  onClick={() => toggleAttendance(child.uid, true)}
                >
                  ✅ حاضر
                </button>
                <button
                  className={`attendance-btn ${attendanceMap[child.uid] === false ? 'absent' : ''}`}
                  onClick={() => toggleAttendance(child.uid, false)}
                >
                  ❌ غائب
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Submit */}
      <motion.button
        className="btn btn-primary btn-lg"
        style={{ width: '100%', marginBottom: '2rem' }}
        onClick={handleSubmit}
        disabled={submitting}
        whileTap={{ scale: 0.98 }}
      >
        {submitting ? 'جارٍ الحفظ...' : `تسجيل الحضور (${markedCount}/${children.length})`}
      </motion.button>

      {/* Past Sessions */}
      {pastSessions.length > 0 && (
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>📅 جلسات سابقة</h3>
          </div>
          <div className="dashboard-card-body">
            <div className="data-table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>التاريخ</th>
                    <th>حاضرون</th>
                    <th>غائبون</th>
                    <th>النسبة</th>
                  </tr>
                </thead>
                <tbody>
                  {pastSessions.map((session) => {
                    const rate = session.total > 0 ? Math.round((session.present / session.total) * 100) : 0;
                    return (
                      <tr key={session.date}>
                        <td>{session.date}</td>
                        <td style={{ color: 'var(--success)', fontWeight: 600 }}>{session.present}</td>
                        <td style={{ color: 'var(--danger)', fontWeight: 600 }}>{session.absent}</td>
                        <td>
                          <span className={`badge ${rate >= 75 ? 'badge-green' : rate >= 50 ? 'badge-yellow' : 'badge-blue'}`}>
                            {rate}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
