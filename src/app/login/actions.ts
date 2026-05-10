'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function createActionClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
          )
        },
      },
    }
  )
}

export async function signIn(email: string, password: string): Promise<{ error?: string }> {
  const supabase = createActionClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  return {}
}

export async function signUp(
  email: string,
  password: string,
  name: string,
  role: 'student' | 'parent'
): Promise<{ error?: string; message?: string }> {
  const supabase = createActionClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })
  if (error) return { error: error.message }
  return { message: '账户已创建！请检查邮箱确认注册，或直接登录。' }
}
