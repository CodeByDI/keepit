import {
    useMemo,
    useState,
    type ElementType,
} from "react"

import { useNavigate } from "react-router-dom"

import {
    BarbellIcon,
    BookOpenIcon,
    CodeIcon,
    DropIcon,
    PersonSimpleRunIcon,
    PlusIcon,
} from "@phosphor-icons/react"

import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
} from "recharts"

import {
    StatisticsChart,
    type StatisticsChartPoint,
    type StatisticsPeriod,
} from "@/components/statistics-chart"

import { HabitsStatisticsTable } from "@/components/habits-statistics-table"
import { HabitList } from "@/components/habit-list"

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
} from "@/components/ui/breadcrumb"

import {
    ensureHabitHistorySeeded,
    getHabitCompletion,
    getHabitList,
    setHabitCompletion,
    toDateKey,
    type HabitCompletion,
    type StoredHabit,
} from "@/lib/habit-storage"

import { notifyHabitDataUpdated } from "@/lib/habit-stats"

// ─────────────────────────────────────────────
// Periods
// ─────────────────────────────────────────────

const periods: StatisticsPeriod[] = [
    "7 dagar",
    "28 dagar",
    "Allt",
]

const STATISTICS_PERIOD_STORAGE_KEY =
    "statistics-period"

// ─────────────────────────────────────────────
// Habit data from shared storage
// ─────────────────────────────────────────────

const iconMap: Record<string, ElementType> = {
    book: BookOpenIcon,
    code: CodeIcon,
    run: PersonSimpleRunIcon,
    barbell: BarbellIcon,
    drop: DropIcon,
    fire: PlusIcon,
}

function buildHabitsFromStorage() {
    return (getHabitList() ?? []).map(
        (habit: StoredHabit) => ({
            id: habit.id,

            // Statistics koristi name
            name: habit.title,

            // HabitList koristi title, reminder i streak
            title: habit.title,
            reminder: habit.reminder ?? "",
            streak: habit.streak ?? 0,

            icon:
                iconMap[habit.icon] ??
                PlusIcon,
        })
    )
}

// ─────────────────────────────────────────────
// Saved statistics period
// ─────────────────────────────────────────────

function getSavedPeriod(): StatisticsPeriod {
    const savedPeriod =
        localStorage.getItem(
            STATISTICS_PERIOD_STORAGE_KEY
        )

    if (
        savedPeriod === "7 dagar" ||
        savedPeriod === "28 dagar" ||
        savedPeriod === "Allt"
    ) {
        return savedPeriod
    }

    return "28 dagar"
}

// ─────────────────────────────────────────────
// Date helpers
// ─────────────────────────────────────────────

function normalizeDate(date: Date) {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    )
}

function dateFromKey(dateKey: string) {
    const [year, month, day] =
        dateKey
            .split("-")
            .map(Number)

    return new Date(
        year,
        month - 1,
        day
    )
}

