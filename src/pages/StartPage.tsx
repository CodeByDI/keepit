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

const staticWeekDays = [
  { day: "M", done: 5, total: 5 },
  { day: "T", done: 4, total: 5 },
  { day: "O", done: 5, total: 5 },
  { day: "T", done: 4, total: 5 },
  { day: "F", done: 3, total: 5, today: true },
  { day: "L", done: 0, total: 5 },
  { day: "S", done: 0, total: 5 },
]

const streakData = {
  current: 12,
  record: 21,
  daysLeft: 9,
}

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

  // Derive done state from localStorage history, attach icon components
  const habits = storedHabits.map((h) => ({
    ...h,
    done: getHabitCompletion(history, h.id, today),
    icon: ICON_MAP[h.icon] ?? PlusIcon,
  }))

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

  const weekDays = staticWeekDays.map((d) =>
    d.today
      ? {
          ...d,
          done: habits.filter((h) => h.done).length,
          total: habits.length,
          habitStates: habits.map((h, i) => ({
            color: ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"][i % 5],
            done: h.done,
          })),
        }
      : d
  )

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
          <p className="text-sm text-muted-foreground opacity-60">Fredag 9 September</p>
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
          <StreakCard current={streakData.current} record={streakData.record} daysLeft={streakData.daysLeft} />
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
