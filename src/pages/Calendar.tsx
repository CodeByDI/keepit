import { useState } from "react"

import {
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
  date: Date
  day: number
  currentMonth: boolean
  completed: number
  total: number
  streak: number
  future: boolean
  isToday: boolean
}

type HabitId =
  | "running"
  | "training"
  | "water"
  | "reading"
  | "coding"

type Habit = {
  id: HabitId
  name: string
  time: string
  icon: typeof PersonSimpleRun
  color: string
  background: string
}

const TOTAL_HABITS = 5

const weekdays = ["M", "T", "O", "T", "F", "L", "S"]

const habits: Habit[] = [
  {
    id: "running",
    name: "Morgonlöpning",
    time: "Dagligen · 07:00",
    icon: PersonSimpleRun,
    color: "var(--chart-1)",
    background: "rgba(109, 92, 246, 0.12)",
  },
  {
    id: "training",
    name: "Träna 30 min",
    time: "Dagligen · 17:30",
    icon: Barbell,
    color: "var(--chart-2)",
    background: "rgba(139, 92, 246, 0.12)",
  },
  {
    id: "water",
    name: "Drick 2L vatten",
    time: "Dagligen · 20:00",
    icon: Drop,
    color: "var(--chart-3)",
    background: "rgba(168, 155, 250, 0.12)",
  },
  {
    id: "reading",
    name: "Läs 20 sidor",
    time: "Dagligen · 21:00",
    icon: BookOpen,
    color: "var(--chart-4)",
    background: "rgba(192, 132, 252, 0.12)",
  },
  {
    id: "coding",
    name: "Koda",
    time: "Dagligen · 20:00",
    icon: Code,
    color: "var(--chart-5)",
    background: "rgba(244, 114, 182, 0.12)",
  },
]

function getMockCompleted(day: number) {
  const pattern = [5, 5, 4, 5, 3, 5, 4]

  return pattern[(day - 1) % pattern.length]
}

function getMockStreak(
  day: number,
  completed: number
) {
  if (completed === TOTAL_HABITS) {
    return Math.min(day, 21)
  }

  return Math.max(
    0,
    Math.min(day - 1, 12)
  )
}

function isHabitCompleted(
  day: CalendarDay,
  habitIndex: number
) {
  if (day.future || !day.currentMonth) {
    return false
  }

  return habitIndex < day.completed
}

function createCalendarDays(
  today: Date
): CalendarDay[] {
  const year = today.getFullYear()
  const month = today.getMonth()

  const normalizedToday = new Date(
    year,
    month,
    today.getDate()
  )

  const firstDayOfMonth = new Date(
    year,
    month,
    1
  )

  const mondayOffset =
    (firstDayOfMonth.getDay() + 6) % 7

  const gridStart = new Date(
    year,
    month,
    1 - mondayOffset
  )

  const calendarDays: CalendarDay[] = []

  for (let index = 0; index < 42; index++) {
    const date = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + index
    )

    const currentMonth =
      date.getFullYear() === year &&
      date.getMonth() === month

    const isToday =
      date.getFullYear() ===
        normalizedToday.getFullYear() &&
      date.getMonth() ===
        normalizedToday.getMonth() &&
      date.getDate() ===
        normalizedToday.getDate()

    const future =
      date.getTime() >
      normalizedToday.getTime()

    const completed =
      currentMonth && !future
        ? getMockCompleted(date.getDate())
        : 0

    const streak =
      currentMonth && !future
        ? getMockStreak(
            date.getDate(),
            completed
          )
        : 0

    calendarDays.push({
      date,
      day: date.getDate(),
      currentMonth,
      completed,
      total: TOTAL_HABITS,
      streak,
      future,
      isToday,
    })
  }

  return calendarDays
}

function capitalizeFirstLetter(
  value: string
) {
  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  )
}

