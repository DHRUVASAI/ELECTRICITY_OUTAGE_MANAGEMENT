"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Trash2 } from "lucide-react"
import { outageApi } from "@/lib/api-client"
import { formatDistanceToNow } from "date-fns"

interface Outage {
  outageId: number
  location: string
  description: string
  reportedTime: string
  restorationTime: string | null
  status: "REPORTED" | "IN_PROGRESS" | "RESOLVED"
  user: {
    username: string
  }
  area: {
    areaName: string
  }
}

export default function OutageManagement() {
  const [outages, setOutages] = useState<Outage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  useEffect(() => {
    loadOutages()
  }, [])

  const loadOutages = async () => {
    try {
      const response = await outageApi.getAllOutages()
      if (response.data) {
        setOutages(
          (response.data as Outage[]).sort(
            (a, b) => new Date(b.reportedTime).getTime() - new Date(a.reportedTime).getTime(),
          ),
        )
      }
    } catch (error) {
      console.error("Failed to load outages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (outageId: number, newStatus: string) => {
    setUpdatingId(outageId)
    try {
      const response = await outageApi.updateOutageStatus(outageId, newStatus)
      if (!response.error) {
        await loadOutages()
      }
    } catch (error) {
      console.error("Failed to update outage:", error)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (outageId: number) => {
    if (confirm("Are you sure you want to delete this outage?")) {
      try {
        await outageApi.deleteOutage(outageId)
        await loadOutages()
      } catch (error) {
        console.error("Failed to delete outage:", error)
      }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Outage Management</CardTitle>
        <CardDescription>Update and manage all reported outages</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {outages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No outages to manage</p>
          ) : (
            outages.map((outage) => (
              <div key={outage.outageId} className="p-4 border border-border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{outage.location}</p>
                    <p className="text-sm text-muted-foreground">
                      {outage.area.areaName} • Reported by {outage.user.username}
                    </p>
                  </div>
                  <Badge className={getStatusColor(outage.status)}>{outage.status}</Badge>
                </div>

                <p className="text-sm text-foreground">{outage.description}</p>

                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(outage.reportedTime), { addSuffix: true })}
                </p>

                <div className="flex gap-2 items-center">
                  <Select
                    value={outage.status}
                    onValueChange={(value) => handleStatusUpdate(outage.outageId, value)}
                    disabled={updatingId === outage.outageId}
                  >
                    <SelectTrigger className="w-40 bg-input text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="REPORTED">Reported</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                    </SelectContent>
                  </Select>

                  {updatingId === outage.outageId && <Loader2 className="h-4 w-4 animate-spin text-primary" />}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(outage.outageId)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
