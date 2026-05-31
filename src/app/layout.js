import './globals.css';
import { AuthProvider } from '@/lib/auth';

export const metadata = {
  title: 'MSM Kids — خدمة ماري مرقس ابتدائي بنين',
  description: 'المنصة الرقمية لخدمة ماري مرقس ابتدائي بنين — إيبارشية قنا القبطية الأرثوذكسية. بيت روحي وتعليمي لكل طفل ينمو في الإيمان والمعرفة والمجتمع.',
  keywords: 'خدمة ماري مرقس, ابتدائي بنين, إيبارشية قنا, كنيسة قبطية, تعليم مسيحي, أطفال',
  authors: [{ name: 'خدمة ماري مرقس ابتدائي بنين' }],
  openGraph: {
    title: 'MSM Kids — خدمة ماري مرقس ابتدائي بنين',
    description: 'بيت روحي وتعليمي لكل طفل ينمو في الإيمان والمعرفة والمجتمع',
    locale: 'ar_EG',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/logo.jpg" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

