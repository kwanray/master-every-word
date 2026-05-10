'use client'

import { useState } from 'react'
import { UserVocabProgress } from '@/types'
import WordBankItem from './WordBankItem'

type Bucket = 'all' | 'due' | 'weak' | 'improving' | 'mastered'

interface Groups {
  due: UserVocabProgress[]
  weak: UserVocabProgress[]   // new + weak combined
  improving: UserVocabProgress[]
  mastered: UserVocabProgress[]
}

interface Props {
  groups: Groups
  total: number
}

const TABS: { key: Bucket; icon: string; label: string }[] = [
  { key: 'all',      icon: '📚', label: '全部' },
  { key: 'due',      icon: '⏰', label: '待复习' },
  { key: 'weak',     icon: '📌', label: '需加强' },
  { key: 'improving',icon: '📈', label: '进步中' },
  { key: 'mastered', icon: '🏆', label: '已掌握' },
]

export default function VocabFilteredList({ groups, total }: Props) {
  const [active, setActive] = useState<Bucket>('all')

  const allWords = [...groups.due, ...groups.weak, ...groups.improving, ...groups.mastered]

  const counts: Record<Bucket, number> = {
    all: total,
    due: groups.due.length,
    weak: groups.weak.length,
    improving: groups.improving.length,
    mastered: groups.mastered.length,
  }

  const visibleGroups: { icon: string; label: string; color: string; items: UserVocabProgress[] }[] =
    active === 'all'
      ? [
          { icon: '⏰', label: '今天待复习', color: 'text-amber-600', items: groups.due },
          { icon: '📌', label: '需要加强',   color: 'text-red-500',   items: groups.weak },
          { icon: '📈', label: '进步中',     color: 'text-amber-600', items: groups.improving },
          { icon: '🏆', label: '已掌握',     color: 'text-emerald-600', items: groups.mastered },
        ].filter(g => g.items.length > 0)
      : active === 'due'
      ? [{ icon: '⏰', label: '今天待复习', color: 'text-amber-600', items: groups.due }]
      : active === 'weak'
      ? [{ icon: '📌', label: '需要加强', color: 'text-red-500', items: groups.weak }]
      : active === 'improving'
      ? [{ icon: '📈', label: '进步中', color: 'text-amber-600', items: groups.improving }]
      : [{ icon: '🏆', label: '已掌握', color: 'text-emerald-600', items: groups.mastered }]

  const isEmpty = active === 'all' ? total === 0 : counts[active] === 0

  return (
    <div className="flex flex-col gap-5">
      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
        {TABS.map(tab => {
          const count = counts[tab.key]
          const isActive = active === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                isActive
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Word list */}
      {isEmpty ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
          <div className="text-3xl mb-2">
            {active === 'mastered' ? '🎉' : active === 'due' ? '✅' : '📭'}
          </div>
          <p className="text-gray-400 text-sm chinese-text">
            {active === 'all'
              ? '完成每日任务后，练习过的词语会出现在这里'
              : active === 'due'
              ? '今天没有待复习的词语，继续保持！'
              : active === 'mastered'
              ? '还没有已掌握的词语，继续努力！'
              : '这个分类暂时没有词语'}
          </p>
        </div>
      ) : (
        visibleGroups.map(group => (
          group.items.length > 0 && (
            <section key={group.label}>
              {active === 'all' && (
                <h2 className={`text-sm font-semibold mb-3 flex items-center gap-1.5 ${group.color}`}>
                  <span>{group.icon}</span>
                  {group.label} ({group.items.length})
                </h2>
              )}
              <div className="flex flex-col gap-3">
                {group.items.map(p => (
                  <WordBankItem key={p.id} progress={p} />
                ))}
              </div>
            </section>
          )
        ))
      )}
    </div>
  )
}
