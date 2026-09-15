import { useState } from "react"
import {
  BookOpenIcon,
  BarbellIcon,
  DropIcon,
  PersonSimpleRunIcon,
  CodeIcon,
  FireIcon,
  CheckIcon,
} from "@phosphor-icons/react"

const ONBOARDING_KEY = "keepit.onboarding.done"

export function hasCompletedOnboarding() {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === "true"
  } catch {
    return false
  }
}

function markOnboardingDone() {
  try {
    localStorage.setItem(ONBOARDING_KEY, "true")
  } catch {
    // ignore
  }
}

// ─── Step visuals ──────────────────────────────────────────────────────────────

function FloatingIcons() {
  const icons = [
    { Icon: BookOpenIcon,        color: "var(--chart-1)", size: 18, top: "10%",  left: "8%",  rotate: "-8deg",  scale: 1 },
    { Icon: BarbellIcon,         color: "var(--chart-4)", size: 16, top: "5%",   left: "55%", rotate: "6deg",   scale: 0.9 },
    { Icon: FireIcon,            color: "#f472b6",        size: 22, top: "18%",  left: "78%", rotate: "-4deg",  scale: 1.1 },
    { Icon: PersonSimpleRunIcon, color: "var(--chart-3)", size: 18, top: "58%",  left: "5%",  rotate: "5deg",   scale: 0.95 },
    { Icon: DropIcon,            color: "var(--chart-5)", size: 16, top: "65%",  left: "72%", rotate: "-6deg",  scale: 0.9 },
    { Icon: CodeIcon,            color: "var(--chart-2)", size: 18, top: "75%",  left: "38%", rotate: "4deg",   scale: 1 },
  ]

  return (
    <div className="relative w-full h-36">
      {icons.map(({ Icon, color, size, top, left, rotate, scale }, i) => (
        <div
          key={i}
          className="absolute flex items-center justify-center rounded-xl"
          style={{
            top, left,
            width: "40px",
            height: "40px",
            transform: `rotate(${rotate}) scale(${scale})`,
            backgroundColor: `color-mix(in oklch, ${color} 15%, transparent)`,
            border: `1px solid color-mix(in oklch, ${color} 25%, transparent)`,
          }}
        >
          <Icon size={size} style={{ color }} />
        </div>
      ))}
      {/* Center logo mark */}
      <div
        className="absolute flex items-center justify-center rounded-2xl"
        style={{
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "52px", height: "52px",
          background: "linear-gradient(135deg, #5649d4 0%, #6d5cf6 45%, #8b5cf6 78%, #f472b6 100%)",
        }}
      >
        <div
          className="rounded-xl"
          style={{ width: "28px", height: "28px", background: "linear-gradient(135deg, #6d5cf6, #a89bfa, #f472b6)", borderRadius: "50%", padding: "3px" }}
        >
          <div className="w-full h-full rounded-full" style={{ backgroundColor: "white", opacity: 0.15 }} />
        </div>
      </div>
    </div>
  )
}

function HabitListMockup() {
  const rows = [
    { label: "Läs 20 sidor",    color: "var(--chart-1)", done: true },
    { label: "Morgonlöpning",   color: "var(--chart-3)", done: true },
    { label: "Drick 2L vatten", color: "var(--chart-5)", done: false },
  ]

  return (
    <div
      className="w-full rounded-xl border overflow-hidden"
      style={{ backgroundColor: "var(--card)" }}
    >
      <div className="px-4 py-2 border-b">
        <p className="text-[9px] font-medium uppercase tracking-widest opacity-50" style={{ color: "var(--muted-foreground)" }}>
          Återstår · 1
        </p>
      </div>
      {rows.map((row, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-2.5 border-b last:border-0"
        >
          <div
            className="size-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `color-mix(in oklch, ${row.color} 15%, transparent)` }}
          >
            <div className="size-2 rounded-full" style={{ backgroundColor: row.color }} />
          </div>
          <p
            className="flex-1 text-xs font-medium"
            style={{
              color: row.done ? "var(--muted-foreground)" : "var(--foreground)",
              textDecoration: row.done ? "line-through" : "none",
              opacity: row.done ? 0.5 : 1,
            }}
          >
            {row.label}
          </p>
          <div
            className="size-5 rounded-full border-2 flex items-center justify-center"
            style={{
              borderColor: row.done ? row.color : "var(--border)",
              backgroundColor: row.done ? row.color : "transparent",
            }}
          >
            {row.done && <CheckIcon size={10} weight="bold" color="white" />}
          </div>
        </div>
      ))}
    </div>
  )
}

