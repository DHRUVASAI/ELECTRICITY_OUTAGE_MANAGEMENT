"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { outageApi } from "@/lib/api-client"

interface Stats {
  total: number
  reported: number
  inProgress: number
  resolved: number
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    reported: 0,
    inProgress: 0,
    resolved: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await outageApi.getAllOutages()
      if (response.data) {
        const outages = response.data as any[]
        const reported = outages.filter((o) => o.status === "REPORTED").length
        const inProgress = outages.filter((o) => o.status === "IN_PROGRESS").length
        const resolved = outages.filter((o) => o.status === "RESOLVED").length

        setStats({
          total: outages.length,
          reported,
          inProgress,
          resolved,
        })
      }
    } catch (error) {
      console.error("Failed to load stats:", error)
    } finally {
      setIsLoading(false)
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Outages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{stats.total}</div>
          <p className="text-xs text-muted-foreground mt-1">All reported outages</p>
        </CardContent>
      </Card>

      <Card className="border-border border-yellow-200 bg-yellow-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-yellow-900 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Reported
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-yellow-900">{stats.reported}</div>
          <p className="text-xs text-yellow-700 mt-1">Awaiting response</p>
        </CardContent>
      </Card>

      <Card className="border-border border-blue-200 bg-blue-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-blue-900 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            In Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-900">{stats.inProgress}</div>
          <p className="text-xs text-blue-700 mt-1">Being worked on</p>
        </CardContent>
      </Card>

      <Card className="border-border border-green-200 bg-green-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Resolved
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-900">{stats.resolved}</div>
          <p className="text-xs text-green-700 mt-1">Power restored</p>
        </CardContent>
      </Card>
    </div>
  )
}
