import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateExplanation } from '@/lib/ai'
import { QuestionOption } from '@/types'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const {
    question_text,
    options,
    student_answer,
    correct_answer,
    tested_word,
    explanation_en,
    explanation_zh,
  }: {
    question_text: string
    options: QuestionOption[]
    student_answer: string
    correct_answer: string
    tested_word?: string | null
    explanation_en?: string | null
    explanation_zh?: string | null
  } = body

  if (!question_text || !options || !student_answer || !correct_answer) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const explanation = await generateExplanation({
    question_text,
    options,
    student_answer,
    correct_answer,
    tested_word,
    explanation_en,
    explanation_zh,
  })

  return NextResponse.json(explanation)
}
