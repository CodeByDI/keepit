// src/components/app-sidebar.tsx
import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { useTheme } from "@/components/theme-provider"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  HouseIcon,
  CalendarBlankIcon,
  ChartBarIcon,
  UserIcon,
  MoonIcon,
  SunIcon,
  GearIcon,
} from "@phosphor-icons/react"

// ─── Data ─────────────────────────────────────────────────────────────────────

const data = {
  user: {
    name: "Maja L.",
    email: "maja@example.com",
    avatar: "/avatars/maja.jpg",
  },
  navMain: [
    { title: "Start", url: "/", icon: <HouseIcon size={16} />, isActive: true },
    { title: "Kalender", url: "/kalender", icon: <CalendarBlankIcon size={16} /> },
    { title: "Statistik", url: "/statistik", icon: <ChartBarIcon size={16} /> },
    { title: "Profil", url: "/profil", icon: <UserIcon size={16} /> },
  ],
  navSecondary: [
    { title: "Inställningar", url: "/settings", icon: <GearIcon size={16} /> },
  ],
}

// ─── Logo ─────────────────────────────────────────────────────────────────────

function KeepItLogo() {
  return (
    <svg style={{ width: 32, height: 32 }} width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
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

// ─── AppSidebar ───────────────────────────────────────────────────────────────

type AppSidebarProps = React.ComponentProps<typeof Sidebar>

function NavItems({ items }: { items: typeof data.navMain }) {
  const { state } = useSidebar()
  const location = useLocation()
  const collapsed = state === "collapsed"

  return (
    <SidebarMenu>
      {items.map((item) => {
        const isActive = location.pathname === item.url

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              render={<Link to={item.url} />}
              tooltip={item.title}
              className={isActive ? "rounded-none font-medium" : "text-muted-foreground"}
              style={
                isActive
                  ? collapsed
                    ? { color: "var(--primary)", backgroundColor: "color-mix(in oklch, var(--primary) 12%, transparent)", borderRadius: "8px" }
                    : { borderLeft: "2px solid var(--primary)", paddingLeft: "10px", color: "var(--primary)" }
                  : undefined
              }
            >
              {item.icon}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}

export function AppSidebar(props: AppSidebarProps) {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      {/* ── Brand header ── */}
      <SidebarHeader className="pb-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="h-14 py-1"
              render={<Link to="/" />}
            >
              <KeepItLogo />
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold" style={{ color: "var(--primary)" }}>
                  KeepIt
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Navigation ── */}
      <SidebarContent>
        <SidebarGroup className="pt-4">
          <SidebarGroupLabel className="h-5 mb-2 uppercase tracking-wider">
            Navigering
          </SidebarGroupLabel>
          <NavItems items={data.navMain} />
        </SidebarGroup>

        {/* ── Separator ── */}
        <SidebarSeparator className="my-2" />

        {/* ── Secondary Navigation (Settings) ── */}
        <SidebarGroup>
          <NavItems items={data.navSecondary} />
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer ── */}
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleTheme}
              tooltip={isDark ? "Ljust läge" : "Mörkt läge"}
              className="text-muted-foreground"
            >
              {isDark ? <SunIcon size={16} /> : <MoonIcon size={16} />}
              <span>{isDark ? "Ljust läge" : "Mörkt läge"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}