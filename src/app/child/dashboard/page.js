'use client';

import { useAuth } from '@/lib/auth';
import { useVerses, useQuizzes, useLessons } from '@/lib/hooks';
import StatCard from '@/components/ui/StatCard';

export default function ChildDashboardPage() {
  const { user } = useAuth();
  const { verses } = useVerses(user?.uid);
  const { quizzes } = useQuizzes(user?.classId);
  const { lessons } = useLessons(user?.classId);

  const points = user?.points || 0;
  const level = user?.level || 'مبتدئ';

  // Calculate progress to next level
  const getLevelProgress = (pts) => {
    if (pts < 100) return { currentMin: 0, next: 100, progress: (pts / 100) * 100, nextLevel: 'مستكشف' };
    if (pts < 500) return { currentMin: 100, next: 500, progress: ((pts - 100) / 400) * 100, nextLevel: 'بطل' };
    if (pts < 1000) return { currentMin: 500, next: 1000, progress: ((pts - 500) / 500) * 100, nextLevel: 'نجم' };
    return { currentMin: 1000, next: null, progress: 100, nextLevel: 'القمة!' };
  };

  const progressInfo = getLevelProgress(points);

  // Calculate child stats
  const memorizedCount = verses.filter((v) => v.memorizedDate).length;
  const completedQuizzesCount = quizzes.filter((q) => q.submissions && q.submissions[user?.uid]).length;
  const totalLessonsCount = lessons.length;

  // Badges calculation
  const badges = [];
  if (points >= 100) badges.push({ emoji: '🌟', name: 'المستكشف النشيط', desc: 'تجاوز 100 نقطة' });
  if (points >= 500) badges.push({ emoji: '🏆', name: 'بطل الخدمة', desc: 'تجاوز 500 نقطة' });
  if (points >= 1000) badges.push({ emoji: '👑', name: 'الملك المتوج', desc: 'تجاوز 1000 نقطة' });
  if (memorizedCount >= 1) badges.push({ emoji: '📖', name: 'حارس الكلمة', desc: 'حفظ آية واحدة على الأقل' });
  if (completedQuizzesCount >= 1) badges.push({ emoji: '📝', name: 'الناجح الذكي', desc: 'حل مسابقة واحدة على الأقل' });

  return (
    <>
      {/* Welcome Hero Banner */}
      <div className="hero-banner" style={{
        background: 'linear-gradient(135deg, var(--sky-blue) 0%, var(--med-blue) 100%)',
        borderRadius: '16px',
        padding: '2.5rem 2rem',
        color: '#fff',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background circles */}
        <div style={{
          position: 'absolute', width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)', top: '-50px', left: '-50px', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', width: '150px', height: '150px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)', bottom: '-20px', right: '10%', pointerEvents: 'none'
        }} />

        <div className="hero-avatar" style={{
          fontSize: '4.5rem',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '50%',
          width: '110px',
          height: '110px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255,255,255,0.3)'
        }}>
          {user?.avatarId || '👦'}
        </div>
        <div className="hero-welcome-text">
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', fontFamily: 'Cairo' }}>
            أهلاً بك يا بطل، {user?.displayName}! 👋
          </h2>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '1.1rem' }}>
            مستعد لرحلة اليوم في مدارس الأحد؟ استمر في جمع النقاط وحفظ الآيات!
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="stat-cards-grid" style={{ marginBottom: '2rem' }}>
        <StatCard icon="💰" number={points} label="مجموع النقاط" />
        <StatCard icon="🏆" number={level} label="المستوى الحالي" />
        <StatCard icon="📖" number={memorizedCount} label="الآيات المحفوظة" />
        <StatCard icon="📝" number={completedQuizzesCount} label="المسابقات المكتملة" />
      </div>

      <div className="dashboard-grid">
        {/* Level Progress Card */}
        <div className="dashboard-card" style={{ padding: '1.5rem' }}>
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📈 رحلة الترقية للمستوى القادم
          </h3>
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: '600' }}>
              <span>مستوى: {level}</span>
              {progressInfo.next ? (
                <span style={{ color: 'var(--med-blue)' }}>المستوى التالي: {progressInfo.nextLevel}</span>
              ) : (
                <span style={{ color: 'var(--success)' }}>أنت في القمة!</span>
              )}
            </div>

            {/* Progress Bar Container */}
            <div style={{ background: '#EDF2F7', borderRadius: '10px', height: '20px', width: '100%', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
              <div style={{
                background: 'linear-gradient(90deg, var(--sky-blue) 0%, var(--med-blue) 100%)',
                width: `${progressInfo.progress}%`,
                height: '100%',
                borderRadius: '10px',
                transition: 'width 0.5s ease-out'
              }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', color: 'var(--text-light)', fontSize: '0.85rem' }}>
              <span>{progressInfo.currentMin} نقطة</span>
              {progressInfo.next && (
                <span>متبقي {(progressInfo.next - points)} نقطة للوصول إلى {progressInfo.next - progressInfo.currentMin} نقطة</span>
              )}
              <span>{progressInfo.next ? `${progressInfo.next} نقطة` : '🏆'}</span>
            </div>
          </div>
        </div>

        {/* Badges and Medals Card */}
        <div className="dashboard-card" style={{ padding: '1.5rem' }}>
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🎖️ الأوسمة والشارات المكتسبة
          </h3>
          {badges.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-light)' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🛡️</span>
              <p style={{ margin: 0 }}>حافظ على حضورك وحفظ الآيات للحصول على أول شارة لك!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {badges.map((badge, idx) => (
                <div key={idx} style={{
                  background: 'rgba(255,255,255,0.8)',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>{badge.emoji}</span>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-dark)', display: 'block', lineHeight: '1.2' }}>{badge.name}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem', display: 'block' }}>{badge.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
