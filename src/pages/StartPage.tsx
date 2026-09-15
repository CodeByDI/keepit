import { useState } from "react"
import { OnboardingModal, hasCompletedOnboarding } from "@/components/onboarding-modal"
import { Button } from "@/components/ui/button"
import { NewHabitDialog } from "@/components/new-habit-dialog"
import { PlusIcon, BookOpenIcon, CodeIcon, PersonSimpleRunIcon, BarbellIcon, DropIcon } from "@phosphor-icons/react"
import { StreakCard } from "@/components/streak-card"
import { WeeklyCard } from "@/components/weekly-card"
import { HabitList } from "@/components/habit-list"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import {
  ensureHabitHistorySeeded,
  getHabitCompletion,
  setHabitCompletion,
  getHabitList,
  saveHabitList,
  type HabitCompletion,
  type StoredHabit,
} from "@/lib/habit-storage"

// ─── Static data (replace with API later) ─────────────────────────────────────

const user = { name: "Maja" }

const WEEK_LABELS = ["M", "T", "O", "T", "F", "L", "S"]

// ─── Streak helpers ────────────────────────────────────────────────────────────

// How many consecutive days ending on `today` has a single habit been done?
function computeHabitStreak(history: HabitCompletion[], habitId: number, today: Date): number {
  let streak = 0
  const date = new Date(today)
  while (getHabitCompletion(history, habitId, date)) {
    streak++
    date.setDate(date.getDate() - 1)
  }
  return streak
}

// Longest ever streak for a single habit in the full history
function computeHabitRecordStreak(history: HabitCompletion[], habitId: number): number {
  const dateKeys = [...new Set(
    history.filter((h) => h.habitId === habitId).map((h) => h.date)
  )].sort()
  let record = 0
  let run = 0
  let prevKey = ""
  for (const key of dateKeys) {
    const done = history.find((h) => h.habitId === habitId && h.date === key)?.completed ?? false
    if (done) {
      const isConsecutive = prevKey !== "" &&
        (new Date(key).getTime() - new Date(prevKey).getTime()) === 86_400_000
      run = isConsecutive ? run + 1 : 1
      record = Math.max(record, run)
      prevKey = key
    } else {
      run = 0
      prevKey = ""
    }
  }
  return record
}

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

// Icon map — converts stored icon name string to a React component
const ICON_MAP: Record<string, React.ElementType> = {
  book:    BookOpenIcon,
  code:    CodeIcon,
  run:     PersonSimpleRunIcon,
  barbell: BarbellIcon,
  drop:    DropIcon,
  fire:    PlusIcon, // default fallback for new habits
}

// Seed data — used only if localStorage has no habit list yet
const SEED_HABITS: StoredHabit[] = [
  { id: 1, title: "Läs 20 sidor",    reminder: "Påminnelse · 21:00", streak: 3,  icon: "book" },
  { id: 2, title: "Koda",            reminder: "Påminnelse · 20:00", streak: 1,  icon: "code" },
  { id: 3, title: "Morgonlöpning",   reminder: "Dagligen · 07:00",   streak: 12, icon: "run" },
  { id: 4, title: "Träna 30 min",    reminder: "Dagligen · 17:30",   streak: 8,  icon: "barbell" },
  { id: 5, title: "Drick 2L vatten", reminder: "Dagligen · 20:00",   streak: 5,  icon: "drop" },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export function StartPage() {
  const [today] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  })
  const [history, setHistory] = useState<HabitCompletion[]>(() =>
    ensureHabitHistorySeeded(today)
  )
  const [storedHabits, setStoredHabits] = useState<StoredHabit[]>(() => {
    const saved = getHabitList()
    if (saved && saved.length > 0) return saved
    // Seed localStorage with defaults on first load
    saveHabitList(SEED_HABITS)
    return SEED_HABITS
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(() => !hasCompletedOnboarding())

  // Derive done state and live streak from localStorage history
  const habits = storedHabits.map((h) => ({
    ...h,
    done: getHabitCompletion(history, h.id, today),
    streak: computeHabitStreak(history, h.id, today),
    icon: ICON_MAP[h.icon] ?? PlusIcon,
  }))

  // StreakCard: highlight the habit with the longest current streak
  const bestHabit = habits.length > 0
    ? habits.reduce((best, h) => h.streak > best.streak ? h : best, habits[0])
    : null
  const bestRecord = bestHabit ? Math.max(computeHabitRecordStreak(history, bestHabit.id), bestHabit.streak) : 0
  const daysLeft = Math.max(0, bestRecord - (bestHabit?.streak ?? 0))

  function toggleHabit(id: number) {
    const current = getHabitCompletion(history, id, today)
    const nextHistory = setHabitCompletion(id, today, !current)
    setHistory(nextHistory)
  }

  function handleAddHabit(title: string, reminder: string) {
    const newHabit: StoredHabit = {
      id: storedHabits.length > 0 ? Math.max(...storedHabits.map((h) => h.id)) + 1 : 1,
      title,
      reminder,
      streak: 0,
      icon: "fire",
    }
    const updated = [...storedHabits, newHabit]
    setStoredHabits(updated)
    saveHabitList(updated)
  }

  // getDay() returns 0=Sun…6=Sat; our array starts Monday, so shift by 6
  const todayIndex = (today.getDay() + 6) % 7

  // Monday of the current week
  const monday = new Date(today)
  monday.setDate(today.getDate() - todayIndex)

  const weekDays = WEEK_LABELS.map((label, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    const isFuture = date > today

    const habitStates = storedHabits.map((h, j) => ({
      color: CHART_COLORS[j % 5],
      done: isFuture ? false : getHabitCompletion(history, h.id, date),
    }))

    return {
      day: label,
      done: habitStates.filter((s) => s.done).length,
      total: storedHabits.length,
      today: i === todayIndex ? true : undefined,
      habitStates,
    }
  })

  return (
    <>
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Start</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
    <div className="flex flex-col gap-6 p-6 max-w-4xl w-full">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--primary)" }}>Hej {user.name}</h1>
          <p className="text-sm text-muted-foreground opacity-60">
            {today.toLocaleDateString("sv-SE", { weekday: "long", day: "numeric", month: "long" })
              .replace(/^./, (c) => c.toUpperCase())}
          </p>
        </div>
        {habits.length > 0 && (
          <Button onClick={() => setDialogOpen(true)} className="cursor-pointer hover:opacity-80 transition-opacity" style={{ background: "linear-gradient(135deg, #5649d4 0%, #6d5cf6 45%, #8b5cf6 78%, #f472b6 100%)", color: "white", border: "none", height: "40px", fontWeight: 400 }}>
            Skapa vana <PlusIcon size={16} />
          </Button>
        )}
      </div>

      {/* Cards + habit list — hidden when no habits yet */}
      {habits.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ gridAutoRows: "150px" }}>
          <StreakCard
            current={bestHabit?.streak ?? 0}
            record={bestRecord}
            daysLeft={daysLeft}
            habitName={bestHabit?.title ?? ""}
            HabitIcon={bestHabit?.icon ?? PlusIcon}
          />
          <WeeklyCard days={weekDays} />
        </div>
      )}

      <HabitList habits={habits} onToggle={toggleHabit} onAdd={() => setDialogOpen(true)} />

      <NewHabitDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={handleAddHabit} />

      {showOnboarding && (
        <OnboardingModal onDone={() => setShowOnboarding(false)} />
      )}
    </div>
    </>
  )
}
