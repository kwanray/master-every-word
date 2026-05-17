import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NavBar from '@/components/NavBar'
import MasteryBadge from '@/components/MasteryBadge'
import LinkStudentForm from '@/components/LinkStudentForm'
import UnlinkStudentButton from '@/components/UnlinkStudentButton'
import CancelRequestButton from '@/components/CancelRequestButton'
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
  const targetUserId = hasLinkedStudent ? profile.linked_student_id! : user.id

  if (isParent && !hasLinkedStudent) {
    const { data: pendingRequest } = await supabase
      .from('parent_link_requests')
      .select('id, student_id')
      .eq('parent_id', user.id)
      .maybeSingle()

    let pendingStudentName = '学生'
    if (pendingRequest?.student_id) {
      const { data: sp } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', pendingRequest.student_id)
        .maybeSingle()
      pendingStudentName = sp?.name ?? '学生'
    }

    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <NavBar />
        <main className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 chinese-text">家长报告</h1>
            <p className="text-gray-400 text-sm mt-1">关联孩子的账户后查看学习情况</p>
          </div>
          {pendingRequest ? (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
              <div className="text-center">
                <div className="text-5xl mb-3">⏳</div>
                <h2 className="text-lg font-bold text-gray-800 chinese-text">等待学生确认</h2>
                <p className="text-gray-400 text-sm mt-2 chinese-text">
                  已向{' '}
                  <span className="font-medium text-gray-600">{pendingStudentName}</span>{' '}
                  发送关联请求，请让孩子登录后在主页接受请求。
                </p>
              </div>
              <div className="flex justify-center">
                <CancelRequestButton />
              </div>
            </div>
          ) : (
            <LinkStudentForm />
          )}
        </main>
      </div>
    )
  }

  const today = new Date().toISOString().split('T')[0]

  const [vocabRes, sessionsRes, studentProfileRes, todayRes, streakRes, masteryRes] = await Promise.all([
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
    supabase
      .from('daily_sessions')
      .select('completed, total_questions, correct_questions')
      .eq('user_id', targetUserId)
      .eq('session_date', today)
      .maybeSingle(),
    supabase
      .from('daily_sessions')
      .select('session_date')
      .eq('user_id', targetUserId)
      .eq('completed', true)
      .order('session_date', { ascending: false })
      .limit(30),
    supabase
      .from('user_vocab_progress')
      .select('mastery_level')
      .eq('user_id', targetUserId),
  ])

  const weakWords = (vocabRes.data ?? []) as UserVocabProgress[]
  const sessions = sessionsRes.data ?? []
  const studentName = studentProfileRes.data?.name ?? '学生'

  // Today
  const todaySession = todayRes.data
  const todayCompleted = todaySession?.completed ?? false
  const todayAccuracy = todaySession && todaySession.total_questions > 0
    ? Math.round((todaySession.correct_questions / todaySession.total_questions) * 100)
    : null

  // Streak
  let streak = 0
  const completedSessions = streakRes.data ?? []
  if (completedSessions.length > 0) {
    const checkDate = new Date()
    checkDate.setHours(0, 0, 0, 0)
    for (const s of completedSessions) {
      const sessionDay = new Date(s.session_date)
      sessionDay.setHours(0, 0, 0, 0)
      const diff = Math.round((checkDate.getTime() - sessionDay.getTime()) / (1000 * 60 * 60 * 24))
      if (diff === 0 || diff === 1) { streak++; checkDate.setTime(sessionDay.getTime()) }
      else break
    }
  }

  // Mastery breakdown
  const allVocab = masteryRes.data ?? []
  const masteryCount = {
    new:       allVocab.filter(v => v.mastery_level === 'new').length,
    weak:      allVocab.filter(v => v.mastery_level === 'weak').length,
    improving: allVocab.filter(v => v.mastery_level === 'improving').length,
    mastered:  allVocab.filter(v => v.mastery_level === 'mastered').length,
  }
  const totalVocab = allVocab.length

  // 7-day grid
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
  const avgAccuracy = last7.filter(d => d.accuracy !== null)
    .reduce((sum, d, _, arr) => sum + (d.accuracy ?? 0) / arr.length, 0)

  const masteryBars: { label: string; count: number; color: string; bg: string }[] = [
    { label: '新词',   count: masteryCount.new,       color: 'bg-gray-400',    bg: 'bg-gray-100' },
    { label: '较弱',   count: masteryCount.weak,      color: 'bg-red-400',     bg: 'bg-red-50'   },
    { label: '进步中', count: masteryCount.improving,  color: 'bg-amber-400',   bg: 'bg-amber-50' },
    { label: '已掌握', count: masteryCount.mastered,   color: 'bg-emerald-500', bg: 'bg-emerald-50' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <NavBar />

      <main className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 chinese-text">
              {hasLinkedStudent ? '家长报告' : '学习报告'}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {hasLinkedStudent ? `${studentName} 的学习情况` : '我的学习情况'}
            </p>
          </div>
          {hasLinkedStudent && <UnlinkStudentButton studentName={studentName} />}
        </div>

        {/* Today's status */}
        <div className={`rounded-2xl p-5 border shadow-sm ${
          todayCompleted ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-100'
        }`}>
          <h2 className="font-semibold text-gray-700 text-sm mb-3">今日状态</h2>
          {todayCompleted ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="text-sm font-semibold text-emerald-800 chinese-text">今天的任务已完成</p>
                  <p className="text-xs text-emerald-600 mt-0.5">
                    共 {todaySession?.total_questions} 题
                  </p>
                </div>
              </div>
              {todayAccuracy !== null && (
                <div className="text-right">
                  <div className="text-3xl font-bold text-emerald-600">{todayAccuracy}%</div>
                  <div className="text-xs text-emerald-500 mt-0.5">正确率</div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-2xl">📋</span>
              <p className="text-sm chinese-text">今天还没有完成任务</p>
            </div>
          )}
        </div>

        {/* Overall stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              icon: '🔥',
              value: streak,
              unit: '天',
              label: '连续学习',
              color: streak >= 3 ? 'text-amber-600' : 'text-gray-600',
            },
            {
              icon: '🏆',
              value: masteryCount.mastered,
              unit: '个',
              label: '已掌握词语',
              color: 'text-emerald-600',
            },
            {
              icon: '📚',
              value: totalVocab - masteryCount.mastered,
              unit: '个',
              label: '待学习词语',
              color: 'text-brand-600',
            },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <div className="text-xl mb-1">{stat.icon}</div>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
                <span className="text-sm font-normal ml-0.5">{stat.unit}</span>
              </div>
              <div className="text-xs text-gray-400 mt-1 leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Weekly summary with per-day accuracy */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-700 text-sm mb-4">本周完成情况</h2>
          <div className="flex justify-between mb-4">
            {last7.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold ${
                  day.completed ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-300'
                }`}>
                  {day.completed ? '✓' : '—'}
                </div>
                <span className="text-xs text-gray-400">
                  {day.date.toLocaleDateString('zh-CN', { weekday: 'short' }).replace('周', '')}
                </span>
                <span className={`text-xs font-medium ${
                  day.accuracy === null ? 'text-gray-200' :
                  day.accuracy >= 80 ? 'text-emerald-500' :
                  day.accuracy >= 60 ? 'text-amber-500' : 'text-red-400'
                }`}>
                  {day.accuracy !== null ? `${day.accuracy}%` : '—'}
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

        {/* Mastery breakdown */}
        {totalVocab > 0 && (
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h2 className="font-semibold text-gray-700 text-sm mb-4">词语掌握分布</h2>

            {/* Stacked bar */}
            <div className="flex rounded-full overflow-hidden h-3 mb-4">
              {masteryBars.map(bar =>
                bar.count > 0 ? (
                  <div
                    key={bar.label}
                    className={`${bar.color} transition-all`}
                    style={{ width: `${(bar.count / totalVocab) * 100}%` }}
                  />
                ) : null
              )}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2">
              {masteryBars.map(bar => (
                <div key={bar.label} className={`flex items-center justify-between rounded-xl px-3 py-2 ${bar.bg}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${bar.color}`} />
                    <span className="text-xs text-gray-600 chinese-text">{bar.label}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-700">{bar.count}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 text-center mt-3">共接触 {totalVocab} 个词语</p>
          </div>
        )}

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

        {/* Repeated mistakes */}
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
