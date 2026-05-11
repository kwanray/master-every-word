'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { signUp } from './actions'
import { Suspense } from 'react'

type Mode = 'signin' | 'signup'

function LoginPageInner() {
  const searchParams = useSearchParams()
  const oauthError = searchParams.get('error') === 'oauth'

  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'student' | 'parent'>('student')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const getSupabase = () => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError(null)
    const supabase = getSupabase()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    // page navigates away — no need to reset loading
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      if (mode === 'signup') {
        const result = await signUp(email, password, name, role)
        if (result.error) setError(result.error)
        else if (result.message) {
          setMessage(result.message)
          setMode('signin')
        }
      } else {
        const supabase = getSupabase()
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) {
          setError(signInError.message)
        } else {
          console.log('[login] session user:', data.session?.user?.id)
          console.log('[login] document.cookie:', document.cookie)
          console.log('[login] localStorage keys:', Object.keys(localStorage))
          window.location.href = '/dashboard'
        }
      }
    } catch {
      setError('发生错误，请重试。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-600 to-brand-800 flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-white chinese-text mb-2">字字通</h1>
        <p className="text-brand-200 text-sm chinese-text">每天一点点，错词变熟词</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
          {mode === 'signin' ? '登录' : '创建账户'}
        </h2>

        {oauthError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4">
            Google 登录失败，请重试。
          </div>
        )}

        {message && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl p-3 mb-4">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4">
            {error}
          </div>
        )}

        {/* Google sign-in */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 transition-colors"
        >
          {googleLoading ? (
            <span className="text-gray-400">请等候…</span>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
                <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
                <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
                <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">或使用电子邮件</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  姓名
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="输入你的姓名"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  身份
                </label>
                <div className="flex gap-3">
                  {(['student', 'parent'] as const).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-colors ${
                        role === r
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {r === 'student' ? '🎓 学生' : '👨‍👧 家长'}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              电子邮件
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="最少 6 位"
              required
              minLength={6}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 text-white font-semibold py-3.5 rounded-xl transition-colors mt-2"
          >
            {loading ? '请等候…' : mode === 'signin' ? '登录' : '创建账户'}
          </button>
        </form>

        <div className="text-center mt-5">
          <button
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin')
              setError(null)
              setMessage(null)
            }}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            {mode === 'signin' ? '还没有账户？注册' : '已有账户？登录'}
          </button>
        </div>
      </div>

      <p className="mt-8 text-brand-300 text-xs text-center">
        Singapore O-Level Chinese · Sec 4 Express · Syllabus 1160
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  )
}
