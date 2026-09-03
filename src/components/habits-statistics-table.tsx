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

type HabitTrend = "up" | "down" | "stable"

type Habit = {
    name: string
    streak: number
    average: number
    trend: HabitTrend
    icon: typeof PersonSimpleRunIcon
    accentClass: string
    iconClass: string
    barClass: string
}

const habits: Habit[] = [
    {
        name: "Morgonlöpning",
        streak: 12,
        average: 68,
        trend: "up",
        icon: PersonSimpleRunIcon,
        accentClass: "border-l-violet-500",
        iconClass: "bg-violet-500/10 text-violet-500",
        barClass: "bg-violet-500",
    },
    {
        name: "Träna 30 min",
        streak: 8,
        average: 64,
        trend: "up",
        icon: BarbellIcon,
        accentClass: "border-l-purple-500",
        iconClass: "bg-purple-500/10 text-purple-500",
        barClass: "bg-purple-500",
    },
    {
        name: "Drick 2L vatten",
        streak: 5,
        average: 64,
        trend: "stable",
        icon: DropIcon,
        accentClass: "border-l-indigo-400",
        iconClass: "bg-indigo-400/10 text-indigo-400",
        barClass: "bg-indigo-400",
    },
    {
        name: "Koda",
        streak: 1,
        average: 54,
        trend: "down",
        icon: CodeIcon,
        accentClass: "border-l-pink-400",
        iconClass: "bg-pink-400/10 text-pink-400",
        barClass: "bg-pink-400",
    },
    {
        name: "Läs 20 sidor",
        streak: 3,
        average: 50,
        trend: "up",
        icon: BookOpenIcon,
        accentClass: "border-l-fuchsia-400",
        iconClass: "bg-fuchsia-400/10 text-fuchsia-400",
        barClass: "bg-fuchsia-400",
    },
]

export function HabitsStatisticsTable() {
    const [sortDescending, setSortDescending] = useState(true)

    const sortedHabits = useMemo(() => {
        return [...habits].sort((firstHabit, secondHabit) =>
            sortDescending
                ? secondHabit.average - firstHabit.average
                : firstHabit.average - secondHabit.average
        )
    }, [sortDescending])

    return (
        <article className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b px-6 py-5">
                <h2 className="text-lg font-semibold">Vanor</h2>

                <button
                    type="button"
                    onClick={() =>
                        setSortDescending((currentValue) => !currentValue)
                    }
                    className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    Sorterat efter genomsnitt

                    <ArrowDownIcon
                        size={16}
                        className={`transition-transform ${sortDescending ? "" : "rotate-180"
                            }`}
                    />
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] border-collapse">
                    <thead>
                        <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                            <th className="px-6 py-4 font-medium">Vana</th>
                            <th className="px-6 py-4 font-medium">Streak</th>
                            <th className="px-6 py-4 font-medium">
                                28-d snitt
                            </th>
                            <th className="px-6 py-4 text-right font-medium">
                                Trend
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {sortedHabits.map((habit) => {
                            const HabitIcon = habit.icon

                            return (
                                <tr
                                    key={habit.name}
                                    className={`border-b border-l-4 transition-colors last:border-b-0 hover:bg-muted/40 ${habit.accentClass}`}
                                >
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`flex h-9 w-9 items-center justify-center rounded-lg ${habit.iconClass}`}
                                            >
                                                <HabitIcon size={20} />
                                            </span>

                                            <span className="font-medium">
                                                {habit.name}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <FireIcon
                                                size={18}
                                                weight="fill"
                                                className="text-orange-500"
                                            />

                                            <span>{habit.streak}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className={`h-full rounded-full ${habit.barClass}`}
                                                    style={{
                                                        width: `${habit.average}%`,
                                                    }}
                                                />
                                            </div>

                                            <span className="w-10 text-sm">
                                                {habit.average}%
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end">
                                            <span
                                                aria-label={`Trend för ${habit.name}: ${habit.trend}`}
                                                className="rounded-md p-2"
                                            >
                                                <ArrowRightIcon
                                                    size={18}
                                                    className={`transition-transform ${habit.trend === "up"
                                                            ? "-rotate-45 text-green-500"
                                                            : habit.trend === "down"
                                                                ? "rotate-45 text-red-500"
                                                                : "text-muted-foreground"
                                                        }`}
                                                />
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </article>
    )
}