"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "ADMIN" | "USER"
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    } else if (!isLoading && requiredRole && user?.userType !== requiredRole) {
      router.push("/dashboard")
    }
  }, [user, isLoading, requiredRole, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredRole && user.userType !== requiredRole) {
    return null
  }

  return <>{children}</>
}
