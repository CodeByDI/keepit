// src/components/login-form.tsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


// ─── Logo ─────────────────────────────────────────────────────────────────────
function KeepItLogo() {
    return (
        <svg style={{ width: 45, height: 45 }} width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="keepit-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--primary)" />
                    <stop offset="35%" stopColor="var(--primary)" />
                    <stop offset="70%" stopColor="#a89bfa" />
                    <stop offset="100%" stopColor="#f472b6" />
                </linearGradient>
            </defs>
            <circle cx="16" cy="16" r="12" fill="none"
                stroke="url(#keepit-logo-gradient)" strokeWidth="3" />
        </svg>
    )
}

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    // ─── State ──────────────────────────────────────
    const [email, setEmail] = useState("maja@keepit.nu")
    const [password, setPassword] = useState("MajaÄrBäst123")
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const [isHovered, setIsHovered] = useState(false)

    // ─── Handlers ────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        if (!email || !password) {
            setError("Vänligen fyll i alla fält")
            setIsLoading(false)
            return
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            if (email.includes("@") && password.length >= 1) {
                localStorage.setItem("user", JSON.stringify({ email }))
                navigate("/")
            } else {
                setError("Ogiltig e-post eller lösenord")
            }
        } catch (err) {
            setError("Något gick fel. Försök igen.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSocialLogin = (provider: "apple" | "google") => {
        localStorage.setItem("user", JSON.stringify({ email: `${provider}@example.com` }))
        navigate("/")
    }

    // ─── Render ──────────────────────────────────────
    return (
        <div
            className={cn(
                "flex flex-col gap-6 w-full h-full p-8 rounded-xl border",
                className
            )}
            style={{
                background: "#0c0e1d",
                borderColor: "var(--border)",
                borderTopColor: "rgba(109,92,246,0.35)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
            {...props}
        >
            {/* ── Wordmark / Logo ── */}
            <div className="flex items-center justify-center gap-3">
                <KeepItLogo />
                <span className="text-2xl font-bold tracking-tight" style={{ color: "var(--primary)" }}>
                    KeepIt
                </span>
            </div>

            {/* ── Subtitle ── */}
            <p className="text-center text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                Starta en ny vana. Gör den. Repeat.
            </p>

            {/* ── Google Button ── */}
            <Button
                variant="outline"
                type="button"
                // onClick={() => handleSocialLogin("google")}
                disabled={isLoading}
                className="w-full h-10 justify-center text-sm font-medium"
                style={{
                    background: "#0c0e1d",
                    borderColor: "var(--text-dim)",
                    color: "var(--foreground)",
                }}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-2 flex-shrink-0">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Fortsätt med Google
            </Button>

            {/* ── Divider ── */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                <span className="text-xs uppercase tracking-wider" style={{ color: "#334155" }}>
                    eller med e-post
                </span>
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                {/* Email */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-wider block" style={{ color: "#334155" }}>
                        E-post
                    </label>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="maja@example.com"
                        disabled={isLoading}
                        required
                        className="h-10 w-full text-sm"
                        style={{
                            background: "#121429",
                        }}
                    />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-medium uppercase tracking-wider block" style={{ color: "#334155" }}>
                            Lösenord
                        </label>
                        <a href="#" className="text-sm underline-offset-4 hover:underline" style={{ color: "#334155" }}>
                            Glömt lösenord?
                        </a>
                    </div>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={isLoading}
                        required
                        className="h-10 w-full text-sm"
                        style={{
                            background: "#121429",
                        }}
                    />
                </div>

                {/* Error */}
                {error && (
                    <div className="text-sm text-center p-2 rounded-md" style={{
                        color: "var(--red)",
                        background: "var(--red-bg)"
                    }}>
                        {error}
                    </div>
                )}

                {/* Login Button */}
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 justify-center text-sm font-medium text-white border-none transition-all duration-300 mt-2"
                    style={{
                        // Use rgba() for the background to keep text solid
                        background: isHovered
                            ? `rgba(86, 73, 212, 0.7) linear-gradient(135deg, #5649d4 0%, #6d5cf6 45%, #8b5cf6 78%, #f472b6 100%)`
                            : `linear-gradient(135deg, #5649d4 0%, #6d5cf6 45%, #8b5cf6 78%, #f472b6 100%)`,
                        boxShadow: isHovered
                            ? "0 0 20px rgba(109,92,246,0.30), 0 0 30px rgba(244,114,182,0.25)"
                            : "0 0 10px rgba(109,92,246,0.20), 0 0 20px rgba(244,114,182,0.12)",
                        // Text stays solid white
                        color: "white",
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {isLoading ? "Loggar in..." : "Logga in"}
                </Button>
            </form>

            {/* ── Footer ── */}
            <div className="text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                Inget konto?{" "}
                <a href="#" className="underline underline-offset-2" style={{ color: "var(--primary)" }}>
                    Skapa ett
                </a>
            </div>
        </div>
    )
}