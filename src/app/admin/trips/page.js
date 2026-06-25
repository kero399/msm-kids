'use client';

import { useState, useEffect } from 'react';
import { getTrips, getTripRegistrations } from '@/lib/firestore';
import { useToast } from '@/components/ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';

export default function AdminTripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [regsLoading, setRegsLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    async function loadTrips() {
      setLoading(true);
      try {
        const data = await getTrips();
        setTrips(data);
        if (data.length > 0) {
          setSelectedTrip(data[0]);
        }
      } catch (err) {
        console.error('Error loading trips:', err);
        showToast('حدث خطأ أثناء تحميل الرحلات', 'error');
      }
      setLoading(false);
    }
    loadTrips();
  }, []);

  useEffect(() => {
    async function loadRegistrations() {
      if (!selectedTrip) return;
      setRegsLoading(true);
      try {
        const data = await getTripRegistrations(selectedTrip.id);
        setRegistrations(data);
      } catch (err) {
        console.error('Error loading registrations:', err);
        showToast('حدث خطأ أثناء تحميل كشف التسجيل', 'error');
      }
      setRegsLoading(false);
    }
    loadRegistrations();
  }, [selectedTrip]);

  const columns = [
    {
      key: 'index',
      label: 'م',
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    { key: 'childName', label: 'اسم الطفل' },
    { key: 'parentContact', label: 'رقم هاتف ولي الأمر' },
    {
      key: 'registeredBy',
      label: 'مسجل بواسطة',
      render: (val) => {
        if (val === 'parent') return <span className="badge badge-blue">ولي الأمر 👨‍👩‍👦</span>;
        if (val === 'child') return <span className="badge badge-green">الطفل نفسه 👦</span>;
        return <span className="badge badge-yellow">زائر 👤</span>;
      },
    },
    {
      key: 'notes',
      label: 'ملاحظات / طلبات خاصة',
      render: (val) => val || <span style={{ opacity: 0.4 }}>—</span>,
    },
  ];

  if (loading) {
    return <LoadingSpinner size="lg" text="جارٍ تحميل الرحلات والأنشطة..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner */}
      <div className="hero-banner" style={{
        background: 'linear-gradient(135deg, var(--medium-blue) 0%, var(--sky-blue-dark) 100%)',
        borderRadius: '16px',
        padding: '1.5rem',
        color: '#fff',
      }}>
        <h2 style={{ margin: 0, color: '#fff', fontFamily: 'Cairo', fontSize: '1.5rem' }}>
          ✈️ إدارة تسجيلات الرحلات والأنشطة
        </h2>
        <p style={{ margin: '0.25rem 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
          متابعة قوائم المشاركين وهواتف أولياء الأمور لتنظيم التنقلات والزيارات.
        </p>
      </div>

      {/* Trips Row Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {trips.map((trip) => {
          const isSelected = selectedTrip?.id === trip.id;
          return (
            <motion.div
              key={trip.id}
              onClick={() => setSelectedTrip(trip)}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="dashboard-card"
              style={{
                cursor: 'pointer',
                border: isSelected ? '2px solid var(--sky-blue-dark)' : '1px solid rgba(135,206,235,0.1)',
                background: isSelected ? 'rgba(135,206,235,0.03)' : undefined,
                transition: 'all 0.2s',
                padding: '1.25rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Top accent gradient line */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, height: '4px',
                background: trip.gradient
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '2rem' }}>{trip.icon || '✈️'}</span>
                <span className="price-badge" style={{
                  background: 'rgba(135,206,235,0.1)',
                  color: 'var(--sky-blue-dark)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {trip.price}
                </span>
              </div>

              <h3 style={{ margin: '1rem 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 600, fontFamily: 'Cairo' }}>
                {trip.title}
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-light)' }}>
                📍 {trip.location}
              </p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                📅 التاريخ: {new Date(trip.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Registrations List Section */}
      <AnimatePresence mode="wait">
        {selectedTrip && (
          <motion.div
            key={selectedTrip.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="dashboard-card"
            style={{ padding: '1.5rem' }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(135,206,235,0.1)',
              paddingBottom: '1rem',
              marginBottom: '1.25rem'
            }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'Cairo', fontSize: '1.2rem' }}>
                  📝 كشف المسجلين في: {selectedTrip.title}
                </h3>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                  الموعد النهائي للتسجيل: {new Date(selectedTrip.deadline).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}
                </p>
              </div>
              <span className="count-badge" style={{
                background: 'var(--medium-blue)',
                color: '#fff',
                padding: '0.35rem 0.85rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 'bold'
              }}>
                إجمالي المسجلين: {regsLoading ? '...' : registrations.length}
              </span>
            </div>

            <DataTable
              columns={columns}
              data={registrations}
              loading={regsLoading}
              emptyState={
                <EmptyState
                  icon="📝"
                  title="لا يوجد مسجلين حتى الآن"
                  description="لم يقم أي طفل أو ولي أمر بالتسجيل لهذه الرحلة بعد."
                />
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
