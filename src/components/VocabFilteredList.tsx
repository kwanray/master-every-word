'use client'

import { useState } from 'react'
import { UserVocabProgress } from '@/types'
import WordBankItem from './WordBankItem'

type Bucket = 'due' | 'weak' | 'improving' | 'mastered'

interface Groups {
  due: UserVocabProgress[]
  weak: UserVocabProgress[]
  improving: UserVocabProgress[]
  mastered: UserVocabProgress[]
}

interface Props {
  groups: Groups
  total: number
}

const TILES: {
  key: Bucket
  icon: string
  label: string
  color: string
  bg: string
  activeBg: string
  textColor: string
  dot: string
  barColor: string
}[] = [
  {
    key: 'due',
    icon: '⏰',
    label: '待复习',
    color: 'bg-amber-400',
    bg: 'bg-amber-50',
    activeBg: 'bg-amber-100',
    textColor: 'text-amber-700',
    dot: 'bg-amber-400',
    barColor: 'bg-amber-400',
  },
  {
    key: 'weak',
    icon: '📌',
    label: '需加强',
    color: 'bg-red-400',
    bg: 'bg-red-50',
    activeBg: 'bg-red-100',
    textColor: 'text-red-700',
    dot: 'bg-red-400',
    barColor: 'bg-red-400',
  },
  {
    key: 'improving',
    icon: '📈',
    label: '进步中',
    color: 'bg-brand-400',
    bg: 'bg-brand-50',
    activeBg: 'bg-brand-100',
    textColor: 'text-brand-700',
    dot: 'bg-brand-400',
    barColor: 'bg-brand-400',
  },
  {
    key: 'mastered',
    icon: '🏆',
    label: '已掌握',
    color: 'bg-emerald-500',
    bg: 'bg-emerald-50',
    activeBg: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    dot: 'bg-emerald-500',
    barColor: 'bg-emerald-500',
  },
]

export default function VocabFilteredList({ groups, total }: Props) {
  const [selected, setSelected] = useState<Bucket | null>(null)

  const counts: Record<Bucket, number> = {
    due:       groups.due.length,
    weak:      groups.weak.length,
    improving: groups.improving.length,
    mastered:  groups.mastered.length,
  }

  const toggle = (key: Bucket) => setSelected(prev => prev === key ? null : key)

  const selectedWords = selected ? groups[selected] : []

  return (
    <div className="flex flex-col gap-5">

      {/* ── Summary tiles ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">

        {/* Stacked bar */}
        {total > 0 && (
          <div className="flex rounded-full overflow-hidden h-3 mb-4">
            {TILES.map(t =>
              counts[t.key] > 0 ? (
                <div
                  key={t.key}
                  className={`${t.barColor} transition-all`}
                  style={{ width: `${(counts[t.key] / total) * 100}%` }}
                />
              ) : null
            )}
          </div>
        )}

        {/* Tiles */}
        <div className="grid grid-cols-2 gap-2">
          {TILES.map(t => {
            const active = selected === t.key
            const empty = counts[t.key] === 0
            return (
              <button
                key={t.key}
                onClick={() => toggle(t.key)}
                disabled={empty}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition-all text-left
                  ${active ? `${t.activeBg} ring-2 ring-offset-1 ring-current ${t.textColor}` : t.bg}
                  ${empty ? 'opacity-40 cursor-default' : 'cursor-pointer hover:brightness-95'}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${t.dot}`} />
                  <span className={`text-xs chinese-text ${active ? t.textColor : 'text-gray-600'}`}>
                    {t.icon} {t.label}
                  </span>
                  {active && <span className="text-xs">▾</span>}
                </div>
                <span className={`text-sm font-bold ${active ? t.textColor : 'text-gray-700'}`}>
                  {counts[t.key]}
                </span>
              </button>
            )
          })}
        </div>

        <p className="text-xs text-gray-400 text-center mt-3">共 {total} 个词语</p>

        {/* Inline word list for selected tile */}
        {selected && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {selectedWords.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4 chinese-text">
                这个分类暂时没有词语
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {selectedWords.map(p => (
                  <WordBankItem key={p.id} progress={p} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Default all-groups view (when nothing selected) ──────── */}
      {!selected && (
        <>
          {total === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
              <div className="text-3xl mb-2">📭</div>
              <p className="text-gray-400 text-sm chinese-text">
                完成每日任务后，练习过的词语会出现在这里
              </p>
            </div>
          ) : (
            TILES.map(t => {
              const items = groups[t.key]
              if (items.length === 0) return null
              return (
                <section key={t.key}>
                  <h2 className={`text-sm font-semibold mb-3 flex items-center gap-1.5 ${t.textColor}`}>
                    <span>{t.icon}</span>
                    {t.label}
                    <span className="text-xs font-normal text-gray-400 ml-1">({items.length})</span>
                  </h2>
                  <div className="flex flex-col gap-3">
                    {items.map(p => (
                      <WordBankItem key={p.id} progress={p} />
                    ))}
                  </div>
                </section>
              )
            })
          )}
        </>
      )}
    </div>
  )
}
