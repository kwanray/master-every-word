import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

async function requireAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  return profile?.role === 'admin' ? user : null
}

// POST: assign a student to a parent
export async function POST(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { parent_id, student_id } = await request.json()
  if (!parent_id || !student_id) {
    return NextResponse.json({ error: 'Missing parent_id or student_id' }, { status: 400 })
  }

  const { error } = await createServiceClient()
    .from('profiles')
    .update({ linked_student_id: student_id })
    .eq('id', parent_id)
    .eq('role', 'parent')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// DELETE: remove a parent's linked student
export async function DELETE(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { parent_id } = await request.json()
  if (!parent_id) return NextResponse.json({ error: 'Missing parent_id' }, { status: 400 })

  const { error } = await createServiceClient()
    .from('profiles')
    .update({ linked_student_id: null })
    .eq('id', parent_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
