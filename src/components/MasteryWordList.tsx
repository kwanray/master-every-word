'use client'

import { useState } from 'react'
import MasteryBadge from '@/components/MasteryBadge'
import { UserVocabProgress, MasteryLevel } from '@/types'

interface MasteryBar {
  level: MasteryLevel
  label: string
  count: number
  color: string
  bg: string
  activeBg: string
  textColor: string
  dot: string
}

const BARS: Omit<MasteryBar, 'count'>[] = [
  { level: 'new',       label: '新词',   color: 'bg-gray-400',    bg: 'bg-gray-100',    activeBg: 'bg-gray-200',    textColor: 'text-gray-700',    dot: 'bg-gray-400'    },
  { level: 'weak',      label: '较弱',   color: 'bg-red-400',     bg: 'bg-red-50',      activeBg: 'bg-red-100',     textColor: 'text-red-700',     dot: 'bg-red-400'     },
  { level: 'improving', label: '进步中', color: 'bg-amber-400',   bg: 'bg-amber-50',    activeBg: 'bg-amber-100',   textColor: 'text-amber-700',   dot: 'bg-amber-400'   },
  { level: 'mastered',  label: '已掌握', color: 'bg-emerald-500', bg: 'bg-emerald-50',  activeBg: 'bg-emerald-100', textColor: 'text-emerald-700', dot: 'bg-emerald-500' },
]

interface Props {
  allWords: UserVocabProgress[]
  studentName: string
  hasLinkedStudent: boolean
}

export default function MasteryWordList({ allWords, studentName, hasLinkedStudent }: Props) {
  const [selected, setSelected] = useState<MasteryLevel | null>(null)

  const totalVocab = allWords.length

  const bars: MasteryBar[] = BARS.map(b => ({
    ...b,
    count: allWords.filter(w => w.mastery_level === b.level).length,
  }))

  const filteredWords = selected
    ? allWords.filter(w => w.mastery_level === selected)
    : []

  const repeatedMistakes = allWords.filter(w => w.mistake_count >= 3 && w.mastery_level !== 'mastered')

  const toggle = (level: MasteryLevel) =>
    setSelected(prev => (prev === level ? null : level))

  return (
    <div className="flex flex-col gap-6">

      {/* ── Mastery breakdown ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h2 className="font-semibold text-gray-700 text-sm mb-4">词语掌握分布</h2>

        {/* Stacked bar */}
        <div className="flex rounded-full overflow-hidden h-3 mb-4">
          {bars.map(bar =>
            bar.count > 0 ? (
              <div
                key={bar.level}
                className={`${bar.color} transition-all`}
                style={{ width: `${(bar.count / totalVocab) * 100}%` }}
              />
            ) : null
          )}
        </div>

        {/* Clickable tiles */}
        <div className="grid grid-cols-2 gap-2">
          {bars.map(bar => {
            const active = selected === bar.level
            return (
              <button
                key={bar.level}
                onClick={() => toggle(bar.level)}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition-all text-left
                  ${active ? `${bar.activeBg} ring-2 ring-offset-1 ring-current ${bar.textColor}` : bar.bg}
                  ${bar.count === 0 ? 'opacity-40 cursor-default' : 'cursor-pointer hover:brightness-95'}`}
                disabled={bar.count === 0}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${bar.dot}`} />
                  <span className={`text-xs chinese-text ${active ? bar.textColor : 'text-gray-600'}`}>
                    {bar.label}
                  </span>
                  {active && <span className="text-xs">▾</span>}
                </div>
                <span className={`text-sm font-bold ${active ? bar.textColor : 'text-gray-700'}`}>
                  {bar.count}
                </span>
              </button>
            )
          })}
        </div>

        <p className="text-xs text-gray-400 text-center mt-3">共接触 {totalVocab} 个词语</p>

        {/* Inline word list for selected category */}
        {selected && filteredWords.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-3">
              {bars.find(b => b.level === selected)?.label} · {filteredWords.length} 个词语
            </p>
            <div className="flex flex-col gap-2">
              {filteredWords.map(wp => {
                const vocab = wp.vocabulary
                if (!vocab) return null
                return (
                  <div
                    key={wp.id}
                    className="flex items-start justify-between gap-3 py-2 border-b border-gray-50 last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold text-gray-800 chinese-text">{vocab.word}</span>
                        {vocab.pinyin && (
                          <span className="text-xs text-gray-400">{vocab.pinyin}</span>
                        )}
                      </div>
                      {vocab.meaning_zh && (
                        <p className="text-xs text-gray-500 chinese-text mt-0.5 truncate">{vocab.meaning_zh}</p>
                      )}
                      {wp.mistake_count > 0 && (
                        <p className="text-xs text-red-400 mt-0.5">答错 {wp.mistake_count} 次</p>
                      )}
                    </div>
                    <MasteryBadge level={wp.mastery_level} size="sm" />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Weak words needing attention (non-selected state) ────── */}
      {!selected && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-700 text-sm mb-4">
            需要关注的词语
            {allWords.filter(w => w.mastery_level !== 'mastered').length > 0 && (
              <span className="ml-2 text-xs text-gray-400">
                （共 {allWords.filter(w => w.mastery_level !== 'mastered').length} 个）
              </span>
            )}
          </h2>

          {allWords.filter(w => w.mastery_level !== 'mastered').length === 0 ? (
            <div className="text-center py-6">
              <div className="text-3xl mb-2">🎉</div>
              <p className="text-gray-400 text-sm chinese-text">
                {hasLinkedStudent ? studentName : '你'}还没有答错的词语
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {allWords
                .filter(w => w.mastery_level !== 'mastered')
                .slice(0, 20)
                .map(wp => {
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
      )}

      {/* ── Repeated mistakes ─────────────────────────────────────── */}
      {!selected && repeatedMistakes.length > 0 && (
        <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
          <h2 className="font-semibold text-red-700 text-sm mb-3 flex items-center gap-1.5">
            <span>⚠️</span> 反复答错的词语
          </h2>
          <div className="flex flex-wrap gap-2">
            {repeatedMistakes.map(wp => (
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
    </div>
  )
}
