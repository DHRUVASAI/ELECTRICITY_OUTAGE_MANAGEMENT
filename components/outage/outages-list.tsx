"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useWebSocket } from "@/lib/websocket-hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, Wifi, WifiOff, Trash2, Eye } from "lucide-react"
import { outageApi } from "@/lib/api-client"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

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

export default function OutagesList() {
  const { user } = useAuth()
  const { subscribe, isConnected, isSupported } = useWebSocket()
  const [outages, setOutages] = useState<Outage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<"all" | "my" | "active">("all")
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    loadOutages()
  }, [filter])

  useEffect(() => {
    if (!isSupported) {
      // Start polling every 5 seconds when WebSocket is not available
      const interval = setInterval(() => {
        loadOutages()
      }, 5000)
      setPollingInterval(interval)
      console.log("[Outages] WebSocket not supported, using polling fallback")

      return () => {
        if (interval) clearInterval(interval)
      }
    } else {
      const subId = subscribe("/topic/outages", (message) => {
        console.log("[WebSocket] Received outage update:", message)
        loadOutages()
      })

      return () => {
        if (subId) {
          // Cleanup subscription
        }
      }
    }
  }, [subscribe, isSupported])

  const loadOutages = async () => {
    setIsLoading(true)
    setError("")

    try {
      let response

      if (filter === "my" && user) {
        response = await outageApi.getOutagesByUser(user.userId)
      } else if (filter === "active") {
        response = await outageApi.getOutagesByStatus("REPORTED")
      } else {
        response = await outageApi.getAllOutages()
      }

      if (response.error) {
        setError(response.error)
        setOutages([])
      } else {
        setOutages((response.data as Outage[]) || [])
      }
    } catch (err) {
      setError("Failed to load outages")
      console.error("Load error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (outageId: number) => {
    if (!confirm("Are you sure you want to delete this outage report?")) {
      return
    }

    setDeletingId(outageId)
    try {
      const response = await outageApi.deleteOutage(outageId)
      if (response.error) {
        setError(response.error)
      } else {
        await loadOutages()
      }
    } catch (err) {
      setError("Failed to delete outage")
      console.error("Delete error:", err)
    } finally {
      setDeletingId(null)
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
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-primary text-primary-foreground" : ""}
          >
            All Outages
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            onClick={() => setFilter("active")}
            className={filter === "active" ? "bg-primary text-primary-foreground" : ""}
          >
            Active
          </Button>
          <Button
            variant={filter === "my" ? "default" : "outline"}
            onClick={() => setFilter("my")}
            className={filter === "my" ? "bg-primary text-primary-foreground" : ""}
          >
            My Reports
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm">
          {isConnected ? (
            <>
              <Wifi className="h-4 w-4 text-green-600" />
              <span className="text-green-600">Live</span>
            </>
          ) : !isSupported ? (
            <>
              <WifiOff className="h-4 w-4 text-orange-600" />
              <span className="text-orange-600">Polling</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Offline</span>
            </>
          )}
        </div>
      </div>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {outages.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">No outages found</CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {outages.map((outage) => (
            <Card key={outage.outageId} className="border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-foreground">{outage.location}</CardTitle>
                    <CardDescription>
                      {outage.area.areaName} • {outage.area.region}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(outage.status)}>{getStatusLabel(outage.status)}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-foreground">{outage.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Reported by</p>
                    <p className="text-foreground font-medium">{outage.user.username}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Reported</p>
                    <p className="text-foreground font-medium">
                      {formatDistanceToNow(new Date(outage.reportedTime), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                {outage.restorationTime && (
                  <div className="text-sm">
                    <p className="text-muted-foreground">Restored</p>
                    <p className="text-foreground font-medium">
                      {formatDistanceToNow(new Date(outage.restorationTime), { addSuffix: true })}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Link href={`/outages/${outage.outageId}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>

                  {user && (user.userId === outage.userId || user.userType === "ADMIN") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(outage.outageId)}
                      disabled={deletingId === outage.outageId}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      {deletingId === outage.outageId ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
