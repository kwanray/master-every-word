import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: myProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (myProfile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { user_id, new_role } = await request.json()
  if (!user_id || !['student', 'parent'].includes(new_role)) {
    return NextResponse.json({ error: 'Invalid user_id or role' }, { status: 400 })
  }

  const service = createServiceClient()

  // When switching to student: clear linked_student_id (students don't link to others)
  // When switching to parent: clear any parents who had this user as their linked student
  const updates: Record<string, unknown> = { role: new_role }
  if (new_role === 'student') updates.linked_student_id = null

  const { error } = await service
    .from('profiles')
    .update(updates)
    .eq('id', user_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // If switching to parent, remove this user from any parent's linked_student_id
  if (new_role === 'parent') {
    await service
      .from('profiles')
      .update({ linked_student_id: null })
      .eq('linked_student_id', user_id)
  }

  return NextResponse.json({ ok: true })
}
