import { MasteryLevel } from '@/types'
import { getMasteryLabel, getMasteryColor } from '@/lib/spaced-repetition'
import clsx from 'clsx'

interface Props {
  level: MasteryLevel
  size?: 'sm' | 'md'
}

export default function MasteryBadge({ level, size = 'md' }: Props) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        getMasteryColor(level),
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      {getMasteryLabel(level)}
    </span>
  )
}
