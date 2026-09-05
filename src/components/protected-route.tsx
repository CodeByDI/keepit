// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom"

interface ProtectedRouteProps {
    children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const user = localStorage.getItem("user")

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}