import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { MissionData, Question } from '@/types'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const TOPICS = [
  '品格与价值观',
  '家庭与人际关系',
  '学校与学习',
  '社会与公民',
  '环境保护',
  '科技与创新',
  '健康与生活',
  '文化与传统',
]

interface AIOption { key: string; text: string }

interface AIVocabQuestion {
  word: string
  pinyin: string
  meaning_en: string
  meaning_zh: string
  example_sentence: string
  question_text: string
  options: AIOption[]
  correct_answer: string
  explanation_en: string
  explanation_zh: string
}

interface AIClozeQuestion {
  question_text: string
  options: AIOption[]
  correct_answer: string
  explanation_en: string
  explanation_zh: string
}

interface AIComprehension {
  title: string
  passage: string
  questions: {
    question_text: string
    options: AIOption[]
    correct_answer: string
    explanation_en: string
    explanation_zh: string
  }[]
}

interface AIGeneratedMission {
  topic: string
  vocab_questions: AIVocabQuestion[]
  cloze_questions: AIClozeQuestion[]
  comprehension: AIComprehension
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: `Unauthorized: ${authError?.message ?? 'no user'}` }, { status: 401 })
  }

  const serviceClient = createServiceClient()

  // Ensure profile exists
  await serviceClient.from('profiles').upsert(
    {
      id: user.id,
      name: (user.user_metadata?.name as string | undefined) ?? user.email?.split('@')[0] ?? 'Student',
      role: (user.user_metadata?.role as string | undefined) ?? 'student',
    },
    { onConflict: 'id', ignoreDuplicates: true }
  )

  // Upsert daily session
  const today = new Date().toISOString().split('T')[0]
  const { data: session, error: sessionError } = await supabase
    .from('daily_sessions')
    .upsert(
      { user_id: user.id, session_date: today, completed: false },
      { onConflict: 'user_id,session_date', ignoreDuplicates: false }
    )
    .select()
    .single()

  if (sessionError) {
    return NextResponse.json({ error: `Session upsert: ${sessionError.message}` }, { status: 500 })
  }

  // Pick a random topic
  const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)]

  // ─── Call Groq ────────────────────────────────────────────────────────────────
  const systemPrompt = `You are a Singapore O-Level Chinese (Syllabus 1160) exam expert.
Generate authentic practice content for Sec 4 Express students.
Always return ONLY valid JSON — no markdown, no explanation outside the JSON.`

  const userPrompt = `Generate a complete O-Level Chinese practice set on the topic: "${topic}".

Return this exact JSON structure:
{
  "topic": "${topic}",
  "vocab_questions": [
    {
      "word": "Chinese word (2-4 chars)",
      "pinyin": "pīn yīn",
      "meaning_en": "English meaning",
      "meaning_zh": "中文释义",
      "example_sentence": "一个例句。",
      "question_text": "MCQ question testing understanding of this word (Chinese)",
      "options": [
        {"key": "A", "text": "option text"},
        {"key": "B", "text": "option text"},
        {"key": "C", "text": "option text"},
        {"key": "D", "text": "option text"}
      ],
      "correct_answer": "A",
      "explanation_en": "Brief English explanation",
      "explanation_zh": "简短中文解释"
    }
  ],
  "cloze_questions": [
    {
      "question_text": "Sentence with a blank ______ that tests contextual vocabulary (Chinese)",
      "options": [
        {"key": "A", "text": "word A"},
        {"key": "B", "text": "word B"},
        {"key": "C", "text": "word C"},
        {"key": "D", "text": "word D"}
      ],
      "correct_answer": "B",
      "explanation_en": "Brief English explanation",
      "explanation_zh": "简短中文解释"
    }
  ],
  "comprehension": {
    "title": "Passage title in Chinese",
    "passage": "A 400-500 character O-Level style passage in Simplified Chinese on the topic. Write in formal, exam-appropriate Chinese. Use sophisticated vocabulary suitable for Sec 4 Express.",
    "questions": [
      {
         "question_text": "Comprehension question (Chinese)",
         "options": [
           {"key": "A", "text": "option"},
           {"key": "B", "text": "option"},
           {"key": "C", "text": "option"},
           {"key": "D", "text": "option"}
         ],
         "correct_answer": "A",
         "explanation_en": "Brief English explanation",
         "explanation_zh": "简短中文解释"
      }
    ]
  }
}

Rules:
- vocab_questions: exactly 5 items, each testing a different O-Level Chinese word related to "${topic}"
- cloze_questions: exactly 5 items, fill-in-the-blank style, testing contextual vocabulary
- comprehension.questions: exactly 3 items — one factual retrieval, one inference, one vocabulary-in-context
- All Chinese text must be Simplified Chinese
- Questions must be exam-appropriate for Singapore O-Level standard
- Do not repeat any word across vocab_questions`

  let aiMission: AIGeneratedMission
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 4096,
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    })

    const text = completion.choices[0]?.message?.content ?? ''
    const jsonText = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
    aiMission = JSON.parse(jsonText) as AIGeneratedMission
  } catch (err) {
    return NextResponse.json(
      { error: `AI generation failed: ${err instanceof Error ? err.message : 'parse error'}` },
      { status: 500 }
    )
  }

  // ─── Persist to DB via service client ────────────────────────────────────────

  // 1. Insert vocab words (plain insert — no unique constraint on word exists)
  const vocabInserts = aiMission.vocab_questions.map(vq => ({
    word: vq.word,
    pinyin: vq.pinyin,
    meaning_en: vq.meaning_en,
    meaning_zh: vq.meaning_zh,
    example_sentence: vq.example_sentence,
    difficulty: 2,
    tags: [topic],
  }))

  const { data: insertedVocab, error: vocabError } = await serviceClient
    .from('vocabulary')
    .insert(vocabInserts)
    .select('id, word')

  if (vocabError) {
    return NextResponse.json({ error: `Vocab insert failed: ${vocabError.message} [${vocabError.code}]` }, { status: 500 })
  }

  const vocabIdMap: Record<string, string> = {}
  for (const v of insertedVocab ?? []) {
    vocabIdMap[v.word] = v.id
  }

  // 2. Insert vocab MCQ questions
  const vocabQInserts = aiMission.vocab_questions.map(vq => ({
    type: 'vocab_mcq' as const,
    question_text: vq.question_text,
    options: vq.options,
    correct_answer: vq.correct_answer,
    explanation_en: vq.explanation_en,
    explanation_zh: vq.explanation_zh,
    tested_vocab_id: vocabIdMap[vq.word] ?? null,
    difficulty: 2,
  }))

  const { data: insertedVocabQ, error: vocabQError } = await serviceClient
    .from('questions')
    .insert(vocabQInserts)
    .select('*')

  if (vocabQError) {
    return NextResponse.json({ error: `Vocab questions insert failed: ${vocabQError.message} [${vocabQError.code}]` }, { status: 500 })
  }

  // 3. Insert cloze questions
  const clozeQInserts = aiMission.cloze_questions.map(cq => ({
    type: 'cloze_mcq' as const,
    question_text: cq.question_text,
    options: cq.options,
    correct_answer: cq.correct_answer,
    explanation_en: cq.explanation_en,
    explanation_zh: cq.explanation_zh,
    difficulty: 2,
  }))

  const { data: insertedClozeQ, error: clozeQError } = await serviceClient
    .from('questions')
    .insert(clozeQInserts)
    .select('*')

  if (clozeQError) {
    return NextResponse.json({ error: `Cloze questions insert failed: ${clozeQError.message} [${clozeQError.code}]` }, { status: 500 })
  }

  // 4. Insert comprehension questions (all share the same passage + group)
  const passageGroup = `ai_${Date.now()}`
  const compreQInserts = aiMission.comprehension.questions.map(cq => ({
    type: 'compre_mcq' as const,
    passage_group: passageGroup,
    passage_title: aiMission.comprehension.title,
    passage: aiMission.comprehension.passage,
    question_text: cq.question_text,
    options: cq.options,
    correct_answer: cq.correct_answer,
    explanation_en: cq.explanation_en,
    explanation_zh: cq.explanation_zh,
    difficulty: 2,
  }))

  const { data: insertedCompreQ, error: compreQError } = await serviceClient
    .from('questions')
    .insert(compreQInserts)
    .select('*')

  if (compreQError) {
    return NextResponse.json({ error: `Comprehension questions insert failed: ${compreQError.message} [${compreQError.code}]` }, { status: 500 })
  }

  // ─── Build MissionData ────────────────────────────────────────────────────────
  const vocabQuestions = (insertedVocabQ ?? []) as Question[]
  const mcqQuestions = (insertedClozeQ ?? []) as Question[]
  const comprehensionQuestions = (insertedCompreQ ?? []) as Question[]
  const firstPassage = comprehensionQuestions[0] ?? null

  const mission: MissionData = {
    session_id: session.id,
    vocab_questions: vocabQuestions,
    mcq_questions: mcqQuestions,
    comprehension_passage: firstPassage?.passage ?? null,
    comprehension_title: firstPassage?.passage_title ?? null,
    comprehension_questions: comprehensionQuestions,
  }

  return NextResponse.json({ ...mission, ai_topic: topic })
}
