'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useQuizzes } from '@/lib/hooks';
import { submitQuizResponse } from '@/lib/firestore';
import { useToast } from '@/components/ui/Toast';
import Modal from '@/components/ui/Modal';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';

export default function ChildQuizzesPage() {
  const { user } = useAuth();
  const { quizzes, loading, refresh } = useQuizzes(user?.classId);
  const { showToast } = useToast();

  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState({}); // { questionIndex: selectedOptionIndex }
  const [submitting, setSubmitting] = useState(false);

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setAnswers({});
  };

  const handleSelectOption = (qIdx, oIdx) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleSubmitQuiz = async () => {
    // Validate that all questions are answered
    if (Object.keys(answers).length < activeQuiz.questions.length) {
      showToast('يرجى الإجابة على جميع الأسئلة أولاً', 'error');
      return;
    }

    setSubmitting(true);
    try {
      // Calculate score
      let correctCount = 0;
      activeQuiz.questions.forEach((q, idx) => {
        if (answers[idx] === q.correctIndex) {
          correctCount++;
        }
      });

      const score = Math.round((correctCount / activeQuiz.questions.length) * 100);
      // Earn points proportional to score
      const pointsEarned = Math.round((score / 100) * activeQuiz.pointValue);

      await submitQuizResponse(user.uid, activeQuiz.id, score, pointsEarned);

      showToast(`تهانينا! لقد حصلت على درجة ${score}% وربحت +${pointsEarned} نقطة! 🏆`, 'success');
      setActiveQuiz(null);
      refresh();
    } catch (err) {
      showToast('حدث خطأ أثناء إرسال إجابات المسابقة', 'error');
    }
    setSubmitting(false);
  };

  const columns = [
    { key: 'title', label: 'عنوان المسابقة' },
    { key: 'dueDate', label: 'تاريخ الانتهاء', render: (val) => new Date(val).toLocaleDateString('ar-EG') },
    { key: 'pointValue', label: 'قيمة النقاط', render: (val) => `${val} نقطة` },
    {
      key: 'status', label: 'الحالة',
      render: (_, row) => {
        const sub = row.submissions && row.submissions[user?.uid];
        if (sub) {
          return <span className="badge badge-green">تم الحل ({sub.score}%) ✅</span>;
        }
        const isExpired = new Date(row.dueDate) < new Date();
        if (isExpired) {
          return <span className="badge" style={{ background: '#E2E8F0', color: '#718096' }}>منتهية الصلاحية ⌛</span>;
        }
        return <span className="badge badge-blue">متاحة للحل 📝</span>;
      }
    },
    {
      key: 'actions', label: 'إجراءات',
      render: (_, row) => {
        const sub = row.submissions && row.submissions[user?.uid];
        if (sub) {
          return <span style={{ color: 'var(--text-light)', fontStyle: 'italic', fontSize: '0.9rem' }}>أحسنت! لقد ربحت +{sub.pointsEarned} نقطة</span>;
        }
        const isExpired = new Date(row.dueDate) < new Date();
        if (isExpired) {
          return <span style={{ color: 'var(--text-light)', fontStyle: 'italic', fontSize: '0.9rem' }}>انتهى وقت الحل</span>;
        }
        return (
          <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={() => handleStartQuiz(row)}>
            بدء المسابقة 🚀
          </button>
        );
      }
    }
  ];

  return (
    <>
      <div className="page-action-header">
        <h2>📝 مسابقات وتحديات فصلي</h2>
      </div>

      <DataTable
        columns={columns}
        data={quizzes}
        loading={loading}
        emptyState={
          <EmptyState
            icon="📝"
            title="لا توجد مسابقات حالية"
            description="لم يقم خادم الفصل بنشر أي مسابقات أو تحديات نشطة حتى الآن."
          />
        }
      />

      {/* Quiz Modal */}
      {activeQuiz && (
        <Modal title={activeQuiz.title} onClose={() => setActiveQuiz(null)}>
          <div style={{ padding: '0.5rem 0' }}>
            <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
              أجب على الأسئلة التالية بتركيز لتحصل على <strong>{activeQuiz.pointValue}</strong> نقطة كحد أقصى!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {activeQuiz.questions.map((q, qIdx) => (
                <div key={qIdx} style={{ background: '#F7FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--text-dark)', marginBottom: '1rem', fontWeight: 'bold' }}>
                    {qIdx + 1}. {q.text}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {q.options.map((opt, oIdx) => {
                      const isSelected = answers[qIdx] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectOption(qIdx, oIdx)}
                          style={{
                            textAlign: 'right',
                            width: '100%',
                            padding: '0.85rem 1.25rem',
                            borderRadius: '8px',
                            border: isSelected ? '2px solid var(--med-blue)' : '1px solid #CBD5E0',
                            background: isSelected ? 'rgba(49,130,206,0.08)' : '#fff',
                            color: isSelected ? 'var(--med-blue)' : 'var(--text-dark)',
                            fontWeight: isSelected ? 'bold' : 'normal',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            transition: 'all 0.2s'
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem' }}>
              <button className="btn" onClick={() => setActiveQuiz(null)} disabled={submitting}>
                إلغاء
              </button>
              <button className="btn btn-primary" onClick={handleSubmitQuiz} disabled={submitting}>
                {submitting ? 'جاري التسليم...' : 'تسليم الإجابات 🏁'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
