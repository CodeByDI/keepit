import { FireIcon, CheckIcon } from "@phosphor-icons/react"
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

function HabitRow({ habit, index, onToggle }: { habit: Habit; index: number; onToggle: (id: number) => void }) {
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

      {/* Check button */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(habit.id) }}
        className="size-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
        style={{
          borderColor: habit.done ? color : "var(--border)",
          backgroundColor: habit.done ? color : "transparent",
        }}
      >
        {habit.done && <CheckIcon size={12} weight="bold" color="white" />}
      </button>
    </div>
  )
}

export function HabitList({ habits, onToggle, onAdd }: { habits: Habit[]; onToggle: (id: number) => void; onAdd?: () => void }) {
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-normal uppercase tracking-widest text-muted-foreground opacity-60">Idag</p>
        <div className="flex items-center gap-2">
          {habits.map((h, i) => {
            const color = HABIT_COLORS[i % HABIT_COLORS.length]
            return (
              <div
                key={h.id}
                className="size-3 rounded-full transition-colors"
                style={{ backgroundColor: h.done ? color : "var(--border)" }}
              />
            )
          })}
          <span className="text-xs text-muted-foreground ml-1 opacity-60">
            {doneCount} av {habits.length}
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
            <HabitRow key={h.id} habit={h} index={habits.findIndex((x) => x.id === h.id)} onToggle={onToggle} />
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
            <HabitRow key={h.id} habit={h} index={habits.findIndex((x) => x.id === h.id)} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  )
}
