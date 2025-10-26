"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import LoginForm from "@/components/auth/login-form"
import RegisterForm from "@/components/auth/register-form"
import ElectricalBackground from "@/components/auth/electrical-background"

export default function Home() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      const user = JSON.parse(currentUser)
      if (user.userType === "ADMIN") {
        router.push("/admin/dashboard")
      } else {
        router.push("/dashboard")
      }
    }
    setIsLoading(false)
  }, [router])

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

  return (
    <main className="relative flex items-center justify-center min-h-screen p-4">
      <ElectricalBackground />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-card/95 backdrop-blur-sm rounded-lg shadow-2xl p-8 border border-border/50">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Power Outage System</h1>
            <p className="text-muted-foreground">Report and track electricity outages</p>
          </div>

          {isLogin ? (
            <>
              <LoginForm />
              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  Don't have an account?{" "}
                  <button onClick={() => setIsLogin(false)} className="text-primary hover:underline font-semibold">
                    Register here
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <RegisterForm />
              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  Already have an account?{" "}
                  <button onClick={() => setIsLogin(true)} className="text-primary hover:underline font-semibold">
                    Login here
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
