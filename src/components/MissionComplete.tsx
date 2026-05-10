'use client'

import { QuestionResult } from '@/types'
import { useRouter } from 'next/navigation'
import ProgressBar from './ProgressBar'

interface Props {
  results: QuestionResult[]
  streak: number
}

export default function MissionComplete({ results, streak }: Props) {
  const router = useRouter()
  const total = results.length
  const correct = results.filter(r => r.is_correct).length
  const wrong = total - correct
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0

  const wrongResults = results.filter(r => !r.is_correct)

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white px-4 py-8 flex flex-col gap-6">
      {/* Celebration header */}
      <div className="text-center">
        <div className="text-6xl mb-3">{accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👏' : '💪'}</div>
        <h1 className="text-2xl font-bold text-gray-800 chinese-text">今天完成了！</h1>
        <p className="text-gray-500 mt-1 chinese-text text-sm">
          你掌握了 {correct} 道题，还有 {wrong} 道题需要继续练习
        </p>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">正确率</span>
          <span className="text-2xl font-bold text-brand-600">{accuracy}%</span>
        </div>
        <ProgressBar value={accuracy} color={accuracy >= 80 ? 'emerald' : accuracy >= 60 ? 'amber' : 'red'} />

        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-50">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-800">{total}</div>
            <div className="text-xs text-gray-400">总题数</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-emerald-600">{correct}</div>
            <div className="text-xs text-gray-400">答对</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-red-500">{wrong}</div>
            <div className="text-xs text-gray-400">答错</div>
          </div>
        </div>

        {streak > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 rounded-xl p-3">
            <span className="text-xl">🔥</span>
            <span className="text-amber-700 font-medium text-sm">连续 {streak} 天完成任务！</span>
          </div>
        )}
      </div>

      {/* Mistake review */}
      {wrongResults.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-gray-700 text-sm">需要复习的题目 ({wrongResults.length})</h2>
          {wrongResults.map((result, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-red-100 shadow-sm">
              <p className="text-sm text-gray-700 font-medium chinese-text mb-2">
                {result.question.question_text}
              </p>
              <div className="flex items-start gap-2 text-xs">
                <span className="text-red-500 flex-shrink-0 mt-0.5">✗</span>
                <span className="text-red-600">
                  你的答案：{result.selected_answer} —{' '}
                  {result.question.options.find(o => o.key === result.selected_answer)?.text}
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs mt-1">
                <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                <span className="text-emerald-600">
                  正确答案：{result.question.correct_answer} —{' '}
                  {result.question.options.find(o => o.key === result.question.correct_answer)?.text}
                </span>
              </div>
              {result.ai_explanation && (
                <p className="text-xs text-amber-700 mt-2 bg-amber-50 p-2 rounded-lg">
                  💡 {result.ai_explanation.memory_hook}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col gap-3 pb-24">
        <button
          onClick={() => router.push('/dashboard')}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-4 rounded-xl transition-colors"
        >
          返回主页
        </button>
        <button
          onClick={() => router.push('/vocab')}
          className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-4 rounded-xl border border-gray-200 transition-colors"
        >
          查看词语库
        </button>
      </div>
    </div>
  )
}
