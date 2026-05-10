import { UserVocabProgress } from '@/types'
import MasteryBadge from './MasteryBadge'
import ProgressBar from './ProgressBar'
import { getMasteryPercent } from '@/lib/spaced-repetition'
import { format } from 'date-fns'

interface Props {
  progress: UserVocabProgress
}

export default function WordBankItem({ progress }: Props) {
  const vocab = progress.vocabulary
  if (!vocab) return null

  const nextReview = new Date(progress.next_review_at)
  const isDue = nextReview <= new Date()

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <span className="text-2xl font-bold text-gray-800 chinese-text">{vocab.word}</span>
          {vocab.pinyin && (
            <span className="ml-2 text-sm text-gray-400">{vocab.pinyin}</span>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <MasteryBadge level={progress.mastery_level} size="sm" />
          {isDue && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              待复习
            </span>
          )}
        </div>
      </div>

      {vocab.meaning_zh && (
        <p className="text-sm text-gray-600 chinese-text mb-1">{vocab.meaning_zh}</p>
      )}
      {vocab.meaning_en && (
        <p className="text-sm text-gray-400 mb-3">{vocab.meaning_en}</p>
      )}

      <ProgressBar value={getMasteryPercent(progress.mastery_level)} size="sm" />

      <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
        <span>答错 {progress.mistake_count} 次</span>
        <span>
          {isDue ? '今天复习' : `下次复习：${format(nextReview, 'M月d日')}`}
        </span>
      </div>

      {vocab.example_sentence && (
        <p className="mt-3 pt-3 border-t border-gray-50 text-xs text-gray-500 chinese-text italic">
          {vocab.example_sentence}
        </p>
      )}
    </div>
  )
}
