'use client';

import { useState } from 'react';
import { useServants } from '@/lib/hooks';
import { createServant } from '@/lib/firestore';
import { useToast } from '@/components/ui/Toast';
import Modal from '@/components/ui/Modal';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';

export default function AdminServantsPage() {
  const { servants, loading, refresh } = useServants();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    try {
      await createServant(form);
      showToast('تم إنشاء حساب الخادم بنجاح', 'success');
      setShowModal(false);
      setForm({ name: '', email: '', phone: '' });
      refresh();
    } catch (err) {
      showToast('حدث خطأ أثناء إنشاء الحساب', 'error');
    }
  };

  const columns = [
    { key: 'name', label: 'الاسم' },
    { key: 'email', label: 'البريد الإلكتروني' },
    { key: 'phone', label: 'الهاتف', render: (val) => val || '—' },
    {
      key: 'className', label: 'الفصل المعيّن',
      render: (val) => val || <span style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>غير معيّن</span>,
    },
    {
      key: 'status', label: 'الحالة',
      render: (_, row) => (
        <span className={`badge ${row.classId ? 'badge-green' : 'badge-yellow'}`}>
          {row.classId ? 'نشط' : 'متاح'}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="page-action-header">
        <h2>🙏 إدارة الخدّام</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + إضافة خادم جديد
        </button>
      </div>

      <DataTable
        columns={columns}
        data={servants}
        loading={loading}
        searchable
        searchPlaceholder="بحث عن خادم..."
        searchKeys={['name', 'email']}
        emptyState={
          <EmptyState
            icon="🙏"
            title="لا يوجد خدّام بعد"
            description="أضف أول خادم للخدمة"
            actionLabel="إضافة خادم"
            onAction={() => setShowModal(true)}
          />
        }
      />

      {/* Create Servant Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="إنشاء حساب خادم جديد">
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">الاسم الكامل</label>
            <input
              className="form-input" type="text" required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">البريد الإلكتروني</label>
            <input
              className="form-input" type="email" required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">رقم الهاتف</label>
            <input
              className="form-input" type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            إنشاء الحساب
          </button>
        </form>
      </Modal>
    </>
  );
}
