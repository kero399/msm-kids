// src/lib/firestore.js
// Firestore CRUD utilities for MSM Kids
// Dual-mode: uses real Firestore when configured, mock data in dev mode

import { isFirebaseConfigured, db } from './firebase';
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  increment,
  serverTimestamp,
} from 'firebase/firestore';

// ============================================
// Mock Data Store (for development without Firebase)
// ============================================
const mockStore = {
  classes: [
    { id: 'class-001', name: 'الصف الأول', grade: 'أولى ابتدائي', servantUid: 'mock-servant-001', servantName: 'مينا ألبير', childCount: 12, createdAt: new Date() },
    { id: 'class-002', name: 'الصف الثاني', grade: 'ثانية ابتدائي', servantUid: null, servantName: null, childCount: 10, createdAt: new Date() },
    { id: 'class-003', name: 'الصف الثالث', grade: 'ثالثة ابتدائي', servantUid: null, servantName: null, childCount: 8, createdAt: new Date() },
  ],
  children: [
    { uid: 'mock-child-001', name: 'كيرلس رفعت', grade: 'أولى ابتدائي', classId: 'class-001', parentUid: 'mock-parent-001', servantUid: 'mock-servant-001', avatarId: '👦', points: 750, level: 'بطل', createdAt: new Date() },
    { uid: 'mock-child-002', name: 'مارك عادل', grade: 'أولى ابتدائي', classId: 'class-001', parentUid: null, servantUid: 'mock-servant-001', avatarId: '🧒', points: 520, level: 'مستكشف', createdAt: new Date() },
    { uid: 'mock-child-003', name: 'يوسف ماجد', grade: 'أولى ابتدائي', classId: 'class-001', parentUid: null, servantUid: 'mock-servant-001', avatarId: '👦', points: 330, level: 'مستكشف', createdAt: new Date() },
    { uid: 'mock-child-004', name: 'بيشوي ناصف', grade: 'أولى ابتدائي', classId: 'class-001', parentUid: null, servantUid: 'mock-servant-001', avatarId: '🧒', points: 180, level: 'مبتدئ', createdAt: new Date() },
    { uid: 'mock-child-005', name: 'فيلوباتير جمال', grade: 'أولى ابتدائي', classId: 'class-001', parentUid: null, servantUid: 'mock-servant-001', avatarId: '👦', points: 90, level: 'مبتدئ', createdAt: new Date() },
    { uid: 'mock-child-006', name: 'جورج سامي', grade: 'ثانية ابتدائي', classId: 'class-002', parentUid: null, servantUid: null, avatarId: '🧒', points: 410, level: 'مستكشف', createdAt: new Date() },
    { uid: 'mock-child-007', name: 'مينا شنودة', grade: 'ثانية ابتدائي', classId: 'class-002', parentUid: null, servantUid: null, avatarId: '👦', points: 600, level: 'مستكشف', createdAt: new Date() },
    { uid: 'mock-child-008', name: 'أندرو فؤاد', grade: 'ثالثة ابتدائي', classId: 'class-003', parentUid: null, servantUid: null, avatarId: '🧒', points: 250, level: 'مبتدئ', createdAt: new Date() },
  ],
  servants: [
    { uid: 'mock-servant-001', name: 'مينا ألبير', email: 'mina@msmkids.com', role: 'servant', classId: 'class-001', className: 'الصف الأول', phone: '٠١٠-١٢٣-٤٥٦٧', createdAt: new Date() },
    { uid: 'mock-servant-002', name: 'جرجس فهمي', email: 'gerges@msmkids.com', role: 'servant', classId: null, className: null, phone: '٠١١-٩٨٧-٦٥٤٣', createdAt: new Date() },
    { uid: 'mock-servant-003', name: 'مارك عادل', email: 'mark@msmkids.com', role: 'servant', classId: null, className: null, phone: '٠١٢-٥٥٥-٠٠٠٠', createdAt: new Date() },
  ],
  attendance: [
    { id: 'att-001', childUid: 'mock-child-001', classId: 'class-001', date: '2026-06-13', present: true, recordedBy: 'mock-servant-001', sessionId: 'session-001' },
    { id: 'att-002', childUid: 'mock-child-002', classId: 'class-001', date: '2026-06-13', present: true, recordedBy: 'mock-servant-001', sessionId: 'session-001' },
    { id: 'att-003', childUid: 'mock-child-003', classId: 'class-001', date: '2026-06-13', present: false, recordedBy: 'mock-servant-001', sessionId: 'session-001' },
    { id: 'att-004', childUid: 'mock-child-004', classId: 'class-001', date: '2026-06-13', present: true, recordedBy: 'mock-servant-001', sessionId: 'session-001' },
    { id: 'att-005', childUid: 'mock-child-005', classId: 'class-001', date: '2026-06-13', present: false, recordedBy: 'mock-servant-001', sessionId: 'session-001' },
    { id: 'att-006', childUid: 'mock-child-001', classId: 'class-001', date: '2026-06-06', present: true, recordedBy: 'mock-servant-001', sessionId: 'session-002' },
    { id: 'att-007', childUid: 'mock-child-002', classId: 'class-001', date: '2026-06-06', present: false, recordedBy: 'mock-servant-001', sessionId: 'session-002' },
    { id: 'att-008', childUid: 'mock-child-003', classId: 'class-001', date: '2026-06-06', present: true, recordedBy: 'mock-servant-001', sessionId: 'session-002' },
  ],
  activityLog: [
    { id: 'log-001', action: 'تسجيل حضور', details: 'الصف الأول — جلسة الجمعة', user: 'مينا ألبير', timestamp: new Date(Date.now() - 3600000) },
    { id: 'log-002', action: 'إضافة نقاط', details: 'كيرلس رفعت +20 نقطة (حفظ آية)', user: 'مينا ألبير', timestamp: new Date(Date.now() - 7200000) },
    { id: 'log-003', action: 'إنشاء حساب طفل', details: 'فيلوباتير جمال — الصف الأول', user: 'مينا ألبير', timestamp: new Date(Date.now() - 86400000) },
    { id: 'log-004', action: 'إنشاء فصل', details: 'الصف الثالث — ثالثة ابتدائي', user: 'أ. فادي شكري', timestamp: new Date(Date.now() - 172800000) },
  ],
  absence_excuses: [
    { id: 'excuse-001', childUid: 'mock-child-001', childName: 'كيرلس رفعت', classId: 'class-001', parentUid: 'mock-parent-001', sessionDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], reason: 'ظروف عائلية والسفر خارج المدينة', status: 'pending', submittedAt: new Date() },
  ],
  verses: [
    { id: 'verse-001', childUid: 'mock-child-001', classId: 'class-001', verseText: 'أَنَا هُوَ النُّورُ الْحَقِيقِيُّ الَّذِي يُنِيرُ كُلَّ إِنْسَانٍ', reference: 'يوحنا ١: ٩', assignedDate: new Date(Date.now() - 86400000 * 5), memorizedDate: new Date(Date.now() - 86400000 * 2), verifiedBy: 'mock-servant-001', pointsAwarded: 20 },
    { id: 'verse-002', childUid: 'mock-child-001', classId: 'class-001', verseText: 'تَعَالَوْا إِلَيَّ يَا جَمِيعَ الْمُتْعَبِينَ وَالثَّقِيلِي الأَحْمَالِ، وَأَنَا أُرِيحُكُمْ.', reference: 'متى ١١: ٢٨', assignedDate: new Date(Date.now() - 86400000 * 1), memorizedDate: null, verifiedBy: null, pointsAwarded: 20 },
  ],
  quizzes: [
    {
      id: 'quiz-001',
      title: 'مسابقة حياة القديس مارمرقس الرسول',
      classId: 'class-001',
      grade: 'أولى ابتدائي',
      createdBy: 'mock-servant-001',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      pointValue: 30,
      questions: [
        { text: 'أين ولد القديس مارمرقس؟', options: ['القدس', 'القيروان (ليبيا)', 'الإسكندرية', 'روما'], correctIndex: 1 },
        { text: 'ما هو رمز القديس مارمرقس؟', options: ['الحمل', 'النسر', 'الثور', 'الأسد'], correctIndex: 3 },
        { text: 'مارمرقس هو كاتب إنجيل...', options: ['متى', 'مرقس', 'لوقا', 'يوحنا'], correctIndex: 1 },
      ],
      submissions: {
        'mock-child-002': { score: 100, pointsEarned: 30, submittedAt: new Date() }
      }
    }
  ],
  lessons: [
    { id: 'lesson-001', title: 'درس القديس مارمرقس كاروز ديارنا المصرية', classId: 'class-001', date: '2026-06-12', description: 'نتعلم اليوم عن حياة القديس مارمرقس وكيف أحضر الإيمان المسيحي إلى مصر واستشهاده في الإسكندرية.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', fileUrl: '/files/st-mark-lesson.pdf', publishedBy: 'mock-servant-001' },
    { id: 'lesson-002', title: 'درس المحبة والعطاء من قصة السامري الصالح', classId: 'class-001', date: '2026-06-05', description: 'قصة السامري الصالح وكيف نساعد كل إنسان محتاج بغض النظر عن جنسه أو دينه.', videoUrl: null, fileUrl: null, publishedBy: 'mock-servant-001' },
  ],
  news: [
    { id: 'news-001', category: 'فعالية', title: 'احتفال عيد القيامة المجيد', body: 'تدعو خدمة ماري مرقس ابتدائي بنين الأطفال للاحتفال بعيد القيامة المجيد يوم الأحد القادم مع ترانيم وتمثيليات روحية وتوزيع هدايا.', imageUrl: null, publishedBy: 'أ/ مينا سمير', publishedAt: '2026-04-15', createdAt: new Date() },
    { id: 'news-002', category: 'إعلان', title: 'بدء التسجيل في مدارس الأحد', body: 'نعلن عن فتح باب التسجيل للعام الدراسي الجديد في مدارس الأحد. يمكن لأولياء الأمور التسجيل من خلال خدام الفصول أو مكتب الخدمة.', imageUrl: null, publishedBy: 'أ/ جرجس فهمي', publishedAt: '2026-04-10', createdAt: new Date() },
    { id: 'news-003', category: 'خبر', title: 'توزيع جوائز المتميزين', body: 'تم توزيع جوائز المتميزين في الحضور والحفظ خلال الشهر الماضي. نهنئ جميع الأطفال ونشجع الجميع على المواظبة والاجتهاد.', imageUrl: null, publishedBy: 'أ/ فيلوباتير جمال', publishedAt: '2026-03-12', createdAt: new Date() },
  ],
  trips: [
    {
      id: 'trip-001',
      title: 'رحلة دير الأنبا بولا',
      description: 'رحلة روحية مميزة لزيارة دير الأنبا بولا أول السواح في الصحراء الشرقية. يتعرف الأطفال على حياة الرهبان وتاريخ الدير العريق مع أنشطة روحية وترفيهية متنوعة.',
      price: '١٥٠ جنيه',
      date: '2026-07-15',
      location: 'دير الأنبا بولا — البحر الأحمر',
      deadline: '2026-07-10',
      gradient: 'linear-gradient(135deg, #2E7D32, #81C784, #4FC3F7)',
      icon: '⛪'
    },
    {
      id: 'trip-002',
      title: 'يوم ترفيهي في الملاهي',
      description: 'يوم مليء بالمرح والألعاب الترفيهية في مدينة الملاهي. فرصة رائعة للأطفال للاستمتاع مع أصدقائهم في جو من البهجة والسعادة تحت إشراف خدام الخدمة.',
      price: '٢٠٠ جنيه',
      date: '2026-07-22',
      location: 'دريم بارك — مدينة ٦ أكتوبر',
      deadline: '2026-07-18',
      gradient: 'linear-gradient(135deg, #FF8F00, #FFD54F, #FF7043)',
      icon: '🎢'
    },
    {
      id: 'trip-003',
      title: 'رحلة الغردقة الصيفية',
      description: 'رحلة صيفية لمدة ثلاثة أيام إلى الغردقة على شاطئ البحر الأحمر. تشمل الرحلة السباحة والأنشطة البحرية والألعاب الجماعية مع أوقات روحية وترانيم على الشاطئ.',
      price: 'مجاناً',
      date: '2026-08-05',
      location: 'الغردقة — البحر الأحمر',
      deadline: '2026-07-28',
      gradient: 'linear-gradient(135deg, #0288D1, #4FC3F7, #00BCD4)',
      icon: '🏖️'
    }
  ],
  trip_registrations: []
};

