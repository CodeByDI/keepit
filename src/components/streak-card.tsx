import { Card, CardContent } from "@/components/ui/card"
import { FireIcon, TrophyIcon } from "@phosphor-icons/react"

type StreakCardProps = {
  current: number
  record: number
  daysLeft: number
}

export function StreakCard({ current, record, daysLeft }: StreakCardProps) {
  const progress = Math.round((current / record) * 100)

  return (
    <Card
      className="overflow-hidden shadow-none text-white h-full py-0 ring-1 ring-white/10"
      style={{
        background: "linear-gradient(135deg, #6d5cf6 0%, #8b5cf6 40%, #f472b6 100%)",
      }}
    >
      <CardContent style={{ padding: "16px 20px" }} className="flex flex-col justify-between h-full">

        {/* Label */}
        <p className="text-xs font-normal uppercase tracking-widest opacity-60">
          Streak
        </p>

        {/* Bottom content group */}
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-bold">{current}</span>
            <span className="text-base font-medium flex items-center gap-1">
              dagar <FireIcon size={16} />
            </span>
          </div>

          <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
            <div
              className="h-1.5 rounded-full"
              style={{ width: `${progress}%`, backgroundColor: "rgba(255,255,255,0.75)" }}
            />
          </div>

          <div className="flex justify-end text-xs opacity-60">
            <span className="flex items-center gap-1">
              {daysLeft} dagar till nytt rekord <TrophyIcon size={16} />
            </span>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
