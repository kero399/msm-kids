'use client';

import { useAuth } from '@/lib/auth';
import { useVerses } from '@/lib/hooks';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';

export default function ChildVersesPage() {
  const { user } = useAuth();
  const { verses, loading } = useVerses(user?.uid);

  const memorized = verses.filter((v) => v.memorizedDate !== null);
  const pending = verses.filter((v) => v.memorizedDate === null);

  const columns = [
    { key: 'verseText', label: 'الآية الكريمة', render: (val) => <strong style={{ fontSize: '1.05rem', color: 'var(--text-dark)' }}>« {val} »</strong> },
    { key: 'reference', label: 'الشاهد / المرجع' },
    { key: 'pointsAwarded', label: 'النقاط', render: (val) => <span style={{ fontWeight: 'bold', color: 'var(--med-blue)' }}>+{val}</span> },
    {
      key: 'status', label: 'الحالة',
      render: (_, row) => (
        row.memorizedDate ? (
          <span className="badge badge-green">تم التسميع الحفظ ✅</span>
        ) : (
          <span className="badge badge-yellow">مطلوب الحفظ ⏳</span>
        )
      ),
    },
    {
      key: 'date', label: 'التاريخ',
      render: (_, row) => {
        const d = row.memorizedDate || row.assignedDate;
        return d ? new Date(d).toLocaleDateString('ar-EG') : '—';
      }
    }
  ];

  return (
    <>
      <div className="page-action-header">
        <h2>📖 منجم الآيات وحفظ كلمة الله</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }} className="dashboard-grid">
        <div className="stat-card" style={{ background: 'rgba(72,187,120,0.08)', border: '1px solid var(--success)' }}>
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-number" style={{ color: 'var(--success)' }}>{memorized.length}</span>
            <span className="stat-label">آيات تم تسميعها وحفظها</span>
          </div>
        </div>
        <div className="stat-card" style={{ background: 'rgba(237,137,54,0.08)', border: '1px solid var(--warning)' }}>
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <span className="stat-number" style={{ color: 'var(--warning)' }}>{pending.length}</span>
            <span className="stat-label">آيات مطلوبة ومستحقة الحفظ</span>
          </div>
        </div>
      </div>

      <div className="dashboard-card" style={{ padding: '1.5rem' }}>
        <h3 className="card-title" style={{ marginBottom: '1.25rem' }}>📖 جدول الآيات الخاصة بك</h3>
        <DataTable
          columns={columns}
          data={verses}
          loading={loading}
          emptyState={
            <EmptyState
              icon="📖"
              title="لا توجد آيات مخصصة"
              description="لم يتم إسناد أي آيات لحسابك لحفظها بعد."
            />
          }
        />
      </div>
    </>
  );
}
