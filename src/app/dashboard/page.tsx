import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import NavBar from '@/components/NavBar'
import DashboardCard from '@/components/DashboardCard'
import ProgressBar from '@/components/ProgressBar'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const today = new Date().toISOString().split('T')[0]

  // Fetch data in parallel
  const [profileRes, sessionRes, masteredRes, weakRes, streakRes] = await Promise.all([
    supabase.from('profiles').select('name, role').eq('id', user.id).maybeSingle(),
    supabase
      .from('daily_sessions')
      .select('completed, total_questions, correct_questions')
      .eq('user_id', user.id)
      .eq('session_date', today)
      .maybeSingle(),
    supabase
      .from('user_vocab_progress')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('mastery_level', 'mastered'),
    supabase
      .from('user_vocab_progress')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)
      .neq('mastery_level', 'mastered'),
    supabase
      .from('daily_sessions')
      .select('session_date')
      .eq('user_id', user.id)
      .eq('completed', true)
      .order('session_date', { ascending: false })
      .limit(30),
  ])

  const profile = profileRes.data

  if (profile?.role === 'parent') redirect('/parent')

  const todaySession = sessionRes.data
  const masteredCount = masteredRes.count ?? 0
  const weakCount = weakRes.count ?? 0

  // Calculate streak
  let streak = 0
  const completedSessions = streakRes.data ?? []
  if (completedSessions.length > 0) {
    const checkDate = new Date()
    checkDate.setHours(0, 0, 0, 0)
    for (const s of completedSessions) {
      const sessionDay = new Date(s.session_date)
      sessionDay.setHours(0, 0, 0, 0)
      const diff = Math.round((checkDate.getTime() - sessionDay.getTime()) / (1000 * 60 * 60 * 24))
      if (diff === 0 || diff === 1) {
        streak++
        checkDate.setTime(sessionDay.getTime())
      } else break
    }
  }

  const todayCompleted = todaySession?.completed ?? false
  const todayAccuracy =
    todaySession && todaySession.total_questions > 0
      ? Math.round((todaySession.correct_questions / todaySession.total_questions) * 100)
      : null

  const firstName = profile?.name?.split(' ')[0] ?? '同学'

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <NavBar />

      <main className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 chinese-text">
            你好，{firstName}！👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {new Date().toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Today's mission card */}
        <div
          className={`rounded-2xl p-5 shadow-sm border ${
            todayCompleted
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-white border-gray-100'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-bold text-gray-800 text-base">今天的任务</h2>
              {todayCompleted ? (
                <p className="text-emerald-600 text-sm mt-0.5 font-medium">✓ 已完成</p>
              ) : (
                <p className="text-gray-400 text-sm mt-0.5">约 20 分钟</p>
              )}
            </div>
            {todayCompleted && todayAccuracy !== null && (
              <span className="text-2xl font-bold text-emerald-600">{todayAccuracy}%</span>
            )}
          </div>

          {/* Mission breakdown */}
          <div className="flex flex-col gap-2 mb-5">
            {[
              { icon: '📖', label: '词语复习', count: 5 },
              { icon: '❓', label: 'MCQ 练习', count: 5 },
              { icon: '📝', label: '阅读理解', count: 3 },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <span className="text-gray-400">{item.count} 题</span>
              </div>
            ))}
          </div>

          {!todayCompleted ? (
            <Link
              href="/mission"
              className="block w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-4 rounded-xl text-center transition-colors"
            >
              开始今天的任务 →
            </Link>
          ) : (
            <Link
              href="/vocab"
              className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl text-center transition-colors"
            >
              查看词语进度 →
            </Link>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <DashboardCard
            icon="🔥"
            label="连续天数"
            value={streak}
            sub={streak > 0 ? '继续加油！' : '今天开始'}
            color={streak >= 3 ? 'amber' : 'gray'}
          />
          <DashboardCard
            icon="🏆"
            label="已掌握词语"
            value={masteredCount}
            sub="个词语"
            color="emerald"
          />
          <DashboardCard
            icon="📚"
            label="待复习"
            value={weakCount}
            sub="个词语"
            color={weakCount > 10 ? 'red' : 'gray'}
          />
          <DashboardCard
            icon="📅"
            label="今日正确率"
            value={todayAccuracy !== null ? `${todayAccuracy}%` : '—'}
            sub={todayCompleted ? '已完成' : '未开始'}
            color={todayAccuracy !== null && todayAccuracy >= 80 ? 'brand' : 'gray'}
          />
        </div>

        {/* Mastery overview */}
        {(masteredCount + weakCount) > 0 && (
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-4 text-sm">词语掌握总览</h3>
            <div className="flex flex-col gap-2">
              <ProgressBar
                value={Math.round((masteredCount / (masteredCount + weakCount)) * 100)}
                color="emerald"
                showLabel
                label={`已掌握 ${masteredCount} / ${masteredCount + weakCount} 个词语`}
              />
            </div>
          </div>
        )}

        {/* Motivational quote */}
        <div className="bg-brand-50 rounded-2xl p-4 border border-brand-100">
          <p className="text-brand-700 text-sm text-center chinese-text font-medium">
            &ldquo;每天一点点，错词变熟词。&rdquo;
          </p>
        </div>
      </main>
    </div>
  )
}
