'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LinkStudentForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/parent/link-student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? '关联失败，请重试')
      setLoading(false)
      return
    }

    router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">👨‍👧</div>
        <h2 className="text-lg font-bold text-gray-800 chinese-text">关联学生账户</h2>
        <p className="text-gray-400 text-sm mt-2 chinese-text leading-relaxed">
          输入孩子的登录邮件地址，即可查看他们的学习报告
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="学生的邮件地址"
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
        />

        {error && (
          <p className="text-red-500 text-sm text-center chinese-text">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? '查找中...' : '关联学生'}
        </button>
      </form>

      <p className="text-xs text-gray-400 text-center mt-4 chinese-text">
        孩子需要先以学生身份在这个应用上注册账户
      </p>
    </div>
  )
}
