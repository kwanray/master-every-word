import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { MissionData, Question } from '@/types'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date().toISOString().split('T')[0]

  // Upsert daily session
  const { data: session, error: sessionError } = await supabase
    .from('daily_sessions')
    .upsert(
      { user_id: user.id, session_date: today, completed: false },
      { onConflict: 'user_id,session_date', ignoreDuplicates: false }
    )
    .select()
    .single()

  if (sessionError) {
    return NextResponse.json({ error: sessionError.message }, { status: 500 })
  }

  // ─── 1. Vocab review questions ───────────────────────────────────────────────
  // Find words due for review (mastery != mastered, next_review_at <= now)
  const { data: dueVocab } = await supabase
    .from('user_vocab_progress')
    .select('vocab_id')
    .eq('user_id', user.id)
    .neq('mastery_level', 'mastered')
    .lte('next_review_at', new Date().toISOString())
    .limit(10)

  const dueVocabIds = (dueVocab ?? []).map(v => v.vocab_id)

  // Get questions that test these vocab words
  let vocabQuestions: Question[] = []

  if (dueVocabIds.length > 0) {
    const { data: vq } = await supabase
      .from('questions')
      .select('*')
      .in('tested_vocab_id', dueVocabIds)
      .in('type', ['vocab_mcq', 'cloze_mcq'])
      .limit(10)

    if (vq) vocabQuestions = vq as Question[]
  }

  // If we still need more vocab questions, grab random ones
  if (vocabQuestions.length < 5) {
    const existingIds = vocabQuestions.map(q => q.id)
    const needed = 5 - vocabQuestions.length
    const { data: extra } = await supabase
      .from('questions')
      .select('*')
      .in('type', ['vocab_mcq', 'cloze_mcq'])
      .not('id', 'in', `(${existingIds.length > 0 ? existingIds.join(',') : '00000000-0000-0000-0000-000000000000'})`)
      .limit(needed * 2)

    if (extra) {
      const shuffled = (extra as Question[]).sort(() => Math.random() - 0.5)
      vocabQuestions = [...vocabQuestions, ...shuffled.slice(0, needed)]
    }
  }

  vocabQuestions = vocabQuestions.slice(0, 5)

  // ─── 2. MCQ practice questions ───────────────────────────────────────────────
  const vocabQIds = vocabQuestions.map(q => q.id)

  const { data: mcqRaw } = await supabase
    .from('questions')
    .select('*')
    .in('type', ['vocab_mcq', 'cloze_mcq'])
    .not('id', 'in', `(${[...vocabQIds, '00000000-0000-0000-0000-000000000000'].join(',')})`)
    .limit(20)

  const mcqQuestions: Question[] = ((mcqRaw ?? []) as Question[])
    .sort(() => Math.random() - 0.5)
    .slice(0, 5)

  // ─── 3. Comprehension questions ──────────────────────────────────────────────
  const { data: compre } = await supabase
    .from('questions')
    .select('*')
    .eq('type', 'compre_mcq')
    .limit(3)

  const comprehensionQuestions = (compre ?? []) as Question[]

  const firstPassage = comprehensionQuestions[0] ?? null

  const mission: MissionData = {
    session_id: session.id,
    vocab_questions: vocabQuestions,
    mcq_questions: mcqQuestions,
    comprehension_passage: firstPassage?.passage ?? null,
    comprehension_title: firstPassage?.passage_title ?? null,
    comprehension_questions: comprehensionQuestions,
  }

  return NextResponse.json(mission)
}
