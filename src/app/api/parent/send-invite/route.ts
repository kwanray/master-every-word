import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no confusable chars (0/O, 1/I)
  let code = ''
  const bytes = crypto.randomBytes(6)
  for (let i = 0; i < 6; i++) {
    code += chars[bytes[i] % chars.length]
  }
  return code
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role !== 'parent') {
    return NextResponse.json({ error: '只有家长账户可以发送邀请码' }, { status: 403 })
  }

  const { email } = await request.json()
  if (!email?.trim()) {
    return NextResponse.json({ error: '请输入学生的邮件地址' }, { status: 400 })
  }

  const serviceClient = createServiceClient()

  // Find student by email
  let studentAuthId: string | null = null
  let studentEmail: string | null = null
  let page = 1
  const perPage = 1000

  while (!studentAuthId) {
    const { data: userList, error } = await serviceClient.auth.admin.listUsers({ page, perPage })
    if (error || !userList) {
      return NextResponse.json({ error: '查找失败，请重试' }, { status: 500 })
    }
    const match = userList.users.find(
      (u: { id: string; email?: string }) =>
        u.email?.toLowerCase() === email.toLowerCase().trim()
    )
    if (match) {
      studentAuthId = match.id
      studentEmail = match.email ?? null
      break
    }
    if (userList.users.length < perPage) break
    page++
  }

  if (!studentAuthId || !studentEmail) {
    return NextResponse.json({ error: '找不到该邮件地址的账户' }, { status: 404 })
  }

  if (studentAuthId === user.id) {
    return NextResponse.json({ error: '不能关联自己的账户' }, { status: 400 })
  }

  const { data: studentProfile } = await serviceClient
    .from('profiles')
    .select('name, role')
    .eq('id', studentAuthId)
    .maybeSingle()

  if (!studentProfile) {
    return NextResponse.json({ error: '找不到该用户的资料' }, { status: 404 })
  }

  if (studentProfile.role !== 'student') {
    return NextResponse.json({ error: '该账户不是学生账户，请输入学生的邮件地址' }, { status: 400 })
  }

  // Clean up any existing unused codes for this student
  await serviceClient
    .from('parent_invite_codes')
    .delete()
    .eq('student_id', studentAuthId)
    .is('used_at', null)

  const code = generateCode()

  const { error: insertError } = await serviceClient
    .from('parent_invite_codes')
    .insert({ code, student_id: studentAuthId })

  if (insertError) {
    return NextResponse.json({ error: '生成邀请码失败，请重试' }, { status: 500 })
  }

  const studentName = studentProfile.name ?? '同学'
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'

  const { error: emailError } = await resend.emails.send({
    from: `字字通 <${fromEmail}>`,
    to: studentEmail,
    subject: '家长邀请码 - 字字通',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
        <h2 style="color: #1f2937; margin-bottom: 8px;">你好，${studentName}！</h2>
        <p style="color: #6b7280; margin-bottom: 24px;">
          你的家长正在申请查看你在<strong>字字通</strong>上的学习报告。<br>
          请将以下 6 位邀请码告诉你的家长：
        </p>
        <div style="background: #f3f4f6; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #4f46e5;">${code}</span>
        </div>
        <p style="color: #9ca3af; font-size: 14px;">
          此验证码将在 <strong>24 小时</strong>后失效。<br>
          如果你不认识这位家长，请忽略此邮件。
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
        <p style="color: #d1d5db; font-size: 12px; text-align: center;">— 字字通团队</p>
      </div>
    `,
  })

  if (emailError) {
    // Roll back the code if email failed
    await serviceClient.from('parent_invite_codes').delete().eq('code', code)
    return NextResponse.json({ error: '发送邮件失败，请重试' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
