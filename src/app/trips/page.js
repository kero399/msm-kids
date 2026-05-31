'use client';

import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const upcomingTrips = [
  {
    id: 1,
    title: 'رحلة دير الأنبا بولا',
    description: 'رحلة روحية مميزة لزيارة دير الأنبا بولا أول السواح في الصحراء الشرقية. يتعرف الأطفال على حياة الرهبان وتاريخ الدير العريق مع أنشطة روحية وترفيهية متنوعة.',
    price: '١٥٠ جنيه',
    date: '١٥ يوليو ٢٠٢٦',
    location: 'دير الأنبا بولا — البحر الأحمر',
    deadline: 'التسجيل حتى ١٠ يوليو',
    gradient: 'linear-gradient(135deg, #2E7D32, #81C784, #4FC3F7)',
  },
  {
    id: 2,
    title: 'يوم ترفيهي في الملاهي',
    description: 'يوم مليء بالمرح والألعاب الترفيهية في مدينة الملاهي. فرصة رائعة للأطفال للاستمتاع مع أصدقائهم في جو من البهجة والسعادة تحت إشراف خدام الخدمة.',
    price: '٢٠٠ جنيه',
    date: '٢٢ يوليو ٢٠٢٦',
    location: 'دريم بارك — مدينة ٦ أكتوبر',
    deadline: 'التسجيل حتى ١٨ يوليو',
    gradient: 'linear-gradient(135deg, #FF8F00, #FFD54F, #FF7043)',
  },
  {
    id: 3,
    title: 'رحلة الغردقة الصيفية',
    description: 'رحلة صيفية لمدة ثلاثة أيام إلى الغردقة على شاطئ البحر الأحمر. تشمل الرحلة السباحة والأنشطة البحرية والألعاب الجماعية مع أوقات روحية وترانيم على الشاطئ.',
    price: 'مجاناً',
    date: '٥ أغسطس ٢٠٢٦',
    location: 'الغردقة — البحر الأحمر',
    deadline: 'التسجيل حتى ٢٨ يوليو',
    gradient: 'linear-gradient(135deg, #0288D1, #4FC3F7, #00BCD4)',
  },
];

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
  return (
    <>
      <Header />

      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>الرحلات</h1>
          <p>رحلات ممتعة ومفيدة لأطفال الخدمة</p>
        </div>
      </section>

      {/* Upcoming Trips */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>الرحلات القادمة</h2>
            <p>اختر الرحلة المناسبة وسجّل الآن لحجز مكانك</p>
          </div>

          <motion.div
            className="trips-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {upcomingTrips.map((trip) => (
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
                    fontSize: '3rem',
                  }}
                >
                  {trip.id === 1 ? '⛪' : trip.id === 2 ? '🎢' : '🏖️'}
                </div>

                <div className="card-body">
                  <span className="trip-price">{trip.price}</span>
                  <h3 className="card-title">{trip.title}</h3>
                  <p className="card-text">{trip.description}</p>

                  <div className="trip-details">
                    <span className="trip-detail">📅 {trip.date}</span>
                    <span className="trip-detail">📍 {trip.location}</span>
                    <span className="trip-detail">⏰ {trip.deadline}</span>
                  </div>

                  <button
                    className="btn btn-primary"
                    style={{ marginTop: '1.25rem', width: '100%' }}
                  >
                    سجل الآن
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Past Trips */}
      <section className="section" style={{ background: 'var(--light-gray)' }}>
        <div className="container">
          <div className="section-title">
            <h2>رحلات سابقة</h2>
            <p>ذكريات جميلة من رحلاتنا السابقة</p>
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

      <Footer />
    </>
  );
}
