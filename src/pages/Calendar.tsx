import { useState } from "react"

import {
  ArrowLeft,
  ArrowRight,
  Barbell,
  BookOpen,
  Check,
  CheckCircle,
  Circle,
  Code,
  Drop,
  Fire,
  ListChecks,
  PersonSimpleRun,
} from "@phosphor-icons/react"

type CalendarDay = {
  day: number
  currentMonth: boolean
  completed: number
  total: number
  streak: number
  future?: boolean
}

const weekdays = ["M", "T", "O", "T", "F", "L", "S"]

const days: CalendarDay[] = [
  { day: 27, currentMonth: false, completed: 0, total: 5, streak: 0 },
  { day: 28, currentMonth: false, completed: 0, total: 5, streak: 0 },
  { day: 29, currentMonth: false, completed: 0, total: 5, streak: 0 },
  { day: 30, currentMonth: false, completed: 0, total: 5, streak: 0 },
  { day: 31, currentMonth: false, completed: 0, total: 5, streak: 0 },

  { day: 1, currentMonth: true, completed: 5, total: 5, streak: 1 },
  { day: 2, currentMonth: true, completed: 5, total: 5, streak: 2 },
  { day: 3, currentMonth: true, completed: 5, total: 5, streak: 3 },
  { day: 4, currentMonth: true, completed: 5, total: 5, streak: 4 },
  { day: 5, currentMonth: true, completed: 4, total: 5, streak: 4 },
  { day: 6, currentMonth: true, completed: 5, total: 5, streak: 5 },
  { day: 7, currentMonth: true, completed: 5, total: 5, streak: 6 },
  { day: 8, currentMonth: true, completed: 3, total: 5, streak: 6 },
  { day: 9, currentMonth: true, completed: 5, total: 5, streak: 7 },

  { day: 10, currentMonth: true, completed: 5, total: 5, streak: 8 },
  { day: 11, currentMonth: true, completed: 4, total: 5, streak: 8 },
  { day: 12, currentMonth: true, completed: 0, total: 5, streak: 0 },
  { day: 13, currentMonth: true, completed: 5, total: 5, streak: 9 },
  { day: 14, currentMonth: true, completed: 5, total: 5, streak: 10 },
  { day: 15, currentMonth: true, completed: 3, total: 5, streak: 10 },
  { day: 16, currentMonth: true, completed: 5, total: 5, streak: 11 },

  { day: 17, currentMonth: true, completed: 5, total: 5, streak: 12 },
  { day: 18, currentMonth: true, completed: 5, total: 5, streak: 13 },
  { day: 19, currentMonth: true, completed: 2, total: 5, streak: 13 },
  { day: 20, currentMonth: true, completed: 5, total: 5, streak: 14 },
  { day: 21, currentMonth: true, completed: 5, total: 5, streak: 15 },
  { day: 22, currentMonth: true, completed: 5, total: 5, streak: 16 },
  { day: 23, currentMonth: true, completed: 5, total: 5, streak: 17 },

  { day: 24, currentMonth: true, completed: 5, total: 5, streak: 18 },
  { day: 25, currentMonth: true, completed: 5, total: 5, streak: 19 },
  { day: 26, currentMonth: true, completed: 5, total: 5, streak: 20 },
  { day: 27, currentMonth: true, completed: 3, total: 5, streak: 12 },

  {
    day: 28,
    currentMonth: true,
    completed: 0,
    total: 5,
    streak: 0,
    future: true,
  },
  {
    day: 29,
    currentMonth: true,
    completed: 0,
    total: 5,
    streak: 0,
    future: true,
  },
  {
    day: 30,
    currentMonth: true,
    completed: 0,
    total: 5,
    streak: 0,
    future: true,
  },
  {
    day: 31,
    currentMonth: true,
    completed: 0,
    total: 5,
    streak: 0,
    future: true,
  },

  {
    day: 1,
    currentMonth: false,
    completed: 0,
    total: 5,
    streak: 0,
    future: true,
  },
  {
    day: 2,
    currentMonth: false,
    completed: 0,
    total: 5,
    streak: 0,
    future: true,
  },
  {
    day: 3,
    currentMonth: false,
    completed: 0,
    total: 5,
    streak: 0,
    future: true,
  },
  {
    day: 4,
    currentMonth: false,
    completed: 0,
    total: 5,
    streak: 0,
    future: true,
  },
  {
    day: 5,
    currentMonth: false,
    completed: 0,
    total: 5,
    streak: 0,
    future: true,
  },
  {
    day: 6,
    currentMonth: false,
    completed: 0,
    total: 5,
    streak: 0,
    future: true,
  },
]

