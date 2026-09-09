// src/components/edit-profile-dialog.tsx
import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PencilSimpleIcon, EyeIcon, EyeClosedIcon } from "@phosphor-icons/react"

type EditProfileDialogProps = {
    open: boolean
    onClose: () => void
    onSave: (data: { name: string; email: string; password?: string }) => void
    currentName: string
    currentEmail: string
}

export function EditProfileDialog({
    open,
    onClose,
    onSave,
    currentName,
    currentEmail,
}: EditProfileDialogProps) {
    // ─── State ──────────────────────────────────────
    const [name, setName] = useState(currentName)
    const [email, setEmail] = useState(currentEmail)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [showPasswordFields, setShowPasswordFields] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // ─── Reset form when dialog opens ──────────────
    useEffect(() => {
        if (open) {
            setName(currentName)
            setEmail(currentEmail)
            setPassword("")
            setConfirmPassword("")
            setShowPasswordFields(false)
            setError(null)
            setSuccess(null)
        }
    }, [open, currentName, currentEmail])

    // ─── Handlers ────────────────────────────────────
    function handleSave() {
        setError(null)
        setSuccess(null)

        // Validate name
        if (!name.trim()) {
            setError("Namn får inte vara tomt")
            return
        }

        // Validate email
        if (!email.trim() || !email.includes("@")) {
            setError("Ange en giltig e-postadress")
            return
        }

        // If password fields are shown, validate them
        if (showPasswordFields) {
            if (!password.trim() || !confirmPassword.trim()) {
                setError("Vänligen fyll i båda lösenordsfälten")
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
        }

        // Prepare data to save
        const updateData: { name: string; email: string; password?: string } = {
            name: name.trim(),
            email: email.trim(),
        }

        if (showPasswordFields && password) {
            updateData.password = password
        }

        // Save and close
        onSave(updateData)
        setSuccess("Profilen har uppdaterats!")

        // Close after a short delay
        setTimeout(() => {
            onClose()
        }, 800)
    }

    function handleCancel() {
        setName(currentName)
        setEmail(currentEmail)
        setPassword("")
        setConfirmPassword("")
        setShowPasswordFields(false)
        setError(null)
        setSuccess(null)
        onClose()
    }

    // ─── Styles ──────────────────────────────────────
    const labelClass = "text-xs font-normal uppercase tracking-widest text-muted-foreground opacity-60"
    const fieldClass =
        "w-full h-10 rounded-md border border-input bg-muted/40 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"

    // ─── Render ──────────────────────────────────────
    return (
        <Dialog open={open} onOpenChange={(v) => !v && handleCancel()}>
            <DialogContent
                className="sm:max-w-md border-0 p-6"
                style={{
                    background: `radial-gradient(ellipse 80% 60% at 100% 0%, rgba(109, 92, 246, 0.14) 0%, rgba(86, 73, 212, 0.06) 40%, transparent 65%), var(--card)`,
                    border: "1px solid rgba(109, 92, 246, 0.35)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                }}
            >
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold tracking-tight" style={{ color: "var(--primary)" }}>
                        Redigera profil
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground flex items-center gap-1">
                        <PencilSimpleIcon size={14} className="text-primary" />
                        Uppdatera dina uppgifter
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 mt-3">
                    {/* ── Name ── */}
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

                    {/* ── Change Password Toggle ── */}
                    <button
                        type="button"
                        onClick={() => setShowPasswordFields(!showPasswordFields)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left underline-offset-2 hover:underline"
                    >
                        {showPasswordFields ? "← Dölj lösenordsfält" : "Ändra lösenord"}
                    </button>

                    {/* ── Password Fields (conditional) ── */}
                    {showPasswordFields && (
                        <>
                            {/* New Password */}
                            <div className="flex flex-col gap-2">
                                <label className={labelClass}>
                                    Nytt lösenord <span className="text-primary">*</span>
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

                            {/* Confirm New Password */}
                            <div className="flex flex-col gap-2">
                                <label className={labelClass}>
                                    Bekräfta nytt lösenord <span className="text-primary">*</span>
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
                        </>
                    )}

                    {/* ── Error / Success Message ── */}
                    {error && (
                        <div className="text-sm text-center p-2 rounded-md" style={{
                            color: "var(--red)",
                            background: "var(--red-bg)"
                        }}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="text-sm text-center p-2 rounded-md" style={{
                            color: "var(--green)",
                            background: "rgba(34,197,94,0.1)",
                        }}>
                            {success}
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
                            disabled={!name.trim() || !email.trim() || email.includes("@") === false}
                            onClick={handleSave}
                            style={{
                                background: "linear-gradient(135deg, #5649d4 0%, #6d5cf6 45%, #8b5cf6 78%, #f472b6 100%)",
                                color: "white",
                                border: "none",
                            }}
                        >
                            Spara ändringar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}