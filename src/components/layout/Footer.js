import Link from 'next/link';

const quickLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/about', label: 'عن الخدمة' },
  { href: '/news', label: 'الأخبار' },
  { href: '/trips', label: 'الرحلات' },
  { href: '/gallery', label: 'معرض الصور' },
  { href: '/contact', label: 'تواصل معنا' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        {/* Verse of the Day */}
        <div className="footer-verse">
          <p>
            «إن كان أحد يخدمني فليتبعني، وحيث أكون أنا هناك أيضاً يكون خادمي.
            وإن كان أحد يخدمني يكرمه الآب»
          </p>
          <cite>— يوحنا ١٢:٢٦</cite>
        </div>

        <div className="footer-grid">
          {/* About Column */}
          <div className="footer-col">
            <h3>خدمة ماري مرقس</h3>
            <p>
              بيت روحي وتعليمي لكل طفل ينمو في الإيمان والمعرفة والمجتمع.
              خدمة ابتدائي بنين — إيبارشية قنا القبطية الأرثوذكسية.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h3>روابط سريعة</h3>
            <ul>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-col">
            <h3>تواصل معنا</h3>
            <p>📍 كنيسة مارمرقس — قنا، مصر</p>
            <p>📧 msmkids@church.org</p>
            <p>📱 ٠١٠-٠٠٠-٠٠٠٠</p>
          </div>

          {/* Service Hours */}
          <div className="footer-col">
            <h3>مواعيد الخدمة</h3>
            <p>🕐 الجمعة: ٤:٠٠ — ٦:٠٠ مساءً</p>
            <p>🕐 الأحد: ١٠:٠٠ — ١٢:٠٠ صباحاً</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} MSM Kids — خدمة ماري مرقس ابتدائي بنين.
            جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
