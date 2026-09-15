export type HabitCompletion = {
  habitId: number
  date: string
  completed: boolean
}

export type StoredHabit = {
  id: number
  title: string
  reminder: string
  streak: number
  icon: string
}

export const HABIT_LIST_STORAGE_KEY = "keepit.habits.v1"

export function getHabitList(): StoredHabit[] | null {
  if (!hasLocalStorage()) return null
  const stored = window.localStorage.getItem(HABIT_LIST_STORAGE_KEY)
  if (!stored) return null
  try {
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function saveHabitList(habits: StoredHabit[]) {
  if (!hasLocalStorage()) return
  window.localStorage.setItem(HABIT_LIST_STORAGE_KEY, JSON.stringify(habits))
}

export const HABIT_HISTORY_STORAGE_KEY =
  "keepit.habit-completions.v1"

const DEFAULT_COMPLETION_PATTERNS: Record<number, readonly boolean[]> = {
  1: [true, false, true, true, true, true, false],
  2: [false, true, true, false, true, true, true],
  3: [true, true, true, true, false, true, true],
  4: [true, true, false, true, true, true, true],
  5: [true, true, true, true, true, false, true],
}

function hasLocalStorage() {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  )
}

export function toDateKey(date: Date) {
  const year = date.getFullYear()

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0")

  const day = String(
    date.getDate()
  ).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function getPatternIndex(date: Date) {
  const dateUtc = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  )

  const epochUtc = Date.UTC(
    2026,
    0,
    1
  )

  const millisecondsPerDay =
    24 * 60 * 60 * 1000

  const difference = Math.floor(
    (dateUtc - epochUtc) /
      millisecondsPerDay
  )

  return ((difference % 7) + 7) % 7
}

export function getHabitHistory(): HabitCompletion[] {
  if (!hasLocalStorage()) {
    return []
  }

  const stored =
    window.localStorage.getItem(
      HABIT_HISTORY_STORAGE_KEY
    )

  if (!stored) {
    return []
  }

  try {
    const parsed = JSON.parse(stored)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(
      (
        item
      ): item is HabitCompletion =>
        typeof item === "object" &&
        item !== null &&
        typeof item.habitId === "number" &&
        typeof item.date === "string" &&
        typeof item.completed === "boolean"
    )
  } catch {
    return []
  }
}

export function saveHabitHistory(
  history: HabitCompletion[]
) {
  if (!hasLocalStorage()) {
    return
  }

  window.localStorage.setItem(
    HABIT_HISTORY_STORAGE_KEY,
    JSON.stringify(history)
  )
}

export function getHabitCompletion(
  history: HabitCompletion[],
  habitId: number,
  date: Date
) {
  const dateKey = toDateKey(date)

  return (
    history.find(
      (entry) =>
        entry.habitId === habitId &&
        entry.date === dateKey
    )?.completed ?? false
  )
}

export function setHabitCompletion(
  habitId: number,
  date: Date,
  completed: boolean
) {
  const history = getHabitHistory()

  const dateKey = toDateKey(date)

  const existingIndex =
    history.findIndex(
      (entry) =>
        entry.habitId === habitId &&
        entry.date === dateKey
    )

  let nextHistory: HabitCompletion[]

  if (existingIndex === -1) {
    nextHistory = [
      ...history,
      {
        habitId,
        date: dateKey,
        completed,
      },
    ]
  } else {
    nextHistory = history.map(
      (entry, index) =>
        index === existingIndex
          ? {
              ...entry,
              completed,
            }
          : entry
    )
  }

  saveHabitHistory(nextHistory)

  return nextHistory
}

export function getHabitHistoryBetween(
  startDate: Date,
  endDate: Date
) {
  const history = getHabitHistory()

  const startKey = toDateKey(startDate)
  const endKey = toDateKey(endDate)

  return history.filter(
    (entry) =>
      entry.date >= startKey &&
      entry.date <= endKey
  )
}

export function ensureHabitHistorySeeded(
  referenceDate = new Date()
) {
  if (!hasLocalStorage()) {
    return []
  }

  const existing =
    window.localStorage.getItem(
      HABIT_HISTORY_STORAGE_KEY
    )

  if (existing !== null) {
    return getHabitHistory()
  }

  const history: HabitCompletion[] = []

  const startDate =
    new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth(),
      referenceDate.getDate()
    )

  startDate.setDate(
    startDate.getDate() - 364
  )

  const currentDate =
    new Date(startDate)

  while (
    currentDate <= referenceDate
  ) {
    const patternIndex =
      getPatternIndex(currentDate)

    for (
      const habitId of [
        1,
        2,
        3,
        4,
        5,
      ]
    ) {
      const pattern =
        DEFAULT_COMPLETION_PATTERNS[
          habitId
        ]

      history.push({
        habitId,
        date: toDateKey(currentDate),
        completed:
          pattern[patternIndex] ?? false,
      })
    }

    currentDate.setDate(
      currentDate.getDate() + 1
    )
  }

  saveHabitHistory(history)

  return history
}