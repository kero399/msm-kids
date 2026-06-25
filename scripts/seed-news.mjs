import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { addDoc, collection, getDocs, getFirestore, query, serverTimestamp, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const newsItems = [
  {
    category: 'إعلان',
    title: 'بدء التسجيل في مدارس الأحد',
    body: 'نعلن عن فتح باب التسجيل للعام الدراسي الجديد في مدارس الأحد. يمكن لأولياء الأمور التسجيل من خلال خدام الفصول أو مكتب الخدمة.',
  },
  {
    category: 'خبر',
    title: 'توزيع جوائز المتميزين',
    body: 'تم توزيع جوائز المتميزين في الحضور والحفظ خلال الشهر الماضي. نهنئ جميع الأطفال ونشجع الجميع على المواظبة والاجتهاد.',
  },
];

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error('Missing NEXT_PUBLIC_FIREBASE_* environment variables.');
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

await signInWithEmailAndPassword(auth, 'admin@msmkids.com', 'Admin@123456');

let created = 0;
for (const item of newsItems) {
  const existing = await getDocs(query(collection(db, 'news'), where('title', '==', item.title)));
  if (!existing.empty) {
    console.log(`SKIP ${item.title}`);
    continue;
  }

  await addDoc(collection(db, 'news'), {
    ...item,
    imageUrl: null,
    publishedBy: 'المسؤول أ. فادي شكري',
    publishedAt: new Date().toISOString().split('T')[0],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  created += 1;
  console.log(`OK ${item.title}`);
}

await signOut(auth);
console.log(`Seeded ${created} news item(s).`);
process.exit(0);
