'use client'

import { useState } from 'react'
import { QuestionOption } from '@/types'

interface AttemptRecord {
  id: string
  session_date: string
  is_correct: boolean
  selected_answer: string | null
  question: {
    question_text: string
    options: QuestionOption[]
    correct_answer: string
    type: string
    passage_title: string | null
  } | null
}

interface Props {
  attempts: AttemptRecord[]
  dates: string[] // sorted descending
}

type Filter = 'all' | 'correct' | 'wrong'

const TYPE_LABELS: Record<string, string> = {
  vocab_mcq: '词语',
  cloze_mcq: '填词',
  compre_mcq: '阅读',
  editing: '编辑',
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' })
}

export default function DailyAttemptReview({ attempts, dates }: Props) {
  const [selectedDate, setSelectedDate] = useState<string>(dates[0] ?? '')
  const [filter, setFilter] = useState<Filter>('all')

  if (dates.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h2 className="font-semibold text-gray-700 text-sm mb-3">答题记录</h2>
        <p className="text-gray-400 text-sm text-center py-4">还没有答题记录</p>
      </div>
    )
  }

  const dayAttempts = attempts.filter(a => a.session_date === selectedDate)
  const filtered = dayAttempts.filter(a => {
    if (filter === 'correct') return a.is_correct
    if (filter === 'wrong') return !a.is_correct
    return true
  })

  const correctCount = dayAttempts.filter(a => a.is_correct).length
  const wrongCount = dayAttempts.filter(a => !a.is_correct).length

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <h2 className="font-semibold text-gray-700 text-sm mb-3">答题记录</h2>

        {/* Date chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {dates.map(d => (
            <button
              key={d}
              onClick={() => { setSelectedDate(d); setFilter('all') }}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                selectedDate === d
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {formatDate(d)}
            </button>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-gray-100">
        {([
          { key: 'all' as Filter, label: `全部 ${dayAttempts.length}` },
          { key: 'correct' as Filter, label: `✓ 答对 ${correctCount}` },
          { key: 'wrong' as Filter, label: `✗ 答错 ${wrongCount}` },
        ]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex-1 text-xs py-2.5 font-medium transition-colors ${
              filter === tab.key
                ? tab.key === 'correct'
                  ? 'text-emerald-600 border-b-2 border-emerald-500'
                  : tab.key === 'wrong'
                  ? 'text-red-500 border-b-2 border-red-400'
                  : 'text-brand-600 border-b-2 border-brand-500'
                : 'text-gray-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Question list */}
      <div className="divide-y divide-gray-50">
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">没有符合条件的题目</p>
        ) : (
          filtered.map(attempt => {
            const q = attempt.question
            if (!q) return null
            const selectedOption = q.options.find(o => o.key === attempt.selected_answer)
            const correctOption = q.options.find(o => o.key === q.correct_answer)

            return (
              <div key={attempt.id} className="px-5 py-4">
                {/* Header row */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    attempt.is_correct ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'
                  }`}>
                    {attempt.is_correct ? '✓' : '✗'}
                  </span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {TYPE_LABELS[q.type] ?? q.type}
                  </span>
                  {q.passage_title && (
                    <span className="text-xs text-gray-400 truncate">《{q.passage_title}》</span>
                  )}
                </div>

                {/* Question text */}
                <p className="text-sm text-gray-800 chinese-text leading-relaxed mb-3">
                  {q.question_text}
                </p>

                {/* Options */}
                <div className="flex flex-col gap-1.5">
                  {q.options.map(opt => {
                    const isSelected = opt.key === attempt.selected_answer
                    const isCorrect = opt.key === q.correct_answer
                    let cls = 'text-gray-500 bg-gray-50 border-gray-100'
                    if (isCorrect) cls = 'text-emerald-700 bg-emerald-50 border-emerald-200 font-medium'
                    else if (isSelected && !attempt.is_correct) cls = 'text-red-600 bg-red-50 border-red-200'

                    return (
                      <div
                        key={opt.key}
                        className={`flex items-start gap-2 text-xs px-3 py-2 rounded-lg border ${cls}`}
                      >
                        <span className="font-bold flex-shrink-0">{opt.key}.</span>
                        <span className="chinese-text">{opt.text}</span>
                        {isCorrect && <span className="ml-auto flex-shrink-0">✓</span>}
                        {isSelected && !attempt.is_correct && <span className="ml-auto flex-shrink-0">✗</span>}
                      </div>
                    )
                  })}
                </div>

                {/* Wrong answer summary */}
                {!attempt.is_correct && selectedOption && correctOption && (
                  <p className="text-xs text-gray-400 mt-2">
                    你选了 <span className="text-red-500 font-medium">{attempt.selected_answer}. {selectedOption.text}</span>
                    ，正确答案是 <span className="text-emerald-600 font-medium">{q.correct_answer}. {correctOption.text}</span>
                  </p>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
