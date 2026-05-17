import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { request_id } = await request.json()
  if (!request_id) return NextResponse.json({ error: 'Missing request_id' }, { status: 400 })

  // Delete only if it belongs to this student
  const { error } = await createServiceClient()
    .from('parent_link_requests')
    .delete()
    .eq('id', request_id)
    .eq('student_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
