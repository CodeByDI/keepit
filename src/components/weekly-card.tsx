import { PieChart, Pie, Cell } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

const HABIT_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

type HabitState = { color: string; done: boolean }

type WeekDay = {
  day: string
  done: number
  total: number
  today?: boolean
  habitStates?: HabitState[]
}

type WeeklyCardProps = {
  days: WeekDay[]
  selectedIndex?: number
  onSelectDay?: (index: number) => void
}

function DayRing({
  day, done, total, today, habitStates, selected, onClick,
}: WeekDay & { selected?: boolean; onClick?: () => void }) {
  const segments = habitStates
    ? habitStates.map((h) => ({ value: 1, color: h.done ? h.color : "var(--border)" }))
    : [
        ...Array.from({ length: done }, (_, i) => ({
          value: 1,
          color: HABIT_COLORS[i % HABIT_COLORS.length],
        })),
        ...(done < total ? [{ value: total - done, color: "var(--border)" }] : []),
      ]

  // today = solid primary ring; selected-non-today = subtle white outline
  const ringStyle = today
    ? { boxShadow: "0 0 0 2px var(--primary)" }
    : selected
      ? { outline: "2px solid rgba(255,255,255,0.35)", outlineOffset: "2px" }
      : {}

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 cursor-pointer rounded-lg transition-opacity hover:opacity-80 bg-transparent border-0 p-0"
    >
      <div className="rounded-full" style={{ width: 40, height: 40, ...ringStyle }}>
        <PieChart width={40} height={40} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Pie
            data={segments}
            cx={20}
            cy={20}
            innerRadius={12}
            outerRadius={18}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
            isAnimationActive={false}
          >
            {segments.map((seg, i) => (
              <Cell key={i} fill={seg.color} />
            ))}
          </Pie>
        </PieChart>
      </div>
      <span
        className="text-xs"
        style={{
          color: today ? "var(--primary)" : selected ? "var(--foreground)" : "var(--muted-foreground)",
          fontWeight: today || selected ? 600 : 400,
        }}
      >
        {day}
      </span>
    </button>
  )
}

export function WeeklyCard({ days, selectedIndex, onSelectDay }: WeeklyCardProps) {
  const doneDays = days.filter((d) => d.done === d.total && d.total > 0).length

  return (
    <Card className="bg-card h-full py-0">
      <CardContent style={{ padding: "16px 20px" }} className="flex flex-col justify-between h-full">
        <p className="text-xs font-normal uppercase tracking-widest text-muted-foreground">
          Denna vecka
        </p>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3 items-center">
            {days.map((d, i) => (
              <DayRing
                key={i}
                {...d}
                selected={selectedIndex === i}
                onClick={() => onSelectDay?.(i)}
              />
            ))}
          </div>

          <div className="flex justify-end text-xs text-muted-foreground opacity-60">
            <span>{doneDays} av {days.length} dagar klara</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
