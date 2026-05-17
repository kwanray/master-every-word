'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Step = 'email' | 'code'

export default function LinkStudentForm() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/parent/send-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? '发送失败，请重试')
      return
    }

    setStep('code')
  }

  const handleLinkAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/parent/link-student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? '关联失败，请重试')
      return
    }

    router.refresh()
  }

  const handleBack = () => {
    setStep('email')
    setCode('')
    setError(null)
  }

  if (step === 'code') {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">📧</div>
          <h2 className="text-lg font-bold text-gray-800 chinese-text">输入邀请码</h2>
          <p className="text-gray-400 text-sm mt-2 chinese-text leading-relaxed">
            验证码已发送至学生邮箱。<br />
            请让孩子查看邮件并告诉你 6 位验证码。
          </p>
        </div>

        <form onSubmit={handleLinkAccount} className="flex flex-col gap-3">
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
            placeholder="例如：A3B7X2"
            maxLength={6}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-widest text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent uppercase"
          />

          {error && (
            <p className="text-red-500 text-sm text-center chinese-text">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? '验证中...' : '关联账户'}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          没有收到邮件？{' '}
          <button
            onClick={handleBack}
            className="text-brand-500 hover:text-brand-700 underline underline-offset-2"
          >
            重新发送
          </button>
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">👨‍👧</div>
        <h2 className="text-lg font-bold text-gray-800 chinese-text">关联学生账户</h2>
        <p className="text-gray-400 text-sm mt-2 chinese-text leading-relaxed">
          输入孩子的登录邮件地址，系统将向学生发送验证码
        </p>
      </div>

      <form onSubmit={handleSendCode} className="flex flex-col gap-3">
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
          {loading ? '发送中...' : '发送验证码'}
        </button>
      </form>

      <p className="text-xs text-gray-400 text-center mt-4 chinese-text">
        孩子需要先以学生身份在这个应用上注册账户
      </p>
    </div>
  )
}
