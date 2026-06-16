'use client';

import { useState } from 'react';
import { useChildren, useClasses } from '@/lib/hooks';
import DataTable from '@/components/ui/DataTable';

export default function AdminChildrenPage() {
  const { children, loading } = useChildren();
  const { classes } = useClasses();
  const [classFilter, setClassFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChildren = children.filter((c) => {
    const matchesClass = classFilter === 'all' || c.classId === classFilter;
    const matchesSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const columns = [
    {
      key: 'avatarId', label: '',
      render: (val) => <span style={{ fontSize: '1.4rem' }}>{val || '👦'}</span>,
    },
    { key: 'name', label: 'الاسم' },
    { key: 'grade', label: 'المرحلة' },
    {
      key: 'classId', label: 'الفصل',
      render: (val) => {
        const cls = classes.find((c) => c.id === val);
        return cls ? cls.name : '—';
      },
    },
    {
      key: 'points', label: 'النقاط',
      render: (val) => <span className="points-badge">⭐ {val || 0}</span>,
    },
    {
      key: 'level', label: 'المستوى',
      render: (val) => <span className="level-badge">{val || 'مبتدئ'}</span>,
    },
  ];

  return (
    <>
      <div className="page-action-header">
        <h2>👦 إدارة الأطفال</h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-input"
            placeholder="بحث عن طفل بالاسم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ maxWidth: '200px', padding: '0.5rem 1rem' }}
          />
          <select
            className="form-input"
            style={{ maxWidth: '200px', padding: '0.5rem 1rem' }}
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option value="all">جميع الفصول</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hide-on-mobile">
        <DataTable
          columns={columns}
          data={filteredChildren}
          loading={loading}
        />
      </div>

      {/* Mobile view */}
      <div className="show-on-mobile">
        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>جاري التحميل...</p>
        ) : filteredChildren.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>لا توجد نتائج مطابقة</p>
        ) : (
          <div className="mobile-card-list">
            {filteredChildren.map((child) => {
              const cls = classes.find((c) => c.id === child.classId);
              return (
                <div key={child.uid} className="mobile-card">
                  <div className="mobile-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.4rem' }}>{child.avatarId || '👦'}</span>
                      <span style={{ fontWeight: 'bold', color: 'var(--text-dark)', fontFamily: 'Cairo' }}>{child.name}</span>
                    </div>
                    <span className="level-badge">{child.level || 'مبتدئ'}</span>
                  </div>
                  <div className="mobile-card-body" style={{ fontSize: '0.9rem', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <div>المرحلة الدراسية: {child.grade}</div>
                    <div>الفصل: {cls ? cls.name : '—'}</div>
                  </div>
                  <div className="mobile-card-footer" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <span className="points-badge">⭐ {child.points || 0} نقطة</span>
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
