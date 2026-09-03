import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

export type StatisticsPeriod = "7 dagar" | "28 dagar" | "Allt"

type StatisticsChartProps = {
    period: StatisticsPeriod
}

const chartData = {
    "7 dagar": [
        { date: "31 aug", completed: 60 },
        { date: "1 sep", completed: 40 },
        { date: "2 sep", completed: 80 },
        { date: "3 sep", completed: 60 },
        { date: "4 sep", completed: 40 },
        { date: "5 sep", completed: 80 },
        { date: "6 sep", completed: 60 },
    ],
    "28 dagar": [
        { date: "10 aug", completed: 40 },
        { date: "11 aug", completed: 60 },
        { date: "12 aug", completed: 60 },
        { date: "13 aug", completed: 80 },
        { date: "14 aug", completed: 60 },
        { date: "15 aug", completed: 40 },
        { date: "16 aug", completed: 60 },
        { date: "17 aug", completed: 80 },
        { date: "18 aug", completed: 60 },
        { date: "19 aug", completed: 40 },
        { date: "20 aug", completed: 60 },
        { date: "21 aug", completed: 60 },
        { date: "22 aug", completed: 80 },
        { date: "23 aug", completed: 60 },
        { date: "24 aug", completed: 40 },
        { date: "25 aug", completed: 60 },
        { date: "26 aug", completed: 80 },
        { date: "27 aug", completed: 60 },
        { date: "28 aug", completed: 60 },
        { date: "29 aug", completed: 40 },
        { date: "30 aug", completed: 60 },
        { date: "31 aug", completed: 80 },
        { date: "1 sep", completed: 60 },
        { date: "2 sep", completed: 40 },
        { date: "3 sep", completed: 60 },
        { date: "4 sep", completed: 80 },
        { date: "5 sep", completed: 60 },
        { date: "6 sep", completed: 60 },
    ],
    Allt: [
        { date: "Jan", completed: 42 },
        { date: "Feb", completed: 48 },
        { date: "Mar", completed: 52 },
        { date: "Apr", completed: 58 },
        { date: "Maj", completed: 55 },
        { date: "Jun", completed: 62 },
        { date: "Jul", completed: 66 },
        { date: "Aug", completed: 60 },
        { date: "Sep", completed: 68 },
    ],
}

export function StatisticsChart({
    period,
}: StatisticsChartProps) {
    const data = chartData[period]

    const average = Math.round(
        data.reduce((total, item) => total + item.completed, 0) /
        data.length
    )

    const description =
        period === "Allt"
            ? "Månadsvis utveckling — sedan start"
            : `Daglig utveckling — senaste ${period.toLowerCase()}`

    const legend =
        period === "Allt"
            ? "Klarade vanor per månad"
            : "Klarade vanor per dag"

    return (
        <article className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm sm:p-6">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold">Utveckling</h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>

                <div className="shrink-0 text-right">
                    <p className="text-3xl font-bold">{average}%</p>

                    <p className="text-sm text-muted-foreground">
                        genomsnitt
                    </p>
                </div>
            </div>

            <div className="h-72 w-full sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient
                                id="statisticsGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#8b5cf6"
                                    stopOpacity={0.4}
                                />

                                <stop
                                    offset="95%"
                                    stopColor="#8b5cf6"
                                    stopOpacity={0.02}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            opacity={0.25}
                        />

                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            minTickGap={32}
                            tick={{ fontSize: 12 }}
                        />

                        <YAxis
                            domain={[0, 100]}
                            ticks={[0, 25, 50, 75, 100]}
                            axisLine={false}
                            tickLine={false}
                            width={45}
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `${value}%`}
                        />

                        <Tooltip
                            formatter={(value) => [
                                `${value}%`,
                                "Klarade vanor",
                            ]}
                            contentStyle={{
                                backgroundColor: "var(--popover)",
                                color: "var(--popover-foreground)",
                                border: "1px solid var(--border)",
                                borderRadius: "10px",
                            }}
                        />

                        <Area
                            type="monotone"
                            dataKey="completed"
                            name="Klarade vanor"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            fill="url(#statisticsGradient)"
                            activeDot={{ r: 6 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-3 w-3 rounded-full bg-violet-500" />
                {legend}
            </div>
        </article>
    )
}