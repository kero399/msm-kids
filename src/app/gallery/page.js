'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const categories = ['الكل', 'رحلات', 'أنشطة', 'احتفالات', 'دروس'];

const galleryItems = [
  {
    id: 1,
    name: 'رحلة الدير',
    category: 'رحلات',
    gradient: 'linear-gradient(135deg, #1565C0, #42A5F5, #87CEEB)',
  },
  {
    id: 2,
    name: 'يوم رياضي',
    category: 'أنشطة',
    gradient: 'linear-gradient(135deg, #2E7D32, #66BB6A, #A5D6A7)',
  },
  {
    id: 3,
    name: 'حفل الترانيم',
    category: 'احتفالات',
    gradient: 'linear-gradient(135deg, #F57F17, #FFCA28, #FFF9C4)',
  },
  {
    id: 4,
    name: 'ورشة الرسم',
    category: 'أنشطة',
    gradient: 'linear-gradient(135deg, #AD1457, #EC407A, #F48FB1)',
  },
  {
    id: 5,
    name: 'مسابقة الكتاب المقدس',
    category: 'دروس',
    gradient: 'linear-gradient(135deg, #4A148C, #7E57C2, #CE93D8)',
  },
  {
    id: 6,
    name: 'احتفال عيد الميلاد',
    category: 'احتفالات',
    gradient: 'linear-gradient(135deg, #B71C1C, #E53935, #EF9A9A)',
  },
  {
    id: 7,
    name: 'المخيم الصيفي',
    category: 'رحلات',
    gradient: 'linear-gradient(135deg, #00838F, #26C6DA, #80DEEA)',
  },
  {
    id: 8,
    name: 'توزيع الجوائز',
    category: 'احتفالات',
    gradient: 'linear-gradient(135deg, #E65100, #FF9800, #FFE0B2)',
  },
  {
    id: 9,
    name: 'صلاة جماعية',
    category: 'دروس',
    gradient: 'linear-gradient(135deg, #1A237E, #3F51B5, #9FA8DA)',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredItems =
    activeCategory === 'الكل'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <>
      <Header />

      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>معرض الصور</h1>
          <p>لحظات جميلة من أنشطة الخدمة</p>
        </div>
      </section>

      {/* Filter Bar + Gallery */}
      <section className="section">
        <div className="container">
          {/* Category Filter */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginBottom: '2.5rem',
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`badge ${activeCategory === cat ? 'badge-blue' : ''}`}
                style={{
                  cursor: 'pointer',
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.95rem',
                  border: 'none',
                  background:
                    activeCategory === cat
                      ? 'var(--medium-blue)'
                      : 'var(--light-gray)',
                  color:
                    activeCategory === cat
                      ? 'var(--white)'
                      : 'var(--text-secondary)',
                  borderRadius: 'var(--radius-full)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  transition: 'all 0.25s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <motion.div
            className="gallery-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            key={activeCategory}
          >
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                className="gallery-item"
                variants={itemVariants}
                onClick={() => setSelectedItem(item)}
                whileHover={{ scale: 1.03 }}
              >
                {/* Gradient placeholder as image */}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: item.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    transition: 'transform 0.4s ease',
                  }}
                >
                  📷
                </div>
                <span className="gallery-caption">{item.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <button
              className="lightbox-close"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedItem(null);
              }}
            >
              ✕
            </button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '80vw',
                maxWidth: '700px',
                aspectRatio: '4/3',
                background: selectedItem.gradient,
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
              }}
            >
              <span style={{ fontSize: '4rem' }}>📷</span>
              <span
                style={{
                  color: 'var(--white)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                {selectedItem.name}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
