"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { outageApi, areaApi } from "@/lib/api-client"

interface Area {
  areaId: number
  areaName: string
  region: string
  totalUsers: number
}

export default function OutageReportForm() {
  const { user } = useAuth()
  const [areas, setAreas] = useState<Area[]>([])
  const [formData, setFormData] = useState({
    areaId: "",
    location: "",
    description: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingAreas, setIsLoadingAreas] = useState(true)

  useEffect(() => {
    loadAreas()
  }, [user?.state])

  const loadAreas = async () => {
    try {
      const userState = user?.state || "TS"
      const response = await areaApi.getAllAreas(userState)
      if (response.data) {
        setAreas(response.data as Area[])
      }
    } catch (err) {
      console.error("Failed to load areas:", err)
    } finally {
      setIsLoadingAreas(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAreaChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      areaId: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    if (!user) {
      setError("User not authenticated")
      setIsLoading(false)
      return
    }

    try {
      const response = await outageApi.reportOutage({
        userId: user.userId,
        areaId: Number.parseInt(formData.areaId),
        location: formData.location,
        description: formData.description,
      })

      if (response.error) {
        setError(response.error)
        return
      }

      setSuccess("Outage reported successfully!")
      setFormData({
        areaId: "",
        location: "",
        description: "",
      })

      setTimeout(() => {
        setSuccess("")
      }, 5000)
    } catch (err) {
      setError("Failed to report outage. Please try again.")
      console.error("Report error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingAreas) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">Report a Power Outage</h2>

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
          <Label htmlFor="areaId" className="text-foreground">
            Affected Area *
          </Label>
          <Select value={formData.areaId} onValueChange={handleAreaChange}>
            <SelectTrigger className="bg-input text-foreground">
              <SelectValue placeholder="Select an area" />
            </SelectTrigger>
            <SelectContent>
              {areas.map((area) => (
                <SelectItem key={area.areaId} value={area.areaId.toString()}>
                  {area.areaName} ({area.region})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-foreground">
            Location *
          </Label>
          <Input
            id="location"
            name="location"
            placeholder="Enter the specific location of the outage"
            value={formData.location}
            onChange={handleChange}
            disabled={isLoading}
            required
            className="bg-input text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-foreground">
            Description *
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe the outage (e.g., duration, affected buildings, etc.)"
            value={formData.description}
            onChange={handleChange}
            disabled={isLoading}
            required
            className="bg-input text-foreground min-h-32"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading || !formData.areaId}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Reporting...
            </>
          ) : (
            "Report Outage"
          )}
        </Button>
      </form>
    </div>
  )
}