// Helper: generate unique ID
let mockIdCounter = 100;
function generateId(prefix = 'mock') {
  return `${prefix}-${Date.now()}-${++mockIdCounter}`;
}

// ============================================
// Classes
// ============================================
export async function getClasses() {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, 'classes'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return [...mockStore.classes];
}

export async function getClassById(classId) {
  if (isFirebaseConfigured && db) {
    const docSnap = await getDoc(doc(db, 'classes', classId));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  }
  return mockStore.classes.find((c) => c.id === classId) || null;
}

export async function createClass({ name, grade }) {
  if (isFirebaseConfigured && db) {
    const docRef = await addDoc(collection(db, 'classes'), {
      name, grade, servantUid: null, servantName: null, childCount: 0, createdAt: serverTimestamp(),
    });
    return { id: docRef.id, name, grade, servantUid: null, servantName: null, childCount: 0 };
  }
  const newClass = { id: generateId('class'), name, grade, servantUid: null, servantName: null, childCount: 0, createdAt: new Date() };
  mockStore.classes.push(newClass);
  return newClass;
}

export async function updateClass(classId, data) {
  if (isFirebaseConfigured && db) {
    await updateDoc(doc(db, 'classes', classId), data);
    return;
  }
  const idx = mockStore.classes.findIndex((c) => c.id === classId);
  if (idx !== -1) Object.assign(mockStore.classes[idx], data);
}

