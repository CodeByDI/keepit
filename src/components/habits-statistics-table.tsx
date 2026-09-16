import {
    useMemo,
    useState,
    type ElementType,
} from "react"

import {
    ArrowDownIcon,
    ArrowRightIcon,
    BarbellIcon,
    BookOpenIcon,
    CodeIcon,
    DropIcon,
    FireIcon,
    PersonSimpleRunIcon,
} from "@phosphor-icons/react"

import type {
    StatisticsPeriod,
} from "@/components/statistics-chart"

import {
    ensureHabitHistorySeeded,
    getHabitCompletion,
    getHabitList,
    type HabitCompletion,
} from "@/lib/habit-storage"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type HabitTrend =
    | "up"
    | "down"
    | "stable"

type Habit = {
    id: number

    name: string

    streak: number

    averages: Record<
        StatisticsPeriod,
        number
    >

    icon: ElementType

    accentClass: string

    iconClass: string

    barClass: string
}

type HabitsStatisticsTableProps = {
    period: StatisticsPeriod

    onSelectHabit: (
        habitId: number
    ) => void
}

// ─────────────────────────────────────────────
// Icons
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

// ─────────────────────────────────────────────
// Colors
// ─────────────────────────────────────────────

const STYLE_PRESETS = [
    {
        accentClass:
            "border-l-violet-500",

        iconClass:
            "bg-violet-500/10 text-violet-500",

        barClass:
            "bg-violet-500",
    },

    {
        accentClass:
            "border-l-purple-500",

        iconClass:
            "bg-purple-500/10 text-purple-500",

        barClass:
            "bg-purple-500",
    },

    {
        accentClass:
            "border-l-indigo-400",

        iconClass:
            "bg-indigo-400/10 text-indigo-400",

        barClass:
            "bg-indigo-400",
    },

    {
        accentClass:
            "border-l-pink-400",

        iconClass:
            "bg-pink-400/10 text-pink-400",

        barClass:
            "bg-pink-400",
    },

    {
        accentClass:
            "border-l-fuchsia-400",

        iconClass:
            "bg-fuchsia-400/10 text-fuchsia-400",

        barClass:
            "bg-fuchsia-400",
    },
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
    ] =
        dateKey
            .split("-")
            .map(Number)

    return new Date(
        year,
        month - 1,
        day
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
            new Date(
                endDate
            )

        date.setDate(
            endDate.getDate() -
            offset
        )

        dates.push(
            normalizeDate(
                date
            )
        )
    }

    return dates
}

// ─────────────────────────────────────────────
// Streak
// ─────────────────────────────────────────────

function calculateStreak(
    history:
        HabitCompletion[],
    habitId:
        number,
    today:
        Date
) {
    let streak = 0

    const date =
        new Date(
            today
        )

    while (
        getHabitCompletion(
            history,
            habitId,
            date
        )
    ) {
        streak++

        date.setDate(
            date.getDate() -
            1
        )
    }

    return streak
}

// ─────────────────────────────────────────────
// Average for X days
// ─────────────────────────────────────────────

function calculatePeriodAverage(
    history:
        HabitCompletion[],
    habitId:
        number,
    today:
        Date,
    numberOfDays:
        number
) {
    const dates =
        getLastDays(
            today,
            numberOfDays
        )

    const completed =
        dates.filter(
            (date) =>
                getHabitCompletion(
                    history,
                    habitId,
                    date
                )
        ).length

    return Math.round(
        (
            completed /
            numberOfDays
        ) *
        100
    )
}

// ─────────────────────────────────────────────
// Average since first history entry
// ─────────────────────────────────────────────

function calculateOverallAverage(
    history:
        HabitCompletion[],
    habitId:
        number,
    today:
        Date
) {
    const entries =
        history
            .filter(
                (entry) =>
                    entry.habitId ===
                    habitId
            )
            .sort(
                (
                    first,
                    second
                ) =>
                    first.date.localeCompare(
                        second.date
                    )
            )

    if (
        entries.length === 0
    ) {
        return 0
    }

    const startDate =
        dateFromKey(
            entries[0].date
        )

    const millisecondsPerDay =
        24 *
        60 *
        60 *
        1000

    const numberOfDays =
        Math.max(
            1,
            Math.floor(
                (
                    normalizeDate(
                        today
                    ).getTime() -
                    normalizeDate(
                        startDate
                    ).getTime()
                ) /
                millisecondsPerDay
            ) + 1
        )

    const completed =
        getLastDays(
            today,
            numberOfDays
        ).filter(
            (date) =>
                getHabitCompletion(
                    history,
                    habitId,
                    date
                )
        ).length

    return Math.round(
        (
            completed /
            numberOfDays
        ) *
        100
    )
}

