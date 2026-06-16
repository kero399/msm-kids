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
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredServants = searchQuery
    ? servants.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : servants;

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
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-input"
            placeholder="بحث عن خادم بالاسم أو البريد..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ maxWidth: '240px', padding: '0.5rem 1rem' }}
          />
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + إضافة خادم جديد
          </button>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hide-on-mobile">
        <DataTable
          columns={columns}
          data={filteredServants}
          loading={loading}
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
      </div>

      {/* Mobile view */}
      <div className="show-on-mobile">
        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>جاري التحميل...</p>
        ) : filteredServants.length === 0 ? (
          <EmptyState
            icon="🙏"
            title="لا يوجد خدّام بعد"
            description="أضف أول خادم للخدمة"
            actionLabel="إضافة خادم"
            onAction={() => setShowModal(true)}
          />
        ) : (
          <div className="mobile-card-list">
            {filteredServants.map((servant) => (
              <div key={servant.uid} className="mobile-card">
                <div className="mobile-card-header">
                  <span style={{ fontWeight: 'bold', color: 'var(--text-dark)', fontFamily: 'Cairo' }}>🙏 {servant.name}</span>
                  <span className={`badge ${servant.classId ? 'badge-green' : 'badge-yellow'}`}>
                    {servant.classId ? 'نشط' : 'متاح'}
                  </span>
                </div>
                <div className="mobile-card-body" style={{ fontSize: '0.9rem', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div>البريد: {servant.email}</div>
                  <div>الهاتف: {servant.phone || '—'}</div>
                </div>
                <div className="mobile-card-footer" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <span className="badge badge-blue">
                    الفصل: {servant.className || 'غير معيّن'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
