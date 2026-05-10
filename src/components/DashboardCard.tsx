import clsx from 'clsx'

interface Props {
  icon: string
  label: string
  value: string | number
  sub?: string
  color?: 'brand' | 'emerald' | 'amber' | 'red' | 'gray'
}

export default function DashboardCard({ icon, label, value, sub, color = 'gray' }: Props) {
  const colorMap = {
    brand: 'bg-brand-50 border-brand-100',
    emerald: 'bg-emerald-50 border-emerald-100',
    amber: 'bg-amber-50 border-amber-100',
    red: 'bg-red-50 border-red-100',
    gray: 'bg-white border-gray-100',
  }

  const valueColorMap = {
    brand: 'text-brand-700',
    emerald: 'text-emerald-700',
    amber: 'text-amber-700',
    red: 'text-red-600',
    gray: 'text-gray-800',
  }

  return (
    <div className={clsx('rounded-xl p-4 border shadow-sm', colorMap[color])}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{icon}</span>
      </div>
      <div className={clsx('text-2xl font-bold', valueColorMap[color])}>{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  )
}
