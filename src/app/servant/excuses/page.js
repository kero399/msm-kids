'use client';

import { useAuth } from '@/lib/auth';
import { useExcuses } from '@/lib/hooks';
import { updateExcuseStatus } from '@/lib/firestore';
import { useToast } from '@/components/ui/Toast';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';

export default function ServantExcusesPage() {
  const { user } = useAuth();
  const { excuses, loading, refresh } = useExcuses(user?.classId);
  const { showToast } = useToast();

  const handleStatusUpdate = async (excuseId, status) => {
    try {
      await updateExcuseStatus(excuseId, status, user.displayName);
      showToast(`تم ${status === 'acknowledged' ? 'قبول' : 'رفض'} العذر بنجاح`, 'success');
      refresh();
    } catch (err) {
      showToast('حدث خطأ أثناء تحديث حالة العذر', 'error');
    }
  };

  const columns = [
    { key: 'childName', label: 'اسم الطفل' },
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
      key: 'actions', label: 'إجراءات',
      render: (_, row) => (
        row.status === 'pending' ? (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-primary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: 'var(--success)', borderColor: 'var(--success)' }}
              onClick={() => handleStatusUpdate(row.id, 'acknowledged')}
            >
              قبول
            </button>
            <button
              className="btn"
              style={{
                padding: '0.35rem 0.75rem', fontSize: '0.8rem',
                background: 'rgba(252,129,129,0.1)', color: 'var(--danger)',
              }}
              onClick={() => handleStatusUpdate(row.id, 'rejected')}
            >
              رفض
            </button>
          </div>
        ) : (
          <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
            تم الرد بواسطة {row.acknowledgedBy || '—'}
          </span>
        )
      ),
    },
  ];

  return (
    <>
      <div className="page-action-header">
        <h2>📝 أعذار الغياب المقدمة</h2>
      </div>

      <DataTable
        columns={columns}
        data={excuses}
        loading={loading}
        emptyState={
          <EmptyState
            icon="📝"
            title="لا توجد أعذار غياب"
            description="لم يتم تقديم أي أعذار غياب من قبل أولياء الأمور لهذا الفصل."
          />
        }
      />
    </>
  );
}
