import { PieChart, Pie, Cell } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

// Uses our chart color palette from index.css
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
}

function DayRing({ day, done, total, today, habitStates }: WeekDay) {
  // If we have per-habit state, use each habit's actual color; otherwise fall back to index-based
  const segments = habitStates
    ? habitStates.map((h) => ({ value: 1, color: h.done ? h.color : "var(--border)" }))
    : [
        ...Array.from({ length: done }, (_, i) => ({
          value: 1,
          color: HABIT_COLORS[i % HABIT_COLORS.length],
        })),
        ...(done < total ? [{ value: total - done, color: "var(--border)" }] : []),
      ]

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="rounded-full"
        style={{ width: 40, height: 40, ...(today ? { boxShadow: "0 0 0 2px var(--primary)" } : {}) }}
      >
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
          color: today ? "var(--primary)" : "var(--muted-foreground)",
          fontWeight: today ? 600 : 400,
        }}
      >
        {day}
      </span>
    </div>
  )
}

export function WeeklyCard({ days }: WeeklyCardProps) {
  const doneDays = days.filter((d) => d.done === d.total && d.total > 0).length

  return (
    <Card className="bg-card h-full py-0">
      <CardContent style={{ padding: "16px 20px" }} className="flex flex-col justify-between h-full">

        <p className="text-xs font-normal uppercase tracking-widest text-muted-foreground">
          Denna vecka
        </p>

        {/* Bottom content group */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 items-center">
            {days.map((d, i) => (
              <DayRing key={i} {...d} />
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
