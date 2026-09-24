import { FireIcon, CheckIcon, CalendarBlankIcon } from "@phosphor-icons/react"
import { useNavigate } from "react-router-dom"

type Habit = {
  id: number
  title: string
  reminder: string
  streak: number
  done: boolean
  icon?: React.ElementType
}

// One color per habit slot (cycles through chart palette)
const HABIT_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

function HabitRow({ habit, index, onToggle, readOnly }: { habit: Habit; index: number; onToggle: (id: number) => void; readOnly?: boolean }) {
  const color = HABIT_COLORS[index % HABIT_COLORS.length]
  const HabitIcon = habit.icon
  const navigate = useNavigate()

  return (
    <div
      className="flex items-center gap-3 py-3 border-b last:border-0 cursor-pointer rounded-lg transition-colors hover:bg-muted/50 -mx-2 px-2"
      onClick={() => navigate(`/habits/${habit.id}`)}
    >
      {/* Icon badge */}
      <div
        className="size-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `color-mix(in oklch, ${color} 15%, transparent)` }}
      >
        {HabitIcon && <HabitIcon size={18} style={{ color }} />}
      </div>

      {/* Title + reminder */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium truncate"
          style={{ color: habit.done ? "var(--muted-foreground)" : "var(--foreground)",
                   textDecoration: habit.done ? "line-through" : "none" }}
        >
          {habit.title}
        </p>
        <p className="text-xs text-muted-foreground opacity-60">{habit.reminder}</p>
      </div>

      {/* Streak */}
      <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
        <FireIcon size={16} />
        {habit.streak}
      </span>

      {/* Check button — hidden when viewing a past day */}
      {!readOnly && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(habit.id) }}
          className="h-7 px-2.5 rounded-full border flex items-center gap-1 shrink-0 transition-colors text-xs font-medium"
          style={habit.done ? {
            borderColor: "var(--border)",
            backgroundColor: "transparent",
            color: "var(--muted-foreground)",
            opacity: 0.5,
          } : {
            borderColor: color,
            backgroundColor: color,
            color: "white",
          }}
        >
          <CheckIcon size={11} weight="bold" />
          {habit.done ? "Klar" : "Markera klar"}
        </button>
      )}
      {readOnly && habit.done && (
        <CheckIcon size={14} style={{ color, flexShrink: 0 }} weight="bold" />
      )}
    </div>
  )
}

export function HabitList({ habits, onToggle, onAdd, readOnly, isFuture, selectedDateLabel, shortDateLabel }: {
  habits: Habit[]
  onToggle: (id: number) => void
  onAdd?: () => void
  readOnly?: boolean
  isFuture?: boolean
  selectedDateLabel?: string
  shortDateLabel?: string
}) {
  const remaining = habits.filter((h) => !h.done)
  const done = habits.filter((h) => h.done)

  const doneCount = habits.filter((h) => h.done).length

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-center min-h-[50vh]">
        <div
          className="size-14 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: "var(--muted)" }}
        >
          <FireIcon size={24} style={{ color: "var(--muted-foreground)", opacity: 0.4 }} />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">Inga vanor än.</p>
          <p className="text-xs text-muted-foreground opacity-60">
            Vilket är ett perfekt tillfälle att lägga till en.
          </p>
        </div>
        <button
          onClick={onAdd}
          className="cursor-pointer hover:opacity-80 transition-opacity px-5 py-2.5 rounded-lg text-sm font-medium text-white"
          style={{
            background: "linear-gradient(135deg, #5649d4 0%, #6d5cf6 45%, #8b5cf6 78%, #f472b6 100%)",
          }}
        >
          Skapa din första vana
        </button>
        <p className="text-xs text-muted-foreground opacity-40">Dag 1 av förhoppningsvis många.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Day banner when viewing a past day */}
      {readOnly && selectedDateLabel && (
        <div className="flex items-center gap-2 rounded-lg border px-3 py-2 text-xs text-muted-foreground"
          style={{ backgroundColor: "var(--muted)" }}>
          <CalendarBlankIcon size={13} />
          <span>Visar <span className="font-medium text-foreground">{selectedDateLabel}</span> — kan inte ändras, {isFuture ? "datum i framtiden" : "datum passerat"}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-1">
        {/* Row 1: title + date | count */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <p className="text-sm font-semibold text-foreground">
              {readOnly ? "Vald dag" : "Dagens vanor"}
            </p>
            {shortDateLabel && (
              <p className="text-xs text-muted-foreground opacity-60">
                {shortDateLabel}
              </p>
            )}
          </div>
          <span className="text-sm font-semibold text-foreground">
            {doneCount} av {habits.length}
          </span>
        </div>

        {/* Row 2: progress dots | % klara */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {[...habits]
              .sort((a, b) => Number(b.done) - Number(a.done))
              .map((h) => {
                const color = HABIT_COLORS[habits.findIndex((x) => x.id === h.id) % HABIT_COLORS.length]
                return (
                  <div
                    key={h.id}
                    className="rounded-full transition-all"
                    style={{
                      width:  h.done ? 10 : 7,
                      height: h.done ? 10 : 7,
                      backgroundColor: h.done ? color : "var(--border)",
                    }}
                  />
                )
              })}
          </div>
          <span className="text-xs text-muted-foreground opacity-60">
            {habits.length > 0 ? Math.round((doneCount / habits.length) * 100) : 0}% klara
          </span>
        </div>
      </div>

      {/* Återstår */}
      {remaining.length > 0 && (
        <div className="rounded-xl border bg-card px-4">
          <div className="py-3 border-b">
            <p className="text-xs font-normal uppercase tracking-widest text-muted-foreground opacity-60">
              Återstår · {remaining.length}
            </p>
          </div>
          {remaining.map((h) => (
            <HabitRow key={h.id} habit={h} index={habits.findIndex((x) => x.id === h.id)} onToggle={onToggle} readOnly={readOnly} />
          ))}
        </div>
      )}

      {/* Klara */}
      {done.length > 0 && (
        <div className="rounded-xl border bg-card px-4">
          <div className="py-3 border-b">
            <p className="text-xs font-normal uppercase tracking-widest text-muted-foreground opacity-60">
              Klara · {done.length}
            </p>
          </div>
          {done.map((h) => (
            <HabitRow key={h.id} habit={h} index={habits.findIndex((x) => x.id === h.id)} onToggle={onToggle} readOnly={readOnly} />
          ))}
        </div>
      )}
    </div>
  )
}
