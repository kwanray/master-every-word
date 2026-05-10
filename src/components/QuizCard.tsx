'use client'

import { Question, QuestionOption } from '@/types'
import clsx from 'clsx'

interface Props {
  question: Question
  selectedAnswer: string | null
  showResult: boolean
  onSelect: (key: string) => void
  questionNumber: number
  totalQuestions: number
  phaseLabel: string
}

export default function QuizCard({
  question,
  selectedAnswer,
  showResult,
  onSelect,
  questionNumber,
  totalQuestions,
  phaseLabel,
}: Props) {
  function getOptionState(option: QuestionOption) {
    if (!showResult) {
      return selectedAnswer === option.key ? 'selected' : 'default'
    }
    if (option.key === question.correct_answer) return 'correct'
    if (option.key === selectedAnswer) return 'wrong'
    return 'default'
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span className="font-medium text-brand-600 bg-brand-50 px-2 py-1 rounded-full text-xs">
          {phaseLabel}
        </span>
        <span>
          第 {questionNumber} 题 / 共 {totalQuestions} 题
        </span>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <p className="text-lg font-semibold text-gray-800 leading-relaxed chinese-text">
          {question.question_text}
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {question.options.map(option => {
          const state = getOptionState(option)
          return (
            <button
              key={option.key}
              onClick={() => !showResult && onSelect(option.key)}
              disabled={showResult}
              className={clsx(
                'w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all active:scale-98',
                {
                  'border-gray-200 bg-white hover:border-brand-300 hover:bg-brand-50':
                    state === 'default',
                  'border-brand-500 bg-brand-50': state === 'selected',
                  'border-emerald-500 bg-emerald-50': state === 'correct',
                  'border-red-400 bg-red-50': state === 'wrong',
                }
              )}
            >
              <span
                className={clsx(
                  'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                  {
                    'bg-gray-100 text-gray-600': state === 'default',
                    'bg-brand-500 text-white': state === 'selected',
                    'bg-emerald-500 text-white': state === 'correct',
                    'bg-red-400 text-white': state === 'wrong',
                  }
                )}
              >
                {option.key}
              </span>
              <span
                className={clsx(
                  'text-base leading-snug mt-0.5 chinese-text',
                  {
                    'text-gray-700': state === 'default',
                    'text-brand-700 font-medium': state === 'selected',
                    'text-emerald-700 font-medium': state === 'correct',
                    'text-red-700 font-medium': state === 'wrong',
                  }
                )}
              >
                {option.text}
              </span>
            </button>
          )
        })}
      </div>

      {/* Result indicator */}
      {showResult && (
        <div
          className={clsx(
            'flex items-center gap-2 p-3 rounded-xl text-sm font-medium',
            selectedAnswer === question.correct_answer
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          )}
        >
          {selectedAnswer === question.correct_answer ? (
            <>
              <span className="text-lg">✓</span>
              <span>答对了！</span>
            </>
          ) : (
            <>
              <span className="text-lg">✗</span>
              <span>
                答错了。正确答案是 {question.correct_answer}：
                {question.options.find(o => o.key === question.correct_answer)?.text}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