function formatShortDate(date: Date) {
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

function formatMonth(date: Date) {
    return date
        .toLocaleDateString(
            "sv-SE",
            {
                month: "short",
            }
        )
        .replace(".", "")
}

function getDateRange(
    endDate: Date,
    numberOfDays: number
) {
    const dates: Date[] = []

    for (
        let offset = numberOfDays - 1;
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

// ─────────────────────────────────────────────
// History helpers
// ─────────────────────────────────────────────

function getCompletedCountForDay(
    history: HabitCompletion[],
    date: Date,
    habits: ReturnType<
        typeof buildHabitsFromStorage
    >
) {
    return habits.filter(
        (habit) =>
            getHabitCompletion(
                history,
                habit.id,
                date
            )
    ).length
}

function getHistoryForPeriod(
    history: HabitCompletion[],
    period: StatisticsPeriod,
    today: Date
) {
    const endKey =
        toDateKey(today)

    if (period === "Allt") {
        return history.filter(
            (entry) =>
                entry.date <= endKey
        )
    }

    const numberOfDays =
        period === "7 dagar"
            ? 7
            : 28

    const startDate =
        new Date(today)

    startDate.setDate(
        today.getDate() -
        (numberOfDays - 1)
    )

    const startKey =
        toDateKey(startDate)

    return history.filter(
        (entry) =>
            entry.date >= startKey &&
            entry.date <= endKey
    )
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

export function StatisticsPage() {
    const navigate =
        useNavigate()

    // Same habit list used by StartPage.
    const [dailyHabits] =
        useState(
            () =>
                buildHabitsFromStorage()
        )

    // Today stays stable while page is open.
    const [today] =
        useState(
            () =>
                normalizeDate(
                    new Date()
                )
        )

    // Same completion history used by Start / Calendar.
    const [
        history,
        setHistory,
    ] =
        useState<HabitCompletion[]>(
            () =>
                ensureHabitHistorySeeded(
                    today
                )
        )

    // Remember selected period after refresh.
    const [
        selectedPeriod,
        setSelectedPeriod,
    ] =
        useState<StatisticsPeriod>(
            () =>
                getSavedPeriod()
        )

    const [
        selectedDate,
        setSelectedDate,
    ] =
        useState<string | null>(
            () =>
                selectedPeriod === "Allt"
                    ? null
                    : toDateKey(today)
        )

    // ───────────────────────────────────────────
    // Current period history
    // ───────────────────────────────────────────

    const periodHistory =
        useMemo(
            () =>
                getHistoryForPeriod(
                    history,
                    selectedPeriod,
                    today
                ),
            [
                history,
                selectedPeriod,
                today,
            ]
        )

    // ───────────────────────────────────────────
    // Chart
    // ───────────────────────────────────────────

    const chartData =
        useMemo<StatisticsChartPoint[]>(
            () => {
                if (
                    selectedPeriod !==
                    "Allt"
                ) {
                    const days =
                        selectedPeriod ===
                            "7 dagar"
                            ? 7
                            : 28

                    return getDateRange(
                        today,
                        days
                    ).map(
                        (date) => {
                            const completed =
                                getCompletedCountForDay(
                                    history,
                                    date,
                                    dailyHabits
                                )

                            const percentage =
                                dailyHabits.length > 0
                                    ? Math.round(
                                        (
                                            completed /
                                            dailyHabits.length
                                        ) * 100
                                    )
                                    : 0

                            return {
                                dateKey:
                                    toDateKey(date),

                                label:
                                    formatShortDate(
                                        date
                                    ),

                                completed:
                                    percentage,
                            }
                        }
                    )
                }

                // Allt = monthly overview.
                const monthGroups =
                    new Map<
                        string,
                        HabitCompletion[]
                    >()

                const todayKey =
                    toDateKey(today)

                history
                    .filter(
                        (entry) =>
                            entry.date <=
                            todayKey
                    )
                    .forEach(
                        (entry) => {
                            const monthKey =
                                entry.date.slice(
                                    0,
                                    7
                                )

                            const existing =
                                monthGroups.get(
                                    monthKey
                                ) ?? []

                            existing.push(
                                entry
                            )

                            monthGroups.set(
                                monthKey,
                                existing
                            )
                        }
                    )

                const monthKeys =
                    Array.from(
                        monthGroups.keys()
                    )
                        .sort()
                        .slice(-12)

                return monthKeys.map(
                    (monthKey) => {
                        const entries =
                            monthGroups.get(
                                monthKey
                            ) ?? []

                        const completed =
                            entries.filter(
                                (entry) =>
                                    entry.completed
                            ).length

                        const percentage =
                            entries.length > 0
                                ? Math.round(
                                    (
                                        completed /
                                        entries.length
                                    ) * 100
                                )
                                : 0

                        const [
                            year,
                            month,
                        ] =
                            monthKey
                                .split("-")
                                .map(Number)

                        const date =
                            new Date(
                                year,
                                month - 1,
                                1
                            )

                        return {
                            dateKey:
                                `${monthKey}-01`,

                            label:
                                formatMonth(date),

                            completed:
                                percentage,
                        }
                    }
                )
            },
            [
                history,
                selectedPeriod,
                today,
                dailyHabits,
            ]
        )

    // ───────────────────────────────────────────
    // Change period
    // ───────────────────────────────────────────

    const handlePeriodChange = (
        period: StatisticsPeriod
    ) => {
        setSelectedPeriod(
            period
        )

        localStorage.setItem(
            STATISTICS_PERIOD_STORAGE_KEY,
            period
        )

        if (period === "Allt") {
            setSelectedDate(null)
            return
        }

        setSelectedDate(
            toDateKey(today)
        )
    }

    // ───────────────────────────────────────────
    // Selected date
    // ───────────────────────────────────────────

    const selectedDateObject =
        selectedDate
            ? dateFromKey(
                selectedDate
            )
            : null

    const selectedDayHabits =
        selectedDateObject
            ? dailyHabits.map(
                (habit) => ({
                    ...habit,

                    done:
                        getHabitCompletion(
                            history,
                            habit.id,
                            selectedDateObject
                        ),
                })
            )
            : []

    // ───────────────────────────────────────────
    // Toggle completion
    // ───────────────────────────────────────────

    const toggleHabit = (
        habitId: number
    ) => {
        if (
            !selectedDateObject
        ) {
            return
        }

        // Only today's habits can be changed.
        if (
            toDateKey(
                selectedDateObject
            ) !==
            toDateKey(today)
        ) {
            return
        }

        const currentlyCompleted =
            getHabitCompletion(
                history,
                habitId,
                selectedDateObject
            )

        const nextHistory =
            setHabitCompletion(
                habitId,
                selectedDateObject,
                !currentlyCompleted
            )

        setHistory(
            nextHistory
        )

        notifyHabitDataUpdated()
    }

    // ───────────────────────────────────────────
    // Summary
    // ───────────────────────────────────────────

    const totalCompleted =
        periodHistory.filter(
            (entry) =>
                entry.completed
        ).length

    const bestHabit =
        useMemo(
            () => {
                const results =
                    dailyHabits.map(
                        (habit) => {
                            const entries =
                                periodHistory.filter(
                                    (entry) =>
                                        entry.habitId ===
                                        habit.id
                                )

                            const completed =
                                entries.filter(
                                    (entry) =>
                                        entry.completed
                                ).length

                            const percentage =
                                entries.length > 0
                                    ? Math.round(
                                        (
                                            completed /
                                            entries.length
                                        ) * 100
                                    )
                                    : 0

                            return {
                                ...habit,
                                percentage,
                            }
                        }
                    )

                if (
                    results.length === 0
                ) {
                    return {
                        name: "-",
                        percentage: 0,
                    }
                }

                return results.reduce(
                    (
                        best,
                        current
                    ) =>
                        current.percentage >
                            best.percentage
                            ? current
                            : best,
                    results[0]
                )
            },
            [
                periodHistory,
                dailyHabits,
            ]
        )

    const subtitle =
        selectedPeriod ===
            "7 dagar"
            ? "Senaste 7 dagarna"
            : selectedPeriod ===
                "28 dagar"
                ? "Senaste 28 dagarna"
                : "Sedan start"

    const totalDescription =
        selectedPeriod ===
            "Allt"
            ? "Registreringar sedan start"
            : selectedPeriod ===
                "7 dagar"
                ? "Registreringar senaste 7 dagarna"
                : "Registreringar senaste 28 dagarna"

    const summaryCards = [
        {
            title:
                "Klarat totalt",

            value:
                String(
                    totalCompleted
                ),

            description:
                totalDescription,
        },

        {
            title:
                "Aktiva vanor",

            value:
                String(
                    dailyHabits.length
                ),

            description:
                `Av ${dailyHabits.length} möjliga idag`,
        },

        {
            title:
                "Bästa vana",

            value:
                bestHabit.name,

            description:
                `${bestHabit.percentage}% klarat`,
        },
    ]

    // ───────────────────────────────────────────
    // History donut
    // ───────────────────────────────────────────

    const historyCompleted =
        totalCompleted

    const historyTotal =
        periodHistory.length

    const historyRemaining =
        Math.max(
            0,
            historyTotal -
            historyCompleted
        )

    const historyPercentage =
        historyTotal > 0
            ? Math.round(
                (
                    historyCompleted /
                    historyTotal
                ) * 100
            )
            : 0

    const donutData = [
        {
            name: "Klara",
            value:
                historyCompleted,
        },

        {
            name: "Ej klara",
            value:
                historyRemaining,
        },
    ]

    // ───────────────────────────────────────────
    // Render
    // ───────────────────────────────────────────

    return (
        <>
            {/* Application header */}

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
                                Statistik
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            {/* Content */}

            <main className="w-full p-6">
                <div className="flex w-full max-w-[850px] flex-col gap-6">

                    {/* Page title */}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1
                                className="text-2xl font-semibold tracking-tight"
                                style={{
                                    color:
                                        "var(--primary)",
                                }}
                            >
                                Statistik
                            </h1>

                            <p className="text-sm text-muted-foreground opacity-60">
                                {subtitle}
                            </p>
                        </div>

                        {/* Period selector */}

                        <div className="flex w-fit rounded-lg border bg-muted/30 p-1">
                            {periods.map(
                                (period) => (
                                    <button
                                        key={
                                            period
                                        }
                                        type="button"
                                        aria-pressed={
                                            selectedPeriod ===
                                            period
                                        }
                                        onClick={() =>
                                            handlePeriodChange(
                                                period
                                            )
                                        }
                                        className={`rounded-md px-3 py-1.5 text-xs transition-colors sm:text-sm ${selectedPeriod ===
                                                period
                                                ? "bg-background text-foreground shadow-sm"
                                                : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {period}
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    {/* Summary cards */}

                    <div className="grid gap-4 md:grid-cols-3">
                        {summaryCards.map(
                            (card) => (
                                <article
                                    key={
                                        card.title
                                    }
                                    className="rounded-xl border bg-card p-5 text-card-foreground"
                                >
                                    <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                                        {
                                            card.title
                                        }
                                    </p>

                                    <p
                                        className={`mt-4 font-semibold ${card.title ===
                                                "Bästa vana"
                                                ? "text-lg"
                                                : "text-3xl"
                                            }`}
                                    >
                                        {
                                            card.value
                                        }
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {
                                            card.description
                                        }
                                    </p>
                                </article>
                            )
                        )}
                    </div>

                    {/* Chart */}

                    <StatisticsChart
                        period={
                            selectedPeriod
                        }
                        data={
                            chartData
                        }
                        selectedDate={
                            selectedDate
                        }
                        onSelectDate={
                            setSelectedDate
                        }
                    />

                    {/* Selected day — same HabitList as StartPage */}

                    {selectedPeriod !==
                        "Allt" &&
                        selectedDateObject && (
                            <HabitList
                                habits={
                                    selectedDayHabits
                                }
                                onToggle={
                                    toggleHabit
                                }
                                readOnly={
                                    toDateKey(
                                        selectedDateObject
                                    ) !==
                                    toDateKey(
                                        today
                                    )
                                }
                                isFuture={
                                    selectedDateObject >
                                    today
                                }
                                selectedDateLabel={
                                    selectedDateObject
                                        .toLocaleDateString(
                                            "sv-SE",
                                            {
                                                weekday:
                                                    "long",
                                                day:
                                                    "numeric",
                                                month:
                                                    "long",
                                            }
                                        )
                                        .replace(
                                            /^./,
                                            (
                                                character
                                            ) =>
                                                character.toUpperCase()
                                        )
                                }
                                shortDateLabel={
                                    formatShortDate(
                                        selectedDateObject
                                    )
                                }
                            />
                        )}

                    {/* History */}

                    {selectedPeriod !==
                        "Allt" && (
                            <article className="rounded-xl border bg-card p-5">
                                <div className="mb-4">
                                    <h2 className="text-base font-semibold">
                                        Historik
                                    </h2>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {selectedPeriod ===
                                            "7 dagar"
                                            ? "Sammanfattning för senaste 7 dagarna"
                                            : "Sammanfattning för senaste 28 dagarna"}
                                    </p>
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2 sm:items-center">

                                    {/* Donut */}

                                    <div className="relative mx-auto h-44 w-full max-w-56">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <PieChart>
                                                <Pie
                                                    data={
                                                        donutData
                                                    }
                                                    dataKey="value"
                                                    nameKey="name"
                                                    innerRadius={
                                                        52
                                                    }
                                                    outerRadius={
                                                        72
                                                    }
                                                    startAngle={
                                                        90
                                                    }
                                                    endAngle={
                                                        -270
                                                    }
                                                    strokeWidth={
                                                        0
                                                    }
                                                >
                                                    <Cell fill="#8b5cf6" />
                                                    <Cell fill="var(--muted)" />
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>

                                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-2xl font-bold">
                                                {
                                                    historyPercentage
                                                }
                                                %
                                            </span>

                                            <span className="text-[11px] text-muted-foreground">
                                                klarat
                                            </span>
                                        </div>
                                    </div>

                                    {/* History numbers */}

                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between rounded-lg border p-3">
                                            <div className="flex items-center gap-2">
                                                <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />

                                                <span className="text-xs">
                                                    Klara registreringar
                                                </span>
                                            </div>

                                            <span className="text-sm font-semibold">
                                                {
                                                    historyCompleted
                                                }
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between rounded-lg border p-3">
                                            <div className="flex items-center gap-2">
                                                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/25" />

                                                <span className="text-xs">
                                                    Ej klara
                                                </span>
                                            </div>

                                            <span className="text-sm font-semibold">
                                                {
                                                    historyRemaining
                                                }
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
                                            <span className="text-xs text-muted-foreground">
                                                Totalt möjliga
                                            </span>

                                            <span className="text-sm font-semibold">
                                                {
                                                    historyTotal
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        )}

                    {/* Habits table */}

                    <HabitsStatisticsTable
                        period={
                            selectedPeriod
                        }
                        onSelectHabit={(
                            habitId
                        ) =>
                            navigate(
                                `/habits/${habitId}`
                            )
                        }
                    />

                    <div className="h-4" />
                </div>
            </main>
        </>
    )
}