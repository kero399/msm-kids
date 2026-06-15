'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState({
    serviceName: 'خدمة ماري مرقس ابتدائي بنين',
    sessionDays: 'الجمعة والأحد',
    sessionTime: '٤:٠٠ — ٦:٠٠ مساءً',
    attendancePoints: 10,
    versePoints: 20,
    quizPointsBase: 15,
    levelBeginner: 0,
    levelExplorer: 100,
    levelChampion: 500,
    levelStar: 1000,
  });

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    showToast('تم حفظ الإعدادات بنجاح', 'success');
  };

  return (
    <>
      <div className="page-action-header">
        <h2>⚙️ إعدادات النظام</h2>
      </div>

      <form onSubmit={handleSave}>
        {/* Service Info */}
        <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
          <div className="dashboard-card-header">
            <h3>معلومات الخدمة</h3>
          </div>
          <div className="dashboard-card-body">
            <div className="form-group">
              <label className="form-label">اسم الخدمة</label>
              <input className="form-input" type="text" value={settings.serviceName}
                onChange={(e) => handleChange('serviceName', e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">أيام الخدمة</label>
                <input className="form-input" type="text" value={settings.sessionDays}
                  onChange={(e) => handleChange('sessionDays', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">أوقات الخدمة</label>
                <input className="form-input" type="text" value={settings.sessionTime}
                  onChange={(e) => handleChange('sessionTime', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Points Config */}
        <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
          <div className="dashboard-card-header">
            <h3>إعدادات النقاط</h3>
          </div>
          <div className="dashboard-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">نقاط الحضور</label>
                <input className="form-input" type="number" value={settings.attendancePoints}
                  onChange={(e) => handleChange('attendancePoints', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">نقاط حفظ الآية</label>
                <input className="form-input" type="number" value={settings.versePoints}
                  onChange={(e) => handleChange('versePoints', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">نقاط الاختبار (أساس)</label>
                <input className="form-input" type="number" value={settings.quizPointsBase}
                  onChange={(e) => handleChange('quizPointsBase', parseInt(e.target.value) || 0)} />
              </div>
            </div>
          </div>
        </div>

        {/* Level Thresholds */}
        <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
          <div className="dashboard-card-header">
            <h3>حدود المستويات</h3>
          </div>
          <div className="dashboard-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">🌱 مبتدئ (من)</label>
                <input className="form-input" type="number" value={settings.levelBeginner}
                  onChange={(e) => handleChange('levelBeginner', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">🔍 مستكشف (من)</label>
                <input className="form-input" type="number" value={settings.levelExplorer}
                  onChange={(e) => handleChange('levelExplorer', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">🏆 بطل (من)</label>
                <input className="form-input" type="number" value={settings.levelChampion}
                  onChange={(e) => handleChange('levelChampion', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">⭐ نجم (من)</label>
                <input className="form-input" type="number" value={settings.levelStar}
                  onChange={(e) => handleChange('levelStar', parseInt(e.target.value) || 0)} />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg">
          حفظ الإعدادات
        </button>
      </form>
    </>
  );
}
