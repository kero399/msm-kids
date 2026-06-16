// src/lib/firestore.js
// Firestore CRUD utilities for MSM Kids
// Dual-mode: uses real Firestore when configured, mock data in dev mode

import { isFirebaseConfigured, db } from './firebase';
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
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
    const q = query(collection(db, 'children'), where('classId', '==', classId), orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ uid: d.id, ...d.data() }));
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
    await updateDoc(doc(db, 'children', childUid), { points: increment(pointsDelta) });
    // Recalculate level
    const child = await getChildById(childUid);
    if (child) {
      const newLevel = calculateLevel(child.points);
      if (newLevel !== child.level) {
        await updateDoc(doc(db, 'children', childUid), { level: newLevel });
      }
    }
    return;
  }
  const child = mockStore.children.find((c) => c.uid === childUid);
  if (child) {
    child.points = Math.max(0, child.points + pointsDelta);
    child.level = calculateLevel(child.points);
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
  if (isFirebaseConfigured && db) {
    const sessionId = `session-${sessionDate}-${classId}`;
    const promises = records.map((r) =>
      addDoc(collection(db, 'attendance'), {
        childUid: r.childUid, classId, date: sessionDate,
        present: r.present, recordedBy, sessionId,
        excuseId: null, createdAt: serverTimestamp(),
      })
    );
    await Promise.all(promises);
    // Award points for present children
    for (const r of records) {
      if (r.present) await updateChildPoints(r.childUid, 10);
    }
    return;
  }

  const sessionId = `session-${sessionDate}-${classId}`;
  // Remove existing attendance for this session
  mockStore.attendance = mockStore.attendance.filter(
    (a) => !(a.classId === classId && a.date === sessionDate)
  );
  records.forEach((r) => {
    mockStore.attendance.push({
      id: generateId('att'), childUid: r.childUid, classId, date: sessionDate,
      present: r.present, recordedBy, sessionId,
    });
    if (r.present) {
      const child = mockStore.children.find((c) => c.uid === r.childUid);
      if (child) {
        child.points += 10;
        child.level = calculateLevel(child.points);
      }
    }
  });
}

export async function getAttendanceByClass(classId, dateFrom, dateTo) {
  if (isFirebaseConfigured && db) {
    const q = query(
      collection(db, 'attendance'),
      where('classId', '==', classId),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return mockStore.attendance
    .filter((a) => a.classId === classId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getAttendanceByChild(childUid) {
  if (isFirebaseConfigured && db) {
    const q = query(
      collection(db, 'attendance'),
      where('childUid', '==', childUid),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
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
      where('classId', '==', classId),
      orderBy('sessionDate', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return mockStore.absence_excuses
    .filter((e) => e.classId === classId)
    .sort((a, b) => b.sessionDate.localeCompare(a.sessionDate));
}

export async function getAbsenceExcusesByChild(childUid) {
  if (isFirebaseConfigured && db) {
    const q = query(
      collection(db, 'absence_excuses'),
      where('childUid', '==', childUid),
      orderBy('sessionDate', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
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
      where('childUid', '==', childUid),
      orderBy('assignedDate', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
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
      where('classId', '==', classId),
      orderBy('dueDate', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
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
      where('classId', '==', classId),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return mockStore.lessons.filter((l) => l.classId === classId);
}
