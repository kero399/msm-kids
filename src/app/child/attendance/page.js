'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { getAttendanceByChild, getAbsenceExcusesByChild } from '@/lib/firestore';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';

export default function ChildAttendancePage() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [excuses, setExcuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user?.uid) return;
      setLoading(true);
      try {
        const [attData, excuseData] = await Promise.all([
          getAttendanceByChild(user.uid),
          getAbsenceExcusesByChild(user.uid),
        ]);
        setRecords(attData);
        setExcuses(excuseData);
      } catch (err) {
        console.error('Error loading attendance records:', err);
      }
      setLoading(false);
    }
    loadData();
  }, [user]);

  // Calculate stats
  const totalSessions = records.length;
  const presentCount = records.filter((r) => r.present).length;
  const attendanceRate = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;

  // Enhance attendance records with excuse information
  const enhancedRecords = records.map((rec) => {
    // Find if there was an excuse for this session date
    const excuse = excuses.find((e) => e.sessionDate === rec.date);
    return {
      ...rec,
      excuseStatus: excuse ? excuse.status : null,
      excuseReason: excuse ? excuse.reason : null,
    };
  });

  const columns = [
    { key: 'date', label: 'تاريخ الجلسة' },
    {
      key: 'status', label: 'الحالة',
      render: (_, row) => {
        if (row.present) {
          return <span className="badge badge-green"> حاضر 🟢</span>;
        }
        if (row.excuseStatus === 'acknowledged') {
          return <span className="badge badge-blue"> غائب بعذر مقبول 🔵</span>;
        }
        if (row.excuseStatus === 'pending') {
          return <span className="badge badge-blue" style={{ opacity: 0.75 }}> غائب (عذر معلق) ⏳</span>;
        }
        return <span className="badge badge-yellow"> غائب 🔴</span>;
      }
    },
    {
      key: 'notes', label: 'ملاحظات',
      render: (_, row) => {
        if (row.present) return 'حضور رائع! (+10 نقاط)';
        if (row.excuseStatus) return `عذر: ${row.excuseReason}`;
        return 'لم يتم تقديم عذر غياب';
      }
    }
  ];

  return (
    <>
      <div className="page-action-header">
        <h2>📅 سجل حضوري وغيابي</h2>
      </div>

      {/* Summary stats */}
      <div className="stat-cards-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <span className="stat-number">{totalSessions}</span>
            <span className="stat-label">إجمالي الجلسات</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-number">{presentCount}</span>
            <span className="stat-label">عدد مرات الحضور</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <span className="stat-number">{attendanceRate}%</span>
            <span className="stat-label">نسبة الحضور العامة</span>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={enhancedRecords}
        loading={loading}
        emptyState={
          <EmptyState
            icon="📅"
            title="لا يوجد سجل حضور بعد"
            description="عندما يبدأ الخادم بتسجيل الحضور، ستظهر تفاصيل الجلسات هنا."
          />
        }
      />
    </>
  );
}
