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

import {
  WeeklyHabitView,
  type WeeklyHabitDay,
} from "@/components/weekly-habit-view"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"

type CalendarDay = {
  date: Date
  day: number
  currentMonth: boolean
  completed: number
  total: number
  future: boolean
  isToday: boolean
}

const TOTAL_HABITS = 5

const weekdays = [
  "M",
  "T",
  "O",
  "T",
  "F",
  "L",
  "S",
]

const habits = [
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
] as const

type HabitId =
  (typeof habits)[number]["id"]

/*
  Tillfällig mockhistorik.

  true = genomförd
  false = missad

  När databasen kopplas in ersätts
  den här delen med riktig historik.
*/
const HABIT_COMPLETION_PATTERNS = [
  [
    true,
    true,
    true,
    true,
    false,
    true,
    true,
  ],
  [
    true,
    true,
    false,
    true,
    true,
    true,
    true,
  ],
  [
    true,
    true,
    true,
    true,
    true,
    false,
    true,
  ],
  [
    true,
    false,
    true,
    true,
    true,
    true,
    true,
  ],
  [
    false,
    true,
    true,
    false,
    true,
    true,
    true,
  ],
] as const

function sameDate(
  first: Date,
  second: Date
) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  )
}

function sameMonth(
  first: Date,
  second: Date
) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth()
  )
}

function normalizeDate(
  date: Date
) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  )
}

/*
  Stabilt index 0–6.

  Date.UTC används så sommartid inte
  kan flytta mockhistoriken en dag.
*/
function getMockPatternIndex(
  date: Date
) {
  const dateUtc =
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    )

  const epochUtc =
    Date.UTC(
      2026,
      0,
      1
    )

  const millisecondsPerDay =
    24 * 60 * 60 * 1000

  const dayDifference =
    Math.floor(
      (
        dateUtc -
        epochUtc
      ) /
        millisecondsPerDay
    )

  return (
    (
      dayDifference % 7
    ) +
    7
  ) % 7
}

function isHabitCompletedOnDate(
  date: Date,
  habitIndex: number
) {
  const pattern =
    HABIT_COMPLETION_PATTERNS[
      habitIndex
    ]

  if (!pattern) {
    return false
  }

  const patternIndex =
    getMockPatternIndex(date)

  return pattern[
    patternIndex
  ]
}

function getMockCompleted(
  date: Date
) {
  return habits.reduce(
    (
      completed,
      _habit,
      habitIndex
    ) => {
      const habitCompleted =
        isHabitCompletedOnDate(
          date,
          habitIndex
        )

      return (
        completed +
        (habitCompleted ? 1 : 0)
      )
    },
    0
  )
}

function isDayCompletedForStreak(
  date: Date,
  selectedHabitIndex:
    | number
    | null
) {
  if (
    selectedHabitIndex === null
  ) {
    return (
      getMockCompleted(date) ===
      TOTAL_HABITS
    )
  }

  return isHabitCompletedOnDate(
    date,
    selectedHabitIndex
  )
}

function calculateStreak(
  selectedDate: Date,
  selectedHabitIndex:
    | number
    | null,
  today: Date
) {
  const normalizedSelectedDate =
    normalizeDate(
      selectedDate
    )

  const normalizedToday =
    normalizeDate(
      today
    )

  if (
    normalizedSelectedDate.getTime() >
    normalizedToday.getTime()
  ) {
    return 0
  }

  let streak = 0

  const dateToCheck =
    new Date(
      normalizedSelectedDate
    )

  for (
    let index = 0;
    index < 365;
    index++
  ) {
    const completed =
      isDayCompletedForStreak(
        dateToCheck,
        selectedHabitIndex
      )

    if (!completed) {
      break
    }

    streak++

    dateToCheck.setDate(
      dateToCheck.getDate() - 1
    )
  }

  return streak
}

