import {
  useMemo,
  useState,
  type ElementType,
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
  FireIcon,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  Input,
} from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))
const MINUTES = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"]

import {
  deleteHabit,
  ensureHabitHistorySeeded,
  getHabitCompletion,
  getHabitList,
  setHabitCompletion,
  toDateKey,
  updateHabit,
  type HabitCompletion,
  type StoredHabit,
} from "@/lib/habit-storage"

// ─────────────────────────────────────────────
// Habit icons
// ─────────────────────────────────────────────

const ICON_MAP: Record<
  string,
  ElementType
> = {
  book:
    BookOpenIcon,

  code:
    CodeIcon,

  run:
    PersonSimpleRunIcon,

  barbell:
    BarbellIcon,

  drop:
    DropIcon,

  fire:
    FireIcon,
}

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
    const entry of
    entries
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

  // Forces rerender after changing localStorage.
  const [
    ,
    setHabitVersion,
  ] = useState(0)

  // ───────────────────────────────────────────
  // Dialog state
  // ───────────────────────────────────────────

  const [
    editOpen,
    setEditOpen,
  ] = useState(false)

  const [
    deleteOpen,
    setDeleteOpen,
  ] = useState(false)

  const [
    editTitle,
    setEditTitle,
  ] = useState("")

  const [
    editFrequency,
    setEditFrequency,
  ] = useState("Dagligen")

  const [
    editTime,
    setEditTime,
  ] = useState("07:00")

  const [
    editReminder,
    setEditReminder,
  ] = useState("På")

  // ───────────────────────────────────────────
  // Habit
  // ───────────────────────────────────────────

  const habitList =
    getHabitList() ?? []

  const storedHabit =
    habitList.find(
      (item) =>
        item.id ===
        Number(id)
    )

  // Fallback keeps hooks stable
  // if an invalid habit ID is opened.
  const habit: StoredHabit =
    storedHabit ?? {
      id:
        Number(id) || 0,

      title:
        "Vanan kunde inte hittas",

      reminder:
        "",

      streak:
        0,

      icon:
        "fire",
    }

  const HabitIcon =
    ICON_MAP[
    habit.icon
    ] ??
    FireIcon

  const habitIndex =
    Math.max(
      0,
      habitList.findIndex(
        (item) =>
          item.id ===
          habit.id
      )
    )

  const color =
    HABIT_COLORS[
    habitIndex %
    HABIT_COLORS.length
    ]

  const [
    today,
  ] = useState(
    () =>
      normalizeDate(
        new Date()
      )
  )

  // Same localStorage history
  // as Start + Calendar + Statistics.

  const [
    history,
    setHistory,
  ] =
    useState<
      HabitCompletion[]
    >(
      () =>
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

  const toggleToday =
    () => {
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
      [
        today,
      ]
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
      (
        completedLast28 /
        last28Days.length
      ) *
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
          index % 7 ===
            0
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

        value:
          1,
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

  // ───────────────────────────────────────────
  // Open edit dialog
  // ───────────────────────────────────────────

  const openEditDialog =
    () => {
      const knownFrequencies = [
        "Dagligen",
        "Varje vecka",
        "Vardagar",
        "Helger",
      ]

      const frequency =
        knownFrequencies.find(
          (value) =>
            habit.reminder.startsWith(
              value
            )
        ) ??
        "Dagligen"

      const timeMatch =
        habit.reminder.match(
          /\d{2}:\d{2}/
        )

      const reminderOn =
        !habit.reminder
          .toLowerCase()
          .includes(
            "ingen påminnelse"
          )

      setEditTitle(
        habit.title
      )

      setEditFrequency(
        frequency
      )

      setEditTime(
        timeMatch?.[0] ??
        "07:00"
      )

      setEditReminder(
        reminderOn
          ? "På"
          : "Av"
      )

      setEditOpen(
        true
      )
    }

  // ───────────────────────────────────────────
  // Save edited habit
  // ───────────────────────────────────────────

  const handleSaveEdit =
    () => {
      const trimmedTitle =
        editTitle.trim()

      if (
        !trimmedTitle
      ) {
        return
      }

      const reminderText =
        editReminder ===
          "På"
          ? `${editFrequency} · ${editTime}`
          : `${editFrequency} · Ingen påminnelse`

      const updatedHabit:
        StoredHabit = {
        ...habit,

        title:
          trimmedTitle,

        reminder:
          reminderText,
      }

      updateHabit(
        updatedHabit
      )

      setHabitVersion(
        (value) =>
          value + 1
      )

      setEditOpen(
        false
      )
    }

  // ───────────────────────────────────────────
  // Delete
  // ───────────────────────────────────────────

  const handleDelete =
    () => {
      deleteHabit(
        habit.id
      )

      setDeleteOpen(
        false
      )

      navigate(
        "/statistik"
      )
    }

  // ───────────────────────────────────────────
  // Invalid habit
  // ───────────────────────────────────────────

  if (
    !storedHabit
  ) {
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
                  Vana saknas
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

        </header>

        <div className="p-6">

          <p className="text-sm text-muted-foreground">
            Vanan kunde inte hittas.
          </p>

          <Button
            className="mt-4"
            onClick={() =>
              navigate(
                "/statistik"
              )
            }
          >
            Tillbaka till Statistik
          </Button>

        </div>
      </>
    )
  }

  return (
    <>
      {/* Header */}

      <header className="flex h-16 shrink-0 items-center border-b">

        <div className="flex w-full max-w-4xl items-center gap-2 px-6">

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

          {/* Edit + delete */}

          <div className="flex shrink-0 items-center gap-2">

            <Button
              variant="outline"
              size="sm"
              onClick={
                openEditDialog
              }
            >
              Redigera
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() =>
                setDeleteOpen(
                  true
                )
              }
            >
              Ta bort
            </Button>

          </div>

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
                {
                  formatLongDate(
                    today
                  )
                }
              </p>

              <p className="text-xs text-muted-foreground opacity-60">
                {habit.reminder}
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

      {/* ───────────────────────────────────── */}
      {/* Edit habit dialog */}
      {/* ───────────────────────────────────── */}

      <Dialog
        open={
          editOpen
        }
        onOpenChange={
          setEditOpen
        }
      >

        <DialogContent className="sm:max-w-sm border-0 p-6">

          <DialogHeader>

            <DialogTitle
              className="text-xl font-semibold tracking-tight"
              style={{
                color:
                  "var(--primary)",
              }}
            >
              Redigera vana
            </DialogTitle>

            <DialogDescription className="flex items-center gap-1 text-sm text-muted-foreground">

              Uppdatera din vana och fortsätt bygga din streak.

              <FireIcon
                size={14}
                className="text-primary"
              />

            </DialogDescription>

          </DialogHeader>

          <div className="mt-3 flex flex-col gap-4">

            {/* Habit name */}

            <div className="flex flex-col gap-2">

              <label className="text-xs font-normal uppercase tracking-widest text-muted-foreground opacity-60">

                Vana{" "}

                <span className="text-primary">
                  *
                </span>

              </label>

              <Input
                value={
                  editTitle
                }
                onChange={
                  (event) =>
                    setEditTitle(
                      event.target.value
                    )
                }
                placeholder="T.ex. Läs tjugo minuter"
                autoFocus
                className="h-10 w-full rounded-md border border-input bg-muted/40 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />

              <p className="text-xs text-muted-foreground opacity-60">
                Håll det konkret. Vaga löften håller inte.
              </p>

            </div>

            {/* Frequency + time */}

            <div className="grid grid-cols-2 gap-3">

              <div className="flex flex-col gap-2">
                <label className="text-xs font-normal uppercase tracking-widest text-muted-foreground opacity-60">
                  Frekvens
                </label>
                <Select value={editFrequency} onValueChange={(v) => v !== null && setEditFrequency(v)}>
                  <SelectTrigger className="h-10 bg-muted/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dagligen">Dagligen</SelectItem>
                    <SelectItem value="Varje vecka">Varje vecka</SelectItem>
                    <SelectItem value="Vardagar">Vardagar</SelectItem>
                    <SelectItem value="Helger">Helger</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-normal uppercase tracking-widest text-muted-foreground opacity-60 whitespace-nowrap">
                  Tid på dagen
                </label>
                <div className="flex items-center gap-1.5">
                  <Select
                    value={editTime.split(":")[0]}
                    onValueChange={(h) => h !== null && setEditTime(`${h}:${editTime.split(":")[1]}`)}
                  >
                    <SelectTrigger className="h-10 bg-muted/40 flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-48" alignItemWithTrigger={false}>
                      {HOURS.map((h) => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">:</span>
                  <Select
                    value={editTime.split(":")[1]}
                    onValueChange={(m) => m !== null && setEditTime(`${editTime.split(":")[0]}:${m}`)}
                  >
                    <SelectTrigger className="h-10 bg-muted/40 flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-48" alignItemWithTrigger={false}>
                      {MINUTES.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

            </div>

            {/* Reminder */}

            <div className="flex flex-col gap-2">

              <label className="text-xs font-normal uppercase tracking-widest text-muted-foreground opacity-60">
                Påminnelse
              </label>

              <Select value={editReminder} onValueChange={(v) => v !== null && setEditReminder(v)}>
                <SelectTrigger className="h-10 w-full bg-muted/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="På">På</SelectItem>
                  <SelectItem value="Av">Av</SelectItem>
                </SelectContent>
              </Select>

            </div>

            {/* Actions */}

            <div className="flex gap-3">

              <Button
                variant="ghost"
                className="flex-1 cursor-pointer text-muted-foreground opacity-60 hover:opacity-100"
                onClick={() =>
                  setEditOpen(
                    false
                  )
                }
              >
                Avbryt
              </Button>

              <Button
                disabled={
                  !editTitle.trim()
                }
                onClick={
                  handleSaveEdit
                }
                className="h-11 flex-1 cursor-pointer transition-opacity hover:opacity-80"
                style={{
                  background:
                    "linear-gradient(135deg, #5649d4 0%, #6d5cf6 45%, #8b5cf6 78%, #f472b6 100%)",

                  color:
                    "white",

                  border:
                    "none",
                }}
              >
                Spara ändringar
              </Button>

            </div>

          </div>

        </DialogContent>

      </Dialog>

      {/* ───────────────────────────────────── */}
      {/* Delete confirmation dialog */}
      {/* ───────────────────────────────────── */}

      <Dialog
        open={
          deleteOpen
        }
        onOpenChange={
          setDeleteOpen
        }
      >

        <DialogContent className="sm:max-w-sm border-0 p-6">

          <DialogHeader>

            <DialogTitle
              className="text-xl font-semibold tracking-tight"
              style={{
                color:
                  "var(--primary)",
              }}
            >
              Ta bort vana?
            </DialogTitle>

            <DialogDescription className="text-sm leading-relaxed text-muted-foreground">

              Är du säker på att du vill ta bort{" "}

              <span className="font-medium text-foreground">
                {habit.title}
              </span>

              ? All historik för vanan kommer också att tas bort.

            </DialogDescription>

          </DialogHeader>

          <div className="mt-4 flex gap-3">

            <Button
              variant="ghost"
              className="flex-1 cursor-pointer text-muted-foreground"
              onClick={() =>
                setDeleteOpen(
                  false
                )
              }
            >
              Avbryt
            </Button>

            <Button
              variant="destructive"
              className="flex-1 cursor-pointer"
              onClick={
                handleDelete
              }
            >
              Ta bort
            </Button>

          </div>

        </DialogContent>

      </Dialog>

    </>
  )
}