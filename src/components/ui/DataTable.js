'use client';

import { useState } from 'react';

/**
 * DataTable — styled responsive data table with optional search.
 *
 * @param {object[]} columns - [{ key: string, label: string, render?: (value, row) => ReactNode }]
 * @param {object[]} data - Array of row objects
 * @param {boolean} [searchable=false] - Show search input
 * @param {string} [searchPlaceholder] - Search input placeholder
 * @param {string[]} [searchKeys] - Which keys to search against
 * @param {boolean} [loading=false] - Show skeleton state
 * @param {React.ReactNode} [emptyState] - Custom empty state
 */
export default function DataTable({
  columns = [],
  data = [],
  searchable = false,
  searchPlaceholder = 'بحث...',
  searchKeys = [],
  loading = false,
  emptyState = null,
}) {
  const [search, setSearch] = useState('');

  const filteredData = searchable && search
    ? data.filter((row) =>
        searchKeys.some((key) => {
          const val = row[key];
          return val && String(val).toLowerCase().includes(search.toLowerCase());
        })
      )
    : data;

  if (loading) {
    return (
      <div className="data-table-wrapper">
        <div className="data-table-skeleton">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-row" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="data-table-wrapper">
      {searchable && (
        <div className="data-table-search">
          <input
            type="text"
            className="form-input"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {filteredData.length === 0 ? (
        emptyState || (
          <div className="empty-state" style={{ padding: '3rem 1rem' }}>
            <span className="empty-state-icon">🔍</span>
            <h3 className="empty-state-title">لا توجد بيانات</h3>
          </div>
        )
      ) : (
        <div className="data-table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, rowIndex) => (
                <tr key={row.uid || row.id || rowIndex}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
