'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useExcuses, useClasses } from '@/lib/hooks';
import { updateExcuseStatus } from '@/lib/firestore';
import { useToast } from '@/components/ui/Toast';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';

export default function AdminExcusesPage() {
  const { user } = useAuth();
  const { excuses, loading, refresh } = useExcuses();
  const { classes } = useClasses();
  const { showToast } = useToast();
  const [selectedClass, setSelectedClass] = useState('all');

  const handleStatusUpdate = async (excuseId, status) => {
    try {
      await updateExcuseStatus(excuseId, status, user.displayName);
      showToast(`تم ${status === 'acknowledged' ? 'قبول' : 'رفض'} العذر بنجاح`, 'success');
      refresh();
    } catch (err) {
      showToast('حدث خطأ أثناء تحديث حالة العذر', 'error');
    }
  };

  const filteredExcuses = selectedClass === 'all'
    ? excuses
    : excuses.filter((e) => e.classId === selectedClass);

  const columns = [
    { key: 'childName', label: 'اسم الطفل' },
    {
      key: 'classId', label: 'الفصل',
      render: (val) => {
        const cls = classes.find((c) => c.id === val);
        return cls ? cls.name : '—';
      }
    },
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
        <h2>📝 إدارة أعذار الغياب</h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
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
        </div>
      </div>

      {/* Desktop View */}
      <div className="hide-on-mobile">
        <DataTable
          columns={columns}
          data={filteredExcuses}
          loading={loading}
          emptyState={
            <EmptyState
              icon="📝"
              title="لا توجد أعذار غياب"
              description="لم يتم تقديم أي أعذار غياب من قبل أولياء الأمور بعد."
            />
          }
        />
      </div>

      {/* Mobile View */}
      <div className="show-on-mobile">
        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>جاري التحميل...</p>
        ) : filteredExcuses.length === 0 ? (
          <EmptyState
            icon="📝"
            title="لا توجد أعذار غياب"
            description="لم يتم تقديم أي أعذار غياب من قبل أولياء الأمور بعد."
          />
        ) : (
          <div className="mobile-card-list">
            {filteredExcuses.map((excuse) => {
              const cls = classes.find((c) => c.id === excuse.classId);
              return (
                <div key={excuse.id} className="mobile-card">
                  <div className="mobile-card-header">
                    <span style={{ fontWeight: 'bold', color: 'var(--text-dark)', fontFamily: 'Cairo' }}>👦 {excuse.childName}</span>
                    <span className="badge badge-blue">{cls ? cls.name : '—'}</span>
                  </div>
                  <div className="mobile-card-body" style={{ fontSize: '0.95rem', fontWeight: 'normal', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div><strong>تاريخ الغياب:</strong> {excuse.sessionDate}</div>
                    <div><strong>السبب:</strong> {excuse.reason}</div>
                  </div>
                  <div className="mobile-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`badge ${excuse.status === 'acknowledged' ? 'badge-green' : excuse.status === 'rejected' ? 'badge-yellow' : 'badge-blue'}`}>
                      {excuse.status === 'acknowledged' ? 'مقبول' : excuse.status === 'rejected' ? 'مرفوض' : 'قيد الانتظار'}
                    </span>
                    
                    {excuse.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-primary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: 'var(--success)', borderColor: 'var(--success)' }}
                          onClick={() => handleStatusUpdate(excuse.id, 'acknowledged')}
                        >
                          قبول
                        </button>
                        <button
                          className="btn"
                          style={{
                            padding: '0.35rem 0.75rem', fontSize: '0.8rem',
                            background: 'rgba(252,129,129,0.1)', color: 'var(--danger)',
                          }}
                          onClick={() => handleStatusUpdate(excuse.id, 'rejected')}
                        >
                          رفض
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                        الرد: {excuse.acknowledgedBy}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
