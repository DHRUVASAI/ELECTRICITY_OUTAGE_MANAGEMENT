"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { outageApi } from "@/lib/api-client"
import { formatDistanceToNow } from "date-fns"

interface Outage {
  outageId: number
  location: string
  reportedTime: string
  status: string
  area: {
    areaName: string
  }
}

export default function RecentOutages() {
  const [outages, setOutages] = useState<Outage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadRecentOutages()
  }, [])

  const loadRecentOutages = async () => {
    try {
      const response = await outageApi.getAllOutages()
      if (response.data) {
        const allOutages = (response.data as any[])
          .sort((a, b) => new Date(b.reportedTime).getTime() - new Date(a.reportedTime).getTime())
          .slice(0, 5)

        setOutages(allOutages)
      }
    } catch (error) {
      console.error("Failed to load recent outages:", error)
    } finally {
      setIsLoading(false)
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
        <CardTitle>Recent Outages</CardTitle>
        <CardDescription>Latest reported power outages</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {outages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent outages</p>
          ) : (
            outages.map((outage) => (
              <div key={outage.outageId} className="flex items-start justify-between p-3 bg-muted rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{outage.location}</p>
                  <p className="text-sm text-muted-foreground">
                    {outage.area.areaName} • {formatDistanceToNow(new Date(outage.reportedTime), { addSuffix: true })}
                  </p>
                </div>
                <Badge className={getStatusColor(outage.status)}>{outage.status}</Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
