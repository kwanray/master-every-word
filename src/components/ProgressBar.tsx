import clsx from 'clsx'

interface Props {
  value: number  // 0-100
  color?: 'brand' | 'emerald' | 'amber' | 'red'
  size?: 'sm' | 'md'
  showLabel?: boolean
  label?: string
}

export default function ProgressBar({
  value,
  color = 'brand',
  size = 'md',
  showLabel = false,
  label,
}: Props) {
  const clamped = Math.max(0, Math.min(100, value))

  const bgColor = {
    brand: 'bg-brand-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  }[color]

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{label ?? '进度'}</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div
        className={clsx(
          'w-full bg-gray-100 rounded-full overflow-hidden',
          size === 'sm' ? 'h-1.5' : 'h-2.5'
        )}
      >
        <div
          className={clsx('h-full rounded-full transition-all duration-500', bgColor)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
