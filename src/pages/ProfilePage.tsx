// src/pages/ProfilePage.tsx
import { useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  UserIcon,
  BellIcon,
  GearIcon,
  SignOutIcon,
  PencilSimpleIcon,
  CaretRightIcon,
} from "@phosphor-icons/react"
import { useNavigate } from "react-router-dom"
import { EditProfileDialog } from "@/components/edit-profile-dialog"

// ─── Default user data ─────────────────────────────────────────────────────
const defaultUser = {
  name: "Maja Lindström",
  email: "maja@example.se",
  memberSince: "aug 2026",
  streak: 12,
  habits: 5,
  avatar: "ML",
  password: "MajaÄrBäst123",
}

// ─── Profile Page ─────────────────────────────────────────────────────────
export function ProfilePage() {
  const navigate = useNavigate()
  const [isLogoutHovered, setIsLogoutHovered] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // ─── User state (from localStorage) ──
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        return {
          ...defaultUser,
          name: parsed.name || defaultUser.name,
          email: parsed.email || defaultUser.email,
          password: parsed.password || defaultUser.password,
          memberSince: parsed.memberSince || defaultUser.memberSince,
        }
      } catch {
        return defaultUser
      }
    }
    return defaultUser
  })

  // ─── Update user in localStorage ──
  const handleSaveProfile = (data: { name: string; email: string; password?: string }) => {
    const updatedUser = {
      ...user,
      name: data.name,
      email: data.email,
    }

    if (data.password) {
      updatedUser.password = data.password
    }

    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)

    // ─── 🔥 Notify NavUser about the update ──
    window.dispatchEvent(new Event("userUpdated"))

    // ─── Keep login session active ──
    localStorage.setItem("isLoggedIn", "true")
  }

  // ─── Logout: Keep user data, only remove session ──
  const handleLogout = () => {
    console.log("🚪 Logging out...")
    // ✅ Keep user data, just remove login session
    localStorage.removeItem("isLoggedIn")
    navigate("/login")
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
              <BreadcrumbPage>Profil</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      {/* ── Main Content ── */}
      <div className="flex flex-col gap-6 p-6 max-w-4xl w-full">

        {/* ── Page Header ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--primary)" }}>
              Profil
            </h1>
            <p className="text-sm text-muted-foreground opacity-60">
              Aktiv sedan {user.memberSince}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <PencilSimpleIcon size={14} className="mr-1" />
            Redigera
          </Button>
        </div>

        {/* ── Profile Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-[230px_1fr] gap-6">

          {/* ── Left Column: User Card ── */}
          <div
            className="flex flex-col items-center p-6 rounded-xl border relative overflow-hidden"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            {/* Top glow */}
            <div
              className="absolute top-0 left-0 right-0 h-20 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(109,92,246,0.12) 0%, transparent 100%)",
              }}
            />

            {/* Avatar */}
            <div className="relative z-10 mb-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold tracking-tight"
                style={{
                  background: `linear-gradient(var(--card), var(--card)) padding-box,
                              linear-gradient(135deg, var(--primary), var(--chart-2), var(--chart-5)) border-box`,
                  border: "2.5px solid transparent",
                  color: "var(--primary)",
                }}
              >
                {user.avatar || user.name.split(" ").map((n: string) => n[0]).join("")}
              </div>
            </div>

            <div className="text-center relative z-10">
              <div className="font-semibold text-foreground">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
              <div className="text-xs text-muted-foreground/60 mt-1">Aktiv sedan {user.memberSince}</div>
            </div>

            <Separator className="my-4" />

            {/* Mini stats */}
            <div className="grid grid-cols-2 gap-2 w-full relative z-10">
              <div
                className="text-center p-2 rounded-md"
                style={{
                  background: "var(--muted)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="text-lg font-bold text-foreground">{user.streak}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Streak</div>
              </div>
              <div
                className="text-center p-2 rounded-md"
                style={{
                  background: "var(--muted)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="text-lg font-bold text-foreground">{user.habits}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Vanor</div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Active habits list */}
            <div className="w-full relative z-10">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-2">
                Aktiva vanor
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full" style={{ background: "var(--chart-1)" }} />
                  Morgonlöpning
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full" style={{ background: "var(--chart-2)" }} />
                  Träna 30 min
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full" style={{ background: "var(--chart-3)" }} />
                  Drick 2L vatten
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full" style={{ background: "var(--chart-4)" }} />
                  Läs 20 sidor
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full" style={{ background: "var(--chart-5)" }} />
                  Koda
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: Stats & Settings ── */}
          <div className="flex flex-col gap-6">

            {/* ── Overview Stats ── */}
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground/60 mb-3">
                Översikt
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="p-4 rounded-xl border"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground/60">
                    Längsta streak
                  </div>
                  <div className="text-2xl font-bold mt-1" style={{ color: "var(--primary)" }}>
                    28
                  </div>
                  <div className="text-xs text-muted-foreground/60 mt-1">Ditt rekord</div>
                </div>
                <div
                  className="p-4 rounded-xl border"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground/60">
                    Totalt loggat
                  </div>
                  <div className="text-2xl font-bold text-foreground mt-1">142</div>
                  <div className="text-xs text-muted-foreground/60 mt-1">Registreringar</div>
                </div>
                <div
                  className="p-4 rounded-xl border col-span-2"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground/60">
                      Veckosnitt
                    </div>
                    <div className="text-sm font-bold text-foreground">78%</div>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: "78%",
                        background: `linear-gradient(90deg, var(--primary), var(--chart-5))`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground/60 mt-2">Senaste 7 dagarna</div>
                </div>
              </div>
            </div>

            {/* ── Settings List ── */}
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground/60 mb-3">
                Inställningar
              </div>
              <div
                className="rounded-xl border overflow-hidden"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                }}
              >
                {[
                  { icon: UserIcon, label: "Konto" },
                  { icon: BellIcon, label: "Påminnelser" },
                  { icon: GearIcon, label: "Utseende" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    style={{
                      borderBottom: index < 2 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={16} className="text-muted-foreground/60" />
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                    </div>
                    <CaretRightIcon size={14} className="text-muted-foreground/40" />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Logout Button ── */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 w-full cursor-pointer"
              style={{
                background: isLogoutHovered ? "rgba(239, 68, 68, 0.08)" : "var(--card)",
                borderColor: isLogoutHovered ? "rgba(239, 68, 68, 0.15)" : "var(--border)",
                color: "var(--red)",
              }}
              onMouseEnter={() => setIsLogoutHovered(true)}
              onMouseLeave={() => setIsLogoutHovered(false)}
            >
              <SignOutIcon size={16} className="opacity-60" />
              <span className="text-sm font-medium">Logga ut</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Edit Profile Dialog ── */}
      <EditProfileDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSaveProfile}
        currentName={user.name}
        currentEmail={user.email}
      />
    </>
  )
}