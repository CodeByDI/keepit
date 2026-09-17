import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FireIcon } from "@phosphor-icons/react"

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))
const MINUTES = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"]

type NewHabitDialogProps = {
  open: boolean
  onClose: () => void
  onSave?: (title: string, reminder: string) => void
}

export function NewHabitDialog({ open, onClose, onSave }: NewHabitDialogProps) {
  const [title, setTitle] = useState("")
  const [frequency, setFrequency] = useState("Dagligen")
  const [hour, setHour] = useState("07")
  const [minute, setMinute] = useState("00")
  const [reminder, setReminder] = useState("På")

  function handleSave() {
    if (!title.trim()) return
    const reminderText = reminder === "På" ? `${frequency} · ${hour}:${minute}` : "Ingen påminnelse"
    onSave?.(title.trim(), reminderText)
    handleCancel()
  }

  function handleCancel() {
    setTitle("")
    setFrequency("Dagligen")
    setHour("07")
    setMinute("00")
    setReminder("På")
    onClose()
  }

  const labelClass = "text-xs font-normal uppercase tracking-widest text-muted-foreground opacity-60"
  const fieldClass =
    "w-full h-10 rounded-md border border-input bg-muted/40 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleCancel()}>
      <DialogContent className="sm:max-w-sm border-0 p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight" style={{ color: "var(--primary)" }}>Ny vana</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground flex items-center gap-1">
            Vad lovar du dig själv att göra, varje dag? <FireIcon size={14} className="text-primary" />
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-3">
          {/* Habit name */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>
              Vana <span className="text-primary">*</span>
            </label>
            <Input
              placeholder="T.ex. Läs tjugo minuter"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              className={fieldClass}
            />
            <p className="text-xs text-muted-foreground opacity-60">
              Håll det konkret. Vaga löften håller inte.
            </p>
          </div>

          {/* Frequency + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Frekvens</label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger className="h-10 bg-muted/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dagligen">Dagligen</SelectItem>
                  <SelectItem value="Varje vecka">Varje vecka</SelectItem>
                  <SelectItem value="Vardagar">Vardagar</SelectItem>
                  <SelectItem value="Helger">Helger</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className={`${labelClass} whitespace-nowrap`}>Tid på dagen</label>
              <div className="flex items-center gap-1.5">
                <Select value={hour} onValueChange={setHour}>
                  <SelectTrigger className="h-10 bg-muted/40 flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-48" alignItemWithTrigger={false}>
                    {HOURS.map((h) => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">:</span>
                <Select value={minute} onValueChange={setMinute}>
                  <SelectTrigger className="h-10 bg-muted/40 flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-48" alignItemWithTrigger={false}>
                    {MINUTES.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Reminder */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>Påminnelse</label>
            <Select value={reminder} onValueChange={setReminder}>
              <SelectTrigger className="h-10 w-full bg-muted/40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="På">På</SelectItem>
                <SelectItem value="Av">Av</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1 text-muted-foreground opacity-60 hover:opacity-100 cursor-pointer" onClick={handleCancel}>
              Avbryt
            </Button>
            <Button
              className="flex-1 h-11 cursor-pointer hover:opacity-80 transition-opacity"
              disabled={!title.trim()}
              onClick={handleSave}
              style={{
                background: "linear-gradient(135deg, #5649d4 0%, #6d5cf6 45%, #8b5cf6 78%, #f472b6 100%)",
                color: "white",
                border: "none",
              }}
            >
              Spara vana
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
