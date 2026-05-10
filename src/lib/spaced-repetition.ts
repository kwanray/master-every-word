import { MasteryLevel } from '@/types'

// Review intervals in days
const REVIEW_INTERVALS: Record<MasteryLevel, number> = {
  new: 1,
  weak: 3,
  improving: 7,
  mastered: 14,
}

// Minimum consecutive correct answers to advance mastery
const STREAK_TO_ADVANCE = 1

// Consecutive correct to reach mastered
const STREAK_TO_MASTER = 3

export function computeNextReview(
  currentLevel: MasteryLevel,
  isCorrect: boolean,
  currentStreak: number
): {
  mastery_level: MasteryLevel
  correct_streak: number
  next_review_at: Date
} {
  let newStreak = isCorrect ? currentStreak + 1 : 0
  let newLevel: MasteryLevel

  if (!isCorrect) {
    // Wrong — reset to weak and review tomorrow
    newLevel = 'weak'
    newStreak = 0
  } else if (newStreak >= STREAK_TO_MASTER) {
    newLevel = 'mastered'
  } else if (newStreak >= STREAK_TO_ADVANCE) {
    // Advance one level
    if (currentLevel === 'new') newLevel = 'weak'
    else if (currentLevel === 'weak') newLevel = 'improving'
    else if (currentLevel === 'improving') newLevel = 'mastered'
    else newLevel = 'mastered'
  } else {
    newLevel = currentLevel
  }

  const intervalDays = REVIEW_INTERVALS[newLevel]
  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + intervalDays)

  return {
    mastery_level: newLevel,
    correct_streak: newStreak,
    next_review_at: nextReview,
  }
}

export function getMasteryLabel(level: MasteryLevel): string {
  const labels: Record<MasteryLevel, string> = {
    new: '新词',
    weak: '待加强',
    improving: '进步中',
    mastered: '已掌握',
  }
  return labels[level]
}

export function getMasteryColor(level: MasteryLevel): string {
  const colors: Record<MasteryLevel, string> = {
    new: 'bg-gray-100 text-gray-600',
    weak: 'bg-red-100 text-red-700',
    improving: 'bg-amber-100 text-amber-700',
    mastered: 'bg-emerald-100 text-emerald-700',
  }
  return colors[level]
}

export function getMasteryPercent(level: MasteryLevel): number {
  const pct: Record<MasteryLevel, number> = {
    new: 10,
    weak: 33,
    improving: 66,
    mastered: 100,
  }
  return pct[level]
}
