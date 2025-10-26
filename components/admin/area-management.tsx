"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Trash2, Plus } from "lucide-react"
import { areaApi } from "@/lib/api-client"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Area {
  areaId: number
  areaName: string
  region: string
  totalUsers: number
}

export default function AreaManagement() {
  const [areas, setAreas] = useState<Area[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    areaName: "",
    region: "",
    totalUsers: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    loadAreas()
  }, [])

  const loadAreas = async () => {
    try {
      const response = await areaApi.getAllAreas()
      if (response.data) {
        setAreas(response.data as Area[])
      }
    } catch (error) {
      console.error("Failed to load areas:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCreateArea = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsCreating(true)

    try {
      const response = await areaApi.createArea({
        areaName: formData.areaName,
        region: formData.region,
        totalUsers: Number.parseInt(formData.totalUsers),
      })

      if (response.error) {
        setError(response.error)
      } else {
        setSuccess("Area created successfully!")
        setFormData({ areaName: "", region: "", totalUsers: "" })
        setShowForm(false)
        await loadAreas()
      }
    } catch (err) {
      setError("Failed to create area")
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteArea = async (areaId: number) => {
    if (confirm("Are you sure you want to delete this area?")) {
      try {
        await areaApi.deleteArea(areaId)
        await loadAreas()
      } catch (error) {
        console.error("Failed to delete area:", error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Area Management</CardTitle>
            <CardDescription>Create and manage service areas</CardDescription>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Area
          </Button>
        </CardHeader>
      </Card>

      {showForm && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Create New Area</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateArea} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="areaName" className="text-foreground">
                  Area Name
                </Label>
                <Input
                  id="areaName"
                  name="areaName"
                  placeholder="e.g., Downtown District"
                  value={formData.areaName}
                  onChange={handleInputChange}
                  required
                  className="bg-input text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region" className="text-foreground">
                  Region
                </Label>
                <Input
                  id="region"
                  name="region"
                  placeholder="e.g., Central"
                  value={formData.region}
                  onChange={handleInputChange}
                  required
                  className="bg-input text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalUsers" className="text-foreground">
                  Total Users
                </Label>
                <Input
                  id="totalUsers"
                  name="totalUsers"
                  type="number"
                  placeholder="e.g., 5000"
                  value={formData.totalUsers}
                  onChange={handleInputChange}
                  required
                  className="bg-input text-foreground"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isCreating} className="bg-primary text-primary-foreground">
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Area"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="border-border">
        <CardHeader>
          <CardTitle>All Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {areas.length === 0 ? (
              <p className="text-sm text-muted-foreground">No areas created yet</p>
            ) : (
              areas.map((area) => (
                <div
                  key={area.areaId}
                  className="p-4 border border-border rounded-lg flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-foreground">{area.areaName}</p>
                    <p className="text-sm text-muted-foreground">
                      {area.region} • {area.totalUsers} users
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteArea(area.areaId)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
