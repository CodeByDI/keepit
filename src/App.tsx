import { useEffect, useState } from "react"
import { Route, Routes } from "react-router-dom"

import { AppSidebar } from "@/components/app-sidebar"
import Calendar from "@/pages/Calendar"
import { HabitDetailPage } from "@/pages/HabitDetailPage"
import { StartPage } from "@/pages/StartPage"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

function App() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <SidebarProvider>
      <AppSidebar
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
      />

      <SidebarInset>
        <Routes>
          <Route path="/" element={<StartPage />} />

          <Route
            path="/kalender"
            element={<Calendar />}
          />

          <Route
            path="/habits/:id"
            element={<HabitDetailPage />}
          />
        </Routes>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
