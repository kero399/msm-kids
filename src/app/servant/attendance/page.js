'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { useChildren } from '@/lib/hooks';
import { recordAttendance, getAttendanceByClass } from '@/lib/firestore';
import { useToast } from '@/components/ui/Toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

export default function ServantAttendancePage() {
  const { user } = useAuth();
  const { children, loading: childrenLoading } = useChildren(user?.classId);
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [attendanceMap, setAttendanceMap] = useState({});
  const [existingMap, setExistingMap] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [pastSessions, setPastSessions] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  const loadAttendance = async () => {
    if (!user?.classId) return;
    setLoadingAttendance(true);
    try {
      const records = await getAttendanceByClass(user.classId);

      const currentSession = {};
      records
        .filter((r) => r.date === selectedDate)
        .forEach((r) => {
          currentSession[r.childUid] = r.present;
        });

      const byDate = {};
      records.forEach((r) => {
        if (!byDate[r.date]) byDate[r.date] = { date: r.date, present: 0, absent: 0, total: 0 };
        byDate[r.date].total++;
        if (r.present) byDate[r.date].present++;
        else byDate[r.date].absent++;
      });

      setExistingMap(currentSession);
      setAttendanceMap((prev) => {
        const next = {};
        children.forEach((child) => {
          next[child.uid] = currentSession[child.uid] ?? prev[child.uid] ?? null;
        });
        return next;
      });
      setPastSessions(Object.values(byDate).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8));
    } catch (err) {
      console.error('ATTENDANCE_SUBMIT_ERROR: Failed to load attendance records:', err);
      showToast('حدث خطأ أثناء تحميل سجلات الحضور', 'error');
    } finally {
      setLoadingAttendance(false);
    }
  };

  // Initialize attendance map when children load
  useEffect(() => {
    if (children.length > 0) {
      const map = {};
      children.forEach((c) => {
        map[c.uid] = existingMap[c.uid] ?? null; // null = not marked yet
      });
      setAttendanceMap(map);
    }
  }, [children, existingMap]);

  useEffect(() => {
    if (children.length > 0) loadAttendance();
  }, [children.length, selectedDate, user?.classId]);

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
    // ── Pre-flight guards ──────────────────────────────────────────────────────
    if (!user?.uid || !user?.classId) {
      console.error('ATTENDANCE_SUBMIT_ERROR: user or classId is missing', { user });
      showToast('لم يتم تحميل بيانات المستخدم بعد، الرجاء المحاولة مرة أخرى', 'error');
      return;
    }
    if (!selectedDate) {
      console.error('ATTENDANCE_SUBMIT_ERROR: selectedDate is missing');
      showToast('الرجاء اختيار تاريخ الجلسة', 'error');
      return;
    }

    const unmarked = Object.values(attendanceMap).filter((v) => v === null);
    if (unmarked.length > 0) {
      showToast(`يوجد ${unmarked.length} طفل لم يتم تحديد حضوره`, 'error');
      return;
    }

    // ── Build records — filter out any entry with a null/undefined childUid ──
    const records = Object.entries(attendanceMap)
      .filter(([childUid]) => childUid && childUid !== 'undefined')
      .map(([childUid, present]) => ({ childUid, present }));

    if (records.length === 0) {
      console.error('ATTENDANCE_SUBMIT_ERROR: records array is empty after filtering');
      showToast('لا توجد سجلات حضور صالحة للإرسال', 'error');
      return;
    }

    console.log('[Attendance] Submit payload:', {
      classId: user.classId,
      selectedDate,
      recordedBy: user.uid,
      childrenCount: children.length,
      records,
    });

    setSubmitting(true);
    try {
      await recordAttendance(user.classId, selectedDate, records, user.uid);
      showToast('تم تسجيل الحضور بنجاح ✅', 'success');
      await loadAttendance();
    } catch (err) {
      console.error('ATTENDANCE_SUBMIT_ERROR:', err);
      showToast('حدث خطأ أثناء تسجيل الحضور', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const markedCount = Object.values(attendanceMap).filter((v) => v !== null).length;
  const presentCount = Object.values(attendanceMap).filter((v) => v === true).length;
  const absentCount = Object.values(attendanceMap).filter((v) => v === false).length;
  const attendanceWasSaved = Object.keys(existingMap).length > 0;

  if (childrenLoading) {
    return <LoadingSpinner size="lg" text="جارٍ تحميل الأطفال..." />;
  }

  return (
    <>
      <div className="page-action-header">
        <div>
          <h2>✅ تسجيل الحضور</h2>
          <p style={{ color: 'var(--text-light)', marginTop: '0.25rem' }}>
            الفصل: {user?.className || user?.classId || 'فصلي'} — كل طفل حاضر يحصل على 10 نقاط تلقائياً.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {attendanceWasSaved && <span className="badge badge-green">تم حفظ هذه الجلسة</span>}
          <input
            className="form-input"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ maxWidth: '200px' }}
          />
        </div>
      </div>

      {children.length === 0 ? (
        <EmptyState
          icon="👦"
          title="لا يوجد أطفال في فصلك"
          description="لن يظهر هنا إلا الأطفال التابعون للفصل المعيّن لك فقط."
        />
      ) : (
        <>

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
        <span className="badge badge-yellow" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
          ⭐ نقاط متوقعة: +{presentCount * 10}
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
      <div className="dashboard-card" style={{ marginBottom: '1.5rem', opacity: loadingAttendance ? 0.6 : 1 }}>
        <ul className="attendance-list">
          {children.map((child) => (
            <li key={child.uid} className="attendance-item">
              <div className="attendance-child-info">
                <span className="attendance-avatar">{child.avatarId || '👦'}</span>
                <div>
                  <span className="attendance-child-name">{child.name}</span>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '0.15rem' }}>
                    النقاط الحالية: {child.points || 0} — {child.level || 'مبتدئ'}
                  </div>
                </div>
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
        disabled={submitting || loadingAttendance || children.length === 0}
        whileTap={{ scale: 0.98 }}
      >
        {submitting ? 'جارٍ الحفظ...' : attendanceWasSaved ? `تحديث الحضور (${markedCount}/${children.length})` : `تسجيل الحضور (${markedCount}/${children.length})`}
      </motion.button>

        </>
      )}

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
