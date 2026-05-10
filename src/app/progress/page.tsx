import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NavBar from '@/components/NavBar'
import ProgressBar from '@/components/ProgressBar'
import DailyAttemptReview from '@/components/DailyAttemptReview'

export default async function ProgressPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [sessionsRes, vocabRes, attemptsRes] = await Promise.all([
    supabase
      .from('daily_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('session_date', { ascending: false })
      .limit(14),
    supabase
      .from('user_vocab_progress')
      .select('mastery_level')
      .eq('user_id', user.id),
    supabase
      .from('attempts')
      .select(`
        id,
        session_date,
        is_correct,
        selected_answer,
        questions (
          question_text,
          options,
          correct_answer,
          type,
          passage_title
        )
      `)
      .eq('user_id', user.id)
      .order('session_date', { ascending: false })
      .limit(200),
  ])

  const sessions = sessionsRes.data ?? []
  const vocabProgress = vocabRes.data ?? []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawAttempts = (attemptsRes.data ?? []) as any[]
  const attempts = rawAttempts.map(a => ({
    id: a.id as string,
    session_date: a.session_date as string,
    is_correct: a.is_correct as boolean,
    selected_answer: a.selected_answer as string | null,
    question: a.questions ?? null,
  }))
  const attemptDates = [...new Set(attempts.map(a => a.session_date))].sort((x, y) => y.localeCompare(x))

  const masteryBreakdown = {
    new: vocabProgress.filter(v => v.mastery_level === 'new').length,
    weak: vocabProgress.filter(v => v.mastery_level === 'weak').length,
    improving: vocabProgress.filter(v => v.mastery_level === 'improving').length,
    mastered: vocabProgress.filter(v => v.mastery_level === 'mastered').length,
  }
  const totalVocab = vocabProgress.length

  // Streak calculation
  let streak = 0
  const completedSessions = sessions.filter(s => s.completed)
  if (completedSessions.length > 0) {
    const checkDate = new Date()
    checkDate.setHours(0, 0, 0, 0)
    for (const s of completedSessions) {
      const sd = new Date(s.session_date)
      sd.setHours(0, 0, 0, 0)
      const diff = Math.round((checkDate.getTime() - sd.getTime()) / (1000 * 60 * 60 * 24))
      if (diff === 0 || diff === 1) { streak++; checkDate.setTime(sd.getTime()) }
      else break
    }
  }

  // Last 7 days for activity grid
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toISOString().split('T')[0]
    const session = sessions.find(s => s.session_date === dateStr)
    return {
      date: d,
      dateStr,
      completed: session?.completed ?? false,
      accuracy: session && session.total_questions > 0
        ? Math.round((session.correct_questions / session.total_questions) * 100)
        : null,
    }
  })

  const achievements = [
    { icon: '🔥', label: '7天连续', earned: streak >= 7, desc: `当前连续 ${streak} 天` },
    { icon: '🏆', label: '掌握10词', earned: masteryBreakdown.mastered >= 10, desc: `已掌握 ${masteryBreakdown.mastered} 个` },
    { icon: '⭐', label: '掌握50词', earned: masteryBreakdown.mastered >= 50, desc: `已掌握 ${masteryBreakdown.mastered} 个` },
    { icon: '📈', label: '完成首次任务', earned: completedSessions.length >= 1, desc: `共完成 ${completedSessions.length} 次` },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <NavBar />

      <main className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 chinese-text">我的进度</h1>
          <p className="text-gray-400 text-sm mt-1">连续完成 {streak} 天</p>
        </div>

        {/* 7-day activity */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-700 text-sm mb-4">最近 7 天</h2>
          <div className="grid grid-cols-7 gap-1.5">
            {last7.map(day => (
              <div key={day.dateStr} className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    day.completed
                      ? day.accuracy !== null && day.accuracy >= 80
                        ? 'bg-emerald-500 text-white'
                        : 'bg-brand-500 text-white'
                      : 'bg-gray-100 text-gray-300'
                  }`}
                >
                  {day.completed ? (day.accuracy !== null ? `${day.accuracy}` : '✓') : '–'}
                </div>
                <span className="text-xs text-gray-400">
                  {day.date.toLocaleDateString('zh-CN', { weekday: 'short' }).replace('周', '')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mastery breakdown */}
        {totalVocab > 0 && (
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h2 className="font-semibold text-gray-700 text-sm mb-4">词语掌握情况</h2>
            <div className="flex flex-col gap-3">
              {[
                { label: '已掌握', count: masteryBreakdown.mastered, color: 'emerald' as const },
                { label: '进步中', count: masteryBreakdown.improving, color: 'brand' as const },
                { label: '待加强', count: masteryBreakdown.weak, color: 'amber' as const },
                { label: '新词', count: masteryBreakdown.new, color: 'red' as const },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-12 text-right flex-shrink-0">{item.label}</span>
                  <div className="flex-1">
                    <ProgressBar
                      value={totalVocab > 0 ? Math.round((item.count / totalVocab) * 100) : 0}
                      color={item.color}
                      size="sm"
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-6 flex-shrink-0">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-700 text-sm mb-4">成就</h2>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map(a => (
              <div
                key={a.label}
                className={`rounded-xl p-3 border text-center ${
                  a.earned
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-gray-50 border-gray-100 opacity-50'
                }`}
              >
                <div className="text-2xl mb-1">{a.icon}</div>
                <div className="text-xs font-semibold text-gray-700 chinese-text">{a.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{a.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily attempt review */}
        <DailyAttemptReview attempts={attempts} dates={attemptDates} />

        {/* Session history */}
        {sessions.length > 0 && (
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h2 className="font-semibold text-gray-700 text-sm mb-4">最近记录</h2>
            <div className="flex flex-col gap-2">
              {sessions.slice(0, 7).map(s => (
                <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <span className="text-sm text-gray-700">
                      {new Date(s.session_date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                    </span>
                    {s.completed ? (
                      <span className="ml-2 text-xs text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">完成</span>
                    ) : (
                      <span className="ml-2 text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">未完成</span>
                    )}
                  </div>
                  {s.completed && s.total_questions > 0 && (
                    <span className="text-sm font-semibold text-gray-600">
                      {s.correct_questions}/{s.total_questions}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
