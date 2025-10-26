"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export interface User {
  userId: number
  username: string
  email: string
  userType: "ADMIN" | "USER"
  phone?: string
  address?: string
  state?: string
  token?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  logout: () => void
  updateUserState: (stateCode: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("currentUser")
    console.log("[v0] AuthProvider: Checking localStorage for user:", storedUser ? "found" : "not found")

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        console.log("[v0] AuthProvider: Setting user from localStorage:", parsedUser.username)
        setUser(parsedUser)
      } catch (error) {
        console.error("[v0] Failed to parse stored user:", error)
        localStorage.removeItem("currentUser")
      }
    }
    setIsLoading(false)
  }, [])

  const logout = () => {
    console.log("[v0] Logging out user")
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  const updateUserState = async (stateCode: string) => {
    if (!user) return

    const updatedUser = { ...user, state: stateCode }
    setUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    console.log("[v0] Updated user state to:", stateCode)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout, updateUserState }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
