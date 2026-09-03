import { useParams, useNavigate } from "react-router-dom"
import {
  BookOpenIcon, CodeIcon, PersonSimpleRunIcon, BarbellIcon, DropIcon,
  CheckIcon,
} from "@phosphor-icons/react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer } from "recharts"

// ─── Shared static data ────────────────────────────────────────────────────────

const HABITS = [
  { id: 1, title: "Läs 20 sidor",    icon: BookOpenIcon,         frequency: "Dagligen", time: "21:00", streak: 3,  total: 14, avg: 72, record: 10, startDate: "15 aug" },
  { id: 2, title: "Koda",            icon: CodeIcon,             frequency: "Dagligen", time: "20:00", streak: 1,  total: 8,  avg: 60, record: 5,  startDate: "22 aug" },
  { id: 3, title: "Morgonlöpning",   icon: PersonSimpleRunIcon,  frequency: "Dagligen", time: "07:00", streak: 12, total: 38, avg: 86, record: 21, startDate: "1 aug"  },
  { id: 4, title: "Träna 30 min",    icon: BarbellIcon,          frequency: "Dagligen", time: "17:30", streak: 8,  total: 30, avg: 78, record: 15, startDate: "5 aug"  },
  { id: 5, title: "Drick 2L vatten", icon: DropIcon,             frequency: "Dagligen", time: "20:00", streak: 5,  total: 22, avg: 80, record: 12, startDate: "10 aug" },
]

const HABIT_COLORS = [
  "var(--chart-1)", "var(--chart-2)", "var(--chart-3)",
  "var(--chart-4)", "var(--chart-5)",
]

// ─── Week circles ──────────────────────────────────────────────────────────────

type DayState = "done" | "today" | "missed" | "future"

const WEEK = [
  { label: "M", state: "done"   as DayState },
  { label: "T", state: "done"   as DayState },
  { label: "O", state: "done"   as DayState },
  { label: "T", state: "missed" as DayState },  // past, not completed
  { label: "F", state: "today"  as DayState },  // today = Friday
  { label: "L", state: "future" as DayState },
  { label: "S", state: "future" as DayState },
]

function WeekDot({ label, state, color }: { label: string; state: DayState; color: string }) {
  const isDone   = state === "done"
  const isToday  = state === "today"
  const isFuture = state === "future" || state === "missed"

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="size-8 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: isDone ? color : "transparent",
          border: isDone ? "none" : `2px solid ${isToday ? color : "var(--muted-foreground)"}`,
          opacity: isFuture ? 0.35 : 1,
        }}
      >
        {isDone && <CheckIcon size={14} weight="bold" color="white" />}
      </div>
      <span
        className="text-xs"
        style={{
          color: isToday ? color : "var(--muted-foreground)",
          fontWeight: isToday ? 600 : 400,
        }}
      >
        {label}
      </span>
    </div>
  )
}

// ─── Bar chart history data (28 days, ~86% completion) ────────────────────────

const HISTORY = [
  // v.24
  { label: "v.24", done: false },
  { label: "",     done: true  },
  { label: "",     done: true  },
  { label: "",     done: true  },
  { label: "",     done: true  },
  { label: "",     done: true  },
  { label: "",     done: true  },
  // v.25
  { label: "v.25", done: true  },
  { label: "",     done: false },
  { label: "",     done: true  },
  { label: "",     done: true  },
  { label: "",     done: false },
  { label: "",     done: true  },
  { label: "",     done: true  },
  // v.26
  { label: "v.26", done: true  },
  { label: "",     done: true  },
  { label: "",     done: true  },
  { label: "",     done: true  },
  { label: "",     done: true  },
  { label: "",     done: true  },
  { label: "",     done: true  },
  // v.27
  { label: "v.27", done: true  },
  { label: "",     done: true  },
  { label: "",     done: true  },
  { label: "",     done: false }, // today
  { label: "",     done: false }, // future
  { label: "",     done: false },
  { label: "",     done: false },
].map((d) => ({ ...d, value: 1 }))

// ─── Page ──────────────────────────────────────────────────────────────────────

