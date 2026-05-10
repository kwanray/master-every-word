import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { session_id, total_questions, correct_questions } = await request.json()

  const { error } = await supabase
    .from('daily_sessions')
    .update({
      completed: true,
      total_questions,
      correct_questions,
    })
    .eq('id', session_id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Calculate streak
  const { data: sessions } = await supabase
    .from('daily_sessions')
    .select('session_date')
    .eq('user_id', user.id)
    .eq('completed', true)
    .order('session_date', { ascending: false })
    .limit(30)

  let streak = 0
  if (sessions && sessions.length > 0) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    let checkDate = today

    for (const s of sessions) {
      const sessionDay = new Date(s.session_date)
      sessionDay.setHours(0, 0, 0, 0)
      const diff = Math.round((checkDate.getTime() - sessionDay.getTime()) / (1000 * 60 * 60 * 24))

      if (diff === 0 || diff === 1) {
        streak++
        checkDate = sessionDay
      } else {
        break
      }
    }
  }

  return NextResponse.json({ ok: true, streak })
}
