import { Routes, Route } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { HabitDetailPage } from "@/pages/HabitDetailPage"
import LoginPage from "@/pages/LoginPage"
import { StartPage } from "@/pages/StartPage"
import Calendar from "@/pages/Calendar"
import { StatisticsPage } from "@/pages/statistics-page"
import { ProtectedRoute } from "@/components/protected-route"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ProfilePage } from "@/pages/ProfilePage"
import { SettingsPage } from "@/pages/SettingsPage"

// Layout for authenticated pages
function AppLayout() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="keepit-theme">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/kalender" element={<Calendar />} />
            <Route path="/statistik" element={<StatisticsPage />} />
            <Route path="/profil" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/habits/:id" element={<HabitDetailPage />} />
          </Routes>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="keepit-theme">
      <Routes>
        {/* Login - No sidebar */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes - With sidebar */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  )
}
export default App