'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useLessons } from '@/lib/hooks';
import { createLesson, updateLesson, deleteLesson } from '@/lib/firestore';
import { useToast } from '@/components/ui/Toast';
import Modal from '@/components/ui/Modal';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';

const emptyForm = { title: '', date: '', description: '', videoUrl: '', fileUrl: '' };

export default function ServantContentPage() {
  const { user } = useAuth();
  const { lessons, loading, refresh } = useLessons(user?.classId);
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditingLesson(null);
    setForm({ ...emptyForm, date: new Date().toISOString().split('T')[0] });
    setIsModalOpen(true);
  };

  const openEdit = (lesson) => {
    setEditingLesson(lesson);
    setForm({
      title: lesson.title || '',
      date: lesson.date || '',
      description: lesson.description || '',
      videoUrl: lesson.videoUrl || '',
      fileUrl: lesson.fileUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLesson) {
        await updateLesson(editingLesson.id, { ...form, classId: user?.classId });
        showToast('تم تحديث الدرس بنجاح', 'success');
      } else {
        await createLesson({ ...form, classId: user?.classId, publishedBy: user?.uid });
        showToast('تم نشر الدرس بنجاح', 'success');
      }
      setIsModalOpen(false);
      setEditingLesson(null);
      setForm(emptyForm);
      refresh();
    } catch (err) {
      showToast('حدث خطأ أثناء حفظ الدرس', 'error');
    }
  };

  const handleDelete = async (lesson) => {
    if (!confirm(`هل أنت متأكد من حذف "${lesson.title}"؟`)) return;
    try {
      await deleteLesson(lesson.id);
      showToast('تم حذف الدرس بنجاح', 'success');
      refresh();
    } catch (err) {
      showToast('حدث خطأ أثناء حذف الدرس', 'error');
    }
  };

  const columns = [
    { key: 'title', label: 'عنوان الدرس' },
    { key: 'date', label: 'التاريخ', render: (val) => val ? new Date(val).toLocaleDateString('ar-EG') : '—' },
    { key: 'videoUrl', label: 'فيديو', render: (val) => val ? <span className="badge badge-blue">متاح</span> : '—' },
    { key: 'fileUrl', label: 'ملف', render: (val) => val ? <span className="badge badge-yellow">PDF</span> : '—' },
    {
      key: 'actions', label: 'إجراءات', render: (_, row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => openEdit(row)}>تعديل</button>
          <button className="btn" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: 'rgba(252,129,129,0.1)', color: 'var(--danger)' }} onClick={() => handleDelete(row)}>حذف</button>
        </div>
      )
    },
  ];

  return (
    <>
      <div className="page-action-header">
        <h2>📚 إدارة الدروس والمحتوى</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ إضافة درس جديد</button>
      </div>

      <DataTable
        columns={columns}
        data={lessons}
        loading={loading}
        searchable
        searchKeys={['title', 'description']}
        searchPlaceholder="بحث في دروس الفصل..."
        emptyState={<EmptyState icon="📚" title="لا توجد دروس" description="ابدأ بنشر أول درس لأطفال فصلك" actionLabel="إضافة درس" onAction={openCreate} />}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingLesson ? 'تعديل درس' : 'إضافة درس جديد'} maxWidth="640px">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">عنوان الدرس</label>
            <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">تاريخ الدرس</label>
            <input className="form-input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">وصف الدرس</label>
            <textarea className="form-input" rows="5" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">رابط فيديو اختياري</label>
            <input className="form-input" type="url" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">رابط ملف PDF اختياري</label>
            <input className="form-input" type="url" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>{editingLesson ? 'حفظ التعديلات' : 'نشر الدرس'}</button>
        </form>
      </Modal>
    </>
  );
}
