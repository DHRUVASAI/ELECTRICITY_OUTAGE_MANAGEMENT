"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Info } from "lucide-react"
import { authApi } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"

export default function LoginForm() {
  const router = useRouter()
  const { setUser } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await authApi.login(username, password)

      if (result.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }

      if (!result.data) {
        setError("Login failed: No user data returned")
        setIsLoading(false)
        return
      }

      // Transform Flask response to match frontend User interface
      const userData = {
        userId: result.data.user.id,
        username: result.data.user.username,
        email: result.data.user.email,
        userType: (result.data.user.role === 'admin' ? 'ADMIN' : 'USER') as 'ADMIN' | 'USER',
        phone: result.data.user.phone,
        address: result.data.user.address,
        token: result.data.access_token
      }

      localStorage.setItem("currentUser", JSON.stringify(userData))
      setUser(userData)

      // Redirect based on user type
      if (userData.userType === "ADMIN") {
        router.push("/admin/dashboard")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Connected to Flask backend at {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="username" className="text-foreground">
          Email
        </Label>
        <Input
          id="username"
          type="email"
          placeholder="Enter your email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          required
          className="bg-input text-foreground"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
          className="bg-input text-foreground"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </Button>

      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p className="font-semibold">Demo credentials:</p>
        <p>
          Admin: <code className="bg-muted px-1 rounded">admin@power.com</code> /{" "}
          <code className="bg-muted px-1 rounded">admin123</code>
        </p>
        <p>
          User: <code className="bg-muted px-1 rounded">user@power.com</code> /{" "}
          <code className="bg-muted px-1 rounded">user123</code>
        </p>
      </div>
    </form>
  )
}
