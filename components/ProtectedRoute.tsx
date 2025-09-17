"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoginPage } from "./login/LoginPage"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Проверяем, есть ли сохраненные credentials
    const checkAuth = () => {
      try {
        const savedCredentials = localStorage.getItem('authCredentials')
        setIsAuthenticated(!!savedCredentials)
      } catch (err) {
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2c3e50]"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return <>{children}</>
}