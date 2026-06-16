'use client';

import { useAuth } from '@/lib/auth';
import { useChildren, useAttendance } from '@/lib/hooks';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ServantReportsPage() {
  const { user } = useAuth();
  const { children, loading: childrenLoading } = useChildren(user?.classId);
  const { attendance, loading: attendanceLoading } = useAttendance(user?.classId);

  if (childrenLoading || attendanceLoading) {
    return <LoadingSpinner size="lg" text="جارٍ تحميل التقارير..." />;
  }

  // Build per-child attendance stats
  const childStats = children.map((child) => {
    const childRecords = attendance.filter((a) => a.childUid === child.uid);
    const total = childRecords.length;
    const present = childRecords.filter((a) => a.present).length;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;
    return { ...child, totalSessions: total, presentCount: present, attendanceRate: rate };
  });

  const sortedByPoints = [...childStats].sort((a, b) => b.points - a.points);
  const sortedByAttendance = [...childStats].sort((a, b) => b.attendanceRate - a.attendanceRate);

  return (
    <>
      <div className="page-action-header">
        <h2>📋 تقارير الفصل</h2>
      </div>

      {/* Points Ranking */}
      <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
        <div className="dashboard-card-header">
          <h3>🏆 ترتيب النقاط</h3>
        </div>
        <div className="dashboard-card-body">
          {sortedByPoints.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>لا توجد بيانات</p>
          ) : (
            <>
              {/* Desktop view */}
              <div className="hide-on-mobile">
                <div className="data-table-scroll">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>الاسم</th>
                        <th>النقاط</th>
                        <th>المستوى</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedByPoints.map((child, i) => (
                        <tr key={child.uid}>
                          <td>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
                          <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{child.name}</td>
                          <td><span className="points-badge">⭐ {child.points}</span></td>
                          <td><span className="level-badge">{child.level}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile view */}
              <div className="show-on-mobile">
                <div className="mobile-card-list">
                  {sortedByPoints.map((child, i) => (
                    <div key={child.uid} className="mobile-card">
                      <div className="mobile-card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1.25rem' }}>
                            {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                          </span>
                          <span style={{ fontWeight: 'bold', color: 'var(--text-dark)', fontFamily: 'Cairo' }}>{child.name}</span>
                        </div>
                        <span className="level-badge">{child.level}</span>
                      </div>
                      <div className="mobile-card-footer" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <span className="points-badge">⭐ {child.points} نقطة</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h3>📊 ملخص الحضور</h3>
        </div>
        <div className="dashboard-card-body">
          {sortedByAttendance.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>لا توجد بيانات</p>
          ) : (
            <>
              {/* Desktop view */}
              <div className="hide-on-mobile">
                <div className="data-table-scroll">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>الاسم</th>
                        <th>الجلسات</th>
                        <th>حاضر</th>
                        <th>نسبة الحضور</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedByAttendance.map((child) => (
                        <tr key={child.uid}>
                          <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{child.name}</td>
                          <td>{child.totalSessions}</td>
                          <td>{child.presentCount}</td>
                          <td>
                            <span className={`badge ${child.attendanceRate >= 75 ? 'badge-green' : child.attendanceRate >= 50 ? 'badge-yellow' : 'badge-blue'}`}>
                              {child.attendanceRate}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile view */}
              <div className="show-on-mobile">
                <div className="mobile-card-list">
                  {sortedByAttendance.map((child) => (
                    <div key={child.uid} className="mobile-card">
                      <div className="mobile-card-header">
                        <span style={{ fontWeight: 'bold', color: 'var(--text-dark)', fontFamily: 'Cairo' }}>👦 {child.name}</span>
                        <span className={`badge ${child.attendanceRate >= 75 ? 'badge-green' : child.attendanceRate >= 50 ? 'badge-yellow' : 'badge-blue'}`}>
                          {child.attendanceRate}% حضور
                        </span>
                      </div>
                      <div className="mobile-card-body" style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                        <div>إجمالي الجلسات: {child.totalSessions}</div>
                        <div>حاضر: {child.presentCount} مرة</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
