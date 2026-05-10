import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NavBar from '@/components/NavBar'
import WordBankItem from '@/components/WordBankItem'
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

  const grouped = {
    due: progress.filter(p => new Date(p.next_review_at) <= new Date() && p.mastery_level !== 'mastered'),
    improving: progress.filter(p => p.mastery_level === 'improving' && new Date(p.next_review_at) > new Date()),
    weak: progress.filter(p => p.mastery_level === 'weak' && new Date(p.next_review_at) > new Date()),
    new: progress.filter(p => p.mastery_level === 'new' && new Date(p.next_review_at) > new Date()),
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

        {progress.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
            <div className="text-4xl mb-3">📚</div>
            <p className="text-gray-500 chinese-text text-sm">
              完成每日任务后，答错的词语会出现在这里
            </p>
          </div>
        ) : (
          <>
            {grouped.due.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-amber-600 mb-3 flex items-center gap-1.5">
                  <span>⏰</span> 今天待复习 ({grouped.due.length})
                </h2>
                <div className="flex flex-col gap-3">
                  {grouped.due.map(p => (
                    <WordBankItem key={p.id} progress={p} />
                  ))}
                </div>
              </section>
            )}

            {(grouped.new.length > 0 || grouped.weak.length > 0) && (
              <section>
                <h2 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-1.5">
                  <span>📌</span> 需要加强 ({grouped.new.length + grouped.weak.length})
                </h2>
                <div className="flex flex-col gap-3">
                  {[...grouped.new, ...grouped.weak].map(p => (
                    <WordBankItem key={p.id} progress={p} />
                  ))}
                </div>
              </section>
            )}

            {grouped.improving.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-amber-600 mb-3 flex items-center gap-1.5">
                  <span>📈</span> 进步中 ({grouped.improving.length})
                </h2>
                <div className="flex flex-col gap-3">
                  {grouped.improving.map(p => (
                    <WordBankItem key={p.id} progress={p} />
                  ))}
                </div>
              </section>
            )}

            {grouped.mastered.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-emerald-600 mb-3 flex items-center gap-1.5">
                  <span>🏆</span> 已掌握 ({grouped.mastered.length})
                </h2>
                <div className="flex flex-col gap-3">
                  {grouped.mastered.map(p => (
                    <WordBankItem key={p.id} progress={p} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}
