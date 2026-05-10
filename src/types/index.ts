export type UserRole = 'student' | 'parent'
export type MasteryLevel = 'new' | 'weak' | 'improving' | 'mastered'
export type QuestionType = 'vocab_mcq' | 'cloze_mcq' | 'compre_mcq' | 'editing'

export interface Profile {
  id: string
  name: string | null
  role: UserRole
  linked_student_id: string | null
  created_at: string
}

export interface Vocabulary {
  id: string
  word: string
  pinyin: string | null
  meaning_en: string | null
  meaning_zh: string | null
  example_sentence: string | null
  difficulty: number
  tags: string[] | null
  created_at: string
}

export interface QuestionOption {
  key: string
  text: string
}

export interface Question {
  id: string
  type: QuestionType
  question_text: string
  passage: string | null
  passage_title: string | null
  passage_group: string | null
  options: QuestionOption[]
  correct_answer: string
  explanation_en: string | null
  explanation_zh: string | null
  tested_vocab_id: string | null
  difficulty: number
  created_at: string
}

export interface Attempt {
  id: string
  user_id: string
  question_id: string
  selected_answer: string | null
  is_correct: boolean
  ai_explanation: AIExplanation | null
  session_date: string
  created_at: string
}

export interface UserVocabProgress {
  id: string
  user_id: string
  vocab_id: string
  mistake_count: number
  correct_streak: number
  mastery_level: MasteryLevel
  last_attempt_at: string | null
  next_review_at: string
  vocabulary?: Vocabulary
}

export interface DailySession {
  id: string
  user_id: string
  session_date: string
  completed: boolean
  total_questions: number
  correct_questions: number
  created_at: string
}

export interface AIExplanation {
  why_wrong_en: string
  why_wrong_zh: string
  why_correct_en: string
  why_correct_zh: string
  memory_hook: string
  similar_example: string
}

// ─── Mission types ────────────────────────────────────────────────────────────

export type MissionPhase =
  | 'loading'
  | 'intro'
  | 'vocab_review'
  | 'mcq_practice'
  | 'comprehension'
  | 'mistake_review'
  | 'complete'

export interface MissionQuestion extends Question {
  phase: MissionPhase
}

export interface MissionData {
  session_id: string
  vocab_questions: Question[]
  mcq_questions: Question[]
  comprehension_passage: string | null
  comprehension_title: string | null
  comprehension_questions: Question[]
}

export interface QuestionResult {
  question: Question
  selected_answer: string
  is_correct: boolean
  ai_explanation: AIExplanation | null
}

// ─── Dashboard stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
  streak: number
  mastered_count: number
  weak_count: number
  today_completed: boolean
  today_correct: number
  today_total: number
}
