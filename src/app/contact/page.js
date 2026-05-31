'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً بإذن الله. ✉️');
  };

  return (
    <>
      <Header />

      {/* Page Header */}
      <motion.section
        className="page-header"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="container">
          <h1>تواصل معنا</h1>
          <p>نسعد بتواصلكم واستفساراتكم</p>
        </div>
      </motion.section>

      {/* Contact Grid */}
      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Left: Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUp}
              custom={0}
            >
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">الاسم الكامل</label>
                  <input
                    className="form-input"
                    type="text"
                    name="name"
                    placeholder="أدخل اسمك الكامل"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">رقم الهاتف</label>
                  <input
                    className="form-input"
                    type="tel"
                    name="phone"
                    placeholder="٠١٠-٠٠٠-٠٠٠٠"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">البريد الإلكتروني</label>
                  <input
                    className="form-input"
                    type="email"
                    name="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">الموضوع</label>
                  <input
                    className="form-input"
                    type="text"
                    name="subject"
                    placeholder="موضوع الرسالة"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">الرسالة</label>
                  <textarea
                    className="form-textarea"
                    name="message"
                    placeholder="اكتب رسالتك هنا..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg">
                  إرسال الرسالة
                </button>
              </form>
            </motion.div>

            {/* Right: Contact Info Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUp}
              custom={2}
            >
              <div className="contact-info-card">
                <h3>معلومات التواصل</h3>

                <div className="contact-info-item">
                  <div className="contact-info-icon">📍</div>
                  <div className="contact-info-text">
                    <strong>العنوان</strong>
                    <p>كنيسة الشهيد مارمرقس — قنا، مصر</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon">📧</div>
                  <div className="contact-info-text">
                    <strong>البريد الإلكتروني</strong>
                    <p>msmkids@church.org</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon">📱</div>
                  <div className="contact-info-text">
                    <strong>الهاتف</strong>
                    <p>٠١٠-٠٠٠-٠٠٠٠</p>
                  </div>
                </div>

                <h3 style={{ marginTop: '2rem' }}>مواعيد الخدمة</h3>

                <div className="contact-info-item">
                  <div className="contact-info-icon">🕐</div>
                  <div className="contact-info-text">
                    <p>الجمعة: ٤:٠٠ — ٦:٠٠ مساءً</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon">🕐</div>
                  <div className="contact-info-text">
                    <p>الأحد: ١٠:٠٠ — ١٢:٠٠ صباحاً</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            custom={1}
            style={{
              height: '300px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--medium-blue), var(--sky-blue-dark))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--white)',
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              fontWeight: 700,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 60%), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.08) 0%, transparent 50%)',
              }}
            />
            <span style={{ position: 'relative', zIndex: 1 }}>📍 خريطة الموقع</span>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
