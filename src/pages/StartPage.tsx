import { useState } from "react"
import { Button } from "@/components/ui/button"
import { NewHabitDialog } from "@/components/new-habit-dialog"
import { PlusIcon, BookOpenIcon, CodeIcon, PersonSimpleRunIcon, BarbellIcon, DropIcon } from "@phosphor-icons/react"
import { StreakCard } from "@/components/streak-card"
import { WeeklyCard } from "@/components/weekly-card"
import { HabitList } from "@/components/habit-list"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"

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

const initialHabits = [
  { id: 1, title: "Läs 20 sidor",    reminder: "Påminnelse · 21:00", streak: 3,  done: false, icon: BookOpenIcon },
  { id: 2, title: "Koda",            reminder: "Påminnelse · 20:00", streak: 1,  done: false, icon: CodeIcon },
  { id: 3, title: "Morgonlöpning",   reminder: "Dagligen · 07:00",   streak: 12, done: true,  icon: PersonSimpleRunIcon },
  { id: 4, title: "Träna 30 min",    reminder: "Dagligen · 17:30",   streak: 8,  done: true,  icon: BarbellIcon },
  { id: 5, title: "Drick 2L vatten", reminder: "Dagligen · 20:00",   streak: 5,  done: true,  icon: DropIcon },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export function StartPage() {
  const [habits, setHabits] = useState(initialHabits)
  const [dialogOpen, setDialogOpen] = useState(false)

  function toggleHabit(id: number) {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, done: !h.done } : h))
    )
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
        <Button onClick={() => setDialogOpen(true)} className="cursor-pointer hover:opacity-80 transition-opacity" style={{ background: "linear-gradient(135deg, #5649d4 0%, #6d5cf6 45%, #8b5cf6 78%, #f472b6 100%)", color: "white", border: "none", height: "40px", fontWeight: 400 }}>
          Skapa vana <PlusIcon size={16} />
        </Button>
      </div>

      {/* Cards row — streak + weekly (coming next) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ gridAutoRows: "150px" }}>
        <StreakCard current={streakData.current} record={streakData.record} daysLeft={streakData.daysLeft} />
        <WeeklyCard days={weekDays} />
      </div>

      {/* Habit list */}
      <HabitList habits={habits} onToggle={toggleHabit} />

      <NewHabitDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
    </>
  )
}
