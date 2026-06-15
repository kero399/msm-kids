'use client';

import { useState } from 'react';
import { useClasses, useChildren, useAttendance } from '@/lib/hooks';

export default function AdminReportsPage() {
  const { classes } = useClasses();
  const { children } = useChildren();
  const [selectedClass, setSelectedClass] = useState('all');

  const filteredChildren = selectedClass === 'all'
    ? children
    : children.filter((c) => c.classId === selectedClass);

  const sortedByPoints = [...filteredChildren].sort((a, b) => b.points - a.points);

  const handleExportCSV = () => {
    const headers = ['الاسم', 'المرحلة', 'النقاط', 'المستوى'];
    const rows = sortedByPoints.map((c) => [c.name, c.grade, c.points, c.level]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const bom = '\uFEFF';
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `msm-kids-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="page-action-header">
        <h2>📋 التقارير</h2>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select
            className="form-input"
            style={{ maxWidth: '200px', padding: '0.5rem 1rem' }}
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="all">جميع الفصول</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={handleExportCSV}>
            📥 تصدير CSV
          </button>
        </div>
      </div>

      {/* Points Leaderboard */}
      <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
        <div className="dashboard-card-header">
          <h3>🏆 ترتيب النقاط</h3>
        </div>
        <div className="dashboard-card-body">
          {sortedByPoints.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>
              لا توجد بيانات
            </p>
          ) : (
            <div className="data-table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>الاسم</th>
                    <th>المرحلة</th>
                    <th>النقاط</th>
                    <th>المستوى</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedByPoints.map((child, i) => (
                    <tr key={child.uid}>
                      <td>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                      </td>
                      <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                        {child.name}
                      </td>
                      <td>{child.grade}</td>
                      <td><span className="points-badge">⭐ {child.points}</span></td>
                      <td><span className="level-badge">{child.level}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Class Summary */}
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h3>📊 ملخص الفصول</h3>
        </div>
        <div className="dashboard-card-body">
          <div className="data-table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>الفصل</th>
                  <th>المرحلة</th>
                  <th>عدد الأطفال</th>
                  <th>الخادم</th>
                  <th>إجمالي النقاط</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => {
                  const classChildren = children.filter((c) => c.classId === cls.id);
                  const totalPoints = classChildren.reduce((sum, c) => sum + (c.points || 0), 0);
                  return (
                    <tr key={cls.id}>
                      <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{cls.name}</td>
                      <td>{cls.grade}</td>
                      <td>{classChildren.length}</td>
                      <td>{cls.servantName || <span style={{ color: 'var(--text-light)' }}>غير معيّن</span>}</td>
                      <td><span className="points-badge">⭐ {totalPoints}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
