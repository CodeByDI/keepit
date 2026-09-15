// src/components/nav-user.tsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { UserIcon, GearIcon, SignOutIcon, CaretUpDownIcon } from "@phosphor-icons/react"

// ─── Default user ─────────────────────────────────────────────────────
const defaultUser = {
  name: "Maja L.",
  email: "maja@example.com",
  avatar: "/avatars/maja.jpg",
}

// ─── Custom event name ──────────────────────────────
const USER_UPDATED_EVENT = "userUpdated"

export function NavUser() {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()

  // ─── State ──────────────────────────────────────────
  const [user, setUser] = useState(defaultUser)

  // ─── Load user from localStorage ────────────────────
  const loadUser = () => {
    const stored = localStorage.getItem("user")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUser({
          name: parsed.name || defaultUser.name,
          email: parsed.email || defaultUser.email,
          avatar: defaultUser.avatar,
        })
      } catch {
        setUser(defaultUser)
      }
    } else {
      setUser(defaultUser)
    }
  }

  // ─── Listen for changes ─────────────────────────────
  useEffect(() => {
    loadUser()

    // Listen for storage changes (other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        loadUser()
      }
    }

    // Listen for custom event (same tab)
    const handleCustomEvent = () => {
      loadUser()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener(USER_UPDATED_EVENT, handleCustomEvent)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener(USER_UPDATED_EVENT, handleCustomEvent)
    }
  }, [])

  // ─── Handlers ──────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    navigate("/login")
  }

  const handleProfile = () => {
    navigate("/profil")
  }

  const handleSettings = () => {
    navigate("/settings")
  }

  // ─── Get initials ──────────────────────────────────
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // ─── Render ──────────────────────────────────────
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>

          <DropdownMenuTrigger
            render={<SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />}
          >
            <Avatar className="size-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary text-[10px] text-primary-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">{user.email}</span>
            </div>
            <CaretUpDownIcon size={16} className="ml-auto" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-52 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5">
                  <Avatar className="size-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary text-[10px] text-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleProfile}>
                <UserIcon size={16} className="mr-2" /> Profil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettings}>
                <GearIcon size={16} className="mr-2" /> Inställningar
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              <SignOutIcon size={16} className="mr-2" /> Logga ut
            </DropdownMenuItem>

          </DropdownMenuContent>

        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}