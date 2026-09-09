export type WeeklyHabitDay = {
  date: Date
  completed: number
  total: number
  future: boolean
  isToday: boolean
}

type WeeklyHabitViewProps = {
  days: WeeklyHabitDay[]
  selectedDate: Date
  onSelectDate: (date: Date) => void
  habitLabel?: string
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

function getWeekdayLabel(
  date: Date
) {
  const label =
    new Intl.DateTimeFormat(
      "sv-SE",
      {
        weekday: "short",
      }
    ).format(date)

  return label
    .replace(".", "")
    .toUpperCase()
}

export function WeeklyHabitView({
  days,
  selectedDate,
  onSelectDate,
  habitLabel = "Alla vanor",
}: WeeklyHabitViewProps) {
  return (
    <section className="overflow-hidden rounded-[10px] border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
        <div>
          <h2 className="text-xs font-semibold text-foreground">
            Veckoöversikt
          </h2>

          <p className="mt-1 text-[10px] text-muted-foreground">
            Måndag–söndag
          </p>
        </div>

        <span className="rounded-full border bg-background px-3 py-1 text-[9px] text-muted-foreground">
          {habitLabel}
        </span>
      </div>

      <div className="grid grid-cols-7">
        {days.map(
          (day) => {
            const selected =
              sameDate(
                day.date,
                selectedDate
              )

            const completed =
              !day.future &&
              day.total > 0 &&
              day.completed ===
                day.total

            const partiallyCompleted =
              !day.future &&
              day.completed > 0 &&
              day.completed <
                day.total

            const percentage =
              day.total > 0
                ? Math.round(
                    (
                      day.completed /
                      day.total
                    ) *
                      100
                  )
                : 0

            return (
              <button
                key={
                  day.date.toISOString()
                }
                type="button"
                disabled={
                  day.future
                }
                onClick={() =>
                  onSelectDate(
                    day.date
                  )
                }
                className={[
                  "relative flex min-h-[112px] flex-col items-center justify-center gap-2 border-r p-3 text-center transition",
                  "last:border-r-0",

                  selected
                    ? "bg-primary/[0.06] ring-1 ring-inset ring-primary/50"
                    : "hover:bg-muted/40",

                  day.future
                    ? "cursor-not-allowed opacity-35"
                    : "cursor-pointer",
                ].join(" ")}
              >
                {day.isToday && (
                  <span className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-primary px-2 py-0.5 text-[8px] font-semibold text-primary-foreground">
                    Idag
                  </span>
                )}

                <span
                  className={[
                    "mt-3 text-[9px] font-medium tracking-[0.05em]",
                    day.isToday
                      ? "text-primary"
                      : "text-muted-foreground",
                  ].join(" ")}
                >
                  {
                    getWeekdayLabel(
                      day.date
                    )
                  }
                </span>

                <div
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition",
                    completed
                      ? "bg-primary text-primary-foreground"
                      : "border border-muted-foreground/30 bg-transparent text-foreground",

                    day.future
                      ? "border-muted bg-muted/20 text-muted-foreground"
                      : "",
                  ].join(" ")}
                >
                  {
                    day.date.getDate()
                  }
                </div>

                <div className="flex h-5 items-center justify-center">
                  {day.future ? (
                    <span className="text-[9px] text-muted-foreground">
                      Planerad
                    </span>
                  ) : completed ? (
                    <span className="text-[9px] font-medium text-primary">
                      Klar
                    </span>
                  ) : partiallyCompleted ? (
                    <span className="text-[9px] text-muted-foreground">
                      {
                        day.completed
                      }
                      /
                      {
                        day.total
                      }
                    </span>
                  ) : (
                    <span className="text-[9px] text-muted-foreground">
                      Inte klar
                    </span>
                  )}
                </div>

                <div className="h-1.5 w-full max-w-[52px] overflow-hidden rounded-full bg-muted">
                  <div
                    className={[
                      "h-full rounded-full transition-all",
                      completed ||
                      partiallyCompleted
                        ? "bg-primary"
                        : "bg-transparent",
                    ].join(" ")}
                    style={{
                      width: `${
                        day.future
                          ? 0
                          : percentage
                      }%`,
                    }}
                  />
                </div>
              </button>
            )
          }
        )}
      </div>
    </section>
  )
}
