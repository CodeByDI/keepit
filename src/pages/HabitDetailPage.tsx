import {
  useMemo,
  useState,
} from "react"

import {
  useNavigate,
  useParams,
} from "react-router-dom"

import {
  BarbellIcon,
  BookOpenIcon,
  CheckIcon,
  CodeIcon,
  DropIcon,
  PersonSimpleRunIcon,
} from "@phosphor-icons/react"

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

import {
  SidebarTrigger,
} from "@/components/ui/sidebar"

import {
  Separator,
} from "@/components/ui/separator"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import {
  Button,
} from "@/components/ui/button"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

import {
  ensureHabitHistorySeeded,
  getHabitCompletion,
  setHabitCompletion,
  toDateKey,
  type HabitCompletion,
} from "@/lib/habit-storage"

// ─────────────────────────────────────────────
// Habits
// Same IDs as Calendar and Statistics
// ─────────────────────────────────────────────

const HABITS = [
  {
    id: 1,
    title: "Läs 20 sidor",
    icon: BookOpenIcon,
    frequency: "Dagligen",
    time: "21:00",
  },

  {
    id: 2,
    title: "Koda",
    icon: CodeIcon,
    frequency: "Dagligen",
    time: "20:00",
  },

  {
    id: 3,
    title: "Morgonlöpning",
    icon: PersonSimpleRunIcon,
    frequency: "Dagligen",
    time: "07:00",
  },

  {
    id: 4,
    title: "Träna 30 min",
    icon: BarbellIcon,
    frequency: "Dagligen",
    time: "17:30",
  },

  {
    id: 5,
    title: "Drick 2L vatten",
    icon: DropIcon,
    frequency: "Dagligen",
    time: "20:00",
  },
]

const HABIT_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

// ─────────────────────────────────────────────
// Date helpers
// ─────────────────────────────────────────────

function normalizeDate(
  date: Date
) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  )
}

function dateFromKey(
  dateKey: string
) {
  const [
    year,
    month,
    day,
  ] = dateKey
    .split("-")
    .map(Number)

  return new Date(
    year,
    month - 1,
    day
  )
}

function formatShortDate(
  date: Date
) {
  return date
    .toLocaleDateString(
      "sv-SE",
      {
        day: "numeric",
        month: "short",
      }
    )
    .replace(".", "")
}

function formatLongDate(
  date: Date
) {
  const value =
    date.toLocaleDateString(
      "sv-SE",
      {
        weekday: "long",
        day: "numeric",
        month: "short",
      }
    )

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1).replace(".", "")
  )
}

function getLastDays(
  endDate: Date,
  numberOfDays: number
) {
  const dates: Date[] = []

  for (
    let offset =
      numberOfDays - 1;
    offset >= 0;
    offset--
  ) {
    const date =
      new Date(endDate)

    date.setDate(
      endDate.getDate() -
      offset
    )

    dates.push(
      normalizeDate(date)
    )
  }

  return dates
}

function getMonday(
  date: Date
) {
  const result =
    new Date(date)

  const day =
    result.getDay()

  const difference =
    day === 0
      ? -6
      : 1 - day

  result.setDate(
    result.getDate() +
    difference
  )

  return normalizeDate(
    result
  )
}

// ─────────────────────────────────────────────
// Streak calculations
// ─────────────────────────────────────────────

function calculateCurrentStreak(
  history: HabitCompletion[],
  habitId: number,
  today: Date
) {
  let streak = 0

  const currentDate =
    new Date(today)

  while (true) {
    const completed =
      getHabitCompletion(
        history,
        habitId,
        currentDate
      )

    if (!completed) {
      break
    }

    streak++

    currentDate.setDate(
      currentDate.getDate() -
      1
    )
  }

  return streak
}

function calculateRecord(
  history: HabitCompletion[],
  habitId: number
) {
  const entries =
    history
      .filter(
        (entry) =>
          entry.habitId ===
          habitId
      )
      .sort(
        (a, b) =>
          a.date.localeCompare(
            b.date
          )
      )

  let record = 0
  let current = 0

  for (
    const entry of entries
  ) {
    if (
      entry.completed
    ) {
      current++

      record =
        Math.max(
          record,
          current
        )
    } else {
      current = 0
    }
  }

  return record
}

