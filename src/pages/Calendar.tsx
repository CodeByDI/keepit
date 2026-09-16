import { useState, type ElementType } from "react"

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
  Plus,
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

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

import {
  ensureHabitHistorySeeded,
  getHabitCompletion,
  getHabitList,
  type HabitCompletion,
  type StoredHabit,
} from "@/lib/habit-storage"

type CalendarDay = {
  date: Date
  day: number
  currentMonth: boolean
  completed: number
  total: number
  future: boolean
  isToday: boolean
}

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

const ICON_MAP: Record<string, ElementType> = {
  book: BookOpen,
  code: Code,
  run: PersonSimpleRun,
  barbell: Barbell,
  drop: Drop,
  fire: Fire,
}

const weekdays = [
  "Mån",
  "Tis",
  "Ons",
  "Tors",
  "Fre",
  "Lör",
  "Sön",
]

type CalendarHabit = {
  id: string
  storageId: number
  name: string
  time: string
  icon: ElementType
  color: string
  background: string
}

function buildHabitsFromStorage(): CalendarHabit[] {
  const stored = getHabitList()

  const list: StoredHabit[] =
    stored && stored.length > 0
      ? stored
      : [
          {
            id: 1,
            title: "Läs 20 sidor",
            reminder: "Dagligen · 21:00",
            streak: 3,
            icon: "book",
          },
          {
            id: 2,
            title: "Koda",
            reminder: "Dagligen · 20:00",
            streak: 1,
            icon: "code",
          },
          {
            id: 3,
            title: "Morgonlöpning",
            reminder: "Dagligen · 07:00",
            streak: 12,
            icon: "run",
          },
          {
            id: 4,
            title: "Träna 30 min",
            reminder: "Dagligen · 17:30",
            streak: 8,
            icon: "barbell",
          },
          {
            id: 5,
            title: "Drick 2L vatten",
            reminder: "Dagligen · 20:00",
            streak: 5,
            icon: "drop",
          },
        ]

  return list.map((habit, index) => {
    const color =
      CHART_COLORS[index % CHART_COLORS.length]

    return {
      id: habit.id.toString(),
      storageId: habit.id,
      name: habit.title,
      time: habit.reminder,
      icon: ICON_MAP[habit.icon] ?? Plus,
      color,
      background: `color-mix(in oklch, ${color} 12%, transparent)`,
    }
  })
}

function sameDate(
  first: Date,
  second: Date
) {
  return (
    first.getFullYear() ===
      second.getFullYear() &&
    first.getMonth() ===
      second.getMonth() &&
    first.getDate() ===
      second.getDate()
  )
}