function createCalendarDays(
  visibleMonth: Date,
  today: Date
): CalendarDay[] {
  const year =
    visibleMonth.getFullYear()

  const month =
    visibleMonth.getMonth()

  const normalizedToday =
    normalizeDate(today)

  const firstDayOfMonth =
    new Date(
      year,
      month,
      1
    )

  const mondayOffset =
    (
      firstDayOfMonth.getDay() +
      6
    ) % 7

  const gridStart =
    new Date(
      year,
      month,
      1 - mondayOffset
    )

  const calendarDays:
    CalendarDay[] = []

  for (
    let index = 0;
    index < 42;
    index++
  ) {
    const date =
      new Date(
        gridStart.getFullYear(),
        gridStart.getMonth(),
        gridStart.getDate() +
          index
      )

    const currentMonth =
      date.getFullYear() === year &&
      date.getMonth() === month

    const isToday =
      sameDate(
        date,
        normalizedToday
      )

    const future =
      date.getTime() >
      normalizedToday.getTime()

    const completed =
      currentMonth &&
      !future
        ? getMockCompleted(
            date
          )
        : 0

    calendarDays.push({
      date,
      day:
        date.getDate(),
      currentMonth,
      completed,
      total:
        TOTAL_HABITS,
      future,
      isToday,
    })
  }

  return calendarDays
}

function createWeekDays(
  referenceDate: Date,
  today: Date,
  selectedHabitIndex:
    | number
    | null
): WeeklyHabitDay[] {
  const normalizedReferenceDate =
    normalizeDate(
      referenceDate
    )

  const normalizedToday =
    normalizeDate(today)

  const dayOffset =
    (
      normalizedReferenceDate.getDay() +
      6
    ) % 7

  const monday =
    new Date(
      normalizedReferenceDate.getFullYear(),
      normalizedReferenceDate.getMonth(),
      normalizedReferenceDate.getDate() -
        dayOffset
    )

  return Array.from(
    { length: 7 },
    (_, index) => {
      const date =
        new Date(
          monday.getFullYear(),
          monday.getMonth(),
          monday.getDate() +
            index
        )

      const future =
        date.getTime() >
        normalizedToday.getTime()

      let completed = 0
      let total =
        TOTAL_HABITS

      if (!future) {
        if (
          selectedHabitIndex ===
          null
        ) {
          completed =
            getMockCompleted(
              date
            )
        } else {
          total = 1

          completed =
            isHabitCompletedOnDate(
              date,
              selectedHabitIndex
            )
              ? 1
              : 0
        }
      } else if (
        selectedHabitIndex !==
        null
      ) {
        total = 1
      }

      return {
        date,
        completed,
        total,
        future,
        isToday:
          sameDate(
            date,
            normalizedToday
          ),
      }
    }
  )
}

function capitalizeFirstLetter(
  value: string
) {
  return (
    value
      .charAt(0)
      .toUpperCase() +
    value.slice(1)
  )
}

function ProgressRing({
  date,
  future,
  selectedHabitIndex,
}: {
  date: Date
  future: boolean
  selectedHabitIndex:
    | number
    | null
}) {
  const colors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ]

  /*
    Framtida dag:
    inga vanor ska se genomförda ut.
  */
  if (future) {
    return (
      <div className="h-7 w-7 rounded-full bg-muted p-[3px]">
        <div className="h-full w-full rounded-full bg-card" />
      </div>
    )
  }

  /*
    En specifik vana är vald.
  */
  if (
    selectedHabitIndex !==
    null
  ) {
    const habitCompleted =
      isHabitCompletedOnDate(
        date,
        selectedHabitIndex
      )

    return (
      <div
        className="h-7 w-7 rounded-full p-[3px]"
        style={{
          background:
            habitCompleted
              ? colors[
                  selectedHabitIndex
                ]
              : "var(--muted)",
        }}
      >
        <div className="h-full w-full rounded-full bg-card" />
      </div>
    )
  }

  /*
    Alla vanor:
    en färgad del per genomförd vana.
  */
  const segments =
    colors
      .map(
        (
          color,
          index
        ) => {
          const start =
            index * 72

          const end =
            start + 72

          const completed =
            isHabitCompletedOnDate(
              date,
              index
            )

          const segmentColor =
            completed
              ? color
              : "var(--muted)"

          return `${segmentColor} ${start}deg ${end}deg`
        }
      )
      .join(", ")

  return (
    <div
      className="h-7 w-7 rounded-full p-[3px]"
      style={{
        background:
          `conic-gradient(${segments})`,
      }}
    >
      <div className="h-full w-full rounded-full bg-card" />
    </div>
  )
}

