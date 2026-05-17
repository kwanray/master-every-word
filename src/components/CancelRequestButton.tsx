'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CancelRequestButton() {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCancel = async () => {
    setLoading(true)
    const res = await fetch('/api/parent/send-request', { method: 'DELETE' })
    setLoading(false)
    if (res.ok) router.refresh()
    else setConfirming(false)
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">确认取消请求？</span>
        <button
          onClick={handleCancel}
          disabled={loading}
          className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
        >
          {loading ? '处理中...' : '确认'}
        </button>
        <button onClick={() => setConfirming(false)} className="text-xs text-gray-400 hover:text-gray-600">
          返回
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
    >
      取消请求
    </button>
  )
}