function ProgressRingVisual() {
  const percentage = 62
  const size = 100
  const strokeWidth = 10
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - percentage / 100)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--muted)" strokeWidth={strokeWidth} />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke="url(#onboardingGrad)" strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
          />
          <defs>
            <linearGradient id="onboardingGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#5649d4" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-xl font-bold" style={{ color: "var(--foreground)" }}>{percentage}%</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <FireIcon size={14} weight="fill" style={{ color: "#f97316" }} />
        <span className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>12 dagars streak</span>
      </div>
    </div>
  )
}

// ─── Steps config ──────────────────────────────────────────────────────────────

const steps = [
  {
    visual: <FloatingIcons />,
    headline: "Bygg vanor som håller.",
    body: "Välj en vana. Gör den varje dag. KeepIt håller koll åt dig.",
  },
  {
    visual: <HabitListMockup />,
    headline: "Följ din progress.",
    body: "Se streaks, statistik och hur du utvecklas — dag för dag.",
  },
  {
    visual: <ProgressRingVisual />,
    headline: "Dag 1 av förhoppningsvis många.",
    body: "Det börjar idag. Vaga löften håller inte — konkreta vanor gör det.",
  },
]

// ─── Modal ─────────────────────────────────────────────────────────────────────

type OnboardingModalProps = {
  onDone: () => void
}

export function OnboardingModal({ onDone }: OnboardingModalProps) {
  const [step, setStep] = useState(0)
  const current = steps[step]
  const isLast = step === steps.length - 1

  function handleNext() {
    if (isLast) {
      markOnboardingDone()
      onDone()
    } else {
      setStep((s) => s + 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div
        className="relative w-full max-w-sm rounded-2xl border p-8 flex flex-col items-center text-center gap-6"
        style={{ backgroundColor: "var(--card)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 absolute top-6 left-6">
          <div
            className="h-[22px] w-[22px] rounded-full p-[3px]"
            style={{ background: "linear-gradient(135deg, #6d5cf6, #a89bfa, #f472b6)" }}
          >
            <div className="h-full w-full rounded-full" style={{ backgroundColor: "var(--card)" }} />
          </div>
          <span className="text-xs font-semibold" style={{ color: "var(--primary)" }}>KeepIt</span>
        </div>

        {/* Step dots */}
        <div className="flex gap-2 mt-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === step ? "20px" : "6px",
                backgroundColor: i === step ? "var(--primary)" : "var(--muted)",
              }}
            />
          ))}
        </div>

        {/* Visual */}
        <div className="w-full">
          {current.visual}
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold tracking-tight" style={{ color: "var(--foreground)" }}>
            {current.headline}
          </h2>
          <p className="text-sm text-muted-foreground opacity-70 leading-relaxed">
            {current.body}
          </p>
        </div>

        {/* Button */}
        <button
          onClick={handleNext}
          className="w-full py-3 rounded-xl text-sm font-medium text-white cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg, #5649d4 0%, #6d5cf6 45%, #8b5cf6 78%, #f472b6 100%)" }}
        >
          {isLast ? "Kom igång" : "Nästa"}
        </button>

        {/* Skip */}
        {!isLast && (
          <button
            onClick={() => { markOnboardingDone(); onDone() }}
            className="text-xs text-muted-foreground opacity-50 hover:opacity-80 transition-opacity cursor-pointer"
          >
            Hoppa över
          </button>
        )}
      </div>
    </div>
  )
}
