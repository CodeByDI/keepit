import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CaretDownIcon, FireIcon } from "@phosphor-icons/react"

type NewHabitDialogProps = {
  open: boolean
  onClose: () => void
  onSave?: (title: string, reminder: string) => void
}

export function NewHabitDialog({ open, onClose, onSave }: NewHabitDialogProps) {
  const [title, setTitle] = useState("")
  const [frequency, setFrequency] = useState("Dagligen")
  const [time, setTime] = useState("07:00")
  const [reminder, setReminder] = useState("På")

  function handleSave() {
    if (!title.trim()) return
    const reminderText = reminder === "På" ? `${frequency} · ${time}` : "Ingen påminnelse"
    onSave?.(title.trim(), reminderText)
    handleCancel()
  }

  function handleCancel() {
    setTitle("")
    setFrequency("Dagligen")
    setTime("07:00")
    setReminder("På")
    onClose()
  }

  const labelClass = "text-xs font-normal uppercase tracking-widest text-muted-foreground opacity-60"
  const fieldClass =
    "w-full h-10 rounded-md border border-input bg-muted/40 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
  const selectFieldClass = `${fieldClass} appearance-none pr-8`

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleCancel()}>
      <DialogContent className="sm:max-w-md border-0 p-6">
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
              <div className="relative">
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className={selectFieldClass}
                >
                  <option>Dagligen</option>
                  <option>Varje vecka</option>
                  <option>Vardagar</option>
                  <option>Helger</option>
                </select>
                <CaretDownIcon size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Tid på dagen</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`${fieldClass} dark:[color-scheme:dark]`}
              />
            </div>
          </div>

          {/* Reminder */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>Påminnelse</label>
            <div className="relative">
              <select
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                className={selectFieldClass}
              >
                <option>På</option>
                <option>Av</option>
              </select>
              <CaretDownIcon size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
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
