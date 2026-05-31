'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const stats = [
  { icon: '👦', number: '+١٥٠', label: 'طفل مخدوم' },
  { icon: '🙏', number: '+٢٠', label: 'خادم متطوع' },
  { icon: '📚', number: '+٥٠', label: 'درس أسبوعي' },
  { icon: '🏆', number: '+١٠٠٠', label: 'نقطة مكتسبة' },
];

const features = [
  {
    icon: '📖',
    title: 'دروس روحية',
    desc: 'دروس أسبوعية من الكتاب المقدس تُبسّط لأطفالنا قصص الإيمان والقديسين بطريقة شيّقة وتفاعلية تناسب أعمارهم.',
  },
  {
    icon: '✝️',
    title: 'حفظ آيات',
    desc: 'نشجّع أطفالنا على حفظ آيات من الكتاب المقدس كل أسبوع، لتكون كلمة الله نورًا لحياتهم ومرشدًا لخطواتهم.',
  },
  {
    icon: '🎯',
    title: 'تحديات أسبوعية',
    desc: 'تحديات ممتعة تُحفّز الأطفال على تطبيق ما تعلموه في حياتهم اليومية من خلال مهام بسيطة ومكافآت تشجيعية.',
  },
  {
    icon: '🏅',
    title: 'نقاط وجوائز',
    desc: 'نظام نقاط تحفيزي يكافئ الأطفال على الحضور والمشاركة والحفظ، مع جوائز قيّمة في نهاية كل فصل دراسي.',
  },
  {
    icon: '🎪',
    title: 'رحلات ممتعة',
    desc: 'رحلات ترفيهية وروحية للأماكن المقدسة والأديرة، تجمع بين المرح والتعلم وتقوّي الروابط بين الأطفال والخدّام.',
  },
  {
    icon: '🎨',
    title: 'أنشطة إبداعية',
    desc: 'أنشطة فنية ويدوية تُنمّي مواهب الأطفال الإبداعية وتُعبّر عن إيمانهم من خلال الرسم والتلوين والأشغال اليدوية.',
  },
];

const newsItems = [
  {
    date: '٢٥ مايو ٢٠٢٦',
    title: 'احتفال نهاية العام الدراسي',
    text: 'تستعد خدمة ماري مرقس ابتدائي بنين لإقامة حفل نهاية العام الدراسي مع توزيع الجوائز والشهادات على الأطفال المتميزين.',
    gradient: 'linear-gradient(135deg, #87CEEB, #4A90D9)',
  },
  {
    date: '٢٠ مايو ٢٠٢٦',
    title: 'رحلة إلى دير الأنبا بولا',
    text: 'رحلة روحية ممتعة إلى دير الأنبا بولا بالبحر الأحمر، تضمنت زيارة الكنائس الأثرية والمغارة المقدسة.',
    gradient: 'linear-gradient(135deg, #FFF9C4, #F6AD55)',
  },
  {
    date: '١٥ مايو ٢٠٢٦',
    title: 'مسابقة حفظ الآيات الشهرية',
    text: 'أقامت الخدمة مسابقة حفظ الآيات الشهرية وتم تكريم الفائزين بجوائز قيّمة وشهادات تقدير.',
    gradient: 'linear-gradient(135deg, #48BB78, #38A169)',
  },
];

const levels = [
  { icon: '🌱', name: 'مبتدئ', points: '٠ نقطة' },
  { icon: '🔍', name: 'مستكشف', points: '١٠٠ نقطة' },
  { icon: '🏆', name: 'بطل', points: '٥٠٠ نقطة' },
  { icon: '⭐', name: 'نجم', points: '١٠٠٠ نقطة' },
];

export default function HomePage() {
  return (
    <>
      <Header />

      {/* ====== Hero Section ====== */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-cloud hero-cloud-1" />
          <div className="hero-cloud hero-cloud-2" />
          <div className="hero-cloud hero-cloud-3" />
        </div>

        <motion.div
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.img
            src="/images/logo.jpg"
            alt="MSM Kids Logo"
            className="hero-logo"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          />

          <motion.h1
            className="hero-title"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            خدمة ماري مرقس ابتدائي بنين
          </motion.h1>

          <motion.div
            className="hero-verse"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <p>
              «إن كان أحد يخدمني فليتبعني، وحيث أكون أنا هناك أيضاً يكون خادمي.
              وإن كان أحد يخدمني يكرمه الآب»
            </p>
            <cite>— يوحنا ١٢:٢٦</cite>
          </motion.div>

          <motion.p
            className="hero-subtitle"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            بيت روحي وتعليمي لكل طفل ينمو في الإيمان والمعرفة والمجتمع
          </motion.p>

          <motion.div
            className="hero-buttons"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <Link href="/login" className="btn btn-primary btn-lg">
              انضم إلينا
            </Link>
            <Link href="/about" className="btn btn-secondary btn-lg">
              تعرف علينا
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ====== Stats Section ====== */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <motion.div
                className="stat-item"
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <span className="stat-icon">{stat.icon}</span>
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Features Section ====== */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>ماذا نقدم لأطفالنا؟</h2>
            <p>برامج متنوعة تجمع بين التعليم الروحي والمتعة والتحفيز</p>
          </div>

          <motion.div
            className="features-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
          >
            {features.map((feature, i) => (
              <motion.div
                className="feature-card"
                key={i}
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====== Latest News Preview ====== */}
      <section className="section" style={{ background: 'var(--light-gray)' }}>
        <div className="container">
          <div className="section-title">
            <h2>آخر الأخبار</h2>
            <p>تابع أحدث أخبار وفعاليات الخدمة</p>
          </div>

          <motion.div
            className="news-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
          >
            {newsItems.map((item, i) => (
              <motion.div
                className="card"
                key={i}
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
              >
                <div
                  style={{
                    background: item.gradient,
                    height: '200px',
                    borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                  }}
                >
                  {i === 0 ? '🎉' : i === 1 ? '⛪' : '📖'}
                </div>
                <div className="card-body">
                  <span className="badge badge-blue">{item.date}</span>
                  <h3 className="card-title" style={{ marginTop: '0.75rem' }}>
                    {item.title}
                  </h3>
                  <p className="card-text">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/news" className="btn btn-primary">
              عرض المزيد
            </Link>
          </div>
        </div>
      </section>

      {/* ====== Gamification Preview ====== */}
      <section className="section gamification-preview">
        <div className="container">
          <div className="section-title">
            <h2>انضم للمغامرة!</h2>
            <p>
              اجمع النقاط وارتقِ في المستويات — كل حضور وحفظ ومشاركة يقرّبك من
              القمة!
            </p>
          </div>

          <motion.div
            className="gamification-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
          >
            {levels.map((level, i) => (
              <motion.div
                className="level-card"
                key={i}
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
              >
                <div className="level-icon">{level.icon}</div>
                <div className="level-name">{level.name}</div>
                <div className="level-points">{level.points}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====== CTA Section ====== */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>ابدأ رحلتك الروحية اليوم!</h2>
            <p>
              انضم لعائلتنا الكبيرة في خدمة ماري مرقس وابدأ رحلة ممتعة مليئة
              بالإيمان والمعرفة والمرح
            </p>
            <div className="hero-buttons">
              <Link href="/login" className="btn btn-accent btn-lg">
                سجل الآن
              </Link>
              <Link href="/contact" className="btn btn-secondary btn-lg" style={{ borderColor: 'var(--white)', color: 'var(--white)' }}>
                تواصل معنا
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