const habits = [
  {
    name: "Morgonlöpning",
    time: "Dagligen · 07:00",
    icon: PersonSimpleRun,
    color: "var(--chart-1)",
    background: "rgba(109, 92, 246, 0.12)",
  },
  {
    name: "Träna 30 min",
    time: "Dagligen · 17:30",
    icon: Barbell,
    color: "var(--chart-2)",
    background: "rgba(139, 92, 246, 0.12)",
  },
  {
    name: "Drick 2L vatten",
    time: "Dagligen · 20:00",
    icon: Drop,
    color: "var(--chart-3)",
    background: "rgba(168, 155, 250, 0.12)",
  },
  {
    name: "Läs 20 sidor",
    time: "Dagligen · 21:00",
    icon: BookOpen,
    color: "var(--chart-4)",
    background: "rgba(192, 132, 252, 0.12)",
  },
  {
    name: "Koda",
    time: "Dagligen · 20:00",
    icon: Code,
    color: "var(--chart-5)",
    background: "rgba(244, 114, 182, 0.12)",
  },
]

function ProgressRing({
  completed,
}: {
  completed: number
}) {
  const colors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ]

  const segments = colors
    .map((color, index) => {
      const start = index * 72
      const end = start + 72

      const segmentColor =
        index < completed
          ? color
          : "var(--muted)"

      return `${segmentColor} ${start}deg ${end}deg`
    })
    .join(", ")

  return (
    <div
      className="h-7 w-7 rounded-full p-[3px]"
      style={{
        background: `conic-gradient(${segments})`,
      }}
    >
      <div className="h-full w-full rounded-full bg-card" />
    </div>
  )
}

