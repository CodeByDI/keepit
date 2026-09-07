// src/components/create-account.tsx
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
import { FireIcon, EyeIcon, EyeClosedIcon } from "@phosphor-icons/react"

type CreateAccountProps = {
  open: boolean
  onClose: () => void
}

export function CreateAccount({ open, onClose }: CreateAccountProps) {
  // ─── State ──────────────────────────────────────
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ─── Handlers ────────────────────────────────────
  function handleSave() {
    setError(null)

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Vänligen fyll i alla fält")
      return
    }

    if (password !== confirmPassword) {
      setError("Lösenorden matchar inte")
      return
    }

    if (password.length < 6) {
      setError("Lösenordet måste vara minst 6 tecken")
      return
    }

    console.log("Creating account:", { name, email, password })
    onClose()
  }

  function handleCancel() {
    setName("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setError(null)
    onClose()
  }

  // ─── Styles (matching NewHabitDialog) ──────────
  const labelClass = "text-xs font-normal uppercase tracking-widest text-muted-foreground opacity-60"
  const fieldClass =
    "w-full h-10 rounded-md border border-input bg-muted/40 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"

  // ─── Render ──────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleCancel()}>
      <DialogContent className="sm:max-w-md border-0 p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight" style={{ color: "var(--primary)" }}>
            Skapa konto
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground flex items-center gap-1">
            Kom igång med dina dagliga vanor! <FireIcon size={14} className="text-primary" />
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-3">
          {/* ── Full Name ── */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>
              Fullständigt namn <span className="text-primary">*</span>
            </label>
            <Input
              placeholder="T.ex. Maja Lindström"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className={fieldClass}
            />
          </div>

          {/* ── Email ── */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>
              E-post <span className="text-primary">*</span>
            </label>
            <Input
              type="email"
              placeholder="maja@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
            />
          </div>

          {/* ── Password ── */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>
              Lösenord <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${fieldClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeClosedIcon size={18} />
                ) : (
                  <EyeIcon size={18} />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground opacity-60">
              Minst 6 tecken
            </p>
          </div>

          {/* ── Confirm Password ── */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>
              Bekräfta lösenord <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${fieldClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeClosedIcon size={18} />
                ) : (
                  <EyeIcon size={18} />
                )}
              </button>
            </div>
          </div>

          {/* ── Error Message ── */}
          {error && (
            <div className="text-sm text-center p-2 rounded-md" style={{
              color: "var(--red)",
              background: "var(--red-bg)"
            }}>
              {error}
            </div>
          )}

          {/* ── Actions ── */}
          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="flex-1 text-muted-foreground opacity-60 hover:opacity-100 cursor-pointer"
              onClick={handleCancel}
            >
              Avbryt
            </Button>
            <Button
              className="flex-1 h-11 cursor-pointer transition-opacity"
              disabled={
                !name.trim() ||
                !email.trim() ||
                !password.trim() ||
                !confirmPassword.trim() ||
                password !== confirmPassword ||
                password.length < 6
              }
              onClick={handleSave}
              style={{
                background: "linear-gradient(135deg, #5649d4 0%, #6d5cf6 45%, #8b5cf6 78%, #f472b6 100%)",
                color: "white",
                border: "none",
              }}
            >
              Skapa konto
            </Button>
          </div>

          {/* ── Login Link ── */}
          <div className="text-center text-sm text-muted-foreground">
            Har du redan ett konto?{" "}
            <button
              type="button"
              onClick={handleCancel}
              className="underline underline-offset-2 cursor-pointer hover:opacity-100 transition-opacity"
              style={{ color: "var(--primary)" }}
            >
              Logga in
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}