// ─────────────────────────────────────────────
// Build table habits from localStorage
// ─────────────────────────────────────────────

function buildHabits(
    history:
        HabitCompletion[],
    today:
        Date
): Habit[] {
    const storedHabits =
        getHabitList() ?? []

    return storedHabits.map(
        (
            storedHabit,
            index
        ) => {
            const style =
                STYLE_PRESETS[
                index %
                STYLE_PRESETS.length
                ]

            return {
                id:
                    storedHabit.id,

                name:
                    storedHabit.title,

                streak:
                    calculateStreak(
                        history,
                        storedHabit.id,
                        today
                    ),

                averages: {
                    "7 dagar":
                        calculatePeriodAverage(
                            history,
                            storedHabit.id,
                            today,
                            7
                        ),

                    "28 dagar":
                        calculatePeriodAverage(
                            history,
                            storedHabit.id,
                            today,
                            28
                        ),

                    Allt:
                        calculateOverallAverage(
                            history,
                            storedHabit.id,
                            today
                        ),
                },

                icon:
                    ICON_MAP[
                    storedHabit.icon
                    ] ??
                    FireIcon,

                accentClass:
                    style.accentClass,

                iconClass:
                    style.iconClass,

                barClass:
                    style.barClass,
            }
        }
    )
}

// ─────────────────────────────────────────────
// Trend calculation
// ─────────────────────────────────────────────

