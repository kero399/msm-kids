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

const values = [
  {
    icon: '✝️',
    title: 'الإيمان',
    desc: 'نؤسس أطفالنا على صخرة الإيمان المسيحي الأرثوذكسي، ونُعلّمهم أن يحبوا الله ويثقوا بتدبيره في كل أمور حياتهم.',
  },
  {
    icon: '📚',
    title: 'التعلم',
    desc: 'نقدم محتوى تعليمي متميز يجمع بين الدروس الروحية والمعرفة الكتابية بأساليب تفاعلية تناسب أعمار الأطفال.',
  },
  {
    icon: '🤝',
    title: 'المجتمع',
    desc: 'نبني مجتمعًا مسيحيًا مترابطًا يشعر فيه كل طفل بالانتماء والمحبة، ويتعلم قيم التعاون والصداقة الحقيقية.',
  },
  {
    icon: '❤️',
    title: 'المحبة',
    desc: 'نزرع في قلوب أطفالنا محبة المسيح والقريب، ونُشجّعهم على ممارسة الأعمال الصالحة وخدمة الآخرين بفرح.',
  },
];

const leaders = [
  {
    icon: '👨‍💼',
    title: 'الأب الكاهن',
    desc: 'يقود الخدمة روحيًا ويُقدّم الإرشاد الأبوي لكل طفل وخادم، ويحرص على أن تسير الخدمة وفق تعاليم الكنيسة القبطية الأرثوذكسية.',
  },
  {
    icon: '👨‍🏫',
    title: 'رئيس الخدمة',
    desc: 'يُنسّق بين فرق العمل ويُخطط للبرامج والأنشطة الأسبوعية، ويتابع تقدّم الأطفال الروحي والتعليمي بالتعاون مع أب الاعتراف.',
  },
  {
    icon: '👥',
    title: 'فريق الخدّام',
    desc: 'مجموعة من الشباب المُكرّسين الذين يُقدّمون وقتهم ومواهبهم لخدمة أطفال الكنيسة بمحبة وإخلاص وتفانٍ.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />

      {/* ====== Page Header ====== */}
      <section className="page-header">
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            عن الخدمة
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            تعرّف على خدمة ماري مرقس ابتدائي بنين — رسالتنا، رؤيتنا، وفريق
            العمل
          </motion.p>
        </div>
      </section>

      {/* ====== About Content ====== */}
      <section className="section">
        <div className="container">
          <motion.div
            className="about-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
          >
            <motion.div
              className="about-text"
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              <h2>خدمة ماري مرقس ابتدائي بنين</h2>
              <p>
                تأسست خدمة ماري مرقس ابتدائي بنين تحت رعاية إيبارشية قنا
                القبطية الأرثوذكسية، لتكون بيتًا روحيًا وتعليميًا لأبنائنا في
                المرحلة الابتدائية. منذ نشأتها، حرصت الخدمة على تقديم محتوى
                روحي وتعليمي متميز يُبنى على أساس الكتاب المقدس وتعاليم آباء
                الكنيسة.
              </p>
              <p>
                تهدف الخدمة إلى بناء شخصية مسيحية متكاملة لكل طفل، من خلال
                دروس الكتاب المقدس الأسبوعية، وحفظ الآيات، والأنشطة التفاعلية
                التي تُرسّخ القيم المسيحية في حياتهم اليومية. نسعى لأن يكون كل
                طفل قادرًا على فهم إيمانه والتعبير عنه بثقة.
              </p>
              <p>
                تتميز الخدمة بنظام تحفيزي فريد يشمل النقاط والمستويات
                والجوائز، مما يُشجّع الأطفال على المشاركة الفعّالة والالتزام
                بالحضور. كما تُنظّم الخدمة رحلات ترفيهية وروحية دورية تُعزّز
                الروابط بين الأطفال وتُعرّفهم على تاريخ الكنيسة وأماكنها
                المقدسة.
              </p>
              <p>
                يعمل في الخدمة فريق من الخدّام المتطوعين المُدرّبين تحت إشراف
                أب الاعتراف، حيث يحرصون على تقديم أفضل تجربة تعليمية وروحية
                لكل طفل بمحبة وإخلاص. نؤمن بأن كل طفل هو هبة من الله ويستحق
                أفضل رعاية روحية ممكنة.
              </p>
            </motion.div>

            <motion.div
              className="about-image"
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              <div
                style={{
                  height: '300px',
                  background:
                    'linear-gradient(135deg, var(--sky-blue-light), var(--medium-blue))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '5rem',
                  borderRadius: 'var(--radius-xl)',
                }}
              >
                ⛪ 
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ====== Mission & Values ====== */}
      <section className="section" style={{ background: 'var(--light-gray)' }}>
        <div className="container">
          <div className="section-title">
            <h2>رؤيتنا وقيمنا</h2>
            <p>
              القيم الأساسية التي تُوجّه خدمتنا وتُشكّل رؤيتنا لبناء جيل مسيحي
              واعٍ
            </p>
          </div>

          <motion.div
            className="about-values"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
          >
            {values.map((value, i) => (
              <motion.div
                className="about-value-card"
                key={i}
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
              >
                <div className="about-value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====== Leadership ====== */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>فريق الخدمة</h2>
            <p>الفريق القائم على خدمة أطفالنا برعاية الله</p>
          </div>

          <motion.div
            className="features-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
          >
            {leaders.map((leader, i) => (
              <motion.div
                className="feature-card"
                key={i}
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
              >
                <div className="feature-icon">{leader.icon}</div>
                <h3>{leader.title}</h3>
                <p>{leader.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