export async function deleteClass(classId) {
  if (isFirebaseConfigured && db) {
    await deleteDoc(doc(db, 'classes', classId));
    return;
  }
  mockStore.classes = mockStore.classes.filter((c) => c.id !== classId);
}

export async function assignServantToClass(classId, servantUid, servantName) {
  await updateClass(classId, { servantUid, servantName });
  // Also update the servant's user record
  if (!isFirebaseConfigured) {
    const servant = mockStore.servants.find((s) => s.uid === servantUid);
    if (servant) {
      // Remove servant from any previous class
      mockStore.classes.forEach((c) => {
        if (c.servantUid === servantUid && c.id !== classId) {
          c.servantUid = null;
          c.servantName = null;
        }
      });
      const cls = mockStore.classes.find((c) => c.id === classId);
      servant.classId = classId;
      servant.className = cls ? cls.name : null;
    }
  }
}

// ============================================
// Children
// ============================================
export async function getChildrenByClass(classId) {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, 'children'), where('classId', '==', classId));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((d) => ({ uid: d.id, ...d.data() }));
    return data.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ar'));
  }
  return mockStore.children.filter((c) => c.classId === classId);
}

export async function getAllChildren() {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, 'children'), orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ uid: d.id, ...d.data() }));
  }
  return [...mockStore.children];
}