function sameMonth(
  first: Date,
  second: Date
) {
  return (
    first.getFullYear() ===
      second.getFullYear() &&
    first.getMonth() ===
      second.getMonth()
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

function isHabitCompletedOnDate(
  history: HabitCompletion[],
  date: Date,
  habitIndex: number,
  habits: CalendarHabit[]
) {
  const habit =
    habits[habitIndex]

  if (!habit) {
    return false
  }

  return getHabitCompletion(
    history,
    habit.storageId,
    date
  )
}

function getCompletedCount(
  history: HabitCompletion[],
  date: Date,
  habits: CalendarHabit[]
) {
  return habits.reduce(
    (
      completed,
      _habit,
      habitIndex
    ) => {
      const habitCompleted =
        isHabitCompletedOnDate(
          history,
          date,
          habitIndex,
          habits
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
  history: HabitCompletion[],
  date: Date,
  selectedHabitIndex:
    | number
    | null,
  habits: CalendarHabit[]
) {
  if (
    selectedHabitIndex ===
    null
  ) {
    return (
      getCompletedCount(
        history,
        date,
        habits
      ) === habits.length
    )
  }

  return isHabitCompletedOnDate(
    history,
    date,
    selectedHabitIndex,
    habits
  )
}

function calculateStreak(
  history: HabitCompletion[],
  selectedDate: Date,
  selectedHabitIndex:
    | number
    | null,
  today: Date,
  habits: CalendarHabit[]
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
        history,
        dateToCheck,
        selectedHabitIndex,
        habits
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
  today: Date,
  history: HabitCompletion[],
  habits: CalendarHabit[]
): CalendarDay[] {
  const year =
    visibleMonth.getFullYear()

  const month =
    visibleMonth.getMonth()

  const normalizedToday =
    normalizeDate(
      today
    )

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
      date.getFullYear() ===
        year &&
      date.getMonth() ===
        month

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
        ? getCompletedCount(
            history,
            date,
            habits
          )
        : 0

    calendarDays.push({
      date,
      day: date.getDate(),
      currentMonth,
      completed,
      total: habits.length,
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
    | null,
  history: HabitCompletion[],
  habits: CalendarHabit[]
): WeeklyHabitDay[] {
  const normalizedReferenceDate =
    normalizeDate(
      referenceDate
    )

  const normalizedToday =
    normalizeDate(
      today
    )

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
    {
      length: 7,
    },
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
        habits.length

      if (!future) {
        if (
          selectedHabitIndex ===
          null
        ) {
          completed =
            getCompletedCount(
              history,
              date,
              habits
            )
        } else {
          total = 1

          completed =
            isHabitCompletedOnDate(
              history,
              date,
              selectedHabitIndex,
              habits
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
  history,
  habits,
}: {
  date: Date
  future: boolean
  selectedHabitIndex:
    | number
    | null
  history: HabitCompletion[]
  habits: CalendarHabit[]
}) {
  if (future) {
    return (
      <div className="h-5 w-5 rounded-full bg-muted p-[2px] sm:h-7 sm:w-7 sm:p-[3px]">
        <div className="h-full w-full rounded-full bg-card" />
      </div>
    )
  }

  if (
    selectedHabitIndex !==
    null
  ) {
    const habitCompleted =
      isHabitCompletedOnDate(
        history,
        date,
        selectedHabitIndex,
        habits
      )

    return (
      <div
        className="h-5 w-5 rounded-full p-[2px] sm:h-7 sm:w-7 sm:p-[3px]"
        style={{
          background:
            habitCompleted
              ? CHART_COLORS[
                  selectedHabitIndex %
                    CHART_COLORS.length
                ]
              : "var(--muted)",
        }}
      >
        <div className="h-full w-full rounded-full bg-card" />
      </div>
    )
  }

  const segmentDeg =
    habits.length > 0
      ? 360 /
        habits.length
      : 360

  const segments =
    habits
      .map(
        (
          habit,
          index
        ) => {
          const start =
            index *
            segmentDeg

          const end =
            start +
            segmentDeg

          const completed =
            isHabitCompletedOnDate(
              history,
              date,
              index,
              habits
            )

          const segmentColor =
            completed
              ? habit.color
              : "var(--muted)"

          return `${segmentColor} ${start}deg ${end}deg`
        }
      )
      .join(", ")

  return (
    <div
      className="h-5 w-5 rounded-full p-[2px] sm:h-7 sm:w-7 sm:p-[3px]"
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
    normalizeDate(
      today
    )

  const currentMonth =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    )

  const [habits] =
    useState<CalendarHabit[]>(
      () =>
        buildHabitsFromStorage()
    )

  const [history] =
    useState<HabitCompletion[]>(
      () =>
        ensureHabitHistorySeeded(
          normalizedToday
        )
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
      "all" | string
    >("all")

  const calendarDays =
    createCalendarDays(
      visibleMonth,
      today,
      history,
      habits
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

  const selectedHabitLabel =
    selectedHabit
      ? selectedHabit.name
      : "Alla vanor"

  const weeklyDays =
    createWeekDays(
      selectedDay.date,
      today,
      selectedHabitIndex,
      history,
      habits
    )

  const visibleMonthLabel =
    capitalizeFirstLetter(
      new Intl.DateTimeFormat(
        "sv-SE",
        {
          month:
            "long",
          year:
            "numeric",
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
          weekday:
            "long",
          day:
            "numeric",
          month:
            "long",
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

  let monthPercentage:
    number
  let monthResultText:
    string

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
      habits.length

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
            history,
            date.date,
            selectedHabitIndex,
            habits
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
              history,
              selectedDay.date,
              selectedHabitIndex,
              habits
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
      history,
      selectedDay.date,
      selectedHabitIndex,
      today,
      habits
    )

  const visibleHabits =
    selectedHabit
      ? [selectedHabit]
      : habits

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />

        <Separator
          orientation="vertical"
          className="mr-2 h-4"
        />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>
                Kalender
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="w-full min-w-0 max-w-[900px] px-3 pb-6 pt-4 sm:p-6">
        {/* SIDHUVUD */}

        <header className="mb-4 sm:mb-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-start gap-2">
              <div>
                <h1
                  className="text-2xl font-semibold tracking-tight"
                  style={{
                    color:
                      "var(--primary)",
                  }}
                >
                  Kalender
                </h1>

                <p className="text-sm text-muted-foreground opacity-60">
                  {
                    visibleMonthLabel
                  }
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end">
              {/* MÅNADSNAVIGATION */}

              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() =>
                    changeMonth(-1)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-md border text-muted-foreground transition hover:bg-muted hover:text-foreground sm:h-8 sm:w-8"
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
                    "flex h-9 w-9 items-center justify-center rounded-md border transition sm:h-8 sm:w-8",
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

              <div className="flex w-full flex-col gap-1 sm:w-auto">
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
                      value ??
                        "all"
                    )
                  }
                >
                  <SelectTrigger
                    className="w-full text-xs sm:min-w-[170px]"
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

        <section className="mb-5 overflow-hidden rounded-[10px] border border-border bg-card p-4 sm:p-5">
          <div className="flex flex-col gap-5 sm:min-h-[120px] sm:flex-row sm:justify-between sm:gap-8">
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

            <div className="min-w-0">
              <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:text-right">
                {selectedHabit
                  ? "Vald vana"
                  : "Vanor"}
              </p>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:block sm:space-y-[3px]">
                {visibleHabits.map(
                  (
                    habit
                  ) => (
                    <div
                      key={
                        habit.id
                      }
                      className="flex min-w-0 items-center gap-[7px] text-[10px] text-muted-foreground"
                    >
                      <span
                        className="h-[7px] w-[7px] shrink-0 rounded-full"
                        style={{
                          background:
                            habit.color,
                        }}
                      />

                      <span className="truncate">
                        {
                          habit.name
                        }
                      </span>
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
                weekday
              ) => (
                <div
                  key={weekday}
                  className="py-2 text-center text-[8px] font-medium tracking-[0.02em] text-muted-foreground sm:py-[10px] sm:text-[10px]"
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
                      "flex min-h-[54px] min-w-0 flex-col items-center justify-center gap-1",
                      "border-b border-r px-0.5 py-2 text-[8px] transition",
                      "sm:min-h-[72px] sm:gap-[6px] sm:px-2 sm:py-3 sm:text-[10px]",

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
                          ? "rounded-full ring-1 ring-primary/70 ring-offset-1 ring-offset-card sm:ring-offset-2"
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
                        history={
                          history
                        }
                        habits={
                          habits
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
          <div className="flex flex-col items-start gap-4 border-b px-4 py-4 sm:flex-row sm:items-center sm:px-5">
            <div
              className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full p-[6px]"
              style={{
                background:
                  `conic-gradient(
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

            <div className="min-w-0 flex-1">
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

                  {
                    selectedDayTotal -
                    selectedDayCompleted
                  }{" "}
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

          <div className="px-4 py-3 sm:px-5">
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
                  history,
                  selectedDay.date,
                  habitIndex,
                  habits
                )

              return (
                <div
                  key={
                    habit.id
                  }
                  className="flex flex-wrap items-center gap-3 border-t px-4 py-3 sm:flex-nowrap sm:px-5"
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
                        "truncate text-xs font-medium",
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

                  <div className="ml-auto shrink-0">
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
                </div>
              )
            }
          )}
        </section>
      </div>
    </>
  )
}
