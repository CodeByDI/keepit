// src/pages/login/login-page.tsx
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
    return (
        <div
            className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 overflow-hidden"
            style={{
                background: `radial-gradient(ellipse 117% 57% at 92% 8%, rgba(109, 92, 246, 0.96) 0%, rgba(86, 73, 212, 0.92) 14%, rgba(86, 73, 212, 0.55) 32%, rgba(72, 57, 194, 0.16) 50%, rgba(72, 57, 194, 0.04) 64%, transparent 76%), var(--background)`,
            }}
        >
            {/* ── Corner Details ── */}

            {/* Top Left */}
            <div className="absolute top-6 left-6 text-xs tracking-wider font-light" style={{ color: "#334155" }}>
                <div className="text-base mb-1" style={{ color: "#2b2d33" }}>+</div>
                KEEPIT
            </div>

            {/* Top Right */}
            <div className="absolute top-6 right-6 text-xs tracking-wider font-light text-right" style={{ color: "#a9a1f0" }}>
                <div className="text-base mb-1 text-right" style={{ color: "#a9a1f0" }}>+</div>
                V 1.0
            </div>

            {/* Bottom Right */}
            <div className="absolute bottom-6 right-6 text-[10px] tracking-wider font-light text-right" style={{ color: "#334155" }}>
                CONSISTENCY IS KEY
                <div className="text-base mt-1 text-right" style={{ color: "#2b2d33" }}>+</div>
            </div>

            {/* ── Login Form ── */}
            <div className="flex w-[400px] h-[555px] flex-col gap-6 relative z-10">
                <LoginForm />
            </div>
        </div>
    )
}