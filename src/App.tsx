// src/App.tsx
import { Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { StartPage } from "@/pages/StartPage"
import { HabitDetailPage } from "@/pages/HabitDetailPage"
import LoginPage from "@/pages/LoginPage"
import { ProtectedRoute } from "@/components/protected-route"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ProfilePage } from "@/pages/ProfilePage"
import { SettingsPage } from "@/pages/SettingsPage"

// Layout for authenticated pages
function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/habits/:id" element={<HabitDetailPage />} />
          <Route path="/profil" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </SidebarInset>
    </SidebarProvider>
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