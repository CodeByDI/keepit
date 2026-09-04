import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import { StartPage } from "@/pages/StartPage"
import { HabitDetailPage } from "@/pages/HabitDetailPage"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

function App() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <SidebarProvider>
      <AppSidebar isDark={isDark} onToggleTheme={() => setIsDark(prev => !prev)} />
      <SidebarInset>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/habits/:id" element={<HabitDetailPage />} />
        </Routes>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