export async function getChildById(childUid) {
  if (isFirebaseConfigured && db) {
    const docSnap = await getDoc(doc(db, 'children', childUid));
    return docSnap.exists() ? { uid: docSnap.id, ...docSnap.data() } : null;
  }
  return mockStore.children.find((c) => c.uid === childUid) || null;
}

export async function createChild({ name, grade, classId, parentContact, servantUid }) {
  const avatars = ['👦', '🧒', '👦🏻', '🧒🏻'];
  const avatarId = avatars[Math.floor(Math.random() * avatars.length)];

  if (isFirebaseConfigured && db) {
    const docRef = await addDoc(collection(db, 'children'), {
      name, grade, classId, parentUid: null, servantUid, createdBy: servantUid,
      avatarId, points: 0, level: 'مبتدئ', parentContact: parentContact || '',
      createdAt: serverTimestamp(),
    });
    // Increment class child count
    await updateDoc(doc(db, 'classes', classId), { childCount: increment(1) });
    return { uid: docRef.id, name, grade, classId, avatarId, points: 0, level: 'مبتدئ' };
  }

  const newChild = {
    uid: generateId('child'), name, grade, classId, parentUid: null,
    servantUid, avatarId, points: 0, level: 'مبتدئ', createdAt: new Date(),
  };
  mockStore.children.push(newChild);
  const cls = mockStore.classes.find((c) => c.id === classId);
  if (cls) cls.childCount = mockStore.children.filter((c) => c.classId === classId).length;
  return newChild;
}

export async function updateChildPoints(childUid, pointsDelta, reason = '') {
  if (isFirebaseConfigured && db) {
    const currentChild = await getChildById(childUid);
    if (!currentChild) return;

    const nextPoints = Math.max(0, (currentChild.points || 0) + pointsDelta);
    await updateDoc(doc(db, 'children', childUid), {
      points: nextPoints,
      level: calculateLevel(nextPoints),
    });

    if (pointsDelta !== 0) {
      await addDoc(collection(db, 'points_log'), {
        childUid,
        classId: currentChild.classId,
        delta: pointsDelta,
        reason,
        createdAt: serverTimestamp(),
      });
    }
    return;
  }
  const child = mockStore.children.find((c) => c.uid === childUid);
  if (child) {
    child.points = Math.max(0, child.points + pointsDelta);
    child.level = calculateLevel(child.points);
    if (pointsDelta !== 0) {
      mockStore.activityLog.unshift({
        id: generateId('log'),
        action: pointsDelta > 0 ? 'إضافة نقاط' : 'خصم نقاط',
        details: `${child.name} ${pointsDelta > 0 ? '+' : ''}${pointsDelta} نقطة${reason ? ` (${reason})` : ''}`,
        user: 'النظام',
        timestamp: new Date(),
      });
    }
  }
}

function calculateLevel(points) {
  if (points >= 1000) return 'نجم';
  if (points >= 500) return 'بطل';
  if (points >= 100) return 'مستكشف';
  return 'مبتدئ';
}

