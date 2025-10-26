"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, MapPin, AlertTriangle } from "lucide-react"
import { outageApi, areaApi } from "@/lib/api-client"

interface AdminStats {
  totalOutages: number
  activeOutages: number
  totalAreas: number
  criticalOutages: number
}

export default function AdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    totalOutages: 0,
    activeOutages: 0,
    totalAreas: 0,
    criticalOutages: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [outagesResponse, areasResponse] = await Promise.all([outageApi.getAllOutages(), areaApi.getAllAreas()])

      if (outagesResponse.data && areasResponse.data) {
        const outages = outagesResponse.data as any[]
        const areas = areasResponse.data as any[]

        const activeOutages = outages.filter((o) => o.status !== "RESOLVED").length
        const criticalOutages = outages.filter((o) => o.status === "REPORTED").length

        setStats({
          totalOutages: outages.length,
          activeOutages,
          totalAreas: areas.length,
          criticalOutages,
        })
      }
    } catch (error) {
      console.error("Failed to load admin stats:", error)
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
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Total Outages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{stats.totalOutages}</div>
          <p className="text-xs text-muted-foreground mt-1">All time reports</p>
        </CardContent>
      </Card>

      <Card className="border-border border-red-200 bg-red-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-red-900">Critical</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-900">{stats.criticalOutages}</div>
          <p className="text-xs text-red-700 mt-1">Awaiting response</p>
        </CardContent>
      </Card>

      <Card className="border-border border-orange-200 bg-orange-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-orange-900">Active</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-900">{stats.activeOutages}</div>
          <p className="text-xs text-orange-700 mt-1">In progress or reported</p>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{stats.totalAreas}</div>
          <p className="text-xs text-muted-foreground mt-1">Service areas</p>
        </CardContent>
      </Card>
    </div>
  )
}
