"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, CheckCircle } from "lucide-react"
import { authApi } from "@/lib/api-client"
import { INDIAN_STATES } from "@/lib/indian-states-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    state: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    if (!formData.state) {
      setError("Please select your state")
      setIsLoading(false)
      return
    }

    try {
      const result = await authApi.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        state: formData.state,
      })

      if (result.error) {
        setError(result.error)
        console.error("[v0] Registration error:", result.error)
        return
      }

      setSuccess("Registration successful! Redirecting to login...")
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to connect to server"
      setError(errorMessage)
      console.error("[v0] Registration error:", err)
    } finally {
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

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="username" className="text-foreground">
          Username
        </Label>
        <Input
          id="username"
          type="text"
          name="username"
          placeholder="Choose a username"
          value={formData.username}
          onChange={handleChange}
          disabled={isLoading}
          required
          className="bg-input text-foreground"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          required
          className="bg-input text-foreground"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-foreground">
          Phone
        </Label>
        <Input
          id="phone"
          type="tel"
          name="phone"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={handleChange}
          disabled={isLoading}
          required
          className="bg-input text-foreground"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-foreground">
          Address
        </Label>
        <Input
          id="address"
          type="text"
          name="address"
          placeholder="Enter your address"
          value={formData.address}
          onChange={handleChange}
          disabled={isLoading}
          required
          className="bg-input text-foreground"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="state" className="text-foreground">
          State
        </Label>
        <Select
          value={formData.state}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, state: value }))}
          disabled={isLoading}
          required
        >
          <SelectTrigger className="bg-input text-foreground">
            <SelectValue placeholder="Select your state" />
          </SelectTrigger>
          <SelectContent>
            {INDIAN_STATES.map((state) => (
              <SelectItem key={state.stateCode} value={state.stateCode}>
                {state.stateName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          required
          className="bg-input text-foreground"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-foreground">
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
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
            Registering...
          </>
        ) : (
          "Register"
        )}
      </Button>
    </form>
  )
}
