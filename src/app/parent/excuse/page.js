'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { getChildById, submitAbsenceExcuse, getAbsenceExcusesByChild } from '@/lib/firestore';
import { useToast } from '@/components/ui/Toast';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';

export default function ParentExcusePage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [child, setChild] = useState(null);
  const [excuses, setExcuses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [sessionDate, setSessionDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadData() {
    if (!user?.linkedChildUid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [childData, excuseData] = await Promise.all([
        getChildById(user.linkedChildUid),
        getAbsenceExcusesByChild(user.linkedChildUid),
      ]);
      setChild(childData);
      setExcuses(excuseData);
    } catch (err) {
      console.error('Error loading excuses data:', err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sessionDate) {
      showToast('يرجى تحديد تاريخ الجلسة', 'error');
      return;
    }
    if (!reason.trim()) {
      showToast('يرجى كتابة سبب الغياب', 'error');
      return;
    }

    // Date validation: must be future or today
    const selectedDateStr = sessionDate; // YYYY-MM-DD
    const todayStr = new Date().toISOString().split('T')[0];
    if (selectedDateStr < todayStr) {
      showToast('لا يمكن تقديم عذر غياب لتاريخ سابق (يجب أن يكون اليوم أو في المستقبل)', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await submitAbsenceExcuse({
        parentUid: user.uid,
        childUid: user.linkedChildUid,
        childName: child.name,
        classId: child.classId,
        sessionDate,
        reason,
      });

      showToast('تم تقديم عذر الغياب بنجاح وهو قيد المراجعة', 'success');
      setSessionDate('');
      setReason('');
      loadData(); // Reload excuses list
    } catch (err) {
      showToast('حدث خطأ أثناء تقديم العذر', 'error');
    }
    setSubmitting(false);
  };

  if (loading && excuses.length === 0) {
    return <p style={{ textAlign: 'center', padding: '2rem' }}>جاري التحميل...</p>;
  }

  const columns = [
    { key: 'sessionDate', label: 'تاريخ الغياب' },
    { key: 'reason', label: 'السبب' },
    {
      key: 'status', label: 'الحالة',
      render: (val) => (
        <span className={`badge ${val === 'acknowledged' ? 'badge-green' : val === 'rejected' ? 'badge-yellow' : 'badge-blue'}`}>
          {val === 'acknowledged' ? 'مقبول' : val === 'rejected' ? 'مرفوض' : 'قيد الانتظار'}
        </span>
      ),
    },
    {
      key: 'reply', label: 'الرد',
      render: (_, row) => (
        row.status !== 'pending' ? `تم الرد بواسطة ${row.acknowledgedBy || 'الخادم'}` : 'في انتظار المراجعة'
      )
    }
  ];

  return (
    <>
      <div className="page-action-header">
        <h2>📝 تقديم عذر غياب مسبق للطفل</h2>
      </div>

      <div className="dashboard-grid" style={{ alignItems: 'start' }}>
        {/* Excuse Form */}
        <div className="dashboard-card" style={{ padding: '1.5rem' }}>
          <h3 className="card-title" style={{ marginBottom: '1.5rem' }}>📝 طلب عذر جديد</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.95rem' }}>اسم الطفل المستفيد</label>
              <input
                type="text"
                className="form-input"
                value={child ? child.name : 'جاري التحميل...'}
                disabled
                style={{ background: '#EDF2F7', color: 'var(--text-light)', cursor: 'not-allowed' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.95rem' }}>تاريخ الجلسة القادمة</label>
              <input
                type="date"
                className="form-input"
                required
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.95rem' }}>سبب الغياب</label>
              <textarea
                className="form-input"
                required
                rows="4"
                placeholder="يرجى كتابة سبب غياب الطفل بالتفصيل..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }} disabled={submitting || !child}>
              {submitting ? 'جاري الإرسال...' : 'تقديم طلب العذر 📨'}
            </button>
          </form>
        </div>

        {/* Excuses History */}
        <div className="dashboard-card" style={{ padding: '1.5rem' }}>
          <h3 className="card-title" style={{ marginBottom: '1.5rem' }}>📋 الطلبات المقدمة سابقاً</h3>
          
          {/* Desktop View */}
          <div className="hide-on-mobile">
            <DataTable
              columns={columns}
              data={excuses}
              loading={loading}
              emptyState={
                <EmptyState
                  icon="📝"
                  title="لا توجد أعذار غياب"
                  description="لم تقم بتقديم أي أعذار غياب للطفل سابقاً."
                />
              }
            />
          </div>

          {/* Mobile View */}
          <div className="show-on-mobile">
            {excuses.length === 0 ? (
              <EmptyState
                icon="📝"
                title="لا توجد أعذار غياب"
                description="لم تقم بتقديم أي أعذار غياب للطفل سابقاً."
              />
            ) : (
              <div className="mobile-card-list">
                {excuses.map((excuse) => (
                  <div key={excuse.id} className="mobile-card">
                    <div className="mobile-card-header">
                      <span style={{ fontWeight: 'bold', color: 'var(--med-blue)', fontFamily: 'Cairo' }}>📅 {excuse.sessionDate}</span>
                      <span className={`badge ${excuse.status === 'acknowledged' ? 'badge-green' : excuse.status === 'rejected' ? 'badge-yellow' : 'badge-blue'}`}>
                        {excuse.status === 'acknowledged' ? 'مقبول' : excuse.status === 'rejected' ? 'مرفوض' : 'قيد الانتظار'}
                      </span>
                    </div>
                    <div className="mobile-card-body" style={{ fontSize: '0.95rem', fontWeight: 'normal' }}>
                      {excuse.reason}
                    </div>
                    <div className="mobile-card-footer" style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                      <span>
                        {excuse.status !== 'pending' ? `الرد: بواسطة ${excuse.acknowledgedBy || 'الخادم'}` : 'في انتظار المراجعة'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
