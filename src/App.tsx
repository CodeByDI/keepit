import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { StartPage } from "@/pages/StartPage"
import { HabitDetailPage } from "@/pages/HabitDetailPage"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="keepit-theme">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/habits/:id" element={<HabitDetailPage />} />
          </Routes>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default App
