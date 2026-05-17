import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { request_id } = await request.json()
  if (!request_id) return NextResponse.json({ error: 'Missing request_id' }, { status: 400 })

  const serviceClient = createServiceClient()

  // Verify this request belongs to the current student
  const { data: linkRequest } = await serviceClient
    .from('parent_link_requests')
    .select('id, parent_id, student_id')
    .eq('id', request_id)
    .eq('student_id', user.id)
    .maybeSingle()

  if (!linkRequest) {
    return NextResponse.json({ error: '请求不存在' }, { status: 404 })
  }

  // Link the parent to this student and delete the request
  const [linkResult] = await Promise.all([
    serviceClient
      .from('profiles')
      .update({ linked_student_id: linkRequest.student_id })
      .eq('id', linkRequest.parent_id),
    serviceClient
      .from('parent_link_requests')
      .delete()
      .eq('id', request_id),
  ])

  if (linkResult.error) {
    return NextResponse.json({ error: linkResult.error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
