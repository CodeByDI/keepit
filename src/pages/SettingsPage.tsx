// src/pages/SettingsPage.tsx
import { useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
    UserIcon,
    BellIcon,
    MoonIcon,
    SunIcon,
    CaretRightIcon,
    GlobeIcon,
    LockIcon,
    ShieldIcon,
} from "@phosphor-icons/react"
import { useTheme } from "@/components/theme-provider"

// ─── Settings Page ─────────────────────────────────────────────────────────
export function SettingsPage() {
    const { theme, setTheme } = useTheme()
    const isDark = theme === "dark"

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark")
    }

    return (
        <>
            {/* ── Header ── */}
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage>Inställningar</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            {/* ── Main Content ── */}
            <div className="flex flex-col gap-6 p-6 max-w-4xl w-full">

                {/* ── Page Header ── */}
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--primary)" }}>
                        Inställningar
                    </h1>
                    <p className="text-sm text-muted-foreground opacity-60">
                        Hantera dina inställningar och preferenser
                    </p>
                </div>

                {/* ── Settings List ── */}
                <div
                    className="rounded-xl border overflow-hidden"
                    style={{
                        background: "var(--card)",
                        borderColor: "var(--border)",
                    }}
                >
                    {/* ── Appearance ── */}
                    <div
                        className="flex items-center justify-between px-4 py-4"
                        style={{
                            borderBottom: "1px solid var(--border)",
                        }}
                    >
                        <div className="flex items-center gap-3">
                            {isDark ? (
                                <MoonIcon size={20} className="text-muted-foreground/60" />
                            ) : (
                                <SunIcon size={20} className="text-muted-foreground/60" />
                            )}
                            <div>
                                <div className="text-sm font-medium text-foreground">Utseende</div>
                                <div className="text-xs text-muted-foreground/60">
                                    {isDark ? "Mörkt läge" : "Ljust läge"}
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleTheme}
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            {isDark ? (
                                <>
                                    <SunIcon size={14} className="mr-1" /> Ljust
                                </>
                            ) : (
                                <>
                                    <MoonIcon size={14} className="mr-1" /> Mörkt
                                </>
                            )}
                        </Button>
                    </div>

                    {/* ── Account ── */}
                    <div
                        className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-muted/50 transition-colors"
                        style={{
                            borderBottom: "1px solid var(--border)",
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <UserIcon size={20} className="text-muted-foreground/60" />
                            <div>
                                <div className="text-sm font-medium text-foreground">Konto</div>
                                <div className="text-xs text-muted-foreground/60">
                                    Hantera din profil och e-post
                                </div>
                            </div>
                        </div>
                        <CaretRightIcon size={16} className="text-muted-foreground/40" />
                    </div>

                    {/* ── Notifications ── */}
                    <div
                        className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-muted/50 transition-colors"
                        style={{
                            borderBottom: "1px solid var(--border)",
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <BellIcon size={20} className="text-muted-foreground/60" />
                            <div>
                                <div className="text-sm font-medium text-foreground">Påminnelser</div>
                                <div className="text-xs text-muted-foreground/60">
                                    Hantera dina notiser och påminnelser
                                </div>
                            </div>
                        </div>
                        <CaretRightIcon size={16} className="text-muted-foreground/40" />
                    </div>

                    {/* ── Language ── */}
                    <div
                        className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-muted/50 transition-colors"
                        style={{
                            borderBottom: "1px solid var(--border)",
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <GlobeIcon size={20} className="text-muted-foreground/60" />
                            <div>
                                <div className="text-sm font-medium text-foreground">Språk</div>
                                <div className="text-xs text-muted-foreground/60">
                                    Välj ditt föredragna språk
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Svenska</span>
                            <CaretRightIcon size={16} className="text-muted-foreground/40" />
                        </div>
                    </div>

                    {/* ── Privacy ── */}
                    <div
                        className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <ShieldIcon size={20} className="text-muted-foreground/60" />
                            <div>
                                <div className="text-sm font-medium text-foreground">Integritet</div>
                                <div className="text-xs text-muted-foreground/60">
                                    Hantera din data och integritet
                                </div>
                            </div>
                        </div>
                        <CaretRightIcon size={16} className="text-muted-foreground/40" />
                    </div>
                </div>
            </div>
        </>
    )
}