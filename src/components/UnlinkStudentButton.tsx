'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UnlinkStudentButton({ studentName }: { studentName: string }) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleUnlink = async () => {
    setLoading(true)
    const res = await fetch('/api/parent/link-student', { method: 'DELETE' })
    if (res.ok) {
      router.refresh()
    } else {
      setLoading(false)
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 chinese-text">确认解除与 {studentName} 的关联？</span>
        <button
          onClick={handleUnlink}
          disabled={loading}
          className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
        >
          {loading ? '处理中...' : '确认'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          取消
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
    >
      更换学生
    </button>
  )
}
