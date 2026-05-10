'use client'

import { AIExplanation } from '@/types'

interface Props {
  explanation: AIExplanation | null
  isLoading: boolean
  onNext: () => void
  nextLabel?: string
}

export default function ExplanationModal({ explanation, isLoading, onNext, nextLabel = '下一题' }: Props) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">💡</span>
        <h3 className="font-semibold text-amber-800 text-base">解析</h3>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3 animate-pulse">
          <div className="h-4 bg-amber-200 rounded w-4/5" />
          <div className="h-4 bg-amber-200 rounded w-3/5" />
          <div className="h-4 bg-amber-200 rounded w-4/5" />
          <div className="h-4 bg-amber-200 rounded w-2/5" />
        </div>
      ) : explanation ? (
        <div className="flex flex-col gap-4 text-sm">
          {/* Why wrong */}
          <section>
            <p className="font-semibold text-red-600 mb-1">❌ 你的答案为何不对</p>
            <p className="text-gray-700">{explanation.why_wrong_en}</p>
            <p className="text-gray-600 mt-1 chinese-text">{explanation.why_wrong_zh}</p>
          </section>

          {/* Why correct */}
          <section>
            <p className="font-semibold text-emerald-600 mb-1">✓ 正确答案的原因</p>
            <p className="text-gray-700">{explanation.why_correct_en}</p>
            <p className="text-gray-600 mt-1 chinese-text">{explanation.why_correct_zh}</p>
          </section>

          {/* Memory hook */}
          <section className="bg-white rounded-xl p-3 border border-amber-200">
            <p className="font-semibold text-amber-700 mb-1">🧠 记忆技巧</p>
            <p className="text-gray-700">{explanation.memory_hook}</p>
          </section>

          {/* Example */}
          <section>
            <p className="font-semibold text-brand-600 mb-1">📝 例句</p>
            <p className="text-gray-700 chinese-text italic">{explanation.similar_example}</p>
          </section>
        </div>
      ) : (
        <p className="text-amber-700 text-sm">无法加载解析，请继续下一题。</p>
      )}

      <button
        onClick={onNext}
        disabled={isLoading}
        className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {nextLabel}
      </button>
    </div>
  )
}
