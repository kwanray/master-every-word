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
    return NextResponse.json({ error: '只有家长账户可以关联学生' }, { status: 403 })
  }

  const { code } = await request.json()
  if (!code?.trim()) {
    return NextResponse.json({ error: '请输入邀请码' }, { status: 400 })
  }

  const serviceClient = createServiceClient()

  // Find a valid, unused, unexpired invite code
  const { data: invite, error: inviteError } = await serviceClient
    .from('parent_invite_codes')
    .select('id, student_id')
    .eq('code', code.toUpperCase().trim())
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (inviteError || !invite) {
    return NextResponse.json({ error: '邀请码无效或已过期' }, { status: 400 })
  }

  const { student_id: studentId } = invite

  if (studentId === user.id) {
    return NextResponse.json({ error: '不能关联自己的账户' }, { status: 400 })
  }

  // Get student name for the response
  const { data: studentProfile } = await serviceClient
    .from('profiles')
    .select('name')
    .eq('id', studentId)
    .maybeSingle()

  // Link parent to student and mark the code as used
  const [linkResult] = await Promise.all([
    supabase
      .from('profiles')
      .update({ linked_student_id: studentId })
      .eq('id', user.id),
    serviceClient
      .from('parent_invite_codes')
      .update({ used_at: new Date().toISOString() })
      .eq('id', invite.id),
  ])

  if (linkResult.error) {
    return NextResponse.json({ error: linkResult.error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, student_name: studentProfile?.name ?? '学生' })
}

export async function DELETE() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('profiles')
    .update({ linked_student_id: null })
    .eq('id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
