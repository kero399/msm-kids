'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useNews } from '@/lib/hooks';
import { createNews, updateNews, deleteNews } from '@/lib/firestore';
import { useToast } from '@/components/ui/Toast';
import Modal from '@/components/ui/Modal';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';

const emptyForm = { title: '', body: '', category: 'إعلان', imageUrl: '' };

export default function AdminNewsPage() {
  const { user } = useAuth();
  const { news, loading, refresh } = useNews();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({
      title: item.title || '',
      body: item.body || '',
      category: item.category || 'إعلان',
      imageUrl: item.imageUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateNews(editingItem.id, form);
        showToast('تم تحديث الخبر بنجاح', 'success');
      } else {
        await createNews({ ...form, publishedBy: user?.name || user?.email || 'Admin' });
        showToast('تم نشر الخبر بنجاح', 'success');
      }
      setIsModalOpen(false);
      setForm(emptyForm);
      setEditingItem(null);
      refresh();
    } catch (err) {
      showToast('حدث خطأ أثناء حفظ الخبر', 'error');
    }
  };

  const handleDelete = async (item) => {
    if (!confirm(`هل أنت متأكد من حذف "${item.title}"؟`)) return;
    try {
      await deleteNews(item.id);
      showToast('تم حذف الخبر بنجاح', 'success');
      refresh();
    } catch (err) {
      showToast('حدث خطأ أثناء حذف الخبر', 'error');
    }
  };

  const columns = [
    { key: 'title', label: 'العنوان' },
    { key: 'category', label: 'التصنيف', render: (val) => <span className="badge badge-blue">{val || 'إعلان'}</span> },
    { key: 'publishedBy', label: 'الناشر' },
    { key: 'publishedAt', label: 'تاريخ النشر', render: (val) => val ? new Date(val).toLocaleDateString('ar-EG') : '—' },
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
        <h2>📰 إدارة الأخبار والإعلانات</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ نشر خبر جديد</button>
      </div>

      <DataTable
        columns={columns}
        data={news}
        loading={loading}
        searchable
        searchKeys={['title', 'body', 'category', 'publishedBy']}
        searchPlaceholder="بحث في الأخبار..."
        emptyState={<EmptyState icon="📰" title="لا توجد أخبار" description="انشر أول خبر أو إعلان للخدمة" actionLabel="نشر خبر" onAction={openCreate} />}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'تعديل خبر' : 'نشر خبر جديد'} maxWidth="lg">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">العنوان</label>
            <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">التصنيف</label>
            <select className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option>إعلان</option>
              <option>خبر</option>
              <option>فعالية</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">المحتوى</label>
            <textarea className="form-input" rows="5" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">رابط صورة اختياري</label>
            <input className="form-input" type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>{editingItem ? 'حفظ التعديلات' : 'نشر الخبر'}</button>
        </form>
      </Modal>
    </>
  );
}
