import { useState } from "react"

import {
    StatisticsChart,
    type StatisticsPeriod,
} from "@/components/statistics-chart"

import { HabitsStatisticsTable } from "@/components/habits-statistics-table"


const periods: StatisticsPeriod[] = [
    "7 dagar",
    "28 dagar",
    "Allt",
]

const summaryCards = [
    {
        title: "Klarat totalt",
        value: "84",
        description: "Registreringar sedan start",
    },
    {
        title: "Aktiva vanor",
        value: "5",
        description: "Av 5 möjliga idag",
    },
    {
        title: "Bästa vana",
        value: "Morgonlöpning",
        description: "68% klarat",
    },
]

export function StatisticsPage() {
    const [selectedPeriod, setSelectedPeriod] =
        useState<StatisticsPeriod>("28 dagar")

    const subtitle =
        selectedPeriod === "Allt"
            ? "Sedan start"
            : `Senaste ${selectedPeriod.toLowerCase()}`

    return (
        <section className="mx-auto flex w-full max-w-7xl flex-col gap-7">
            <div className="flex flex-col gap-4 border-b pb-7 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Statistik
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        {subtitle}
                    </p>
                </div>

                <div className="flex w-fit rounded-xl border bg-muted p-1">
                    {periods.map((period) => (
                        <button
                            key={period}
                            type="button"
                            onClick={() => setSelectedPeriod(period)}
                            className={`rounded-lg px-5 py-2 text-sm transition-colors ${selectedPeriod === period
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {period}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {summaryCards.map((card) => (
                    <article
                        key={card.title}
                        className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm"
                    >
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {card.title}
                        </p>

                        <p
                            className={`mt-5 font-semibold ${card.title === "Bästa vana"
                                ? "text-xl"
                                : "text-4xl"
                                }`}
                        >
                            {card.value}
                        </p>

                        <p className="mt-2 text-sm text-muted-foreground">
                            {card.description}
                        </p>
                    </article>
                ))}
            </div>

            <StatisticsChart period={selectedPeriod} />

            <HabitsStatisticsTable />
        </section>
    )
}