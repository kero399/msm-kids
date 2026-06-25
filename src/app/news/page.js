'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { useNews } from '@/lib/hooks';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

const gradients = [
  'linear-gradient(135deg, #87CEEB, #4A90D9)',
  'linear-gradient(135deg, #4A90D9, #FFF9C4)',
  'linear-gradient(135deg, #FFF9C4, #87CEEB)',
];

export default function NewsPage() {
  const { news, loading } = useNews();

  return (
    <>
      <Header />

      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            الأخبار والإعلانات
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            تابع آخر أخبار وفعاليات خدمة ماري مرقس
          </motion.p>
        </div>
      </section>

      {/* News Grid */}
      <section className="section">
        <div className="container">
          {loading ? (
            <LoadingSpinner text="جاري تحميل الأخبار..." />
          ) : news.length === 0 ? (
            <EmptyState
              icon="📰"
              title="لا توجد أخبار منشورة"
              description="سيتم عرض الأخبار والإعلانات هنا فور نشرها من لوحة التحكم."
            />
          ) : (
            <div className="news-grid">
            {news.map((item, index) => (
              <motion.div
                key={item.id}
                className="card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '200px',
                    background: gradients[index % gradients.length],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: '3rem', opacity: 0.4 }}>📰</span>
                </div>
                <div className="card-body">
                  <span className="badge badge-blue">{item.category}</span>
                  <h3 className="card-title" style={{ marginTop: '0.5rem' }}>
                    {item.title}
                  </h3>
                  <p className="card-text">{item.body}</p>
                  <div className="card-meta">
                    <span>📅 {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('ar-EG') : '—'}</span>
                    <span>✍️ {item.publishedBy || 'خدمة ماري مرقس'}</span>
                  </div>
                </div>
              </motion.div>
            ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
