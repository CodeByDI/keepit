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
  return new Intl.DateTimeFormat(
    "sv-SE",
    {
      weekday: "short",
    }
  )
    .format(date)
    .replace(".", "")
}

export function WeeklyHabitView({
  days,
  selectedDate,
  onSelectDate,
  habitLabel,
}: WeeklyHabitViewProps) {
  return (
    <section className="overflow-hidden rounded-[10px] border bg-card">
      <div className="flex flex-col gap-2 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <h2 className="text-sm font-semibold">
            Veckoöversikt
          </h2>

          <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">
            Måndag–söndag
          </p>
        </div>

        {habitLabel && (
          <span className="w-fit rounded-full border bg-muted px-2.5 py-1 text-[9px] text-muted-foreground sm:text-[10px]">
            {habitLabel}
          </span>
        )}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const selected =
            sameDate(
              day.date,
              selectedDate
            )

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

          let status =
            "Inte klar"

          if (day.future) {
            status =
              "Planerad"
          } else if (
            day.completed ===
            day.total
          ) {
            status =
              "Klar"
          } else if (
            day.completed > 0
          ) {
            status =
              `${day.completed}/${day.total}`
          }

          return (
            <button
              key={
                day.date.getTime()
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
                "relative min-w-0 border-r px-0.5 py-3 text-center transition last:border-r-0",
                "sm:px-2 sm:py-4",

                selected
                  ? "bg-primary/[0.06] ring-1 ring-inset ring-primary/40"
                  : "",

                day.future
                  ? "cursor-default opacity-35"
                  : "cursor-pointer hover:bg-muted/40",
              ].join(" ")}
            >
              <div className="flex min-h-[20px] items-center justify-center">
                {day.isToday && (
                  <span className="rounded-full bg-primary px-1.5 py-[2px] text-[7px] font-semibold text-primary-foreground sm:px-2 sm:text-[8px]">
                    Idag
                  </span>
                )}
              </div>

              <p className="mt-1 truncate text-[8px] font-semibold uppercase tracking-[0.02em] text-muted-foreground sm:text-[10px]">
                {getWeekdayLabel(
                  day.date
                )}
              </p>

              <div
                className={[
                  "mx-auto mt-2 flex h-7 w-7 items-center justify-center rounded-full border text-[9px] font-semibold",
                  "sm:h-9 sm:w-9 sm:text-xs",

                  day.isToday
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border",
                ].join(" ")}
              >
                {day.date.getDate()}
              </div>

              <p
                className={[
                  "mt-2 truncate text-[7px] sm:text-[10px]",

                  day.future
                    ? "text-muted-foreground"
                    : day.completed ===
                        day.total
                      ? "font-medium text-primary"
                      : "text-muted-foreground",
                ].join(" ")}
              >
                {status}
              </p>

              <div className="mx-auto mt-2 h-1 w-[70%] overflow-hidden rounded-full bg-muted sm:w-[72%]">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width:
                      `${percentage}%`,
                  }}
                />
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}