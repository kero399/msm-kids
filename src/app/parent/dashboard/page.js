'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { getChildById, getAttendanceByChild, getAbsenceExcusesByChild, getRegistrationsByChild, getTrips } from '@/lib/firestore';
import StatCard from '@/components/ui/StatCard';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ParentDashboardPage() {
  const { user } = useAuth();
  const [child, setChild] = useState(null);
  const [records, setRecords] = useState([]);
  const [excuses, setExcuses] = useState([]);
  const [registeredTrips, setRegisteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user?.linkedChildUid) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [childData, attData, excuseData, regs, allTrips] = await Promise.all([
          getChildById(user.linkedChildUid),
          getAttendanceByChild(user.linkedChildUid),
          getAbsenceExcusesByChild(user.linkedChildUid),
          getRegistrationsByChild(user.linkedChildUid),
          getTrips()
        ]);
        setChild(childData);
        setRecords(attData);
        setExcuses(excuseData);

        const enriched = regs.map((reg) => {
          const trip = allTrips.find((t) => t.id === reg.tripId);
          return {
            ...reg,
            tripTitle: trip ? trip.title : 'رحلة غير معروفة',
            tripDate: trip ? trip.date : null,
            tripLocation: trip ? trip.location : '',
            tripIcon: trip ? trip.icon : '✈️',
          };
        }).filter(r => r.tripDate);
        setRegisteredTrips(enriched);
      } catch (err) {
        console.error('Error loading parent dashboard data:', err);
      }
      setLoading(false);
    }
    loadData();
  }, [user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user?.linkedChildUid || !child) {
    return (
      <EmptyState
        icon="👦"
        title="لم يتم ربط أي طفل بحسابك"
        description="يرجى التواصل مع مسؤول الخدمة أو الخادم لربط حساب ابنك/ابنتك بحساب ولي الأمر الخاص بك."
      />
    );
  }

  // Calculate stats
  const totalSessions = records.length;
  const presentCount = records.filter((r) => r.present).length;
  const attendanceRate = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;

  // Enhance attendance records with excuse information
  const enhancedRecords = records.map((rec) => {
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
          return <span className="badge badge-green">حاضر 🟢</span>;
        }
        if (row.excuseStatus === 'acknowledged') {
          return <span className="badge badge-blue">غائب بعذر مقبول 🔵</span>;
        }
        if (row.excuseStatus === 'pending') {
          return <span className="badge badge-blue" style={{ opacity: 0.75 }}>غائب (عذر معلق) ⏳</span>;
        }
        return <span className="badge badge-yellow">غائب 🔴</span>;
      }
    },
    {
      key: 'notes', label: 'التفاصيل',
      render: (_, row) => {
        if (row.present) return 'سجل حضوراً وتفاعل مع الدرس';
        if (row.excuseStatus) return `عذر غياب: ${row.excuseReason}`;
        return 'غياب بدون عذر مسبق';
      }
    }
  ];

  return (
    <>
      {/* Child Information Header */}
      <div className="hero-banner" style={{
        background: 'linear-gradient(135deg, var(--med-blue) 0%, #1A365D 100%)',
        borderRadius: '16px',
        padding: '2rem',
        color: '#fff',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            fontSize: '3.5rem',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '50%',
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {child.avatarId || '👦'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', fontFamily: 'Cairo' }}>
              لوحة متابعة الطفل: {child.name}
            </h2>
            <p style={{ margin: 0, opacity: 0.85, fontSize: '0.95rem' }}>
              الصف الدراسي: {child.grade} — فصل: {child.className || 'الصف الأول'}
            </p>
          </div>
        </div>
      </div>

      {/* Child Stats */}
      <div className="stat-cards-grid" style={{ marginBottom: '2rem' }}>
        <StatCard icon="💰" value={child.points} label="مجموع نقاط الطفل" />
        <StatCard icon="🏆" value={child.level} label="مستوى الطفل" />
        <StatCard icon="📊" value={`${attendanceRate}%`} label="نسبة الحضور" />
      </div>

      {/* Trips registration section */}
      <div className="dashboard-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          ✈️ رحلات الطفل المسجل بها
        </h3>
        {registeredTrips.length === 0 ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-light)', border: '1px dashed rgba(135,206,235,0.2)', borderRadius: '12px' }}>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>لم يتم تسجيل الطفل في أي رحلة قادمة بعد.</p>
            <a href="/trips" style={{ color: 'var(--sky-blue-dark)', fontSize: '0.85rem', fontWeight: 'bold', textDecoration: 'underline', marginTop: '0.5rem', display: 'inline-block' }}>
              تصفح الرحلات المتاحة للتسجيل ➔
            </a>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {registeredTrips.map((reg) => (
              <div key={reg.id} style={{
                background: 'rgba(135,206,235,0.03)',
                border: '1px solid rgba(135,206,235,0.1)',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem'
              }}>
                <span style={{ fontSize: '3rem' }}>{reg.tripIcon}</span>
                <div>
                  <strong style={{ fontSize: '1.05rem', display: 'block', fontFamily: 'Cairo' }}>{reg.tripTitle}</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', display: 'block', marginTop: '0.3rem' }}>
                    📅 {new Date(reg.tripDate).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', display: 'block' }}>
                    📍 {reg.tripLocation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-card" style={{ padding: '1.5rem' }}>
        <h3 className="card-title" style={{ marginBottom: '1.25rem' }}>📅 سجل حضور الطفل الأخير</h3>
        <DataTable
          columns={columns}
          data={enhancedRecords}
          loading={false}
          emptyState={
            <EmptyState
              icon="📅"
              title="لا توجد جلسات حضور مسجلة"
              description="لم يتم تسجيل حضور للطفل بعد."
            />
          }
        />
      </div>
    </>
  );
}
