'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useClasses, useServants } from '@/lib/hooks';
import { createClass, deleteClass, assignServantToClass } from '@/lib/firestore';
import { useToast } from '@/components/ui/Toast';
import Modal from '@/components/ui/Modal';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';

export default function AdminClassesPage() {
  const { classes, loading, refresh } = useClasses();
  const { servants } = useServants();
  const { showToast } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [newClass, setNewClass] = useState({ name: '', grade: '' });

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClass.name || !newClass.grade) return;
    try {
      await createClass(newClass);
      showToast('تم إنشاء الفصل بنجاح', 'success');
      setShowCreateModal(false);
      setNewClass({ name: '', grade: '' });
      refresh();
    } catch (err) {
      showToast('حدث خطأ أثناء إنشاء الفصل', 'error');
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!confirm('هل أنت متأكد من حذف هذا الفصل؟')) return;
    try {
      await deleteClass(classId);
      showToast('تم حذف الفصل بنجاح', 'success');
      refresh();
    } catch (err) {
      showToast('حدث خطأ أثناء حذف الفصل', 'error');
    }
  };

  const handleAssignServant = async (servantUid) => {
    const servant = servants.find((s) => s.uid === servantUid);
    if (!servant || !selectedClassId) return;
    try {
      await assignServantToClass(selectedClassId, servantUid, servant.name);
      showToast(`تم تعيين ${servant.name} للفصل بنجاح`, 'success');
      setShowAssignModal(false);
      setSelectedClassId(null);
      refresh();
    } catch (err) {
      showToast('حدث خطأ أثناء التعيين', 'error');
    }
  };

  const unassignedServants = servants.filter((s) => !s.classId);

  const columns = [
    { key: 'name', label: 'اسم الفصل' },
    { key: 'grade', label: 'المرحلة' },
    {
      key: 'servantName', label: 'الخادم المسؤول',
      render: (val) => val || <span style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>غير معيّن</span>,
    },
    { key: 'childCount', label: 'عدد الأطفال' },
    {
      key: 'actions', label: 'إجراءات',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn btn-primary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            onClick={() => {
              setSelectedClassId(row.id);
              setShowAssignModal(true);
            }}
          >
            تعيين خادم
          </button>
          <button
            className="btn"
            style={{
              padding: '0.35rem 0.75rem', fontSize: '0.8rem',
              background: 'rgba(252,129,129,0.1)', color: 'var(--danger)',
            }}
            onClick={() => handleDeleteClass(row.id)}
          >
            حذف
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-action-header">
        <h2>🏫 إدارة الفصول</h2>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          + إضافة فصل جديد
        </button>
      </div>

      {/* Desktop view */}
      <div className="hide-on-mobile">
        <DataTable
          columns={columns}
          data={classes}
          loading={loading}
          emptyState={
            <EmptyState
              icon="🏫"
              title="لا توجد فصول بعد"
              description="ابدأ بإنشاء أول فصل للخدمة"
              actionLabel="إضافة فصل"
              onAction={() => setShowCreateModal(true)}
            />
          }
        />
      </div>

      {/* Mobile view */}
      <div className="show-on-mobile">
        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>جاري التحميل...</p>
        ) : classes.length === 0 ? (
          <EmptyState
            icon="🏫"
            title="لا توجد فصول بعد"
            description="ابدأ بإنشاء أول فصل للخدمة"
            actionLabel="إضافة فصل"
            onAction={() => setShowCreateModal(true)}
          />
        ) : (
          <div className="mobile-card-list">
            {classes.map((cls) => (
              <div key={cls.id} className="mobile-card">
                <div className="mobile-card-header">
                  <span style={{ fontWeight: 'bold', color: 'var(--text-dark)', fontFamily: 'Cairo' }}>🏫 {cls.name}</span>
                  <span className="badge badge-blue">{cls.grade}</span>
                </div>
                <div className="mobile-card-body" style={{ fontSize: '0.9rem', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <div>الخادم المسؤول: {cls.servantName || <span style={{ fontStyle: 'italic' }}>غير معيّن</span>}</div>
                  <div>عدد الأطفال: {cls.childCount || 0} طفل</div>
                </div>
                <div className="mobile-card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button
                    className="btn btn-primary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    onClick={() => {
                      setSelectedClassId(cls.id);
                      setShowAssignModal(true);
                    }}
                  >
                    تعيين خادم
                  </button>
                  <button
                    className="btn"
                    style={{
                      padding: '0.35rem 0.75rem', fontSize: '0.8rem',
                      background: 'rgba(252,129,129,0.1)', color: 'var(--danger)',
                    }}
                    onClick={() => handleDeleteClass(cls.id)}
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Class Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="إنشاء فصل جديد">
        <form onSubmit={handleCreateClass}>
          <div className="form-group">
            <label className="form-label">اسم الفصل</label>
            <input
              className="form-input"
              type="text"
              placeholder="مثال: الصف الأول"
              value={newClass.name}
              onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">المرحلة الدراسية</label>
            <input
              className="form-input"
              type="text"
              placeholder="مثال: أولى ابتدائي"
              value={newClass.grade}
              onChange={(e) => setNewClass({ ...newClass, grade: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            إنشاء الفصل
          </button>
        </form>
      </Modal>

      {/* Assign Servant Modal */}
      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} title="تعيين خادم للفصل">
        {unassignedServants.length === 0 ? (
          <EmptyState
            icon="🙏"
            title="لا يوجد خدّام متاحون"
            description="جميع الخدّام معيّنون لفصول. أضف خادمًا جديدًا أولاً."
          />
        ) : (
          <ul style={{ listStyle: 'none' }}>
            {unassignedServants.map((servant) => (
              <li
                key={servant.uid}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.75rem 0', borderBottom: '1px solid rgba(135,206,235,0.08)',
                }}
              >
                <div>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{servant.name}</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginRight: '0.5rem' }}>{servant.email}</span>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ padding: '0.35rem 1rem', fontSize: '0.8rem' }}
                  onClick={() => handleAssignServant(servant.uid)}
                >
                  تعيين
                </button>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </>
  );
}
