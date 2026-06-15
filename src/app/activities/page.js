'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';

const categories = ['الكل', 'روحية', 'تعليمية', 'ترفيهية', 'رياضية'];

const activities = [
  {
    id: 1,
    category: 'روحية',
    title: 'حلقة الكتاب المقدس',
    text: 'حلقة أسبوعية لدراسة الكتاب المقدس بأسلوب مبسط وتفاعلي يناسب أطفال المرحلة الابتدائية. نتعلم معاً قصص الآباء والأنبياء ونستخرج الدروس الروحية من كل قصة.',
    schedule: 'كل جمعة — ٤:٠٠ م',
    gradient: 'linear-gradient(135deg, #4A90D9, #1A365D)',
  },
  {
    id: 2,
    category: 'تعليمية',
    title: 'مسابقة المعلومات الدينية',
    text: 'مسابقة شيقة في المعلومات الدينية والكنسية تشمل أسئلة عن الكتاب المقدس والطقوس الكنسية وسير القديسين. تقام المسابقة على مستوى الفصول مع جوائز تشجيعية.',
    schedule: 'كل سبت — ٥:٠٠ م',
    gradient: 'linear-gradient(135deg, #87CEEB, #4A90D9)',
  },
  {
    id: 3,
    category: 'ترفيهية',
    title: 'ورشة الرسم والأشغال اليدوية',
    text: 'ورشة فنية لتنمية مواهب الأطفال في الرسم والتلوين والأشغال اليدوية. نصنع معاً أعمالاً فنية مستوحاة من القصص الكتابية والأعياد الكنسية بمواد بسيطة ومتاحة.',
    schedule: 'كل أحد — ١:٠٠ م',
    gradient: 'linear-gradient(135deg, #FFF9C4, #87CEEB)',
  },
  {
    id: 4,
    category: 'رياضية',
    title: 'يوم رياضي مفتوح',
    text: 'يوم رياضي مفتوح لجميع أطفال الخدمة يتضمن مباريات كرة قدم وألعاب جماعية ومسابقات جري. الهدف تعزيز روح الفريق والتعاون بين الأطفال في جو من المرح.',
    schedule: 'أول سبت من كل شهر — ١٠:٠٠ ص',
    gradient: 'linear-gradient(135deg, #87CEEB, #FFF9C4)',
  },
  {
    id: 5,
    category: 'روحية',
    title: 'حفل ترانيم',
    text: 'حفل ترانيم وتسبيح يشارك فيه أطفال الخدمة بتقديم ترانيم مختارة مع فقرات تمثيلية قصيرة. يهدف الحفل لتعميق العلاقة الروحية وتنمية موهبة التعبير لدى الأطفال.',
    schedule: 'كل جمعة — ٦:٠٠ م',
    gradient: 'linear-gradient(135deg, #4A90D9, #FFF9C4)',
  },
  {
    id: 6,
    category: 'ترفيهية',
    title: 'مخيم صيفي روحي',
    text: 'مخيم صيفي مميز يجمع بين الأنشطة الروحية والترفيهية على مدار ثلاثة أيام. يتضمن المخيم دراسة كتابية وألعاب ورحلات وسهرات ترانيم في أجواء روحية ممتعة.',
    schedule: 'يوليو — ثلاثة أيام',
    gradient: 'linear-gradient(135deg, #FFF9C4, #4A90D9)',
  },
];

export default function ActivitiesPage() {
  const [activeFilter, setActiveFilter] = useState('الكل');

  const filteredActivities =
    activeFilter === 'الكل'
      ? activities
      : activities.filter((a) => a.category === activeFilter);

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
            الأنشطة والفعاليات
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            أنشطة متنوعة تنمي مواهب أطفالنا
          </motion.p>
        </div>
      </section>

      {/* Activities Section */}
      <section className="section">
        <div className="container">
          {/* Filter Badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              justifyContent: 'center',
              marginBottom: '2.5rem',
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                className={`badge ${activeFilter === cat ? 'badge-blue' : ''}`}
                onClick={() => setActiveFilter(cat)}
                style={{
                  cursor: 'pointer',
                  border: 'none',
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.95rem',
                  background:
                    activeFilter === cat
                      ? 'var(--medium-blue)'
                      : 'var(--light-gray)',
                  color:
                    activeFilter === cat
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
          </motion.div>

          {/* Activities Grid */}
          <div className="activities-grid">
            {filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                className="card activity-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Category Badge Overlay */}
                <div className="activity-category">
                  <span className="badge badge-yellow">{activity.category}</span>
                </div>

                {/* Gradient Placeholder Image */}
                <div
                  style={{
                    width: '100%',
                    height: '200px',
                    background: activity.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <span style={{ fontSize: '3rem', opacity: 0.4 }}>🎯</span>
                </div>

                {/* Card Body */}
                <div className="card-body">
                  <h3 className="card-title">{activity.title}</h3>
                  <p className="card-text">{activity.text}</p>
                  <div className="card-meta">
                    <span>🗓️ {activity.schedule}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
