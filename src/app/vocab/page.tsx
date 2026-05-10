import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NavBar from '@/components/NavBar'
import VocabFilteredList from '@/components/VocabFilteredList'
import { UserVocabProgress } from '@/types'

export default async function VocabPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: progressRaw } = await supabase
    .from('user_vocab_progress')
    .select(`
      *,
      vocabulary (*)
    `)
    .eq('user_id', user.id)
    .order('mastery_level', { ascending: true })
    .order('next_review_at', { ascending: true })

  const progress = (progressRaw ?? []) as UserVocabProgress[]

  const dueCount = progress.filter(p => new Date(p.next_review_at) <= new Date() && p.mastery_level !== 'mastered').length
  const masteredCount = progress.filter(p => p.mastery_level === 'mastered').length

  const now = new Date()
  const grouped = {
    due: progress.filter(p => new Date(p.next_review_at) <= now && p.mastery_level !== 'mastered'),
    weak: progress.filter(p => (p.mastery_level === 'weak' || p.mastery_level === 'new') && new Date(p.next_review_at) > now),
    improving: progress.filter(p => p.mastery_level === 'improving' && new Date(p.next_review_at) > now),
    mastered: progress.filter(p => p.mastery_level === 'mastered'),
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <NavBar />

      <main className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 chinese-text">词语库</h1>
          <p className="text-gray-400 text-sm mt-1">
            共 {progress.length} 个词语 · {masteredCount} 个已掌握 · {dueCount} 个待复习
          </p>
        </div>

        {/* How it works */}
        <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4 flex flex-col gap-2.5">
          <p className="text-xs font-semibold text-brand-700 mb-0.5">如何提升词语等级？</p>
          {[
            { icon: '⏰', label: '今天待复习', desc: '今天需要复习，会出现在下一次每日任务的词语复习阶段' },
            { icon: '📌', label: '需要加强', desc: '答错过，还没到复习时间，继续努力！' },
            { icon: '📈', label: '进步中', desc: '答对了，复习时间已安排，保持下去' },
            { icon: '🏆', label: '已掌握', desc: '连续答对 3 次即可达到此等级' },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-2.5">
              <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
              <div>
                <span className="text-xs font-semibold text-gray-700 chinese-text">{item.label}</span>
                <span className="text-xs text-gray-500 chinese-text"> — {item.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <VocabFilteredList groups={grouped} total={progress.length} />
      </main>
    </div>
  )
}