export function HabitDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const habit  = HABITS.find((h) => h.id === Number(id)) ?? HABITS[2]
  const HabitIcon = habit.icon
  const habitIndex = HABITS.findIndex((h) => h.id === habit.id)
  const color = HABIT_COLORS[habitIndex % HABIT_COLORS.length]
  const doneThisWeek = WEEK.filter((d) => d.state === "done").length
  const totalDaysThisWeek = WEEK.filter((d) => d.state === "done" || d.state === "missed" || d.state === "today").length
  const daysLeft = habit.record - habit.streak

  return (
    <>
      {/* ── Header ── */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="flex-1">
          <BreadcrumbList>
            <BreadcrumbItem>
              <button
                onClick={() => navigate("/")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Start
              </button>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-1.5">
                <HabitIcon size={15} style={{ color }} />
                {habit.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Redigera</Button>
          <Button variant="destructive" size="sm">Ta bort</Button>
        </div>
      </header>

      {/* ── Content ── */}
      <div className="flex flex-col gap-5 p-6 max-w-4xl mx-auto w-full">

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4" style={{ gridAutoRows: "130px" }}>
          <Card className="h-full py-0">
            <CardContent style={{ padding: "16px 20px" }} className="flex flex-col justify-between h-full">
              <p className="text-xs font-normal uppercase tracking-widest text-muted-foreground opacity-60">Totalt genomfört</p>
              <div className="flex flex-col gap-1 items-end">
                <p className="flex items-baseline gap-1" style={{ color }}>
                  <span className="text-4xl font-bold">{habit.total}</span>
                  <span className="text-base font-medium text-muted-foreground">gånger</span>
                </p>
                <p className="text-xs text-muted-foreground opacity-60">Sedan {habit.startDate}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="h-full py-0">
            <CardContent style={{ padding: "16px 20px" }} className="flex flex-col justify-between h-full">
              <p className="text-xs font-normal uppercase tracking-widest text-muted-foreground opacity-60">Genomsnitt</p>
              <div className="flex flex-col gap-1 items-end">
                <p className="flex items-baseline gap-1" style={{ color }}>
                  <span className="text-4xl font-bold">{habit.avg}</span>
                  <span className="text-base font-medium text-muted-foreground">%</span>
                </p>
                <p className="text-xs text-muted-foreground opacity-60">Senaste 28 dagarna</p>
              </div>
            </CardContent>
          </Card>
          <Card className="h-full py-0">
            <CardContent style={{ padding: "16px 20px" }} className="flex flex-col justify-between h-full">
              <p className="text-xs font-normal uppercase tracking-widest text-muted-foreground opacity-60">Rekord</p>
              <div className="flex flex-col gap-1 items-end">
                <p className="flex items-baseline gap-1" style={{ color }}>
                  <span className="text-4xl font-bold">{habit.record}</span>
                  <span className="text-base font-medium text-muted-foreground">dagar</span>
                </p>
                <p className="text-xs text-muted-foreground opacity-60">
                  {habit.streak >= habit.record ? "Du har slagit ditt rekord!" : `${daysLeft} dagar till nytt rekord`}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Denna vecka */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-normal uppercase tracking-widest text-muted-foreground opacity-60">Denna vecka</p>
            <p className="text-xs text-muted-foreground opacity-60">{doneThisWeek} av {totalDaysThisWeek} dagar</p>
          </div>
          <div className="flex gap-3">
            {WEEK.map((d, i) => (
              <WeekDot key={i} label={d.label} state={d.state} color={color} />
            ))}
          </div>
        </div>

        {/* Historik */}
        <Card>
          <CardContent className="flex flex-col gap-4" style={{ padding: "8px 20px" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold">Historik</p>
                <p className="text-xs text-muted-foreground opacity-60">Senaste 28 dagarna</p>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ backgroundColor: `color-mix(in oklch, ${color} 15%, transparent)`, color }}
              >
                {habit.avg}% klarat
              </span>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={HISTORY} barCategoryGap={2} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="habitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" style={{ stopColor: color, stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.4 }} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  interval={0}
                />
                <YAxis hide domain={[0, 1]} />
                <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                  {HISTORY.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.done ? "url(#habitGradient)" : "var(--border)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Idag */}
        <Card>
          <CardContent className="flex items-center justify-between" style={{ padding: "10px 20px" }}>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold">Idag — Torsdag 27 aug</p>
              <p className="text-xs text-muted-foreground opacity-60">
                Påminnelse satt till {habit.time} · {habit.frequency}
              </p>
            </div>
            <Button
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                background: "linear-gradient(135deg, #5649d4 0%, #6d5cf6 45%, #8b5cf6 78%, #f472b6 100%)",
                color: "white",
                border: "none",
              }}
            >
              <CheckIcon size={14} weight="bold" />
              Klar för idag
            </Button>
          </CardContent>
        </Card>

      </div>
    </>
  )
}
