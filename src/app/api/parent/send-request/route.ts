import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

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
    return NextResponse.json({ error: '只有家长账户可以发送关联请求' }, { status: 403 })
  }

  const { email } = await request.json()
  if (!email?.trim()) {
    return NextResponse.json({ error: '请输入学生的邮件地址' }, { status: 400 })
  }

  const serviceClient = createServiceClient()

  // Find student by email via admin API
  let studentAuthId: string | null = null
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
    if (match) { studentAuthId = match.id; break }
    if (userList.users.length < perPage) break
    page++
  }

  if (!studentAuthId) {
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

  // Upsert so re-sending to the same student doesn't fail
  const { error: insertError } = await serviceClient
    .from('parent_link_requests')
    .upsert({ parent_id: user.id, student_id: studentAuthId }, { onConflict: 'parent_id,student_id' })

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, student_name: studentProfile.name })
}

export async function DELETE() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await createServiceClient()
    .from('parent_link_requests')
    .delete()
    .eq('parent_id', user.id)

  return NextResponse.json({ ok: true })
}