// ============================================
// Attendance
// ============================================
export async function recordAttendance(classId, sessionDate, records, recordedBy) {
  // records = [{ childUid, present }]

  // ── Guard: reject if any required field is missing ──────────────────────────
  if (!classId || !sessionDate || !recordedBy) {
    const missingFields = [!classId && 'classId', !sessionDate && 'sessionDate', !recordedBy && 'recordedBy'].filter(Boolean);
    const err = new Error(`ATTENDANCE_SUBMIT_ERROR: Missing required fields: ${missingFields.join(', ')}`);
    console.error('ATTENDANCE_SUBMIT_ERROR:', err);
    throw err;
  }
  if (!Array.isArray(records) || records.length === 0) {
    const err = new Error('ATTENDANCE_SUBMIT_ERROR: records array is empty or invalid');
    console.error('ATTENDANCE_SUBMIT_ERROR:', err);
    throw err;
  }

  if (isFirebaseConfigured && db) {
    try {
      const sessionId = `session-${sessionDate}-${classId}`;

      // Fetch existing records for this session to diff against
      const existingRecords = await getAttendanceByClass(classId);
      const existingByChild = existingRecords
        .filter((record) => record.date === sessionDate)
        .reduce((acc, record) => {
          acc[record.childUid] = record;
          return acc;
        }, {});

      for (const r of records) {
        // ── Validate individual record ─────────────────────────────────────────
        if (!r.childUid || r.present === null || r.present === undefined) {
          console.error('ATTENDANCE_SUBMIT_ERROR: Invalid record entry — childUid or present is null/undefined', r);
          throw new Error(`ATTENDANCE_SUBMIT_ERROR: Invalid record for childUid=${r.childUid}`);
        }

        // ── Build a safe, collision-free Firestore document ID ────────────────
        // Format: <classId>__<sessionDate>__<childUid>  (double underscore separator)
        // Replace any character outside [A-Za-z0-9_-] with an underscore.
        const safeClassId  = String(classId).replace(/[^A-Za-z0-9_-]/g, '_');
        const safeDate     = String(sessionDate).replace(/[^A-Za-z0-9_-]/g, '_');
        const safeChildUid = String(r.childUid).replace(/[^A-Za-z0-9_-]/g, '_');
        const recordId     = `${safeClassId}__${safeDate}__${safeChildUid}`;

        const recordRef    = doc(db, 'attendance', recordId);
        const existing     = existingByChild[r.childUid];
        const previousPresent = existing ? existing.present : null;

        // ── Write strategy: use create vs update so Firestore rules are satisfied
        // setDoc without merge always triggers the 'create' rule path for new docs
        // and 'update' rule path for existing docs — both are correctly defined.
        if (existing) {
          // Document already exists → trigger UPDATE rule
          await setDoc(recordRef, {
            childUid:   r.childUid,
            classId,
            date:       sessionDate,
            present:    r.present,
            recordedBy,
            sessionId,
            excuseId:   existing.excuseId ?? null,
            updatedAt:  serverTimestamp(),
            createdAt:  existing.createdAt ?? serverTimestamp(),
          });
        } else {
          // Document does not exist → trigger CREATE rule
          await setDoc(recordRef, {
            childUid:   r.childUid,
            classId,
            date:       sessionDate,
            present:    r.present,
            recordedBy,
            sessionId,
            excuseId:   null,
            updatedAt:  serverTimestamp(),
            createdAt:  serverTimestamp(),
          });
        }

        // ── Award / revoke points only when presence status actually changes ──
        if (previousPresent !== r.present) {
          if (r.present) {
            await updateChildPoints(r.childUid, 10, 'حضور');
          } else if (previousPresent === true && r.present === false) {
            await updateChildPoints(r.childUid, -10, 'تعديل حضور');
          }
        }
      }
    } catch (err) {
      console.error('ATTENDANCE_SUBMIT_ERROR:', err);
      throw err;
    }
    return;
  }

  // ── Mock mode ────────────────────────────────────────────────────────────────
  const sessionId = `session-${sessionDate}-${classId}`;
  // Remove existing attendance for this session
  mockStore.attendance = mockStore.attendance.filter(
    (a) => !(a.classId === classId && a.date === sessionDate)
  );
  records.forEach((r) => {
    const previous = mockStore.attendance.find((a) => a.classId === classId && a.date === sessionDate && a.childUid === r.childUid);
    mockStore.attendance.push({
      id: generateId('att'), childUid: r.childUid, classId, date: sessionDate,
      present: r.present, recordedBy, sessionId,
    });
    if (previous?.present !== r.present && r.present) {
      const child = mockStore.children.find((c) => c.uid === r.childUid);
      if (child) {
        child.points += 10;
        child.level = calculateLevel(child.points);
      }
    } else if (previous?.present === true && r.present === false) {
      const child = mockStore.children.find((c) => c.uid === r.childUid);
      if (child) {
        child.points = Math.max(0, child.points - 10);
        child.level = calculateLevel(child.points);
      }
    }
  });
}

