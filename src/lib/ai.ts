import Groq from 'groq-sdk'
import { AIExplanation, QuestionOption } from '@/types'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function generateExplanation(params: {
  question_text: string
  options: QuestionOption[]
  student_answer: string
  correct_answer: string
  tested_word?: string | null
  explanation_en?: string | null
  explanation_zh?: string | null
}): Promise<AIExplanation> {
  const { question_text, options, student_answer, correct_answer, tested_word, explanation_en, explanation_zh } = params

  const optionsText = options.map(o => `${o.key}. ${o.text}`).join('\n')
  const studentOptionText = options.find(o => o.key === student_answer)?.text ?? student_answer
  const correctOptionText = options.find(o => o.key === correct_answer)?.text ?? correct_answer

  const systemPrompt = `You are a Singapore O-Level Chinese tutor helping a Sec 4 Express Chinese student.
Explain simply in BOTH English and Chinese (Simplified).
Be encouraging, clear, and concise. Keep explanations to 1-2 sentences each.
Always return valid JSON.`

  const userPrompt = `The student answered a Chinese question incorrectly.

Question: ${question_text}

Options:
${optionsText}

Student answered: ${student_answer} (${studentOptionText})
Correct answer: ${correct_answer} (${correctOptionText})
${tested_word ? `Tested word/concept: ${tested_word}` : ''}
${explanation_en ? `Hint (EN): ${explanation_en}` : ''}
${explanation_zh ? `Hint (ZH): ${explanation_zh}` : ''}

Return a JSON object (no markdown, just JSON):
{
  "why_wrong_en": "Brief English explanation of why the student's answer is wrong",
  "why_wrong_zh": "Brief Chinese explanation of why the student's answer is wrong",
  "why_correct_en": "Brief English explanation of why the correct answer is right",
  "why_correct_zh": "Brief Chinese explanation of why the correct answer is right",
  "memory_hook": "A short memorable tip to remember this word/concept (in English)",
  "similar_example": "One short example sentence using the correct word/concept"
}`

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 512,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  })

  const text = completion.choices[0]?.message?.content
  if (!text) {
    throw new Error('Unexpected response type from AI')
  }

  // Strip markdown code fences if present
  const jsonText = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  return JSON.parse(jsonText) as AIExplanation
}
