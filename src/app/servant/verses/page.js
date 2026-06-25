'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useChildren } from '@/lib/hooks';
import { getVersesByChild, assignVerseToChild, markVerseAsMemorized } from '@/lib/firestore';
import { useToast } from '@/components/ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

export default function ServantVersesPage() {
  const { user } = useAuth();
  const { children, loading: childrenLoading, refresh: refreshChildren } = useChildren(user?.classId);
  const { showToast } = useToast();

  const [selectedChild, setSelectedChild] = useState(null);
  const [verses, setVerses] = useState([]);
  const [versesLoading, setVersesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [verseText, setVerseText] = useState('');
  const [reference, setReference] = useState('');
  const [pointValue, setPointValue] = useState(20);
  const [submitting, setSubmitting] = useState(false);

  // Active tab inside the child's verse view: 'active' or 'history'
  const [activeTab, setActiveTab] = useState('active');

  // Load verses when a child is selected
  useEffect(() => {
    async function loadVerses() {
      if (!selectedChild) return;
      setVersesLoading(true);
      try {
        const data = await getVersesByChild(selectedChild.uid);
        setVerses(data);
      } catch (err) {
        console.error('Error loading verses:', err);
        showToast('حدث خطأ أثناء تحميل الآيات', 'error');
      }
      setVersesLoading(false);
    }
    loadVerses();
  }, [selectedChild]);

  // Handle assigning a new verse
  const handleAssignVerse = async (e) => {
    e.preventDefault();
    if (!selectedChild) return;
    if (!verseText || !reference) {
      showToast('يرجى ملء جميع الحقول المطلوبة', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const newVerse = await assignVerseToChild(
        selectedChild.uid,
        user?.classId,
        verseText,
        reference,
        Number(pointValue)
      );
      
      // Update local state
      setVerses((prev) => [newVerse, ...prev]);
      showToast('تم تعيين الآية بنجاح بنجاح', 'success');
      
      // Reset form
      setVerseText('');
      setReference('');
      setPointValue(20);
      setActiveTab('active');
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء تعيين الآية', 'error');
    }
    setSubmitting(false);
  };

  // Handle verifying a verse
  const handleVerifyVerse = async (verseId, points) => {
    if (!selectedChild) return;
    try {
      await markVerseAsMemorized(verseId, user?.uid, selectedChild.uid, points);
      showToast(`تم تأكيد الحفظ! تمت إضافة ${points} نقطة لبطلنا.`, 'success');
      
      // Refresh child's data to show updated points in the sidebar list
      refreshChildren();
      
      // Update local verses state
      setVerses((prev) =>
        prev.map((v) =>
          v.id === verseId
            ? { ...v, memorizedDate: new Date().toISOString(), verifiedBy: user?.uid }
            : v
        )
      );
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء تأكيد التسميع', 'error');
    }
  };

  const filteredChildren = children.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Split verses into pending and memorized
  const pendingVerses = verses.filter((v) => !v.memorizedDate);
  const memorizedVerses = verses.filter((v) => v.memorizedDate);

  if (childrenLoading) {
    return <LoadingSpinner size="lg" text="جارٍ تحميل قائمة الأطفال..." />;
  }

  return (
    <div className="verses-manager-layout" style={{ display: 'flex', gap: '1.5rem', minHeight: 'calc(100vh - 180px)' }}>
      
      {/* Sidebar: Children List */}
      <div className="dashboard-card" style={{ width: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column', padding: '1rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontFamily: 'Cairo', fontSize: '1.1rem' }}>👦 أطفال فصلي</h3>
        
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="بحث عن طفل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 2.2rem 0.6rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid rgba(135,206,235,0.2)',
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text-dark)',
              fontSize: '0.85rem'
            }}
          />
          <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
        </div>

        {/* List */}
        <div style={{ flexGrow: 1, overflowY: 'auto', maxHeight: '500px' }}>
          {filteredChildren.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '0.85rem', padding: '1rem' }}>
              لا يوجد نتائج للبحث
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {filteredChildren.map((child) => (
                <button
                  key={child.uid}
                  onClick={() => setSelectedChild(child)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    textAlign: 'right',
                    cursor: 'pointer',
                    background: selectedChild?.uid === child.uid
                      ? 'linear-gradient(135deg, var(--medium-blue), var(--sky-blue-dark))'
                      : 'rgba(135,206,235,0.04)',
                    color: selectedChild?.uid === child.uid ? 'var(--white)' : 'var(--text-dark)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{child.avatarId || '👦'}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{child.name}</div>
                      <div style={{
                        fontSize: '0.75rem',
                        opacity: selectedChild?.uid === child.uid ? 0.8 : 0.6
                      }}>
                        المستوى: {child.level || 'مبتدئ'}
                      </div>
                    </div>
                  </div>
                  <span className="points-badge" style={{
                    background: selectedChild?.uid === child.uid ? 'rgba(255,255,255,0.2)' : undefined,
                    color: selectedChild?.uid === child.uid ? '#fff' : undefined
                  }}>
                    ⭐ {child.points}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Panel */}
      <div style={{ flexGrow: 1 }}>
        <AnimatePresence mode="wait">
          {!selectedChild ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ height: '100%' }}
            >
              <EmptyState
                icon="📖"
                title="تسميع وتعيين الآيات"
                description="اختر طفلاً من القائمة الجانبية لعرض آياته المعينة، أو تسميع وحفظ الآيات، أو تعيين آيات جديدة له."
              />
            </motion.div>
          ) : (
            <motion.div
              key={selectedChild.uid}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              {/* Selected Child Header */}
              <div className="hero-banner" style={{
                background: 'linear-gradient(135deg, var(--medium-blue) 0%, var(--sky-blue-dark) 100%)',
                borderRadius: '16px',
                padding: '1.5rem',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    fontSize: '2.5rem',
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {selectedChild.avatarId || '👦'}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: '#fff', fontFamily: 'Cairo', fontSize: '1.25rem' }}>
                      البطل: {selectedChild.name}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>
                      مجموع النقاط الحالي: {selectedChild.points} نقطة | المستوى: {selectedChild.level || 'مبتدئ'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action grid: Left is Verse Assignment, Right is active verses & history */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                
                {/* Right Column: Verses tabs */}
                <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="dashboard-card-header" style={{ padding: '1rem', borderBottom: '1px solid rgba(135,206,235,0.1)', display: 'flex', gap: '1rem' }}>
                    <button
                      onClick={() => setActiveTab('active')}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        border: 'none',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'active' ? 'bold' : 'normal',
                        background: activeTab === 'active' ? 'var(--sky-blue-dark)' : 'transparent',
                        color: activeTab === 'active' ? '#fff' : 'var(--text-light)',
                        transition: 'all 0.2s'
                      }}
                    >
                      📖 آيات معلقة ({pendingVerses.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('history')}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        border: 'none',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'history' ? 'bold' : 'normal',
                        background: activeTab === 'history' ? 'var(--sky-blue-dark)' : 'transparent',
                        color: activeTab === 'history' ? '#fff' : 'var(--text-light)',
                        transition: 'all 0.2s'
                      }}
                    >
                      ✅ المحفوظات ({memorizedVerses.length})
                    </button>
                  </div>

                  <div className="dashboard-card-body" style={{ padding: '1.25rem', minHeight: '300px' }}>
                    {versesLoading ? (
                      <LoadingSpinner size="md" />
                    ) : activeTab === 'active' ? (
                      pendingVerses.length === 0 ? (
                        <EmptyState
                          icon="📖"
                          title="لا توجد آيات معلقة"
                          description="قم بتعيين آية جديدة لهذا الطفل باستخدام النموذج الجانبي."
                        />
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {pendingVerses.map((verse) => (
                            <div
                              key={verse.id}
                              style={{
                                padding: '1rem',
                                borderRadius: '10px',
                                border: '1px dashed var(--sky-blue-dark)',
                                background: 'rgba(135,206,235,0.03)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem'
                              }}
                            >
                              <div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.25rem' }}>الآية:</span>
                                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem', lineHeight: '1.6' }}>
                                  "{verse.verseText}"
                                </p>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderTop: '1px solid rgba(135,206,235,0.06)', paddingTop: '0.75rem' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                                  📍 الشاهد: <strong>{verse.reference}</strong>
                                </span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                                  ⭐ النقاط: <strong>{verse.pointsAwarded}</strong>
                                </span>
                              </div>
                              <button
                                onClick={() => handleVerifyVerse(verse.id, verse.pointsAwarded)}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}
                              >
                                ✅ تأكيد الحفظ والتسميع
                              </button>
                            </div>
                          ))}
                        </div>
                      )
                    ) : (
                      memorizedVerses.length === 0 ? (
                        <EmptyState
                          icon="🎉"
                          title="لا توجد آيات محفوظة بعد"
                          description="عندما يقوم الطفل بحفظ آية وتأكيدها، ستظهر في هذا القسم."
                        />
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {memorizedVerses.map((verse) => (
                            <div
                              key={verse.id}
                              style={{
                                padding: '1rem',
                                borderRadius: '10px',
                                border: '1px solid rgba(76,175,80,0.2)',
                                background: 'rgba(76,175,80,0.02)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem'
                              }}
                            >
                              <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem', textDecoration: 'line-through', opacity: 0.8 }}>
                                "{verse.verseText}"
                              </p>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                                <span>الشاهد: {verse.reference}</span>
                                <span>تم الحفظ: {new Date(verse.memorizedDate).toLocaleDateString('ar-EG')}</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', color: '#4CAF50', alignSelf: 'flex-start' }}>
                                🏆 حصل على {verse.pointsAwarded} نقطة
                              </span>
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Left Column: Assign New Verse Form */}
                <div className="dashboard-card" style={{ padding: '1.25rem' }}>
                  <div className="dashboard-card-header" style={{ padding: '0 0 1rem 0', borderBottom: '1px solid rgba(135,206,235,0.1)' }}>
                    <h3 style={{ margin: 0, fontFamily: 'Cairo', fontSize: '1.1rem' }}>✍️ تعيين آية جديدة</h3>
                  </div>

                  <form onSubmit={handleAssignVerse} style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>نص الآية</label>
                      <textarea
                        rows="3"
                        required
                        placeholder="اكتب نص الآية بالتشكيل إن أمكن..."
                        value={verseText}
                        onChange={(e) => setVerseText(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.6rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(135,206,235,0.2)',
                          background: 'rgba(255,255,255,0.05)',
                          color: 'var(--text-dark)',
                          fontSize: '0.9rem',
                          fontFamily: 'Cairo'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>الشاهد (المرجع)</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: يوحنا ٣: ١٦"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.6rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(135,206,235,0.2)',
                          background: 'rgba(255,255,255,0.05)',
                          color: 'var(--text-dark)',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>النقاط الممنوحة عند الحفظ</label>
                      <input
                        type="number"
                        min="5"
                        max="100"
                        required
                        value={pointValue}
                        onChange={(e) => setPointValue(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.6rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(135,206,235,0.2)',
                          background: 'rgba(255,255,255,0.05)',
                          color: 'var(--text-dark)',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-primary"
                      style={{ width: '100%', marginTop: '0.5rem' }}
                    >
                      {submitting ? 'جارٍ الحفظ...' : '➕ تعيين الآية للطفل'}
                    </button>
                  </form>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
