import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const requiredAccounts = [
  { email: 'admin@msmkids.com', password: 'Admin@123456', role: 'admin' },
  { email: 'servant@msmkids.com', password: 'Servant@123456', role: 'servant' },
  { email: 'parent@msmkids.com', password: 'Parent@123456', role: 'parent' },
  { email: 'child@msmkids.com', password: 'Child@123456', role: 'child' },
];

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error('Missing NEXT_PUBLIC_FIREBASE_* environment variables.');
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

for (const account of requiredAccounts) {
  const credential = await signInWithEmailAndPassword(auth, account.email, account.password);
  const profile = await getDoc(doc(db, 'users', credential.user.uid));
  if (!profile.exists()) throw new Error(`Missing Firestore profile for ${account.email}`);
  const data = profile.data();
  if (data.role !== account.role) throw new Error(`Role mismatch for ${account.email}: ${data.role}`);
  console.log(`OK ${account.email} -> ${credential.user.uid} (${data.role})`);
}

await signInWithEmailAndPassword(auth, 'admin@msmkids.com', 'Admin@123456');

const collections = ['classes', 'children', 'lessons', 'quizzes', 'news'];
for (const name of collections) {
  const snapshot = await getDocs(collection(db, name));
  console.log(`OK ${name}: ${snapshot.size} documents`);
}

await signOut(auth);
process.exit(0);
