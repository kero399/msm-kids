'use client';

import { useAuth } from '@/lib/auth';
import { useLessons } from '@/lib/hooks';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

export default function ChildLessonsPage() {
  const { user } = useAuth();
  const { lessons, loading } = useLessons(user?.classId);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="page-action-header">
        <h2>📚 الدروس والمواد الدراسية لمدرستنا</h2>
      </div>

      {lessons.length === 0 ? (
        <EmptyState
          icon="📚"
          title="لا توجد دروس منشورة"
          description="لم يقم خادم الفصل بنشر أي مواد دراسية أو دروس حتى الآن."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {lessons.map((lesson) => (
            <div key={lesson.id} className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ padding: '1.5rem', flex: '1 0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', background: '#EDF2F7', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                    📅 {new Date(lesson.date).toLocaleDateString('ar-EG')}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-dark)', fontWeight: 'bold', marginBottom: '0.75rem', fontFamily: 'Cairo', lineHeight: '1.3' }}>
                  {lesson.title}
                </h3>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }}>
                  {lesson.description}
                </p>
              </div>

              {/* Action downloads footer */}
              {(lesson.fileUrl || lesson.videoUrl) && (
                <div style={{
                  padding: '1rem 1.5rem',
                  borderTop: '1px solid #E2E8F0',
                  background: '#F7FAFC',
                  borderBottomLeftRadius: '12px',
                  borderBottomRightRadius: '12px',
                  display: 'flex',
                  gap: '0.75rem'
                }}>
                  {lesson.fileUrl && (
                    <a
                      href={lesson.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{
                        flex: 1, textDecoration: 'none', textAlign: 'center', fontSize: '0.85rem',
                        padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem'
                      }}
                    >
                      <span>📥 تحميل الدرس (PDF)</span>
                    </a>
                  )}
                  {lesson.videoUrl && (
                    <a
                      href={lesson.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                      style={{
                        flex: 1, textDecoration: 'none', textAlign: 'center', fontSize: '0.85rem',
                        padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
                        background: 'rgba(229,62,62,0.1)', color: '#E53E3E', border: '1px solid rgba(229,62,62,0.2)'
                      }}
                    >
                      <span>🎥 مشاهدة الفيديو</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
