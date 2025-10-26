"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin, Clock, User, ArrowLeft, Trash2 } from "lucide-react"
import { outageApi } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import { format } from "date-fns"

interface Outage {
  outageId: number
  userId: number
  location: string
  description: string
  reportedTime: string
  restorationTime: string | null
  status: "REPORTED" | "IN_PROGRESS" | "RESOLVED"
  user: {
    userId: number
    username: string
  }
  area: {
    areaId: number
    areaName: string
    region: string
  }
}

export default function OutageDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [outage, setOutage] = useState<Outage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadOutage()
  }, [params.id])

  const loadOutage = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await outageApi.getOutageById(Number(params.id))
      if (response.error) {
        setError(response.error)
      } else {
        setOutage(response.data)
      }
    } catch (err) {
      setError("Failed to load outage details")
      console.error("Load error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!outage || !confirm("Are you sure you want to delete this outage report?")) {
      return
    }

    try {
      const response = await outageApi.deleteOutage(outage.outageId)
      if (response.error) {
        setError(response.error)
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("Failed to delete outage")
      console.error("Delete error:", err)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "REPORTED":
        return "bg-yellow-100 text-yellow-800"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800"
      case "RESOLVED":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    return status.replace("_", " ")
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (error || !outage) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Card className="border-destructive bg-destructive/10">
              <CardContent className="pt-6">
                <p className="text-destructive">{error || "Outage not found"}</p>
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            {user && (user.userId === outage.userId || user.userType === "ADMIN") && (
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Outage
              </Button>
            )}
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{outage.location}</CardTitle>
                  <CardDescription className="text-base mt-2">Outage ID: #{outage.outageId}</CardDescription>
                </div>
                <Badge className={getStatusColor(outage.status)}>{getStatusLabel(outage.status)}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground">{outage.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Area</p>
                      <p className="text-sm text-muted-foreground">{outage.area.areaName}</p>
                      <p className="text-sm text-muted-foreground">{outage.area.region}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Reported By</p>
                      <p className="text-sm text-muted-foreground">{outage.user.username}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Reported Time</p>
                      <p className="text-sm text-muted-foreground">{format(new Date(outage.reportedTime), "PPpp")}</p>
                    </div>
                  </div>

                  {outage.restorationTime && (
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Restoration Time</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(outage.restorationTime), "PPpp")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {outage.status === "IN_PROGRESS" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    This outage is currently being worked on. We'll notify you once it's resolved.
                  </p>
                </div>
              )}

              {outage.status === "RESOLVED" && outage.restorationTime && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    This outage has been resolved. Power has been restored to the affected area.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
