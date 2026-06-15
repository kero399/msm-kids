'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useChildren } from '@/lib/hooks';
import { createChild, updateChildPoints } from '@/lib/firestore';
import { useToast } from '@/components/ui/Toast';
import Modal from '@/components/ui/Modal';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';

export default function ServantChildrenPage() {
  const { user } = useAuth();
  const { children, loading, refresh } = useChildren(user?.classId);
  const { showToast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [newChild, setNewChild] = useState({ name: '', parentContact: '' });
  const [pointsInput, setPointsInput] = useState({ amount: 10, reason: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddChild = async (e) => {
    e.preventDefault();
    if (!newChild.name) return;
    try {
      await createChild({
        name: newChild.name,
        grade: user?.className || '',
        classId: user?.classId,
        parentContact: newChild.parentContact,
        servantUid: user?.uid,
      });
      showToast(`تم إضافة ${newChild.name} بنجاح`, 'success');
      setShowAddModal(false);
      setNewChild({ name: '', parentContact: '' });
      refresh();
    } catch (err) {
      showToast('حدث خطأ أثناء إضافة الطفل', 'error');
    }
  };

  const handleAdjustPoints = async (e) => {
    e.preventDefault();
    if (!selectedChild) return;
    try {
      await updateChildPoints(selectedChild.uid, pointsInput.amount, pointsInput.reason);
      showToast(
        `تم ${pointsInput.amount > 0 ? 'إضافة' : 'خصم'} ${Math.abs(pointsInput.amount)} نقطة لـ ${selectedChild.name}`,
        'success'
      );
      setShowPointsModal(false);
      setSelectedChild(null);
      setPointsInput({ amount: 10, reason: '' });
      refresh();
    } catch (err) {
      showToast('حدث خطأ أثناء تعديل النقاط', 'error');
    }
  };

  const filteredChildren = searchQuery
    ? children.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : children;

  const columns = [
    {
      key: 'avatarId', label: '',
      render: (val) => <span style={{ fontSize: '1.4rem' }}>{val || '👦'}</span>,
    },
    { key: 'name', label: 'الاسم' },
    {
      key: 'points', label: 'النقاط',
      render: (val) => <span className="points-badge">⭐ {val || 0}</span>,
    },
    {
      key: 'level', label: 'المستوى',
      render: (val) => <span className="level-badge">{val || 'مبتدئ'}</span>,
    },
    {
      key: 'actions', label: 'إجراءات',
      render: (_, row) => (
        <button
          className="btn btn-primary"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
          onClick={() => {
            setSelectedChild(row);
            setShowPointsModal(true);
          }}
        >
          ⭐ تعديل النقاط
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="page-action-header">
        <h2>👦 أطفال فصلي</h2>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + إضافة طفل جديد
        </button>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <input
          type="text"
          className="form-input"
          placeholder="بحث عن طفل بالاسم..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ maxWidth: '320px' }}
        />
      </div>

      <div className="hide-on-mobile">
        <DataTable
          columns={columns}
          data={filteredChildren}
          loading={loading}
          emptyState={
            <EmptyState
              icon="👦"
              title="لا يوجد أطفال في الفصل"
              description="أضف أول طفل لفصلك"
              actionLabel="إضافة طفل"
              onAction={() => setShowAddModal(true)}
            />
          }
        />
      </div>

      <div className="show-on-mobile">
        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>جاري التحميل...</p>
        ) : filteredChildren.length === 0 ? (
          <EmptyState
            icon="👦"
            title="لا يوجد أطفال في الفصل"
            description="أضف أول طفل لفصلك"
            actionLabel="إضافة طفل"
            onAction={() => setShowAddModal(true)}
          />
        ) : (
          <div className="mobile-card-list">
            {filteredChildren.map((child) => (
              <div key={child.uid} className="mobile-card">
                <div className="mobile-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>{child.avatarId || '👦'}</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--text-dark)', fontFamily: 'Cairo' }}>{child.name}</span>
                  </div>
                  <span className="level-badge">{child.level || 'مبتدئ'}</span>
                </div>
                <div className="mobile-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="points-badge">⭐ {child.points || 0} نقطة</span>
                  <button
                    className="btn btn-primary"
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                    onClick={() => {
                      setSelectedChild(child);
                      setShowPointsModal(true);
                    }}
                  >
                    ⭐ تعديل النقاط
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Child Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="إضافة طفل جديد">
        <form onSubmit={handleAddChild}>
          <div className="form-group">
            <label className="form-label">اسم الطفل</label>
            <input
              className="form-input" type="text" required
              value={newChild.name}
              onChange={(e) => setNewChild({ ...newChild, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">رقم ولي الأمر (اختياري)</label>
            <input
              className="form-input" type="tel"
              value={newChild.parentContact}
              onChange={(e) => setNewChild({ ...newChild, parentContact: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">الفصل</label>
            <input className="form-input" type="text" value={user?.className || ''} disabled
              style={{ background: 'var(--light-gray)', cursor: 'not-allowed' }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            إضافة الطفل
          </button>
        </form>
      </Modal>

      {/* Points Modal */}
      <Modal isOpen={showPointsModal} onClose={() => setShowPointsModal(false)}
        title={`تعديل نقاط ${selectedChild?.name || ''}`}>
        <form onSubmit={handleAdjustPoints}>
          <div className="form-group">
            <label className="form-label">عدد النقاط</label>
            <input
              className="form-input" type="number" required
              value={pointsInput.amount}
              onChange={(e) => setPointsInput({ ...pointsInput, amount: parseInt(e.target.value) || 0 })}
            />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
              استخدم رقم سالب للخصم
            </p>
          </div>
          <div className="form-group">
            <label className="form-label">السبب</label>
            <input
              className="form-input" type="text"
              placeholder="مثال: حفظ آية، مشاركة فعّالة..."
              value={pointsInput.reason}
              onChange={(e) => setPointsInput({ ...pointsInput, reason: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              تأكيد
            </button>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }}
              onClick={() => setShowPointsModal(false)}>
              إلغاء
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
