'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  requestId: string
  parentName: string
}

export default function LinkRequestNotification({ requestId, parentName }: Props) {
  const [loading, setLoading] = useState<'accept' | 'reject' | null>(null)
  const router = useRouter()

  const respond = async (action: 'accept' | 'reject') => {
    setLoading(action)
    const res = await fetch(`/api/student/${action}-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ request_id: requestId }),
    })
    setLoading(null)
    if (res.ok) router.refresh()
  }

  return (
    <div className="bg-brand-50 rounded-2xl p-4 border border-brand-100 flex items-start gap-3">
      <span className="text-2xl">👨‍👧</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-brand-800 chinese-text">
          家长关联请求
        </p>
        <p className="text-xs text-brand-600 mt-0.5 chinese-text">
          <span className="font-medium">{parentName}</span> 请求查看你的学习报告
        </p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => respond('accept')}
            disabled={loading !== null}
            className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {loading === 'accept' ? '处理中...' : '接受'}
          </button>
          <button
            onClick={() => respond('reject')}
            disabled={loading !== null}
            className="bg-white hover:bg-gray-50 disabled:opacity-50 text-gray-600 text-xs font-medium px-4 py-2 rounded-lg border border-gray-200 transition-colors"
          >
            {loading === 'reject' ? '处理中...' : '拒绝'}
          </button>
        </div>
      </div>
    </div>
  )
}