function ProgressRing({
  completed,
  selectedHabitIndex,
}: {
  completed: number
  selectedHabitIndex: number | null
}) {
  const colors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ]

  if (selectedHabitIndex !== null) {
    const habitCompleted =
      selectedHabitIndex < completed

    return (
      <div
        className="h-7 w-7 rounded-full p-[3px]"
        style={{
          background: habitCompleted
            ? colors[selectedHabitIndex]
            : "var(--muted)",
        }}
      >
        <div className="h-full w-full rounded-full bg-card" />
      </div>
    )
  }

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
  const today = new Date()

  const calendarDays =
    createCalendarDays(today)

  const currentMonthLabel =
    capitalizeFirstLetter(
      new Intl.DateTimeFormat("sv-SE", {
        month: "long",
        year: "numeric",
      }).format(today)
    )

  const initialSelectedDay =
    calendarDays.find(
      (date) => date.isToday
    ) as CalendarDay

  const [selectedDay, setSelectedDay] =
    useState<CalendarDay>(
      initialSelectedDay
    )

  const [selectedHabitId, setSelectedHabitId] =
    useState<"all" | HabitId>("all")

  const selectedHabitIndex =
    selectedHabitId === "all"
      ? null
      : habits.findIndex(
          (habit) =>
            habit.id === selectedHabitId
        )

  const selectedHabit =
    selectedHabitIndex === null
      ? null
      : habits[selectedHabitIndex]

  const selectedDateLabel =
    capitalizeFirstLetter(
      new Intl.DateTimeFormat("sv-SE", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(selectedDay.date)
    )

  const elapsedDays =
    calendarDays.filter(
      (date) =>
        date.currentMonth &&
        !date.future
    )

  let monthPercentage = 0
  let monthResultText = ""

  if (selectedHabitIndex === null) {
    const fullyCompletedDays =
      elapsedDays.filter(
        (date) =>
          date.completed === date.total
      ).length

    const totalCompletedHabits =
      elapsedDays.reduce(
        (sum, date) =>
          sum + date.completed,
        0
      )

    const totalPossibleHabits =
      elapsedDays.length * TOTAL_HABITS

    monthPercentage =
      totalPossibleHabits > 0
        ? Math.round(
            (totalCompletedHabits /
              totalPossibleHabits) *
              100
          )
        : 0

    monthResultText =
      `${fullyCompletedDays} av ${elapsedDays.length} dagar fullständiga`
  } else {
    const completedHabitDays =
      elapsedDays.filter((date) =>
        isHabitCompleted(
          date,
          selectedHabitIndex
        )
      ).length

    monthPercentage =
      elapsedDays.length > 0
        ? Math.round(
            (completedHabitDays /
              elapsedDays.length) *
              100
          )
        : 0

    monthResultText =
      `${completedHabitDays} av ${elapsedDays.length} dagar genomförda`
  }

  const selectedDayCompleted =
    selectedHabitIndex === null
      ? selectedDay.completed
      : isHabitCompleted(
            selectedDay,
            selectedHabitIndex
          )
        ? 1
        : 0

  const selectedDayTotal =
    selectedHabitIndex === null
      ? selectedDay.total
      : 1

  const completionPercentage =
    Math.round(
      (selectedDayCompleted /
        selectedDayTotal) *
        100
    )

  const visibleHabits =
    selectedHabit
      ? [selectedHabit]
      : habits

  return (
    <div className="w-full max-w-[900px]">
      {/* HEADER */}

      <header className="mb-6 border-b pb-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-bold tracking-[-0.04em] text-primary">
              Kalender
            </h1>

            <p className="mt-1 text-xs text-muted-foreground">
              {currentMonthLabel}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="habit-filter"
              className="text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"
            >
              Visa vana
            </label>

            <select
              id="habit-filter"
              value={selectedHabitId}
              onChange={(event) =>
                setSelectedHabitId(
                  event.target.value as
                    | "all"
                    | HabitId
                )
              }
              className="h-8 min-w-[170px] rounded-md border bg-background px-2 text-xs text-foreground outline-none transition focus:border-primary"
            >
              <option value="all">
                Alla vanor
              </option>

              {habits.map((habit) => (
                <option
                  key={habit.id}
                  value={habit.id}
                >
                  {habit.name}
                </option>
              ))}
            </select>
          </div>
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
                {monthPercentage}
              </span>

              <span className="mb-[2px] text-xs">
                % klarat
              </span>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              {monthResultText}
            </p>
          </div>

          <div>
            <p className="mb-2 text-right text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {selectedHabit
                ? "Vald vana"
                : "Vanor"}
            </p>

            <div className="space-y-[3px]">
              {visibleHabits.map((habit) => (
                <div
                  key={habit.id}
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
          {calendarDays.map((date) => {
            const isSelected =
              selectedDay.date.getFullYear() ===
                date.date.getFullYear() &&
              selectedDay.date.getMonth() ===
                date.date.getMonth() &&
              selectedDay.date.getDate() ===
                date.date.getDate()

            return (
              <button
                key={date.date.getTime()}
                type="button"
                disabled={!date.currentMonth}
                onClick={() =>
                  setSelectedDay(date)
                }
                className={[
                  "flex min-h-[72px] flex-col items-center justify-center gap-[6px]",
                  "border-b border-r px-2 py-3 text-[10px] transition",

                  date.currentMonth
                    ? "cursor-pointer hover:bg-muted/40"
                    : "cursor-default opacity-25",

                  date.isToday
                    ? "bg-primary/[0.06]"
                    : "",

                  isSelected
                    ? "ring-1 ring-inset ring-primary/40"
                    : "",
                ].join(" ")}
              >
                <span
                  className={
                    date.isToday
                      ? "font-semibold text-primary"
                      : "text-foreground"
                  }
                >
                  {date.day}
                </span>

                <div
                  className={
                    date.isToday
                      ? "rounded-full ring-1 ring-primary/70 ring-offset-2 ring-offset-card"
                      : ""
                  }
                >
                  <ProgressRing
                    completed={
                      date.completed
                    }
                    selectedHabitIndex={
                      selectedHabitIndex
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
              {selectedDateLabel}
            </h3>

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="flex items-center gap-1 rounded-full border bg-muted px-2 py-1 text-[9px]">
                <CheckCircle
                  size={10}
                  className="text-primary"
                />

                {selectedDayCompleted} klara
              </span>

              <span className="flex items-center gap-1 rounded-full border bg-muted px-2 py-1 text-[9px]">
                <Circle size={10} />

                {selectedDayTotal -
                  selectedDayCompleted}{" "}
                återstår
              </span>

              <span className="flex items-center gap-1 rounded-full border bg-muted px-2 py-1 text-[9px]">
                <Fire
                  size={10}
                  weight="fill"
                  className="text-orange-500"
                />

                Streak {selectedDay.streak}
              </span>

              <span className="flex items-center gap-1 rounded-full border bg-muted px-2 py-1 text-[9px]">
                <ListChecks size={10} />

                {selectedDayTotal} planerade
              </span>
            </div>
          </div>
        </div>

        <div className="px-5 py-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            {selectedHabit
              ? "Vald vana denna dag"
              : "Vanor denna dag"}
          </p>
        </div>

        {visibleHabits.map((habit) => {
          const Icon = habit.icon

          const habitIndex =
            habits.findIndex(
              (item) =>
                item.id === habit.id
            )

          const completed =
            isHabitCompleted(
              selectedDay,
              habitIndex
            )

          return (
            <div
              key={habit.id}
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

              {selectedDay.future ? (
                <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                  <Circle size={10} />
                  Planerad
                </div>
              ) : completed ? (
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
