import {
  CalendarBlank,
  ChartBar,
  Gear,
  House,
  Moon,
  Sun,
  User,
} from "@phosphor-icons/react"

type Theme = "light" | "dark"

export type SidebarPage =
  | "start"
  | "calendar"
  | "statistics"
  | "profile"
  | "settings"

type SidebarProps = {
  theme: Theme
  onToggleTheme: () => void
  activePage?: SidebarPage
  onNavigate?: (page: SidebarPage) => void
}

const menuItems = [
  {
    id: "start" as SidebarPage,
    label: "Start",
    icon: House,
  },
  {
    id: "calendar" as SidebarPage,
    label: "Kalender",
    icon: CalendarBlank,
  },
  {
    id: "statistics" as SidebarPage,
    label: "Statistik",
    icon: ChartBar,
  },
  {
    id: "profile" as SidebarPage,
    label: "Profil",
    icon: User,
  },
]

export default function Sidebar({
  theme,
  onToggleTheme,
  activePage = "calendar",
  onNavigate,
}: SidebarProps) {
  return (
    <aside className="flex min-h-screen w-[240px] min-w-[240px] flex-col border-r bg-sidebar">
      {/* LOGO */}

      <div className="flex h-[58px] items-center gap-2 border-b px-4">
        <div
          className="h-[26px] w-[26px] rounded-full p-[3px]"
          style={{
            background:
              "linear-gradient(135deg, #6d5cf6, #a89bfa, #f472b6)",
          }}
        >
          <div className="h-full w-full rounded-full bg-sidebar" />
        </div>

        <span className="text-sm font-semibold text-primary">
          KeepIt
        </span>
      </div>

      {/* NAVIGATION */}

      <div className="flex-1 px-2 py-2">
        <p className="px-2 pb-1 pt-2 text-[10px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
          Navigering
        </p>

        <nav className="space-y-[2px]">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive =
              activePage === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onNavigate?.(item.id)
                }
                className={[
                  "flex w-full cursor-pointer items-center gap-[10px]",
                  "px-[10px] py-[7px] text-left text-xs transition",
                  isActive
                    ? "border-l-2 border-primary bg-primary/5 pl-[8px] font-medium text-primary"
                    : "rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                ].join(" ")}
              >
                <Icon
                  size={15}
                  weight={
                    isActive
                      ? "fill"
                      : "regular"
                  }
                />

                <span>{item.label}</span>
              </button>
            )
          })}

          <div className="my-[6px] border-t" />

          <button
            type="button"
            onClick={() =>
              onNavigate?.("settings")
            }
            className={[
              "flex w-full cursor-pointer items-center gap-[10px]",
              "px-[10px] py-[7px] text-left text-xs transition",
              activePage === "settings"
                ? "border-l-2 border-primary bg-primary/5 pl-[8px] font-medium text-primary"
                : "rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
            ].join(" ")}
          >
            <Gear
              size={15}
              weight={
                activePage === "settings"
                  ? "fill"
                  : "regular"
              }
            />

            <span>Inställningar</span>
          </button>
        </nav>
      </div>

      {/* USER */}

      <div className="flex items-center gap-[10px] border-t px-4 py-3">
        <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
          ML
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium">
            Maja L.
          </p>

          <p className="truncate text-[9px] text-muted-foreground">
            maja@example.com
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-md border bg-muted text-muted-foreground transition hover:bg-sidebar-accent hover:text-foreground"
          aria-label={
            theme === "dark"
              ? "Byt till ljust läge"
              : "Byt till mörkt läge"
          }
          title={
            theme === "dark"
              ? "Ljust läge"
              : "Mörkt läge"
          }
        >
          {theme === "dark" ? (
            <Moon size={14} />
          ) : (
            <Sun size={14} />
          )}
        </button>
      </div>
    </aside>
  )
}