export async function getAttendanceByClass(classId, dateFrom, dateTo) {
  if (isFirebaseConfigured && db) {
    const q = query(
      collection(db, 'attendance'),
      where('classId', '==', classId)
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    return data.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }
  return mockStore.attendance
    .filter((a) => a.classId === classId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getAttendanceByChild(childUid) {
  if (isFirebaseConfigured && db) {
    const q = query(
      collection(db, 'attendance'),
      where('childUid', '==', childUid)
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    return data.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }
  return mockStore.attendance
    .filter((a) => a.childUid === childUid)
    .sort((a, b) => b.date.localeCompare(a.date));
}

// ============================================
// Servants (Users with role='servant')
// ============================================
export async function getServants() {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, 'users'), where('role', '==', 'servant'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ uid: d.id, ...d.data() }));
  }
  return [...mockStore.servants];
}

export async function createServant({ name, email, phone, classId }) {
  if (isFirebaseConfigured && db) {
    // Note: In production, you'd also create a Firebase Auth user
    const docRef = await addDoc(collection(db, 'users'), {
      name, email, phone, role: 'servant', classId: classId || null,
      className: null, createdAt: serverTimestamp(),
    });
    return { uid: docRef.id, name, email, phone, role: 'servant', classId };
  }
  const newServant = {
    uid: generateId('servant'), name, email, phone, role: 'servant',
    classId: classId || null, className: null, createdAt: new Date(),
  };
  mockStore.servants.push(newServant);
  return newServant;
}

// ============================================
// Dashboard Stats
// ============================================
export async function getDashboardStats() {
  const classes = await getClasses();
  const children = await getAllChildren();
  const servants = await getServants();

  const totalChildren = children.length;
  const totalServants = servants.length;
  const totalClasses = classes.length;

  // Calculate attendance rate (from all recent attendance)
  let attendanceRecords;
  if (!isFirebaseConfigured) {
    attendanceRecords = mockStore.attendance;
  } else {
    // For Firebase, we'd do an aggregate query
    attendanceRecords = [];
  }
  const totalRecords = attendanceRecords.length;
  const presentRecords = attendanceRecords.filter((a) => a.present).length;
  const attendanceRate = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;

  return {
    totalChildren,
    totalServants,
    totalClasses,
    attendanceRate,
  };
}

export async function getClassStats(classId) {
  const children = await getChildrenByClass(classId);
  const attendance = await getAttendanceByClass(classId);

  const totalChildren = children.length;
  const totalRecords = attendance.length;
  const presentRecords = attendance.filter((a) => a.present).length;
  const attendanceRate = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;
  const totalPoints = children.reduce((sum, c) => sum + (c.points || 0), 0);

  return {
    totalChildren,
    attendanceRate,
    totalPoints,
    topChildren: [...children].sort((a, b) => b.points - a.points).slice(0, 5),
  };
}

export async function getActivityLog() {
  if (!isFirebaseConfigured) {
    return [...mockStore.activityLog];
  }
  // In production, query from a 'activity_log' collection
  return [];
}

// ============================================
// Absence Excuses
// ============================================
export async function submitAbsenceExcuse({ parentUid, childUid, childName, classId, sessionDate, reason }) {
  if (isFirebaseConfigured && db) {
    const docRef = await addDoc(collection(db, 'absence_excuses'), {
      parentUid, childUid, childName, classId, sessionDate, reason,
      status: 'pending', submittedAt: serverTimestamp(),
      acknowledgedBy: null, acknowledgedAt: null
    });
    return { id: docRef.id, parentUid, childUid, childName, classId, sessionDate, reason, status: 'pending' };
  }
  const newExcuse = {
    id: generateId('excuse'), parentUid, childUid, childName, classId,
    sessionDate, reason, status: 'pending', submittedAt: new Date()
  };
  mockStore.absence_excuses.push(newExcuse);
  return newExcuse;
}

