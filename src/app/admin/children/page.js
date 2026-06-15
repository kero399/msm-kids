'use client';

import { useState } from 'react';
import { useChildren, useClasses } from '@/lib/hooks';
import DataTable from '@/components/ui/DataTable';

export default function AdminChildrenPage() {
  const { children, loading } = useChildren();
  const { classes } = useClasses();
  const [classFilter, setClassFilter] = useState('all');

  const filteredChildren = classFilter === 'all'
    ? children
    : children.filter((c) => c.classId === classFilter);

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
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
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

      <DataTable
        columns={columns}
        data={filteredChildren}
        loading={loading}
        searchable
        searchPlaceholder="بحث عن طفل..."
        searchKeys={['name']}
      />
    </>
  );
}
