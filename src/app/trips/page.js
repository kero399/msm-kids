'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth';
import { getTrips, registerForTrip, getRegistrationsByChild } from '@/lib/firestore';
import { useToast } from '@/components/ui/Toast';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

const pastTrips = [
  {
    id: 1,
    title: 'رحلة دير الأنبا أنطونيوس',
    date: 'مارس ٢٠٢٦',
    gradient: 'linear-gradient(135deg, #5D4037, #A1887F, #D7CCC8)',
  },
  {
    id: 2,
    title: 'يوم رياضي في النادي',
    date: 'فبراير ٢٠٢٦',
    gradient: 'linear-gradient(135deg, #1B5E20, #66BB6A, #A5D6A7)',
  },
  {
    id: 3,
    title: 'زيارة كنيسة العذراء',
    date: 'يناير ٢٠٢٦',
    gradient: 'linear-gradient(135deg, #4A148C, #AB47BC, #CE93D8)',
  },
  {
    id: 4,
    title: 'رحلة الفيوم',
    date: 'ديسمبر ٢٠٢٥',
    gradient: 'linear-gradient(135deg, #E65100, #FF9800, #FFE0B2)',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function TripsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [trips, setTrips] = useState([]);
  const [registeredTripIds, setRegisteredTripIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Modal registration form state
  const [showRegModal, setShowRegModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [childName, setChildName] = useState('');
  const [parentContact, setParentContact] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load Trips
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const fetchedTrips = await getTrips();
        setTrips(fetchedTrips);

        // If user is logged in, fetch their registrations
        if (user) {
          const childUid = user.role === 'child' ? user.uid : user.linkedChildUid;
          if (childUid) {
            const regs = await getRegistrationsByChild(childUid);
            const registeredIds = new Set(regs.map((r) => r.tripId));
            setRegisteredTripIds(registeredIds);
          }
        }
      } catch (err) {
        console.error('Error loading trips data:', err);
      }
      setLoading(false);
    }
    loadData();
  }, [user]);

  // Pre-fill form when user details are available
  const openRegistration = (trip) => {
    setSelectedTrip(trip);
    if (user) {
      if (user.role === 'child') {
        setChildName(user.displayName || '');
        setParentContact(''); // Child can enter their parent phone
      } else if (user.role === 'parent') {
        setChildName(user.displayName ? user.displayName.replace('أبو ', '').replace('أم ', '') : ''); // fallback guess
        setParentContact(user.email || ''); // or phone if profile has it, otherwise email
      }
    } else {
      setChildName('');
      setParentContact('');
    }
    setNotes('');
    setShowRegModal(true);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!childName || !parentContact) {
      showToast('يرجى كتابة الاسم ورقم الهاتف للتواصل', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const childUid = user?.role === 'child' ? user.uid : (user?.role === 'parent' ? user.linkedChildUid : 'guest');
      const registeredBy = user?.role || 'guest';

      await registerForTrip({
        tripId: selectedTrip.id,
        childUid,
        childName,
        parentContact,
        notes,
        registeredBy
      });

      showToast(`تم التسجيل بنجاح في ${selectedTrip.title}! 🎉`, 'success');
      
      // Update local registered set
      setRegisteredTripIds((prev) => {
        const updated = new Set(prev);
        updated.add(selectedTrip.id);
        return updated;
      });

      setShowRegModal(false);
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء التسجيل. حاول مرة أخرى', 'error');
    }
    setSubmitting(false);
  };

  return (
    <>
      <Header />

      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>الرحلات والأنشطة</h1>
          <p>رحلات ترفيهية وروحيّة مميزة لأبطال الخدمة</p>
        </div>
      </section>

      {/* Upcoming Trips */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>الرحلات القادمة</h2>
            <p>اختر الرحلة المناسبة وسجّل الآن لحجز مكانك قبل اكتمال العدد</p>
          </div>

          {loading ? (
            <LoadingSpinner size="lg" text="جارٍ تحميل الرحلات والأنشطة..." />
          ) : trips.length === 0 ? (
            <EmptyState
              icon="✈️"
              title="لا توجد رحلات قادمة حالياً"
              description="يرجى متابعة الصفحة باستمرار للإعلان عن الرحلات القادمة."
            />
          ) : (
            <motion.div
              className="trips-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {trips.map((trip) => {
                const isRegistered = registeredTripIds.has(trip.id);
                return (
                  <motion.div
                    key={trip.id}
                    className="card trip-card"
                    variants={cardVariants}
                  >
                    {/* Gradient image placeholder */}
                    <div
                      style={{
                        height: '220px',
                        background: trip.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '4rem',
                      }}
                    >
                      {trip.icon || '✈️'}
                    </div>

                    <div className="card-body">
                      <span className="trip-price">{trip.price}</span>
                      <h3 className="card-title">{trip.title}</h3>
                      <p className="card-text">{trip.description}</p>

                      <div className="trip-details">
                        <span className="trip-detail">📅 {new Date(trip.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <span className="trip-detail">📍 {trip.location}</span>
                        <span className="trip-detail">⏰ الحجز حتى: {new Date(trip.deadline).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}</span>
                      </div>

                      {isRegistered ? (
                        <div
                          style={{
                            marginTop: '1.25rem',
                            width: '100%',
                            padding: '0.75rem',
                            background: 'rgba(76,175,80,0.1)',
                            color: '#4CAF50',
                            textAlign: 'center',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            border: '1px solid rgba(76,175,80,0.2)'
                          }}
                        >
                          ✔ أنت مسجل في هذه الرحلة
                        </div>
                      ) : (
                        <button
                          className="btn btn-primary"
                          style={{ marginTop: '1.25rem', width: '100%' }}
                          onClick={() => openRegistration(trip)}
                        >
                          سجل الآن
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* Past Trips */}
      <section className="section" style={{ background: 'var(--light-gray)' }}>
        <div className="container">
          <div className="section-title">
            <h2>رحلات سابقة</h2>
            <p>ذكريات جميلة ولحظات لا تُنسى من رحلاتنا السابقة</p>
          </div>

          <motion.div
            className="trips-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {pastTrips.map((trip) => (
              <motion.div
                key={trip.id}
                className="card"
                variants={cardVariants}
              >
                {/* Gradient image placeholder */}
                <div
                  style={{
                    height: '160px',
                    background: trip.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                  }}
                >
                  📸
                </div>

                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 className="card-title" style={{ marginBottom: 0 }}>{trip.title}</h3>
                    <span className="badge badge-green">تمت</span>
                  </div>
                  <p className="card-meta" style={{ marginTop: '0.25rem' }}>📅 {trip.date}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Registration Modal */}
      <Modal
        show={showRegModal}
        onClose={() => setShowRegModal(false)}
        title={`📝 التسجيل في: ${selectedTrip?.title}`}
      >
        <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>اسم الطفل بالكامل</label>
            <input
              type="text"
              required
              placeholder="اكتب اسم الطفل..."
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem',
                borderRadius: '8px',
                border: '1px solid rgba(135,206,235,0.2)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text-dark)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>رقم هاتف ولي الأمر للتواصل</label>
            <input
              type="tel"
              required
              placeholder="مثال: 01xxxxxxxxx"
              value={parentContact}
              onChange={(e) => setParentContact(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem',
                borderRadius: '8px',
                border: '1px solid rgba(135,206,235,0.2)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text-dark)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>ملاحظات أو طلبات خاصة (اختياري)</label>
            <textarea
              rows="3"
              placeholder="أي مشاكل صحية، حساسية طعام، أو ملاحظات هامة..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem',
                borderRadius: '8px',
                border: '1px solid rgba(135,206,235,0.2)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text-dark)',
                fontSize: '0.9rem',
                fontFamily: 'Cairo'
              }}
            />
          </div>

          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowRegModal(false)}
              style={{ padding: '0.5rem 1rem' }}
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ padding: '0.5rem 1rem' }}
            >
              {submitting ? 'جارٍ الحجز...' : 'تأكيد التسجيل'}
            </button>
          </div>
        </form>
      </Modal>

      <Footer />
    </>
  );
}
