'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { isFirebaseConfigured, auth, db } from '@/lib/firebase';

const SEED_DATA = {
  classes: [
    { id: 'class-001', name: 'الصف الأول', grade: 'أولى ابتدائي', servantUid: 'servant-uid-placeholder', servantName: 'مينا ألبير', childCount: 5 },
    { id: 'class-002', name: 'الصف الثاني', grade: 'ثانية ابتدائي', servantUid: null, servantName: null, childCount: 2 },
    { id: 'class-003', name: 'الصف الثالث', grade: 'ثالثة ابتدائي', servantUid: null, servantName: null, childCount: 1 },
  ],
  children: [
    { uid: 'child-uid-placeholder', name: 'كيرلس رفعت', grade: 'أولى ابتدائي', classId: 'class-001', parentUid: 'parent-uid-placeholder', servantUid: 'servant-uid-placeholder', avatarId: '👦', points: 750, level: 'بطل', parentContact: '٠١٠٠٠٠٠٠٠٠١' },
    { name: 'مارك عادل', grade: 'أولى ابتدائي', classId: 'class-001', parentUid: null, servantUid: 'servant-uid-placeholder', avatarId: '🧒', points: 520, level: 'مستكشف', parentContact: '٠١٠٠٠٠٠٠٠٠٢' },
    { name: 'يوسف ماجد', grade: 'أولى ابتدائي', classId: 'class-001', parentUid: null, servantUid: 'servant-uid-placeholder', avatarId: '👦', points: 330, level: 'مستكشف', parentContact: '٠١٠٠٠٠٠٠٠٠٣' },
    { name: 'بيشوي ناصف', grade: 'أولى ابتدائي', classId: 'class-001', parentUid: null, servantUid: 'servant-uid-placeholder', avatarId: '🧒', points: 180, level: 'مبتدئ', parentContact: '٠١٠٠٠٠٠٠٠٠٤' },
    { name: 'فيلوباتير جمال', grade: 'أولى ابتدائي', classId: 'class-001', parentUid: null, servantUid: 'servant-uid-placeholder', avatarId: '👦', points: 90, level: 'مبتدئ', parentContact: '٠١٠٠٠٠٠٠٠٠٥' },
    { name: 'جورج سامي', grade: 'ثانية ابتدائي', classId: 'class-002', parentUid: null, servantUid: null, avatarId: '🧒', points: 410, level: 'مستكشف', parentContact: '٠١٠٠٠٠٠٠٠٠٦' },
    { name: 'مينا شنودة', grade: 'ثانية ابتدائي', classId: 'class-002', parentUid: null, servantUid: null, avatarId: '👦', points: 600, level: 'مستكشف', parentContact: '٠١٠٠٠٠٠٠٠٠٧' },
    { name: 'أندرو فؤاد', grade: 'ثالثة ابتدائي', classId: 'class-003', parentUid: null, servantUid: null, avatarId: '🧒', points: 250, level: 'مبتدئ', parentContact: '٠١٠٠٠٠٠٠٠٠٨' },
  ],
  verses: [
    { verseText: 'أَنَا هُوَ النُّورُ الْحَقِيقِيُّ الَّذِي يُنِيرُ كُلَّ إِنْسَانٍ', reference: 'يوحنا ١: ٩', pointsAwarded: 20 },
    { verseText: 'تَعَالَوْا إِلَيَّ يَا جَمِيعَ الْمُتْعَبِينَ وَالثَّقِيلِي الأَحْمَالِ، وَأَنَا أُرِيحُكُمْ.', reference: 'متى ١١: ٢٨', pointsAwarded: 20 },
  ],
  quizzes: [
    {
      title: 'مسابقة حياة القديس مارمرقس الرسول',
      grade: 'أولى ابتدائي',
      classId: 'class-001',
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      pointValue: 30,
      questions: [
        { text: 'أين ولد القديس مارمرقس؟', options: ['القدس', 'القيروان (ليبيا)', 'الإسكندرية', 'روما'], correctIndex: 1 },
        { text: 'ما هو رمز القديس مارمرقس؟', options: ['الحمل', 'النسر', 'الثور', 'الأسد'], correctIndex: 3 },
        { text: 'مارمرقس هو كاتب إنجيل...', options: ['متى', 'مرقس', 'لوقا', 'يوحنا'], correctIndex: 1 },
      ]
    }
  ],
  lessons: [
    { title: 'درس القديس مارمرقس كاروز ديارنا المصرية', classId: 'class-001', date: '2026-06-12', description: 'نتعلم اليوم عن حياة القديس مارمرقس وكيف أحضر الإيمان المسيحي إلى مصر واستشهاده في الإسكندرية.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', fileUrl: null },
    { title: 'درس المحبة والعطاء من قصة السامري الصالح', classId: 'class-001', date: '2026-06-05', description: 'قصة السامري الصالح وكيف نساعد كل إنسان محتاج بغض النظر عن جنسه أو دينه.', videoUrl: null, fileUrl: null },
  ]
};

