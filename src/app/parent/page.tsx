import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NavBar from '@/components/NavBar'
import MasteryBadge from '@/components/MasteryBadge'
import LinkStudentForm from '@/components/LinkStudentForm'
import UnlinkStudentButton from '@/components/UnlinkStudentButton'
import { UserVocabProgress } from '@/types'

export default async function ParentPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, role, linked_student_id')
    .eq('id', user.id)
    .maybeSingle()

  const isParent = profile?.role === 'parent'
  const hasLinkedStudent = isParent && !!profile?.linked_student_id

  // Non-parent users: show their own learning report
  // Parent without linked student: show link form
  // Parent with linked student: show student's report
  const targetUserId = hasLinkedStudent ? profile.linked_student_id! : user.id

  // If parent with no linked student, show setup screen
  if (isParent && !hasLinkedStudent) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <NavBar />
        <main className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 chinese-text">家长报告</h1>
            <p className="text-gray-400 text-sm mt-1">关联孩子的账户后查看学习情况</p>
          </div>
          <LinkStudentForm />
        </main>
      </div>
    )
  }

  const [vocabRes, sessionsRes, studentProfileRes] = await Promise.all([
    supabase
      .from('user_vocab_progress')
      .select('*, vocabulary (*)')
      .eq('user_id', targetUserId)
      .neq('mastery_level', 'mastered')
      .order('mistake_count', { ascending: false })
      .limit(20),
    supabase
      .from('daily_sessions')
      .select('session_date, completed, total_questions, correct_questions')
      .eq('user_id', targetUserId)
      .order('session_date', { ascending: false })
      .limit(7),
    supabase
      .from('profiles')
      .select('name')
      .eq('id', targetUserId)
      .maybeSingle(),
  ])

  const weakWords = (vocabRes.data ?? []) as UserVocabProgress[]
  const sessions = sessionsRes.data ?? []
  const studentName = studentProfileRes.data?.name ?? '学生'

  // 7-day completion summary
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toISOString().split('T')[0]
    const session = sessions.find(s => s.session_date === dateStr)
    return {
      date: d,
      completed: session?.completed ?? false,
      accuracy: session && session.total_questions > 0
        ? Math.round((session.correct_questions / session.total_questions) * 100)
        : null,
    }
  })

  const completedThisWeek = last7.filter(d => d.completed).length
  const avgAccuracy = last7
    .filter(d => d.accuracy !== null)
    .reduce((sum, d, _, arr) => sum + (d.accuracy ?? 0) / arr.length, 0)

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <NavBar />

      <main className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 chinese-text">
              {hasLinkedStudent ? '家长报告' : '学习报告'}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {hasLinkedStudent ? `${studentName} 的学习情况` : '我的学习情况'}
            </p>
          </div>
          {hasLinkedStudent && (
            <UnlinkStudentButton studentName={studentName} />
          )}
        </div>

        {/* Weekly summary */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-700 text-sm mb-4">本周完成情况</h2>
          <div className="flex justify-between mb-4">
            {last7.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    day.completed
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-100 text-gray-300'
                  }`}
                >
                  {day.completed ? '✓' : '—'}
                </div>
                <span className="text-xs text-gray-400">
                  {day.date.toLocaleDateString('zh-CN', { weekday: 'short' }).replace('周', '')}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-gray-50 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-600">{completedThisWeek}/7</div>
              <div className="text-xs text-gray-400 mt-0.5">本周完成天数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {avgAccuracy > 0 ? `${Math.round(avgAccuracy)}%` : '—'}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">平均正确率</div>
            </div>
          </div>
        </div>

        {/* Top weak words */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-700 text-sm mb-4">
            需要关注的词语
            {weakWords.length > 0 && (
              <span className="ml-2 text-xs text-gray-400">（共 {weakWords.length} 个）</span>
            )}
          </h2>

          {weakWords.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-3xl mb-2">🎉</div>
              <p className="text-gray-400 text-sm chinese-text">
                {hasLinkedStudent ? `${studentName}` : '你'}还没有答错的词语
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {weakWords.map(wp => {
                const vocab = wp.vocabulary
                if (!vocab) return null
                return (
                  <div
                    key={wp.id}
                    className="flex items-start justify-between gap-3 py-2 border-b border-gray-50 last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-800 chinese-text">{vocab.word}</span>
                        {vocab.pinyin && (
                          <span className="text-xs text-gray-400">{vocab.pinyin}</span>
                        )}
                      </div>
                      {vocab.meaning_zh && (
                        <p className="text-xs text-gray-500 chinese-text mt-0.5 truncate">{vocab.meaning_zh}</p>
                      )}
                      <p className="text-xs text-red-400 mt-1">答错 {wp.mistake_count} 次</p>
                    </div>
                    <MasteryBadge level={wp.mastery_level} size="sm" />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Repeated mistakes highlight */}
        {weakWords.filter(w => w.mistake_count >= 3).length > 0 && (
          <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
            <h2 className="font-semibold text-red-700 text-sm mb-3 flex items-center gap-1.5">
              <span>⚠️</span> 反复答错的词语
            </h2>
            <div className="flex flex-wrap gap-2">
              {weakWords
                .filter(w => w.mistake_count >= 3)
                .map(wp => (
                  <span
                    key={wp.id}
                    className="bg-white border border-red-200 text-red-700 text-sm px-3 py-1.5 rounded-full font-medium chinese-text"
                  >
                    {wp.vocabulary?.word} ({wp.mistake_count}×)
                  </span>
                ))}
            </div>
          </div>
        )}

        {!hasLinkedStudent && !isParent && (
          <div className="bg-brand-50 rounded-xl p-4 border border-brand-100">
            <p className="text-brand-700 text-xs text-center">
              💡 家长可以用自己的账户登录并关联学生，查看详细报告
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