export async function getAbsenceExcusesByClass(classId) {
  if (isFirebaseConfigured && db) {
    const q = query(
      collection(db, 'absence_excuses'),
      where('classId', '==', classId)
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    return data.sort((a, b) => (b.sessionDate || '').localeCompare(a.sessionDate || ''));
  }
  return mockStore.absence_excuses
    .filter((e) => e.classId === classId)
    .sort((a, b) => b.sessionDate.localeCompare(a.sessionDate));
}

export async function getAbsenceExcusesByChild(childUid) {
  if (isFirebaseConfigured && db) {
    const q = query(
      collection(db, 'absence_excuses'),
      where('childUid', '==', childUid)
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    return data.sort((a, b) => (b.sessionDate || '').localeCompare(a.sessionDate || ''));
  }
  return mockStore.absence_excuses
    .filter((e) => e.childUid === childUid)
    .sort((a, b) => b.sessionDate.localeCompare(a.sessionDate));
}

export async function getAllAbsenceExcuses() {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, 'absence_excuses'), orderBy('sessionDate', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return [...mockStore.absence_excuses].sort((a, b) => b.sessionDate.localeCompare(a.sessionDate));
}

export async function updateExcuseStatus(excuseId, status, acknowledgedBy) {
  // status = 'acknowledged' | 'rejected'
  if (isFirebaseConfigured && db) {
    await updateDoc(doc(db, 'absence_excuses', excuseId), {
      status, acknowledgedBy, acknowledgedAt: serverTimestamp()
    });
    return;
  }
  const excuse = mockStore.absence_excuses.find((e) => e.id === excuseId);
  if (excuse) {
    excuse.status = status;
    excuse.acknowledgedBy = acknowledgedBy;
    excuse.acknowledgedAt = new Date();
  }
}

// ============================================
// Verses
// ============================================
export async function getVersesByChild(childUid) {
  if (isFirebaseConfigured && db) {
    const q = query(
      collection(db, 'verses'),
      where('childUid', '==', childUid)
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    return data.sort((a, b) => new Date(b.assignedDate || 0) - new Date(a.assignedDate || 0));
  }
  return mockStore.verses.filter((v) => v.childUid === childUid);
}

// ============================================
// Quizzes
// ============================================
export async function getQuizzesByClass(classId) {
  if (isFirebaseConfigured && db) {
    const q = query(
      collection(db, 'quizzes'),
      where('classId', '==', classId)
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    return data.sort((a, b) => new Date(b.dueDate || 0) - new Date(a.dueDate || 0));
  }
  return mockStore.quizzes.filter((q) => q.classId === classId);
}

export async function submitQuizResponse(childUid, quizId, score, pointsEarned) {
  if (isFirebaseConfigured && db) {
    // Save submission inside quiz doc or a submissions subcollection
    const quizRef = doc(db, 'quizzes', quizId);
    await updateDoc(quizRef, {
      [`submissions.${childUid}`]: { score, pointsEarned, submittedAt: serverTimestamp() }
    });
    // Add child points
    await updateChildPoints(childUid, pointsEarned);
    return;
  }
  const quiz = mockStore.quizzes.find((q) => q.id === quizId);
  if (quiz) {
    if (!quiz.submissions) quiz.submissions = {};
    quiz.submissions[childUid] = { score, pointsEarned, submittedAt: new Date() };
    await updateChildPoints(childUid, pointsEarned);
  }
}

// ============================================
// Lessons
// ============================================
export async function getLessonsByClass(classId) {
  if (isFirebaseConfigured && db) {
    const q = query(
      collection(db, 'lessons'),
      where('classId', '==', classId)
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    return data.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }
  return mockStore.lessons.filter((l) => l.classId === classId);
}

export async function createLesson({ title, classId, date, description, videoUrl, fileUrl, publishedBy }) {
  const payload = {
    title,
    classId,
    date,
    description,
    videoUrl: videoUrl || null,
    fileUrl: fileUrl || null,
    publishedBy,
    updatedAt: serverTimestamp(),
  };

  if (isFirebaseConfigured && db) {
    const docRef = await addDoc(collection(db, 'lessons'), {
      ...payload,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...payload, createdAt: new Date().toISOString() };
  }

  const newLesson = {
    id: generateId('lesson'),
    ...payload,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockStore.lessons.unshift(newLesson);
  return newLesson;
}

export async function updateLesson(lessonId, data) {
  const payload = {
    ...data,
    videoUrl: data.videoUrl || null,
    fileUrl: data.fileUrl || null,
    updatedAt: serverTimestamp(),
  };

  if (isFirebaseConfigured && db) {
    await updateDoc(doc(db, 'lessons', lessonId), payload);
    return;
  }

  const lesson = mockStore.lessons.find((l) => l.id === lessonId);
  if (lesson) Object.assign(lesson, payload, { updatedAt: new Date() });
}

export async function deleteLesson(lessonId) {
  if (isFirebaseConfigured && db) {
    await deleteDoc(doc(db, 'lessons', lessonId));
    return;
  }

  mockStore.lessons = mockStore.lessons.filter((l) => l.id !== lessonId);
}

// ============================================
// News & Announcements
// ============================================
export async function getNews() {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, 'news'), orderBy('publishedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  return [...mockStore.news].sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
}

export async function createNews({ title, body, category, imageUrl, publishedBy }) {
  const publishedAt = new Date().toISOString().split('T')[0];
  const payload = {
    title,
    body,
    category: category || 'إعلان',
    imageUrl: imageUrl || null,
    publishedBy,
    publishedAt,
    updatedAt: serverTimestamp(),
  };

  if (isFirebaseConfigured && db) {
    const docRef = await addDoc(collection(db, 'news'), {
      ...payload,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...payload, createdAt: new Date().toISOString() };
  }

  const newsItem = {
    id: generateId('news'),
    ...payload,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockStore.news.unshift(newsItem);
  return newsItem;
}

export async function updateNews(newsId, data) {
  const payload = {
    ...data,
    imageUrl: data.imageUrl || null,
    updatedAt: serverTimestamp(),
  };

  if (isFirebaseConfigured && db) {
    await updateDoc(doc(db, 'news', newsId), payload);
    return;
  }

  const item = mockStore.news.find((n) => n.id === newsId);
  if (item) Object.assign(item, payload, { updatedAt: new Date() });
}

export async function deleteNews(newsId) {
  if (isFirebaseConfigured && db) {
    await deleteDoc(doc(db, 'news', newsId));
    return;
  }

  mockStore.news = mockStore.news.filter((n) => n.id !== newsId);
}

// ============================================
// Verses Assignment & Verification
// ============================================
export async function assignVerseToChild(childUid, classId, verseText, reference, pointsAwarded) {
  if (isFirebaseConfigured && db) {
    const docRef = await addDoc(collection(db, 'verses'), {
      childUid,
      classId,
      verseText,
      reference,
      assignedDate: serverTimestamp(),
      memorizedDate: null,
      verifiedBy: null,
      pointsAwarded,
    });
    return {
      id: docRef.id,
      childUid,
      classId,
      verseText,
      reference,
      assignedDate: new Date().toISOString(),
      memorizedDate: null,
      verifiedBy: null,
      pointsAwarded,
    };
  }
  const newVerse = {
    id: generateId('verse'),
    childUid,
    classId,
    verseText,
    reference,
    assignedDate: new Date().toISOString(),
    memorizedDate: null,
    verifiedBy: null,
    pointsAwarded,
  };
  mockStore.verses.unshift(newVerse);
  return newVerse;
}

export async function markVerseAsMemorized(verseId, verifiedBy, childUid, pointsAwarded) {
  if (isFirebaseConfigured && db) {
    await updateDoc(doc(db, 'verses', verseId), {
      memorizedDate: serverTimestamp(),
      verifiedBy,
    });
    await updateChildPoints(childUid, pointsAwarded, 'حفظ آية');
    return;
  }
  const verse = mockStore.verses.find((v) => v.id === verseId);
  if (verse) {
    verse.memorizedDate = new Date().toISOString();
    verse.verifiedBy = verifiedBy;
    await updateChildPoints(childUid, pointsAwarded, 'حفظ آية');
  }
}

// ============================================
// Trips & Registrations
// ============================================
export async function getTrips() {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, 'trips'), orderBy('date', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return [...mockStore.trips];
}

export async function registerForTrip({ tripId, childUid, childName, parentContact, notes, registeredBy }) {
  if (isFirebaseConfigured && db) {
    const docRef = await addDoc(collection(db, 'trip_registrations'), {
      tripId,
      childUid,
      childName,
      parentContact,
      notes,
      registeredBy,
      registeredAt: serverTimestamp(),
    });
    return { id: docRef.id, tripId, childUid, childName, parentContact, notes, registeredBy };
  }
  const newReg = {
    id: generateId('reg'),
    tripId,
    childUid,
    childName,
    parentContact,
    notes,
    registeredBy,
    registeredAt: new Date().toISOString(),
  };
  mockStore.trip_registrations.unshift(newReg);
  return newReg;
}

// Get trip registrations (either filtered by tripId or all)
export async function getTripRegistrations(tripId = null) {
  if (isFirebaseConfigured && db) {
    let q = collection(db, 'trip_registrations');
    if (tripId) {
      q = query(q, where('tripId', '==', tripId));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  if (tripId) {
    return mockStore.trip_registrations.filter((r) => r.tripId === tripId);
  }
  return [...mockStore.trip_registrations];
}

export async function getRegistrationsByChild(childUid) {
  if (isFirebaseConfigured && db) {
    const q = query(
      collection(db, 'trip_registrations'),
      where('childUid', '==', childUid)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return mockStore.trip_registrations.filter((r) => r.childUid === childUid);
}
