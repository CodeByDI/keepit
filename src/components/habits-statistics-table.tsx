import { useMemo, useState } from "react"
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
import type { StatisticsPeriod } from "@/components/statistics-chart"

type HabitTrend = "up" | "down" | "stable"

type Habit = {
    name: string
    streak: number
    averages: Record<StatisticsPeriod, number>
    trend: HabitTrend
    icon: typeof PersonSimpleRunIcon
    accentClass: string
    iconClass: string
    barClass: string
}

type HabitsStatisticsTableProps = {
    period: StatisticsPeriod
}

const habits: Habit[] = [
    {
        name: "Morgonlöpning",
        streak: 12,
        averages: {
            "7 dagar": 72,
            "28 dagar": 68,
            Allt: 65,
        },
        trend: "up",
        icon: PersonSimpleRunIcon,
        accentClass: "border-l-violet-500",
        iconClass: "bg-violet-500/10 text-violet-500",
        barClass: "bg-violet-500",
    },
    {
        name: "Träna 30 min",
        streak: 8,
        averages: {
            "7 dagar": 66,
            "28 dagar": 64,
            Allt: 70,
        },
        trend: "up",
        icon: BarbellIcon,
        accentClass: "border-l-purple-500",
        iconClass: "bg-purple-500/10 text-purple-500",
        barClass: "bg-purple-500",
    },
    {
        name: "Drick 2L vatten",
        streak: 5,
        averages: {
            "7 dagar": 58,
            "28 dagar": 64,
            Allt: 61,
        },
        trend: "stable",
        icon: DropIcon,
        accentClass: "border-l-indigo-400",
        iconClass: "bg-indigo-400/10 text-indigo-400",
        barClass: "bg-indigo-400",
    },
    {
        name: "Koda",
        streak: 1,
        averages: {
            "7 dagar": 48,
            "28 dagar": 54,
            Allt: 57,
        },
        trend: "down",
        icon: CodeIcon,
        accentClass: "border-l-pink-400",
        iconClass: "bg-pink-400/10 text-pink-400",
        barClass: "bg-pink-400",
    },
    {
        name: "Läs 20 sidor",
        streak: 3,
        averages: {
            "7 dagar": 55,
            "28 dagar": 50,
            Allt: 52,
        },
        trend: "up",
        icon: BookOpenIcon,
        accentClass: "border-l-fuchsia-400",
        iconClass: "bg-fuchsia-400/10 text-fuchsia-400",
        barClass: "bg-fuchsia-400",
    },
]

export function HabitsStatisticsTable({
    period,
}: HabitsStatisticsTableProps) {
    const [sortDescending, setSortDescending] = useState(true)

    const sortedHabits = useMemo(() => {
        return [...habits].sort((firstHabit, secondHabit) => {
            const firstAverage = firstHabit.averages[period]
            const secondAverage = secondHabit.averages[period]

            return sortDescending
                ? secondAverage - firstAverage
                : firstAverage - secondAverage
        })
    }, [period, sortDescending])

    const averageLabel =
        period === "7 dagar"
            ? "7-d snitt"
            : period === "28 dagar"
                ? "28-d snitt"
                : "Totalt snitt"

    return (
        <article className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b px-4 py-5 sm:px-6">
                <h2 className="text-lg font-semibold">Vanor</h2>

                <button
                    type="button"
                    onClick={() =>
                        setSortDescending((currentValue) => !currentValue)
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
                        className={`transition-transform ${sortDescending ? "" : "rotate-180"
                            }`}
                    />
                </button>
            </div>

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
                            {averageLabel}
                        </th>

                        <th className="hidden px-6 py-4 text-right font-medium sm:table-cell">
                            Trend
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {sortedHabits.map((habit) => {
                        const HabitIcon = habit.icon
                        const average = habit.averages[period]

                        return (
                            <tr
                                key={habit.name}
                                className={`border-b border-l-4 transition-colors last:border-b-0 hover:bg-muted/40 ${habit.accentClass}`}
                            >
                                <td className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <span
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${habit.iconClass}`}
                                        >
                                            <HabitIcon size={20} />
                                        </span>

                                        <span className="font-medium">
                                            {habit.name}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-3 py-4 sm:px-6">
                                    <div className="flex items-center gap-1">
                                        <FireIcon
                                            size={18}
                                            weight="fill"
                                            className="shrink-0 text-orange-500"
                                        />

                                        <span>{habit.streak}</span>
                                    </div>
                                </td>

                                <td className="px-3 py-4 sm:px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="hidden h-2 w-16 overflow-hidden rounded-full bg-muted min-[430px]:block sm:w-24">
                                            <div
                                                className={`h-full rounded-full ${habit.barClass}`}
                                                style={{ width: `${average}%` }}
                                            />
                                        </div>

                                        <span className="text-sm">
                                            {average}%
                                        </span>
                                    </div>
                                </td>

                                <td className="hidden px-6 py-4 text-right sm:table-cell">
                                    <ArrowRightIcon
                                        size={18}
                                        className={`ml-auto transition-transform ${habit.trend === "up"
                                            ? "-rotate-45 text-green-500"
                                            : habit.trend === "down"
                                                ? "rotate-45 text-red-500"
                                                : "text-muted-foreground"
                                            }`}
                                    />
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </article>
    )
}