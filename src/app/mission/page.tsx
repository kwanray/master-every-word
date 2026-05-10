'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MissionData, Question, QuestionResult, AIExplanation, MissionPhase } from '@/types'
import QuizCard from '@/components/QuizCard'
import ExplanationModal from '@/components/ExplanationModal'
import PassageCard from '@/components/PassageCard'
import MissionComplete from '@/components/MissionComplete'
import ProgressBar from '@/components/ProgressBar'

type UIState =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'intro'; mission: MissionData }
  | { kind: 'question'; mission: MissionData; phase: MissionPhase; questionIndex: number; answered: boolean; selectedAnswer: string | null; loadingExplanation: boolean; explanation: AIExplanation | null }
  | { kind: 'passage'; mission: MissionData }
  | { kind: 'complete'; results: QuestionResult[]; streak: number }

export default function MissionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isAiMode = searchParams.get('mode') === 'ai'

  const [state, setState] = useState<UIState>({ kind: 'loading' })
  const [results, setResults] = useState<QuestionResult[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [aiTopic, setAiTopic] = useState<string | null>(null)

  // Load mission on mount
  useEffect(() => {
    async function loadMission() {
      try {
        const endpoint = isAiMode ? '/api/mission/generate-ai' : '/api/mission/generate'
        const res = await fetch(endpoint, { method: 'POST' })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(`Failed to generate mission (${res.status}): ${body.error ?? 'unknown'}`)
        }
        const data = await res.json()
        const mission: MissionData = data
        setSessionId(mission.session_id)
        if (data.ai_topic) setAiTopic(data.ai_topic)
        setState({ kind: 'intro', mission })
      } catch (err) {
        setState({ kind: 'error', message: err instanceof Error ? err.message : 'Unknown error' })
      }
    }
    loadMission()
  }, [isAiMode])

  const getQuestionsForPhase = useCallback(
    (mission: MissionData, phase: MissionPhase): Question[] => {
      if (phase === 'vocab_review') return mission.vocab_questions
      if (phase === 'mcq_practice') return mission.mcq_questions
      if (phase === 'comprehension') return mission.comprehension_questions
      return []
    },
    []
  )

  const getPhasLabel = (phase: MissionPhase): string => {
    const labels: Partial<Record<MissionPhase, string>> = {
      vocab_review: '词语复习',
      mcq_practice: 'MCQ 练习',
      comprehension: '阅读理解',
    }
    return labels[phase] ?? ''
  }

  const advanceFromPhase = useCallback(
    async (mission: MissionData, currentPhase: MissionPhase, currentResults: QuestionResult[]) => {
      const phases: MissionPhase[] = ['vocab_review', 'mcq_practice', 'comprehension']
      const idx = phases.indexOf(currentPhase)
      const nextPhase = phases[idx + 1]

      if (!nextPhase) {
        // All phases done — complete session
        const total = currentResults.length
        const correct = currentResults.filter(r => r.is_correct).length

        if (sessionId) {
          const res = await fetch('/api/session/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId, total_questions: total, correct_questions: correct }),
          })
          const data = await res.json()
          setState({ kind: 'complete', results: currentResults, streak: data.streak ?? 0 })
        } else {
          setState({ kind: 'complete', results: currentResults, streak: 0 })
        }
        return
      }

      if (nextPhase === 'comprehension' && mission.comprehension_passage) {
        setState({ kind: 'passage', mission })
      } else {
        setState({
          kind: 'question',
          mission,
          phase: nextPhase,
          questionIndex: 0,
          answered: false,
          selectedAnswer: null,
          loadingExplanation: false,
          explanation: null,
        })
      }
    },
    [sessionId]
  )

  const handleAnswer = useCallback(
    async (selectedKey: string) => {
      if (state.kind !== 'question') return
      const { mission, phase, questionIndex } = state
      const questions = getQuestionsForPhase(mission, phase)
      const question = questions[questionIndex]
      if (!question) return

      const isCorrect = selectedKey === question.correct_answer

      // Immediately show result
      setState(prev =>
        prev.kind === 'question'
          ? { ...prev, answered: true, selectedAnswer: selectedKey, loadingExplanation: !isCorrect }
          : prev
      )

      let explanation: AIExplanation | null = null

      // Fetch AI explanation for wrong answers
      if (!isCorrect) {
        try {
          const res = await fetch('/api/ai/explain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              question_text: question.question_text,
              options: question.options,
              student_answer: selectedKey,
              correct_answer: question.correct_answer,
              tested_word: null,
              explanation_en: question.explanation_en,
              explanation_zh: question.explanation_zh,
            }),
          })
          if (res.ok) explanation = await res.json()
        } catch {
          // Continue without explanation
        }

        setState(prev =>
          prev.kind === 'question'
            ? { ...prev, loadingExplanation: false, explanation }
            : prev
        )
      }

      // Save attempt in background
      fetch('/api/attempts/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: question.id,
          vocab_id: question.tested_vocab_id ?? null,
          selected_answer: selectedKey,
          is_correct: isCorrect,
          ai_explanation: explanation,
        }),
      }).catch(() => {})

      const newResult: QuestionResult = { question, selected_answer: selectedKey, is_correct: isCorrect, ai_explanation: explanation }
      setResults(prev => [...prev, newResult])
    },
    [state, getQuestionsForPhase]
  )

  const handleNext = useCallback(async () => {
    if (state.kind !== 'question') return
    const { mission, phase, questionIndex } = state
    const questions = getQuestionsForPhase(mission, phase)
    const nextIndex = questionIndex + 1

    if (nextIndex < questions.length) {
      setState({
        kind: 'question',
        mission,
        phase,
        questionIndex: nextIndex,
        answered: false,
        selectedAnswer: null,
        loadingExplanation: false,
        explanation: null,
      })
    } else {
      const allResults = [...results]
      await advanceFromPhase(mission, phase, allResults)
    }
  }, [state, results, getQuestionsForPhase, advanceFromPhase])

  const startMission = (mission: MissionData) => {
    setState({
      kind: 'question',
      mission,
      phase: 'vocab_review',
      questionIndex: 0,
      answered: false,
      selectedAnswer: null,
      loadingExplanation: false,
      explanation: null,
    })
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  if (state.kind === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">{isAiMode ? '🤖' : '📚'}</div>
          <p className="text-gray-500 chinese-text">
            {isAiMode ? 'AI 正在生成专属练习…' : '正在准备今天的任务…'}
          </p>
          {isAiMode && (
            <p className="text-gray-400 text-xs mt-2">约需 10 秒</p>
          )}
        </div>
      </div>
    )
  }

  if (state.kind === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">加载失败：{state.message}</p>
          <button onClick={() => router.push('/dashboard')} className="text-brand-600 font-medium">
            返回主页
          </button>
        </div>
      </div>
    )
  }

  if (state.kind === 'complete') {
    return <MissionComplete results={state.results} streak={state.streak} />
  }

  if (state.kind === 'intro') {
    const mission = state.mission
    const total =
      mission.vocab_questions.length +
      mission.mcq_questions.length +
      mission.comprehension_questions.length
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b ${isAiMode ? 'from-violet-600 to-violet-700' : 'from-brand-600 to-brand-700'}`}>
        <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl flex flex-col gap-5">
          <div className="text-center">
            <div className="text-5xl mb-3">{isAiMode ? '🤖' : '🎯'}</div>
            {isAiMode && aiTopic && (
              <div className="inline-block bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                AI 生成 · {aiTopic}
              </div>
            )}
            <h1 className="text-2xl font-bold text-gray-800 chinese-text">
              {isAiMode ? 'AI 练习' : '今天的任务'}
            </h1>
            <p className="text-gray-400 text-sm mt-1">共 {total} 题，约 20 分钟</p>
          </div>

          <div className="flex flex-col gap-3 bg-gray-50 rounded-xl p-4">
            {[
              { icon: '📖', label: '词语复习', count: mission.vocab_questions.length },
              { icon: '❓', label: 'MCQ 练习', count: mission.mcq_questions.length },
              { icon: '📝', label: '阅读理解', count: mission.comprehension_questions.length },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-brand-600">{item.count} 题</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => startMission(mission)}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl text-lg transition-colors"
          >
            开始 →
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full text-gray-400 text-sm text-center"
          >
            稍后再做
          </button>
        </div>
      </div>
    )
  }

  if (state.kind === 'passage') {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        <div className="max-w-lg mx-auto">
          <button onClick={() => router.push('/dashboard')} className="text-sm text-gray-400 mb-4 flex items-center gap-1">
            ← 退出任务
          </button>
          <PassageCard
            title={state.mission.comprehension_title}
            passage={state.mission.comprehension_passage!}
            onReady={() =>
              setState({
                kind: 'question',
                mission: state.mission,
                phase: 'comprehension',
                questionIndex: 0,
                answered: false,
                selectedAnswer: null,
                loadingExplanation: false,
                explanation: null,
              })
            }
          />
        </div>
      </div>
    )
  }

  // Question state
  const { mission, phase, questionIndex, answered, selectedAnswer, loadingExplanation, explanation } = state
  const questions = getQuestionsForPhase(mission, phase)
  const question = questions[questionIndex]

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">没有找到题目</p>
      </div>
    )
  }

  // Calculate overall progress
  const phaseSizes = [mission.vocab_questions.length, mission.mcq_questions.length, mission.comprehension_questions.length]
  const phaseOrder: MissionPhase[] = ['vocab_review', 'mcq_practice', 'comprehension']
  const phaseIdx = phaseOrder.indexOf(phase)
  const doneBeforeThisPhase = phaseSizes.slice(0, phaseIdx).reduce((a, b) => a + b, 0)
  const totalQuestions = phaseSizes.reduce((a, b) => a + b, 0)
  const overallDone = doneBeforeThisPhase + questionIndex + (answered ? 1 : 0)
  const overallProgress = totalQuestions > 0 ? Math.round((overallDone / totalQuestions) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Progress header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')} className="text-gray-400 text-sm flex-shrink-0">
            ✕
          </button>
          <div className="flex-1">
            <ProgressBar value={overallProgress} size="sm" />
          </div>
          <span className="text-xs text-gray-400 flex-shrink-0">
            {overallDone}/{totalQuestions}
          </span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-4">
        <QuizCard
          question={question}
          selectedAnswer={selectedAnswer}
          showResult={answered}
          onSelect={handleAnswer}
          questionNumber={questionIndex + 1}
          totalQuestions={questions.length}
          phaseLabel={getPhasLabel(phase)}
        />

        {/* After answering */}
        {answered && (
          <>
            {selectedAnswer !== question.correct_answer ? (
              <ExplanationModal
                explanation={explanation}
                isLoading={loadingExplanation}
                onNext={handleNext}
                nextLabel={
                  questionIndex + 1 >= questions.length
                    ? phase === 'comprehension'
                      ? '查看结果'
                      : '下一阶段'
                    : '下一题'
                }
              />
            ) : (
              <button
                onClick={handleNext}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-4 rounded-xl transition-colors"
              >
                {questionIndex + 1 >= questions.length
                  ? phase === 'comprehension'
                    ? '查看结果 →'
                    : '继续 →'
                  : '下一题 →'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
