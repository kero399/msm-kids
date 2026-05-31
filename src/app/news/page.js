'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';

const newsItems = [
  {
    id: 1,
    category: 'فعالية',
    title: 'احتفال عيد القيامة المجيد',
    text: 'تثور خدمة ماري مرقس ابتدائي بنين الاحتفال بعيد القيامة المجيد يوم الأحد القادم. سيتضمن الاحتفال ترانيم وتمثيليات روحية وتوزيع هدايا على الأطفال المشاركين.',
    date: '١٥ أبريل ٢٠٢٦',
    author: 'أ/ مينا سمير',
    gradient: 'linear-gradient(135deg, #87CEEB, #4A90D9)',
  },
  {
    id: 2,
    category: 'إعلان',
    title: 'بدء التسجيل في مدارس الأحد',
    text: 'نعلن عن فتح باب التسجيل للعام الدراسي الجديد في مدارس الأحد. يمكن لأولياء الأمور التسجيل لأبنائهم من خلال التواصل مع خدام الفصول أو زيارة مكتب الخدمة بالكنيسة.',
    date: '١٠ أبريل ٢٠٢٦',
    author: 'أ/ جرجس فهمي',
    gradient: 'linear-gradient(135deg, #4A90D9, #FFF9C4)',
  },
  {
    id: 3,
    category: 'فعالية',
    title: 'مسابقة حفظ سفر المزامير',
    text: 'تنظم الخدمة مسابقة حفظ مزامير مختارة لجميع المراحل. ستقام التصفيات خلال شهر مايو والنهائيات في يونيو مع جوائز قيمة للفائزين.',
    date: '٥ أبريل ٢٠٢٦',
    author: 'أ/ مارك عادل',
    gradient: 'linear-gradient(135deg, #FFF9C4, #87CEEB)',
  },
  {
    id: 4,
    category: 'خبر',
    title: 'رحلة ترفيهية لأطفال الخدمة',
    text: 'تنثم الخدمة رحلة ترفيهية لأطفال المرحلة الابتدائية إلى حديقة الأسرة. ستشمل الرحلة ألعاب جماعية ومسابقات ووجبة غداء مشتركة في جو من المرح والبهجة.',
    date: '٢٨ مارس ٢٠٢٦',
    author: 'أ/ بيشوي ناصف',
    gradient: 'linear-gradient(135deg, #87CEEB, #FFF9C4)',
  },
  {
    id: 5,
    category: 'إعلان',
    title: 'اجتماع أولياء الأمور الشهري',
    text: 'ندعو جميع أولياء الأمور لحضور الاجتماع الشهري يوم الجمعة القادم بعد القداس الإلهي. سيتم مناقشة خطة الخدمة للفترة القادمة ومتابعة مستوى الأطفال الروحي والتعليمي.',
    date: '٢٠ مارس ٢٠٢٦',
    author: 'أبونا يوحنا',
    gradient: 'linear-gradient(135deg, #4A90D9, #87CEEB)',
  },
  {
    id: 6,
    category: 'خبر',
    title: 'توزيع جوائز المتميزين',
    text: 'تم توزيع جوائز المتميزين في الحضور والحفظ خلال الشهر الماضي. نهنئ جميع الأطفال المتميزين ونشجع الجميع على المواظبة والاجتهاد في حضور مدارس الأحد.',
    date: '١٢ مارس ٢٠٢٦',
    author: 'أ/ فيلوباتير جمال',
    gradient: 'linear-gradient(135deg, #FFF9C4, #4A90D9)',
  },
];

export default function NewsPage() {
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
          <div className="news-grid">
            {newsItems.map((item, index) => (
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
                    background: item.gradient,
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
                  <p className="card-text">{item.text}</p>
                  <div className="card-meta">
                    <span>📅 {item.date}</span>
                    <span>✍️ {item.author}</span>
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