export default function SetupDatabasePage() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const addLog = (message) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
  };

  const handleInitialize = async () => {
    if (!isFirebaseConfigured || !auth || !db) {
      setError('يرجى التحقق من إعدادات Firebase في ملف .env.local أولاً.');
      return;
    }

    setLoading(true);
    setError(null);
    setLogs([]);
    addLog('بدء تهيئة قاعدة البيانات...');

    try {
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      const { doc, setDoc, collection, addDoc, serverTimestamp } = await import('firebase/firestore');

      // 1. Create Mock Admin Account
      addLog('إنشاء حساب المسؤول (admin)...');
      let adminUid = 'mock-admin-uid';
      try {
        const adminCred = await createUserWithEmailAndPassword(auth, 'admin@msmkids.com', 'Admin@123456');
        adminUid = adminCred.user.uid;
        addLog(`تم إنشاء حساب المسؤول بنجاح: ${adminUid}`);
      } catch (authErr) {
        if (authErr.code === 'auth/email-already-in-use') {
          addLog('حساب المسؤول موجود بالفعل، سيتم تحديث بيانات Firestore فقط.');
          // Try signing in or finding UID (for safety we use placeholder or allow overwrite if config matches)
          adminUid = 'existing-admin-uid';
        } else {
          throw authErr;
        }
      }

      await setDoc(doc(db, 'users', adminUid), {
        name: 'المسؤول أ. فادي شكري',
        email: 'admin@msmkids.com',
        role: 'admin',
        createdAt: serverTimestamp()
      }, { merge: true });
      addLog('تم حفظ بيانات المسؤول في Firestore.');

      // 2. Create Mock Servant Account
      addLog('إنشاء حساب الخادم (servant)...');
      let servantUid = 'mock-servant-uid';
      try {
        const servantCred = await createUserWithEmailAndPassword(auth, 'servant@msmkids.com', 'Servant@123456');
        servantUid = servantCred.user.uid;
        addLog(`تم إنشاء حساب الخادم بنجاح: ${servantUid}`);
      } catch (authErr) {
        if (authErr.code === 'auth/email-already-in-use') {
          addLog('حساب الخادم موجود بالفعل، سيتم تحديث بيانات Firestore فقط.');
          servantUid = 'existing-servant-uid';
        } else {
          throw authErr;
        }
      }

      await setDoc(doc(db, 'users', servantUid), {
        name: 'الخادم مينا ألبير',
        email: 'servant@msmkids.com',
        role: 'servant',
        classId: 'class-001',
        className: 'الصف الأول',
        phone: '٠١٠١٢٣٤٥٦٧',
        createdAt: serverTimestamp()
      }, { merge: true });
      addLog('تم حفظ بيانات الخادم في Firestore.');

      // 3. Create Mock Parent Account
      addLog('إنشاء حساب ولي الأمر (parent)...');
      let parentUid = 'mock-parent-uid';
      try {
        const parentCred = await createUserWithEmailAndPassword(auth, 'parent@msmkids.com', 'Parent@123456');
        parentUid = parentCred.user.uid;
        addLog(`تم إنشاء حساب ولي الأمر بنجاح: ${parentUid}`);
      } catch (authErr) {
        if (authErr.code === 'auth/email-already-in-use') {
          addLog('حساب ولي الأمر موجود بالفعل، سيتم تحديث بيانات Firestore.');
          parentUid = 'existing-parent-uid';
        } else {
          throw authErr;
        }
      }

      // 4. Create Mock Child Account
      addLog('إنشاء حساب الطفل (child)...');
      let childUid = 'mock-child-uid';
      try {
        const childCred = await createUserWithEmailAndPassword(auth, 'child@msmkids.com', 'Child@123456');
        childUid = childCred.user.uid;
        addLog(`تم إنشاء حساب الطفل بنجاح: ${childUid}`);
      } catch (authErr) {
        if (authErr.code === 'auth/email-already-in-use') {
          addLog('حساب الطفل موجود بالفعل، سيتم تحديث بيانات Firestore.');
          childUid = 'existing-child-uid';
        } else {
          throw authErr;
        }
      }

      await setDoc(doc(db, 'users', parentUid), {
        name: 'أبو كيرلس رفعت',
        email: 'parent@msmkids.com',
        role: 'parent',
        linkedChildUid: childUid,
        createdAt: serverTimestamp()
      }, { merge: true });
      addLog('تم حفظ بيانات ولي الأمر في Firestore.');

      await setDoc(doc(db, 'users', childUid), {
        name: 'كيرلس رفعت',
        email: 'child@msmkids.com',
        role: 'child',
        classId: 'class-001',
        points: 750,
        level: 'بطل',
        avatarUrl: '/images/logo.jpg',
        createdAt: serverTimestamp()
      }, { merge: true });
      addLog('تم حفظ بيانات الطفل في Firestore.');

      // 5. Initialize Classes
      addLog('بدء إنشاء الفصول...');
      for (const cls of SEED_DATA.classes) {
        const finalServantUid = cls.servantUid === 'servant-uid-placeholder' ? servantUid : cls.servantUid;
        await setDoc(doc(db, 'classes', cls.id), {
          name: cls.name,
          grade: cls.grade,
          servantUid: finalServantUid,
          servantName: finalServantUid ? 'الخادم مينا ألبير' : null,
          childCount: cls.childCount,
          createdAt: serverTimestamp()
        }, { merge: true });
        addLog(`تم إنشاء فصل: ${cls.name}`);
      }

      // 6. Initialize Children profiles in 'children' collection
      addLog('بدء إنشاء بيانات الأطفال...');
      let isFirst = true;
      for (const ch of SEED_DATA.children) {
        const finalChildUid = isFirst ? childUid : generateId('ch');
        const finalParentUid = isFirst ? parentUid : null;
        const finalServantUid = ch.servantUid === 'servant-uid-placeholder' ? servantUid : ch.servantUid;
        
        await setDoc(doc(db, 'children', finalChildUid), {
          name: ch.name,
          grade: ch.grade,
          classId: ch.classId,
          parentUid: finalParentUid,
          servantUid: finalServantUid,
          avatarId: ch.avatarId,
          points: ch.points,
          level: ch.level,
          parentContact: ch.parentContact,
          createdAt: serverTimestamp()
        }, { merge: true });
        
        addLog(`تم إنشاء ملف الطفل: ${ch.name}`);
        isFirst = false;
      }

      // 7. Seed Assigned Verses
      addLog('بدء إنشاء آيات الحفظ...');
      for (const v of SEED_DATA.verses) {
        await addDoc(collection(db, 'verses'), {
          childUid: childUid,
          classId: 'class-001',
          verseText: v.verseText,
          reference: v.reference,
          assignedDate: new Date(Date.now() - 86400000 * 5),
          memorizedDate: null,
          verifiedBy: null,
          pointsAwarded: v.pointsAwarded,
          createdAt: serverTimestamp()
        });
      }
      addLog('تم إنشاء آيات الحفظ بنجاح.');

      // 8. Seed Quizzes
      addLog('بدء إنشاء المسابقات...');
      for (const q of SEED_DATA.quizzes) {
        await addDoc(collection(db, 'quizzes'), {
          title: q.title,
          grade: q.grade,
          classId: q.classId,
          dueDate: q.dueDate,
          pointValue: q.pointValue,
          questions: q.questions,
          createdBy: servantUid,
          createdAt: serverTimestamp()
        });
      }
      addLog('تم إنشاء المسابقات بنجاح.');

      // 9. Seed Lessons
      addLog('بدء إنشاء الدروس...');
      for (const l of SEED_DATA.lessons) {
        await addDoc(collection(db, 'lessons'), {
          title: l.title,
          classId: l.classId,
          date: l.date,
          description: l.description,
          videoUrl: l.videoUrl,
          fileUrl: l.fileUrl,
          publishedBy: servantUid,
          createdAt: serverTimestamp()
        });
      }
      addLog('تم إنشاء الدروس بنجاح.');

      addLog('تمت تهيئة قاعدة البيانات بالكامل بنجاح! 🎉');
      setSuccess(true);
    } catch (err) {
      addLog(`خطأ فادح: ${err.message}`);
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateId = (prefix) => {
    return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6" dir="rtl">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <h1 className="text-2xl font-bold text-slate-800 text-center mb-2">تهيئة قاعدة بيانات خدمة ماري مرقس</h1>
        <p className="text-slate-600 text-center mb-8">سيقوم هذا المعالج بإنشاء الهيكل وحسابات الاختبار الافتراضية في مشروع Firebase الخاص بك.</p>

        {!isFirebaseConfigured ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 text-center mb-6">
            <p className="font-semibold">تنبيه: لم يتم تكوين إعدادات Firebase بعد!</p>
            <p className="text-sm mt-1">يرجى التأكد من ملء المتغيرات في ملف <code className="bg-red-100 px-1 py-0.5 rounded">.env.local</code> وإعادة تشغيل الخادم.</p>
          </div>
        ) : (
          <div className="bg-blue-50 text-blue-700 p-4 rounded-xl border border-blue-100 mb-6 text-sm">
            <h3 className="font-bold mb-1">خطوات هامة قبل البدء:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>تأكد من تفعيل <strong>Authentication</strong> وتفعيل طريقة تسجيل الدخول بـ <strong>البريد الإلكتروني وكلمة المرور (Email/Password)</strong> في لوحة Firebase.</li>
              <li>تأكد من إنشاء قاعدة بيانات <strong>Firestore Database</strong> في لوحة Firebase.</li>
            </ul>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 text-sm mb-6">
            <strong>حدث خطأ:</strong> {error}
          </div>
        )}

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={handleInitialize}
            disabled={loading || !isFirebaseConfigured || success}
            className={`btn btn-primary btn-lg ${loading || !isFirebaseConfigured || success ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'جاري التهيئة...' : 'ابدأ التهيئة والتشغيل'}
          </button>
          <Link href="/" className="btn btn-secondary btn-lg">
            العودة للرئيسية
          </Link>
        </div>

        {logs.length > 0 && (
          <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs h-64 overflow-y-auto space-y-1 border border-slate-800">
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        )}

        {success && (
          <div className="mt-8 bg-emerald-50 text-emerald-800 p-6 rounded-xl border border-emerald-100 text-center">
            <h3 className="font-bold text-lg mb-2">اكتملت التهيئة بنجاح! 🎉</h3>
            <p className="text-sm mb-4">يمكنك الآن تسجيل الدخول باستخدام الحسابات التالية:</p>
            <div className="grid grid-cols-2 gap-4 text-right text-xs max-w-md mx-auto">
              <div className="bg-white p-2.5 rounded border border-emerald-200">
                <strong className="block text-slate-800">المسؤول (Admin):</strong>
                <p>Email: admin@msmkids.com</p>
                <p>Pass: Admin@123456</p>
              </div>
              <div className="bg-white p-2.5 rounded border border-emerald-200">
                <strong className="block text-slate-800">الخادم (Servant):</strong>
                <p>Email: servant@msmkids.com</p>
                <p>Pass: Servant@123456</p>
              </div>
              <div className="bg-white p-2.5 rounded border border-emerald-200">
                <strong className="block text-slate-800">ولي الأمر (Parent):</strong>
                <p>Email: parent@msmkids.com</p>
                <p>Pass: Parent@123456</p>
              </div>
              <div className="bg-white p-2.5 rounded border border-emerald-200">
                <strong className="block text-slate-800">الطفل (Child):</strong>
                <p>Email: child@msmkids.com</p>
                <p>Pass: Child@123456</p>
              </div>
            </div>
            <Link href="/login" className="btn btn-primary mt-6">
              اذهب إلى صفحة الدخول
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
