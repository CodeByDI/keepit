import { Route, Routes } from "react-router-dom"

import { AppSidebar } from "@/components/app-sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { HabitDetailPage } from "@/pages/HabitDetailPage"
import { StartPage } from "@/pages/StartPage"
import Calendar from "@/pages/Calendar"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { StatisticsPage } from "@/pages/statistics-page"

function App() {
  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="keepit-theme"
    >
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          <Routes>
            <Route
              path="/"
              element={<StartPage />}
            />

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
    </ThemeProvider>
  )
}

export default App