function getHabitTrend(
    habit: Habit,
    period: StatisticsPeriod
): HabitTrend {
    let currentValue:
        number

    let comparisonValue:
        number

    if (
        period ===
        "7 dagar"
    ) {
        currentValue =
            habit.averages[
            "7 dagar"
            ]

        comparisonValue =
            habit.averages[
            "28 dagar"
            ]
    } else {
        currentValue =
            habit.averages[
            "28 dagar"
            ]

        comparisonValue =
            habit.averages.Allt
    }

    const difference =
        currentValue -
        comparisonValue

    if (
        difference > 2
    ) {
        return "up"
    }

    if (
        difference < -2
    ) {
        return "down"
    }

    return "stable"
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function HabitsStatisticsTable({
    period,
    onSelectHabit,
}: HabitsStatisticsTableProps) {
    const [
        sortDescending,
        setSortDescending,
    ] = useState(true)

    const [
        today,
    ] = useState(
        () =>
            normalizeDate(
                new Date()
            )
    )

    const [
        history,
    ] =
        useState<
            HabitCompletion[]
        >(
            () =>
                ensureHabitHistorySeeded(
                    today
                )
        )

    // All habits now come from
    // the same localStorage as Start + Statistics.

    const habits =
        useMemo(
            () =>
                buildHabits(
                    history,
                    today
                ),
            [
                history,
                today,
            ]
        )

    const sortedHabits =
        useMemo(
            () => {
                return [
                    ...habits,
                ].sort(
                    (
                        firstHabit,
                        secondHabit
                    ) => {
                        const firstAverage =
                            firstHabit
                                .averages[
                            period
                            ]

                        const secondAverage =
                            secondHabit
                                .averages[
                            period
                            ]

                        return sortDescending
                            ? secondAverage -
                            firstAverage
                            : firstAverage -
                            secondAverage
                    }
                )
            },
            [
                habits,
                period,
                sortDescending,
            ]
        )

    const averageLabel =
        period ===
            "7 dagar"
            ? "7-d snitt"
            : period ===
                "28 dagar"
                ? "28-d snitt"
                : "Totalt snitt"

    return (
        <article className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">

            {/* Header */}

            <div className="flex items-center justify-between gap-4 border-b px-4 py-5 sm:px-6">

                <h2 className="text-lg font-semibold">
                    Vanor
                </h2>

                <button
                    type="button"
                    onClick={() =>
                        setSortDescending(
                            (
                                currentValue
                            ) =>
                                !currentValue
                        )
                    }
                    className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >

                    <span className="hidden min-[430px]:inline">
                        Sorterat efter genomsnitt
                    </span>

                    <span className="min-[430px]:hidden">
                        Sortera
                    </span>

                    <ArrowDownIcon
                        size={16}
                        className={`transition-transform ${sortDescending
                                ? ""
                                : "rotate-180"
                            }`}
                    />

                </button>

            </div>

            {/* Table */}

            <div className="overflow-x-auto">

                <table className="w-full border-collapse">

                    <thead>

                        <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">

                            <th className="px-4 py-4 font-medium sm:px-6">
                                Vana
                            </th>

                            <th className="px-3 py-4 font-medium sm:px-6">
                                Streak
                            </th>

                            <th className="px-3 py-4 font-medium sm:px-6">
                                {
                                    averageLabel
                                }
                            </th>

                            <th className="hidden px-6 py-4 text-right font-medium sm:table-cell">
                                Trend
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {sortedHabits.map(
                            (
                                habit
                            ) => {
                                const HabitIcon =
                                    habit.icon

                                const average =
                                    habit.averages[
                                    period
                                    ]

                                const trend =
                                    getHabitTrend(
                                        habit,
                                        period
                                    )

                                return (
                                    <tr
                                        key={
                                            habit.id
                                        }
                                        role="button"
                                        tabIndex={
                                            0
                                        }
                                        onClick={() =>
                                            onSelectHabit(
                                                habit.id
                                            )
                                        }
                                        onKeyDown={(
                                            event
                                        ) => {
                                            if (
                                                event.key ===
                                                "Enter" ||
                                                event.key ===
                                                " "
                                            ) {
                                                event.preventDefault()

                                                onSelectHabit(
                                                    habit.id
                                                )
                                            }
                                        }}
                                        className={`cursor-pointer border-b border-l-4 transition-colors last:border-b-0 hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none ${habit.accentClass}`}
                                    >

                                        {/* Habit */}

                                        <td className="px-4 py-4 sm:px-6">

                                            <div className="flex items-center gap-2 sm:gap-3">

                                                <span
                                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${habit.iconClass}`}
                                                >

                                                    <HabitIcon
                                                        size={
                                                            20
                                                        }
                                                    />

                                                </span>

                                                <span className="font-medium">
                                                    {
                                                        habit.name
                                                    }
                                                </span>

                                            </div>

                                        </td>

                                        {/* Streak */}

                                        <td className="px-3 py-4 sm:px-6">

                                            <div className="flex items-center gap-1">

                                                <FireIcon
                                                    size={
                                                        18
                                                    }
                                                    weight="fill"
                                                    className="shrink-0 text-orange-500"
                                                />

                                                <span>
                                                    {
                                                        habit.streak
                                                    }
                                                </span>

                                            </div>

                                        </td>

                                        {/* Average */}

                                        <td className="px-3 py-4 sm:px-6">

                                            <div className="flex items-center gap-3">

                                                <div className="hidden h-2 w-16 overflow-hidden rounded-full bg-muted min-[430px]:block sm:w-24">

                                                    <div
                                                        className={`h-full rounded-full transition-all ${habit.barClass}`}
                                                        style={{
                                                            width:
                                                                `${average}%`,
                                                        }}
                                                    />

                                                </div>

                                                <span className="text-sm">
                                                    {
                                                        average
                                                    }
                                                    %
                                                </span>

                                            </div>

                                        </td>

                                        {/* Trend */}

                                        <td className="hidden px-6 py-4 text-right sm:table-cell">

                                            <div className="flex items-center justify-end gap-2">

                                                <span
                                                    className={`text-xs ${trend ===
                                                            "up"
                                                            ? "text-green-500"
                                                            : trend ===
                                                                "down"
                                                                ? "text-red-500"
                                                                : "text-muted-foreground"
                                                        }`}
                                                >
                                                    {trend ===
                                                        "up"
                                                        ? "Ökar"
                                                        : trend ===
                                                            "down"
                                                            ? "Minskar"
                                                            : "Stabil"}
                                                </span>

                                                <ArrowRightIcon
                                                    size={
                                                        18
                                                    }
                                                    className={`transition-transform ${trend ===
                                                            "up"
                                                            ? "-rotate-45 text-green-500"
                                                            : trend ===
                                                                "down"
                                                                ? "rotate-45 text-red-500"
                                                                : "text-muted-foreground"
                                                        }`}
                                                />

                                            </div>

                                        </td>

                                    </tr>
                                )
                            }
                        )}

                    </tbody>

                </table>

            </div>

        </article>
    )
}