// src/lib/hooks.js
// Custom React hooks for real-time data fetching

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getClasses, getChildrenByClass, getAllChildren,
  getAttendanceByClass, getDashboardStats, getClassStats,
  getServants, getActivityLog,
  getAbsenceExcusesByClass, getAbsenceExcusesByChild, getAllAbsenceExcuses,
  getVersesByChild, getQuizzesByClass, getLessonsByClass, getNews,
} from './firestore';

/**
 * useClasses — fetches all classes
 */
export function useClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getClasses();
      setClasses(data);
    } catch (err) {
      console.error('useClasses error:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { classes, loading, refresh };
}

/**
 * useChildren — fetches children, optionally filtered by classId
 */
export function useChildren(classId = null) {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = classId
        ? await getChildrenByClass(classId)
        : await getAllChildren();
      setChildren(data);
    } catch (err) {
      console.error('useChildren error:', err);
    }
    setLoading(false);
  }, [classId]);

  useEffect(() => { refresh(); }, [refresh]);

  return { children, loading, refresh };
}

/**
 * useAttendance — fetches attendance for a class
 */
export function useAttendance(classId) {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!classId) return;
    setLoading(true);
    try {
      const data = await getAttendanceByClass(classId);
      setAttendance(data);
    } catch (err) {
      console.error('useAttendance error:', err);
    }
    setLoading(false);
  }, [classId]);

  useEffect(() => { refresh(); }, [refresh]);

  return { attendance, loading, refresh };
}

/**
 * useServants — fetches all servants
 */
export function useServants() {
  const [servants, setServants] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getServants();
      setServants(data);
    } catch (err) {
      console.error('useServants error:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { servants, loading, refresh };
}

/**
 * useDashboardStats — fetches aggregate stats for admin dashboard
 */
export function useDashboardStats() {
  const [stats, setStats] = useState({
    totalChildren: 0,
    totalServants: 0,
    totalClasses: 0,
    attendanceRate: 0,
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('useDashboardStats error:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { stats, loading, refresh };
}

/**
 * useClassStats — fetches stats for a specific class (servant dashboard)
 */
export function useClassStats(classId) {
  const [stats, setStats] = useState({
    totalChildren: 0,
    attendanceRate: 0,
    totalPoints: 0,
    topChildren: [],
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!classId) return;
    setLoading(true);
    try {
      const data = await getClassStats(classId);
      setStats(data);
    } catch (err) {
      console.error('useClassStats error:', err);
    }
    setLoading(false);
  }, [classId]);

  useEffect(() => { refresh(); }, [refresh]);

  return { stats, loading, refresh };
}

/**
 * useActivityLog — fetches recent activity
 */
export function useActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getActivityLog();
      setLogs(data);
    } catch (err) {
      console.error('useActivityLog error:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { logs, loading, refresh };
}

/**
 * useExcuses — fetches excuses, optionally filtered by classId or childUid
 */
export function useExcuses(classId = null, childUid = null) {
  const [excuses, setExcuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      let data = [];
      if (childUid) {
        data = await getAbsenceExcusesByChild(childUid);
      } else if (classId) {
        data = await getAbsenceExcusesByClass(classId);
      } else {
        data = await getAllAbsenceExcuses();
      }
      setExcuses(data);
    } catch (err) {
      console.error('useExcuses error:', err);
    }
    setLoading(false);
  }, [classId, childUid]);

  useEffect(() => { refresh(); }, [refresh]);

  return { excuses, loading, refresh };
}

/**
 * useVerses — fetches verses for a child
 */
export function useVerses(childUid) {
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!childUid) return;
    setLoading(true);
    try {
      const data = await getVersesByChild(childUid);
      setVerses(data);
    } catch (err) {
      console.error('useVerses error:', err);
    }
    setLoading(false);
  }, [childUid]);

  useEffect(() => { refresh(); }, [refresh]);

  return { verses, loading, refresh };
}

/**
 * useQuizzes — fetches quizzes for a class
 */
export function useQuizzes(classId) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!classId) return;
    setLoading(true);
    try {
      const data = await getQuizzesByClass(classId);
      setQuizzes(data);
    } catch (err) {
      console.error('useQuizzes error:', err);
    }
    setLoading(false);
  }, [classId]);

  useEffect(() => { refresh(); }, [refresh]);

  return { quizzes, loading, refresh };
}

/**
 * useLessons — fetches lessons for a class
 */
export function useLessons(classId) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!classId) return;
    setLoading(true);
    try {
      const data = await getLessonsByClass(classId);
      setLessons(data);
    } catch (err) {
      console.error('useLessons error:', err);
    }
    setLoading(false);
  }, [classId]);

  useEffect(() => { refresh(); }, [refresh]);

  return { lessons, loading, refresh };
}

/**
 * useNews — fetches public news and announcements
 */
export function useNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getNews();
      setNews(data);
    } catch (err) {
      console.error('useNews error:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { news, loading, refresh };
}
