import { Card, CardContent } from "@/components/ui/card"
import { TrophyIcon } from "@phosphor-icons/react"

type StreakCardProps = {
  current: number
  record: number
  daysLeft: number
  habitName: string
  HabitIcon: React.ElementType
}

export function StreakCard({ current, record, daysLeft, habitName, HabitIcon }: StreakCardProps) {
  const progress = record > 0 ? Math.min(100, Math.round((current / record) * 100)) : 100

  return (
    <Card
      className="overflow-hidden shadow-none text-white h-full py-0 ring-1 ring-white/10"
      style={{
        background: "linear-gradient(135deg, #6d5cf6 0%, #8b5cf6 40%, #f472b6 100%)",
      }}
    >
      <CardContent style={{ padding: "16px 20px" }} className="flex flex-col justify-between h-full">

        {/* Label row with habit icon */}
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-normal uppercase tracking-widest opacity-60">Streak</p>
          <div className="opacity-70">
            <HabitIcon size={13} />
          </div>
        </div>

        {/* Bottom content group */}
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-bold">{current}</span>
            <span className="text-base font-medium opacity-80">dagar</span>
          </div>

          <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
            <div
              className="h-1.5 rounded-full transition-all"
              style={{ width: `${progress}%`, backgroundColor: "rgba(255,255,255,0.75)" }}
            />
          </div>

          <div className="flex justify-end text-xs opacity-60">
            {daysLeft > 0 ? (
              <span className="flex items-center gap-1">
                {daysLeft} {daysLeft === 1 ? "dag" : "dagar"} till rekord i {habitName} <TrophyIcon size={13} />
              </span>
            ) : (
              <span className="flex items-center gap-1">
                Rekord i {habitName}! <TrophyIcon size={13} />
              </span>
            )}
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
