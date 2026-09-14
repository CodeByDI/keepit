import {
    Area,
    AreaChart,
    CartesianGrid,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

export type StatisticsPeriod =
    | "7 dagar"
    | "28 dagar"
    | "Allt"

export type StatisticsChartPoint = {
    dateKey: string
    label: string
    completed: number
}

type StatisticsChartProps = {
    period: StatisticsPeriod
    data: StatisticsChartPoint[]
    selectedDate?: string | null
    onSelectDate?: (dateKey: string) => void
}

export function StatisticsChart({
    period,
    data,
    selectedDate,
    onSelectDate,
}: StatisticsChartProps) {
    const average =
        data.length > 0
            ? Math.round(
                data.reduce(
                    (sum, point) =>
                        sum + point.completed,
                    0
                ) / data.length
            )
            : 0

    const selectedPoint =
        data.find(
            (point) =>
                point.dateKey ===
                selectedDate
        ) ?? null

    return (
        <article className="rounded-xl border bg-card p-5 text-card-foreground sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-base font-semibold">
                        Utveckling
                    </h2>

                    <p className="mt-1 text-xs text-muted-foreground">
                        Andel av dagens vanor som
                        blev klara
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-2xl font-bold">
                        {average}%
                    </p>

                    <p className="text-xs text-muted-foreground">
                        genomsnitt
                    </p>
                </div>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <AreaChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 10,
                            left: -20,
                            bottom: 0,
                        }}
                        onClick={(chartState) => {
                            if (
                                period === "Allt" ||
                                !chartState?.activeLabel
                            ) {
                                return
                            }

                            const point =
                                data.find(
                                    (item) =>
                                        item.label ===
                                        chartState.activeLabel
                                )

                            if (point) {
                                onSelectDate?.(
                                    point.dateKey
                                )
                            }
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
                                    offset="0%"
                                    stopColor="#8b5cf6"
                                    stopOpacity={0.35}
                                />

                                <stop
                                    offset="100%"
                                    stopColor="#8b5cf6"
                                    stopOpacity={0.02}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            vertical={false}
                            stroke="var(--border)"
                            strokeDasharray="3 3"
                        />

                        <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fontSize: 10,
                                fill:
                                    "var(--muted-foreground)",
                            }}
                            interval={
                                period === "28 dagar"
                                    ? 3
                                    : 0
                            }
                        />

                        <YAxis
                            domain={[0, 100]}
                            ticks={[
                                0,
                                20,
                                40,
                                60,
                                80,
                                100,
                            ]}
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fontSize: 10,
                                fill:
                                    "var(--muted-foreground)",
                            }}
                            tickFormatter={(
                                value
                            ) => `${value}%`}
                        />

                        <Tooltip
                            cursor={{
                                stroke:
                                    "var(--border)",
                            }}
                            contentStyle={{
                                borderRadius:
                                    "8px",
                                border:
                                    "1px solid var(--border)",
                                background:
                                    "var(--popover)",
                                color:
                                    "var(--popover-foreground)",
                                fontSize:
                                    "12px",
                            }}
                            formatter={(
                                value
                            ) => [
                                    `${value}%`,
                                    "Klarat",
                                ]}
                        />

                        {selectedPoint &&
                            period !== "Allt" && (
                                <ReferenceLine
                                    x={
                                        selectedPoint.label
                                    }
                                    stroke="#8b5cf6"
                                    strokeDasharray="4 4"
                                    strokeOpacity={
                                        0.7
                                    }
                                />
                            )}

                        <Area
                            type="monotone"
                            dataKey="completed"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            fill="url(#statisticsGradient)"
                            activeDot={{
                                r: 5,
                                fill:
                                    "#8b5cf6",
                                stroke:
                                    "var(--background)",
                                strokeWidth:
                                    2,
                                cursor:
                                    period ===
                                        "Allt"
                                        ? "default"
                                        : "pointer",
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-violet-500" />

                <span>
                    Klarade vanor
                    {period !== "Allt"
                        ? " per dag"
                        : " per månad"}
                </span>

                <span className="ml-auto hidden sm:inline">
                    {period === "Allt"
                        ? "Månadsöversikt"
                        : "Klicka på en punkt för att visa dagens vanor"}
                </span>
            </div>
        </article>
    )
}