export default function Calendar() {
  const today =
    new Date()

  const normalizedToday =
    normalizeDate(today)

  const currentMonth =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    )

  const [
    visibleMonth,
    setVisibleMonth,
  ] =
    useState<Date>(
      currentMonth
    )

  const [
    selectedDate,
    setSelectedDate,
  ] =
    useState<Date>(
      normalizedToday
    )

  const [
    selectedHabitId,
    setSelectedHabitId,
  ] =
    useState<
      "all" | HabitId
    >("all")

  const calendarDays =
    createCalendarDays(
      visibleMonth,
      today
    )

  const selectedDay =
    calendarDays.find(
      (date) =>
        sameDate(
          date.date,
          selectedDate
        )
    ) ??
    calendarDays.find(
      (date) =>
        date.currentMonth
    )!

  const selectedHabitIndex =
    selectedHabitId ===
    "all"
      ? null
      : habits.findIndex(
          (habit) =>
            habit.id ===
            selectedHabitId
        )

  const selectedHabit =
    selectedHabitIndex ===
    null
      ? null
      : habits[
          selectedHabitIndex
        ]

  /*
    Texten som visas i Select-triggern.

    Vi visar användarnamn,
    aldrig interna id:n som
    "all", "running" eller "water".
  */
  const selectedHabitLabel =
    selectedHabit
      ? selectedHabit.name
      : "Alla vanor"

  const weeklyDays =
    createWeekDays(
      selectedDay.date,
      today,
      selectedHabitIndex
    )

  const visibleMonthLabel =
    capitalizeFirstLetter(
      new Intl.DateTimeFormat(
        "sv-SE",
        {
          month: "long",
          year: "numeric",
        }
      ).format(
        visibleMonth
      )
    )

  const selectedDateLabel =
    capitalizeFirstLetter(
      new Intl.DateTimeFormat(
        "sv-SE",
        {
          weekday: "long",
          day: "numeric",
          month: "long",
        }
      ).format(
        selectedDay.date
      )
    )

  const canGoNext =
    !sameMonth(
      visibleMonth,
      currentMonth
    )

  function changeMonth(
    direction: number
  ) {
    const nextMonth =
      new Date(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth() +
          direction,
        1
      )

    if (
      nextMonth.getTime() >
      currentMonth.getTime()
    ) {
      return
    }

    setVisibleMonth(
      nextMonth
    )

    if (
      sameMonth(
        nextMonth,
        currentMonth
      )
    ) {
      setSelectedDate(
        normalizedToday
      )
    } else {
      setSelectedDate(
        new Date(
          nextMonth.getFullYear(),
          nextMonth.getMonth(),
          1
        )
      )
    }
  }

  function selectWeekDate(
    date: Date
  ) {
    setSelectedDate(
      date
    )

    if (
      !sameMonth(
        date,
        visibleMonth
      )
    ) {
      setVisibleMonth(
        new Date(
          date.getFullYear(),
          date.getMonth(),
          1
        )
      )
    }
  }

  const elapsedDays =
    calendarDays.filter(
      (date) =>
        date.currentMonth &&
        !date.future
    )

  let monthPercentage = 0
  let monthResultText = ""

  if (
    selectedHabitIndex ===
    null
  ) {
    const fullyCompletedDays =
      elapsedDays.filter(
        (date) =>
          date.completed ===
          date.total
      ).length

    const totalCompletedHabits =
      elapsedDays.reduce(
        (
          sum,
          date
        ) =>
          sum +
          date.completed,
        0
      )

    const totalPossibleHabits =
      elapsedDays.length *
      TOTAL_HABITS

    monthPercentage =
      totalPossibleHabits >
      0
        ? Math.round(
            (
              totalCompletedHabits /
              totalPossibleHabits
            ) *
              100
          )
        : 0

    monthResultText =
      `${fullyCompletedDays} av ${elapsedDays.length} dagar fullständiga`
  } else {
    const completedHabitDays =
      elapsedDays.filter(
        (date) =>
          isHabitCompletedOnDate(
            date.date,
            selectedHabitIndex
          )
      ).length

    monthPercentage =
      elapsedDays.length >
      0
        ? Math.round(
            (
              completedHabitDays /
              elapsedDays.length
            ) *
              100
          )
        : 0

    monthResultText =
      `${completedHabitDays} av ${elapsedDays.length} dagar genomförda`
  }

  const selectedDayCompleted =
    selectedHabitIndex ===
    null
      ? selectedDay.completed
      : selectedDay.future
        ? 0
        : isHabitCompletedOnDate(
              selectedDay.date,
              selectedHabitIndex
            )
          ? 1
          : 0

  const selectedDayTotal =
    selectedHabitIndex ===
    null
      ? selectedDay.total
      : 1

  const completionPercentage =
    Math.round(
      (
        selectedDayCompleted /
        selectedDayTotal
      ) *
        100
    )

  const selectedStreak =
    calculateStreak(
      selectedDay.date,
      selectedHabitIndex,
      today
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
              {visibleMonthLabel}
            </p>
          </div>

          <div className="flex items-end gap-3">
            {/* MÅNADSNAVIGATION */}

            <div className="flex gap-1">
              <button
                type="button"
                onClick={() =>
                  changeMonth(-1)
                }
                className="flex h-8 w-8 items-center justify-center rounded-md border text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Föregående månad"
                title="Föregående månad"
              >
                <ArrowLeft
                  size={14}
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  changeMonth(1)
                }
                disabled={
                  !canGoNext
                }
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-md border transition",
                  canGoNext
                    ? "text-muted-foreground hover:bg-muted hover:text-foreground"
                    : "cursor-not-allowed opacity-30",
                ].join(" ")}
                aria-label="Nästa månad"
                title="Nästa månad"
              >
                <ArrowRight
                  size={14}
                />
              </button>
            </div>

            {/* VANEFILTER */}

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Visa vana
              </label>

              <Select
                value={
                  selectedHabitId
                }
                onValueChange={(
                  value
                ) =>
                  setSelectedHabitId(
                    value as
                      | "all"
                      | HabitId
                  )
                }
              >
                <SelectTrigger
                  className="min-w-[170px] text-xs"
                  aria-label="Visa vana"
                >
                  <span className="flex flex-1 text-left">
                    {
                      selectedHabitLabel
                    }
                  </span>
                </SelectTrigger>

                <SelectContent
                  align="start"
                >
                  <SelectItem
                    value="all"
                  >
                    Alla vanor
                  </SelectItem>

                  {habits.map(
                    (
                      habit
                    ) => (
                      <SelectItem
                        key={
                          habit.id
                        }
                        value={
                          habit.id
                        }
                      >
                        {
                          habit.name
                        }
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
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
                {
                  monthPercentage
                }
              </span>

              <span className="mb-[2px] text-xs">
                % klarat
              </span>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              {
                monthResultText
              }
            </p>
          </div>

          <div>
            <p className="mb-2 text-right text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {selectedHabit
                ? "Vald vana"
                : "Vanor"}
            </p>

            <div className="space-y-[3px]">
              {visibleHabits.map(
                (
                  habit
                ) => (
                  <div
                    key={
                      habit.id
                    }
                    className="flex items-center gap-[7px] text-[10px] text-muted-foreground"
                  >
                    <span
                      className="h-[7px] w-[7px] rounded-full"
                      style={{
                        background:
                          habit.color,
                      }}
                    />

                    {
                      habit.name
                    }
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MÅNADSKALENDER */}

      <section className="overflow-hidden rounded-[10px] border bg-card">
        <div className="grid grid-cols-7 border-b">
          {weekdays.map(
            (
              weekday,
              index
            ) => (
              <div
                key={`${weekday}-${index}`}
                className="py-[10px] text-center text-[10px] font-medium tracking-[0.05em] text-muted-foreground"
              >
                {
                  weekday
                }
              </div>
            )
          )}
        </div>

        <div className="grid grid-cols-7">
          {calendarDays.map(
            (
              date
            ) => {
              const isSelected =
                sameDate(
                  selectedDay.date,
                  date.date
                )

              return (
                <button
                  key={
                    date.date.getTime()
                  }
                  type="button"
                  disabled={
                    !date.currentMonth
                  }
                  onClick={() =>
                    setSelectedDate(
                      date.date
                    )
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
                    {
                      date.day
                    }
                  </span>

                  <div
                    className={
                      date.isToday
                        ? "rounded-full ring-1 ring-primary/70 ring-offset-2 ring-offset-card"
                        : ""
                    }
                  >
                    <ProgressRing
                      date={
                        date.date
                      }
                      future={
                        date.future
                      }
                      selectedHabitIndex={
                        selectedHabitIndex
                      }
                    />
                  </div>
                </button>
              )
            }
          )}
        </div>
      </section>

      {/* VECKOVY */}

      <div className="mt-5">
        <WeeklyHabitView
          days={
            weeklyDays
          }
          selectedDate={
            selectedDay.date
          }
          onSelectDate={
            selectWeekDate
          }
          habitLabel={
            selectedHabitLabel
          }
        />
      </div>

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
                {
                  completionPercentage
                }
                %
              </span>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-xs font-semibold">
              {
                selectedDateLabel
              }
            </h3>

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="flex items-center gap-1 rounded-full border bg-muted px-2 py-1 text-[9px]">
                <CheckCircle
                  size={10}
                  className="text-primary"
                />

                {
                  selectedDayCompleted
                }{" "}
                klara
              </span>

              <span className="flex items-center gap-1 rounded-full border bg-muted px-2 py-1 text-[9px]">
                <Circle
                  size={10}
                />

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

                Streak{" "}
                {
                  selectedStreak
                }
              </span>

              <span className="flex items-center gap-1 rounded-full border bg-muted px-2 py-1 text-[9px]">
                <ListChecks
                  size={10}
                />

                {
                  selectedDayTotal
                }{" "}
                planerade
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

        {visibleHabits.map(
          (
            habit
          ) => {
            const Icon =
              habit.icon

            const habitIndex =
              habits.findIndex(
                (
                  item
                ) =>
                  item.id ===
                  habit.id
              )

            const completed =
              !selectedDay.future &&
              isHabitCompletedOnDate(
                selectedDay.date,
                habitIndex
              )

            return (
              <div
                key={
                  habit.id
                }
                className="flex items-center gap-3 border-t px-5 py-3"
                style={{
                  borderLeft:
                    `3px solid ${habit.color}`,
                }}
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
                  style={{
                    color:
                      habit.color,
                    background:
                      habit.background,
                    borderColor:
                      habit.color,
                  }}
                >
                  <Icon
                    size={14}
                  />
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
                    {
                      habit.name
                    }
                  </p>

                  <p className="mt-[1px] text-[9px] text-muted-foreground">
                    {
                      habit.time
                    }
                  </p>
                </div>

                {selectedDay.future ? (
                  <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                    <Circle
                      size={10}
                    />
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
                    <Circle
                      size={10}
                    />
                    Inte klar
                  </div>
                )}
              </div>
            )
          }
        )}
      </section>
    </div>
  )
}