// ─────────────────────────────────────────────
// Week dot
// ─────────────────────────────────────────────

type DayState =
  | "done"
  | "today"
  | "missed"
  | "future"

function WeekDot({
  label,
  state,
  color,
}: {
  label: string
  state: DayState
  color: string
}) {
  const isDone =
    state === "done"

  const isToday =
    state === "today"

  const isFuture =
    state === "future"

  const isMissed =
    state === "missed"

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="flex size-8 items-center justify-center rounded-full"
        style={{
          backgroundColor:
            isDone
              ? color
              : "transparent",

          border:
            isDone
              ? "none"
              : `2px solid ${isToday
                ? color
                : "var(--muted-foreground)"
              }`,

          opacity:
            isFuture ||
              isMissed
              ? 0.35
              : 1,
        }}
      >
        {isDone && (
          <CheckIcon
            size={14}
            weight="bold"
            color="white"
          />
        )}
      </div>

      <span
        className="text-xs"
        style={{
          color:
            isToday
              ? color
              : "var(--muted-foreground)",

          fontWeight:
            isToday
              ? 600
              : 400,
        }}
      >
        {label}
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

export function HabitDetailPage() {
  const { id } =
    useParams()

  const navigate =
    useNavigate()

  const habit =
    HABITS.find(
      (item) =>
        item.id ===
        Number(id)
    ) ?? HABITS[2]

  const HabitIcon =
    habit.icon

  const habitIndex =
    HABITS.findIndex(
      (item) =>
        item.id ===
        habit.id
    )

  const color =
    HABIT_COLORS[
    habitIndex %
    HABIT_COLORS.length
    ]

  const [today] =
    useState(() =>
      normalizeDate(
        new Date()
      )
    )

  // Same localStorage history
  // as Calendar + Statistics.

  const [
    history,
    setHistory,
  ] =
    useState<
      HabitCompletion[]
    >(() =>
      ensureHabitHistorySeeded(
        today
      )
    )

  // ───────────────────────────────────────────
  // Today's status
  // ───────────────────────────────────────────

  const completedToday =
    getHabitCompletion(
      history,
      habit.id,
      today
    )

  const toggleToday = () => {
    const nextHistory =
      setHabitCompletion(
        habit.id,
        today,
        !completedToday
      )

    setHistory(
      nextHistory
    )
  }

  // ───────────────────────────────────────────
  // Habit history
  // ───────────────────────────────────────────

  const habitHistory =
    useMemo(
      () =>
        history.filter(
          (entry) =>
            entry.habitId ===
            habit.id &&
            entry.date <=
            toDateKey(today)
        ),
      [
        history,
        habit.id,
        today,
      ]
    )

  const totalCompleted =
    habitHistory.filter(
      (entry) =>
        entry.completed
    ).length

  // ───────────────────────────────────────────
  // Last 28 days
  // ───────────────────────────────────────────

  const last28Days =
    useMemo(
      () =>
        getLastDays(
          today,
          28
        ),
      [today]
    )

  const completedLast28 =
    last28Days.filter(
      (date) =>
        getHabitCompletion(
          history,
          habit.id,
          date
        )
    ).length

  const average28 =
    Math.round(
      (completedLast28 /
        last28Days.length) *
      100
    )

  // ───────────────────────────────────────────
  // Streak / record
  // ───────────────────────────────────────────

  const currentStreak =
    calculateCurrentStreak(
      history,
      habit.id,
      today
    )

  const record =
    calculateRecord(
      history,
      habit.id
    )

  const daysToRecord =
    Math.max(
      1,
      record +
      1 -
      currentStreak
    )

  // ───────────────────────────────────────────
  // Current week
  // ───────────────────────────────────────────

  const weekDays =
    useMemo(
      () => {
        const monday =
          getMonday(today)

        const labels = [
          "M",
          "T",
          "O",
          "T",
          "F",
          "L",
          "S",
        ]

        return labels.map(
          (
            label,
            index
          ) => {
            const date =
              new Date(
                monday
              )

            date.setDate(
              monday.getDate() +
              index
            )

            const normalized =
              normalizeDate(
                date
              )

            const dateKey =
              toDateKey(
                normalized
              )

            const todayKey =
              toDateKey(
                today
              )

            let state:
              DayState

            if (
              dateKey >
              todayKey
            ) {
              state =
                "future"
            } else {
              const completed =
                getHabitCompletion(
                  history,
                  habit.id,
                  normalized
                )

              if (
                completed
              ) {
                state =
                  "done"
              } else if (
                dateKey ===
                todayKey
              ) {
                state =
                  "today"
              } else {
                state =
                  "missed"
              }
            }

            return {
              label,
              state,
            }
          }
        )
      },
      [
        history,
        habit.id,
        today,
      ]
    )

  const elapsedWeekDays =
    weekDays.filter(
      (day) =>
        day.state !==
        "future"
    )

  const doneThisWeek =
    weekDays.filter(
      (day) =>
        day.state ===
        "done"
    ).length

  // ───────────────────────────────────────────
  // Chart data
  // ───────────────────────────────────────────

  const chartData =
    last28Days.map(
      (
        date,
        index
      ) => ({
        label:
          index % 7 === 0
            ? formatShortDate(
              date
            )
            : "",

        done:
          getHabitCompletion(
            history,
            habit.id,
            date
          ),

        value: 1,
      })
    )

  // ───────────────────────────────────────────
  // First stored date
  // ───────────────────────────────────────────

  const firstEntry =
    habitHistory[0]

  const historyStart =
    firstEntry
      ? formatShortDate(
        dateFromKey(
          firstEntry.date
        )
      )
      : "start"

  return (
    <>
      {/* Header */}

      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">

        <SidebarTrigger className="-ml-1" />

        <Separator
          orientation="vertical"
          className="mr-2 h-4"
        />

        <Breadcrumb className="flex-1">

          <BreadcrumbList>

            <BreadcrumbItem>
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/statistik"
                  )
                }
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Statistik
              </button>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>

              <BreadcrumbPage className="flex items-center gap-1.5">

                <HabitIcon
                  size={15}
                  style={{
                    color,
                  }}
                />

                {habit.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-2">

          <Button
            variant="outline"
            size="sm"
          >
            Redigera
          </Button>

          <Button
            variant="destructive"
            size="sm"
          >
            Ta bort
          </Button>
        </div>
      </header>

      {/* Content */}

      <div className="flex w-full max-w-4xl flex-col gap-5 p-6">

        {/* Stat cards */}

        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
          style={{
            gridAutoRows:
              "130px",
          }}
        >

          {/* Total */}

          <Card className="h-full py-0">

            <CardContent
              style={{
                padding:
                  "16px 20px",
              }}
              className="flex h-full flex-col justify-between"
            >

              <p className="text-xs font-normal uppercase tracking-widest text-muted-foreground opacity-60">
                Totalt genomfört
              </p>

              <div className="flex flex-col items-end gap-1">

                <p
                  className="flex items-baseline gap-1"
                  style={{
                    color,
                  }}
                >

                  <span className="text-4xl font-bold">
                    {
                      totalCompleted
                    }
                  </span>

                  <span className="text-base font-medium text-muted-foreground">
                    gånger
                  </span>
                </p>

                <p className="text-xs text-muted-foreground opacity-60">
                  Sedan{" "}
                  {
                    historyStart
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Average */}

          <Card className="h-full py-0">

            <CardContent
              style={{
                padding:
                  "16px 20px",
              }}
              className="flex h-full flex-col justify-between"
            >

              <p className="text-xs font-normal uppercase tracking-widest text-muted-foreground opacity-60">
                Genomsnitt
              </p>

              <div className="flex flex-col items-end gap-1">

                <p
                  className="flex items-baseline gap-1"
                  style={{
                    color,
                  }}
                >

                  <span className="text-4xl font-bold">
                    {
                      average28
                    }
                  </span>

                  <span className="text-base font-medium text-muted-foreground">
                    %
                  </span>
                </p>

                <p className="text-xs text-muted-foreground opacity-60">
                  Senaste 28 dagarna
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Record */}

          <Card className="h-full py-0">

            <CardContent
              style={{
                padding:
                  "16px 20px",
              }}
              className="flex h-full flex-col justify-between"
            >

              <p className="text-xs font-normal uppercase tracking-widest text-muted-foreground opacity-60">
                Rekord
              </p>

              <div className="flex flex-col items-end gap-1">

                <p
                  className="flex items-baseline gap-1"
                  style={{
                    color,
                  }}
                >

                  <span className="text-4xl font-bold">
                    {record}
                  </span>

                  <span className="text-base font-medium text-muted-foreground">
                    dagar
                  </span>
                </p>

                <p className="text-xs text-muted-foreground opacity-60">
                  {currentStreak ===
                    record
                    ? `${daysToRecord} dag till nytt rekord`
                    : `${daysToRecord} dagar till nytt rekord`}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current week */}

        <div className="flex flex-col gap-2">

          <div className="flex items-center justify-between">

            <p className="text-xs font-normal uppercase tracking-widest text-muted-foreground opacity-60">
              Denna vecka
            </p>

            <p className="text-xs text-muted-foreground opacity-60">
              {
                doneThisWeek
              }{" "}
              av{" "}
              {
                elapsedWeekDays.length
              }{" "}
              dagar
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            {weekDays.map(
              (
                day,
                index
              ) => (
                <WeekDot
                  key={
                    index
                  }
                  label={
                    day.label
                  }
                  state={
                    day.state
                  }
                  color={
                    color
                  }
                />
              )
            )}
          </div>
        </div>

        {/* History */}

        <Card>

          <CardContent
            className="flex flex-col gap-4"
            style={{
              padding:
                "8px 20px",
            }}
          >

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-semibold">
                  Historik
                </p>

                <p className="text-xs text-muted-foreground opacity-60">
                  Senaste 28 dagarna
                </p>
              </div>

              <span
                className="rounded-full px-2.5 py-1 text-xs font-medium"
                style={{
                  backgroundColor:
                    `color-mix(in oklch, ${color} 15%, transparent)`,

                  color,
                }}
              >
                {
                  average28
                }
                % klarat
              </span>
            </div>

            <ResponsiveContainer
              width="100%"
              height={120}
            >

              <BarChart
                data={
                  chartData
                }
                barCategoryGap={
                  2
                }
                margin={{
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
              >

                <defs>

                  <linearGradient
                    id="habitGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      style={{
                        stopColor:
                          color,
                        stopOpacity:
                          1,
                      }}
                    />

                    <stop
                      offset="100%"
                      style={{
                        stopColor:
                          color,
                        stopOpacity:
                          0.4,
                      }}
                    />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="label"
                  axisLine={
                    false
                  }
                  tickLine={
                    false
                  }
                  tick={{
                    fontSize:
                      10,

                    fill:
                      "var(--muted-foreground)",
                  }}
                  interval={
                    0
                  }
                />

                <YAxis
                  hide
                  domain={[
                    0,
                    1,
                  ]}
                />

                <Bar
                  dataKey="value"
                  radius={[
                    3,
                    3,
                    0,
                    0,
                  ]}
                >

                  {chartData.map(
                    (
                      entry,
                      index
                    ) => (

                      <Cell
                        key={
                          index
                        }
                        fill={
                          entry.done
                            ? "url(#habitGradient)"
                            : "var(--border)"
                        }
                      />
                    )
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Today */}

        <Card>

          <CardContent
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            style={{
              padding:
                "10px 20px",
            }}
          >

            <div className="flex flex-col gap-0.5">

              <p className="text-sm font-semibold">
                Idag —{" "}
                {formatLongDate(
                  today
                )}
              </p>

              <p className="text-xs text-muted-foreground opacity-60">
                Påminnelse satt
                till{" "}
                {
                  habit.time
                }{" "}
                ·{" "}
                {
                  habit.frequency
                }
              </p>
            </div>

            <Button
              type="button"
              onClick={
                toggleToday
              }
              variant={
                completedToday
                  ? "outline"
                  : "default"
              }
              className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80"
              style={
                completedToday
                  ? undefined
                  : {
                    background:
                      "linear-gradient(135deg, #5649d4 0%, #6d5cf6 45%, #8b5cf6 78%, #f472b6 100%)",

                    color:
                      "white",

                    border:
                      "none",
                  }
              }
            >

              <CheckIcon
                size={14}
                weight="bold"
              />

              {completedToday
                ? "Ångra klar"
                : "Klar för idag"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}