// src/lib/habit-stats.ts
import { useEffect, useState } from "react"
import {
  getHabitList,
  getHabitHistory,
  getHabitCompletion,
  ensureHabitHistorySeeded,
  toDateKey,
  type HabitCompletion,
  type StoredHabit,
} from "@/lib/habit-storage"

// ─── Streak helpers ────────────────────────────────────────────────────────────

export function computeHabitStreak(
  history: HabitCompletion[],
  habitId: number,
  today: Date
): number {
  let streak = 0
  const date = new Date(today)
  while (getHabitCompletion(history, habitId, date)) {
    streak++
    date.setDate(date.getDate() - 1)
  }
  return streak
}

export function computeHabitRecordStreak(
  history: HabitCompletion[],
  habitId: number
): number {
  const entries = history
    .filter((h) => h.habitId === habitId)
    .sort((a, b) => a.date.localeCompare(b.date))

  let record = 0
  let run = 0
  let prevKey = ""

  for (const entry of entries) {
    if (entry.completed) {
      const isConsecutive =
        prevKey !== "" &&
        new Date(entry.date).getTime() -
          new Date(prevKey).getTime() ===
          86_400_000
      run = isConsecutive ? run + 1 : 1
      record = Math.max(record, run)
      prevKey = entry.date
    } else {
      run = 0
      prevKey = ""
    }
  }

  return record
}

// ─── Weekly average ────────────────────────────────────────────────────────────
// % of (habit × day) slots completed over the last 7 days (including today)

export function computeWeeklyAverage(
  history: HabitCompletion[],
  habits: StoredHabit[],
  today: Date
): number {
  if (habits.length === 0) return 0

  let completed = 0
  const total = habits.length * 7

  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    for (const h of habits) {
      if (getHabitCompletion(history, h.id, d)) completed++
    }
  }

  return Math.round((completed / total) * 100)
}

// ─── Aggregate stats hook ─────────────────────────────────────────────────────

export type HabitStats = {
  habits: StoredHabit[]
  totalHabits: number
  totalCompletions: number
  bestCurrentStreak: number
  bestCurrentHabit: StoredHabit | null
  longestRecordStreak: number
  weeklyAverage: number
  history: HabitCompletion[]
}

export function readHabitStats(): HabitStats {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const history = ensureHabitHistorySeeded(today)
  const habits = getHabitList() ?? []

  // Totalt loggat — every completed entry ever
  const totalCompletions = history.filter((h) => h.completed).length

  // Best current streak
  let bestCurrentStreak = 0
  let bestCurrentHabit: StoredHabit | null = null
  for (const h of habits) {
    const s = computeHabitStreak(history, h.id, today)
    if (s > bestCurrentStreak) {
      bestCurrentStreak = s
      bestCurrentHabit = h
    }
  }

  // Längsta streak (record) across all habits — take the max, but never below current
  let longestRecordStreak = 0
  for (const h of habits) {
    const rec = computeHabitRecordStreak(history, h.id)
    if (rec > longestRecordStreak) longestRecordStreak = rec
  }
  longestRecordStreak = Math.max(longestRecordStreak, bestCurrentStreak)

  // Veckosnitt
  const weeklyAverage = computeWeeklyAverage(history, habits, today)

  return {
    habits,
    totalHabits: habits.length,
    totalCompletions,
    bestCurrentStreak,
    bestCurrentHabit,
    longestRecordStreak,
    weeklyAverage,
    history,
  }
}

// ─── Hook: live-updating stats ────────────────────────────────────────────────

export function useHabitStats(): HabitStats {
  const [stats, setStats] = useState<HabitStats>(() => readHabitStats())

  useEffect(() => {
    const refresh = () => setStats(readHabitStats())

    // Cross-tab updates
    window.addEventListener("storage", refresh)
    // Same-tab updates (we'll dispatch this manually from mutations)
    window.addEventListener("habitDataUpdated", refresh)

    return () => {
      window.removeEventListener("storage", refresh)
      window.removeEventListener("habitDataUpdated", refresh)
    }
  }, [])

  return stats
}

// ─── Helper to broadcast updates ──────────────────────────────────────────────

export function notifyHabitDataUpdated() {
  window.dispatchEvent(new Event("habitDataUpdated"))
}