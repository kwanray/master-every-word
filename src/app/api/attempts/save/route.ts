import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { computeNextReview } from '@/lib/spaced-repetition'
import { AIExplanation, MasteryLevel } from '@/types'

interface SaveAttemptBody {
  question_id: string
  vocab_id?: string | null
  selected_answer: string
  is_correct: boolean
  ai_explanation?: AIExplanation | null
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body: SaveAttemptBody = await request.json()
  const { question_id, vocab_id, selected_answer, is_correct, ai_explanation } = body

  // Save the attempt
  const { error: attemptError } = await supabase.from('attempts').insert({
    user_id: user.id,
    question_id,
    selected_answer,
    is_correct,
    ai_explanation: ai_explanation ?? null,
  })

  if (attemptError) {
    return NextResponse.json({ error: attemptError.message }, { status: 500 })
  }

  // Update vocab progress if this question tests a specific word
  if (vocab_id) {
    // Get or create progress record
    const { data: existing } = await supabase
      .from('user_vocab_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('vocab_id', vocab_id)
      .single()

    const currentLevel: MasteryLevel = (existing?.mastery_level as MasteryLevel) ?? 'new'
    const currentStreak: number = existing?.correct_streak ?? 0
    const currentMistakes: number = existing?.mistake_count ?? 0

    const { mastery_level, correct_streak, next_review_at } = computeNextReview(
      currentLevel,
      is_correct,
      currentStreak
    )

    const upsertData = {
      user_id: user.id,
      vocab_id,
      mastery_level,
      correct_streak,
      mistake_count: is_correct ? currentMistakes : currentMistakes + 1,
      last_attempt_at: new Date().toISOString(),
      next_review_at: next_review_at.toISOString(),
    }

    if (existing) {
      await supabase
        .from('user_vocab_progress')
        .update(upsertData)
        .eq('id', existing.id)
    } else {
      await supabase.from('user_vocab_progress').insert(upsertData)
    }
  }

  return NextResponse.json({ ok: true })
}