export default function Calendar() {
  const [selectedDay, setSelectedDay] =
    useState<CalendarDay>(
      days.find(
        (date) =>
          date.day === 27 &&
          date.currentMonth
      ) as CalendarDay
    )

  const completionPercentage =
    Math.round(
      (selectedDay.completed /
        selectedDay.total) *
        100
    )

  return (
    <div className="w-full max-w-[900px]">
      {/* HEADER */}

      <header className="mb-6 flex items-start justify-between border-b pb-5">
        <div>
          <h1 className="text-[22px] font-bold tracking-[-0.04em] text-primary">
            Kalender
          </h1>

          <p className="mt-1 text-xs text-muted-foreground">
            Augusti 2026
          </p>
        </div>

        <div className="flex gap-1">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Föregående månad"
          >
            <ArrowLeft size={13} />
          </button>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Nästa månad"
          >
            <ArrowRight size={13} />
          </button>
        </div>
      </header>

      {/* MÅNADSRESULTAT */}

      <section
        className="mb-5 overflow-hidden rounded-[10px] border border-primary p-5"
        style={{
          background:
            "radial-gradient(ellipse 117% 80% at 108% 0%, rgba(109,92,246,0.50) 0%, rgba(86,73,212,0.25) 25%, rgba(72,57,194,0.06) 55%, transparent 75%), var(--card)",
        }}
      >
        <div className="flex min-h-[120px] justify-between gap-8">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
              Månadsresultat
            </p>

            <div className="mt-2 flex items-end gap-2">
              <span className="text-[30px] font-extrabold leading-none tracking-[-0.04em]">
                86
              </span>

              <span className="mb-[2px] text-xs">
                % klarat
              </span>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              23 av 27 dagar fullständiga
            </p>
          </div>

          <div>
            <p className="mb-2 text-right text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Vanor
            </p>

            <div className="space-y-[3px]">
              {habits.map((habit) => (
                <div
                  key={habit.name}
                  className="flex items-center gap-[7px] text-[10px] text-muted-foreground"
                >
                  <span
                    className="h-[7px] w-[7px] rounded-full"
                    style={{
                      background:
                        habit.color,
                    }}
                  />

                  {habit.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* KALENDER */}

      <section className="overflow-hidden rounded-[10px] border bg-card">
        <div className="grid grid-cols-7 border-b">
          {weekdays.map(
            (weekday, index) => (
              <div
                key={`${weekday}-${index}`}
                className="py-[10px] text-center text-[10px] font-medium tracking-[0.05em] text-muted-foreground"
              >
                {weekday}
              </div>
            )
          )}
        </div>

        <div className="grid grid-cols-7">
          {days.map((date, index) => {
            const isToday =
              date.day === 27 &&
              date.currentMonth

            const isSelected =
              selectedDay.day ===
                date.day &&
              selectedDay.currentMonth ===
                date.currentMonth

            return (
              <button
                key={`${date.day}-${index}`}
                type="button"
                disabled={
                  !date.currentMonth ||
                  date.future
                }
                onClick={() =>
                  setSelectedDay(date)
                }
                className={[
                  "flex min-h-[72px] flex-col items-center justify-center gap-[6px]",
                  "border-b border-r px-2 py-3 text-[10px] transition",
                  !date.currentMonth ||
                  date.future
                    ? "cursor-default opacity-25"
                    : "cursor-pointer hover:bg-muted/40",
                  isToday
                    ? "bg-primary/[0.06]"
                    : "",
                  isSelected
                    ? "ring-1 ring-inset ring-primary/40"
                    : "",
                ].join(" ")}
              >
                <span
                  className={
                    isToday
                      ? "font-semibold text-primary"
                      : "text-foreground"
                  }
                >
                  {date.day}
                </span>

                <div
                  className={
                    isToday
                      ? "rounded-full ring-1 ring-primary/70 ring-offset-2 ring-offset-card"
                      : ""
                  }
                >
                  <ProgressRing
                    completed={
                      date.completed
                    }
                  />
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* VALD DAG */}

      <section className="mt-5 overflow-hidden rounded-[10px] border bg-card">
        <div className="flex items-center gap-4 border-b px-5 py-4">
          <div
            className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full p-[6px]"
            style={{
              background: `conic-gradient(
                var(--primary) 0% ${completionPercentage}%,
                var(--muted) ${completionPercentage}% 100%
              )`,
            }}
          >
            <div className="flex h-full w-full items-center justify-center rounded-full bg-card">
              <span className="text-sm font-bold">
                {completionPercentage}%
              </span>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-xs font-semibold">
              {selectedDay.day} augusti
            </h3>

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="flex items-center gap-1 rounded-full border bg-muted px-2 py-1 text-[9px]">
                <CheckCircle
                  size={10}
                  className="text-primary"
                />

                {selectedDay.completed} klara
              </span>

              <span className="flex items-center gap-1 rounded-full border bg-muted px-2 py-1 text-[9px]">
                <Circle size={10} />

                {selectedDay.total -
                  selectedDay.completed}{" "}
                återstår
              </span>

              <span className="flex items-center gap-1 rounded-full border bg-muted px-2 py-1 text-[9px]">
                <Fire
                  size={10}
                  weight="fill"
                  className="text-orange-500"
                />

                Streak{" "}
                {selectedDay.streak}
              </span>

              <span className="flex items-center gap-1 rounded-full border bg-muted px-2 py-1 text-[9px]">
                <ListChecks size={10} />

                {selectedDay.total} planerade
              </span>
            </div>
          </div>
        </div>

        <div className="px-5 py-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Vanor denna dag
          </p>
        </div>

        {habits.map((habit, index) => {
          const Icon = habit.icon

          const completed =
            index <
            selectedDay.completed

          return (
            <div
              key={habit.name}
              className="flex items-center gap-3 border-t px-5 py-3"
              style={{
                borderLeft: `3px solid ${habit.color}`,
              }}
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
                style={{
                  color: habit.color,
                  background:
                    habit.background,
                  borderColor:
                    habit.color,
                }}
              >
                <Icon size={14} />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={[
                    "text-xs font-medium",
                    completed
                      ? "text-muted-foreground"
                      : "",
                  ].join(" ")}
                >
                  {habit.name}
                </p>

                <p className="mt-[1px] text-[9px] text-muted-foreground">
                  {habit.time}
                </p>
              </div>

              {completed ? (
                <div className="flex items-center gap-1 text-[9px] font-medium text-primary">
                  <Check
                    size={11}
                    weight="bold"
                  />

                  Klar
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                  <Circle size={10} />

                  Inte klar
                </div>
              )}
            </div>
          )
        })}
      </section>
    </div>
  )
}
