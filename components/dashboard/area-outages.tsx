"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { outageApi, areaApi } from "@/lib/api-client"

interface AreaOutage {
  areaId: number
  areaName: string
  region: string
  outageCount: number
}

export default function AreaOutages() {
  const [areaOutages, setAreaOutages] = useState<AreaOutage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAreaOutages()
  }, [])

  const loadAreaOutages = async () => {
    try {
      const [areasResponse, outagesResponse] = await Promise.all([areaApi.getAllAreas(), outageApi.getAllOutages()])

      if (areasResponse.data && outagesResponse.data) {
        const areas = areasResponse.data as any[]
        const outages = outagesResponse.data as any[]

        const areaOutageMap = areas.map((area) => ({
          areaId: area.areaId,
          areaName: area.areaName,
          region: area.region,
          outageCount: outages.filter((o) => o.area.areaId === area.areaId).length,
        }))

        setAreaOutages(areaOutageMap.sort((a, b) => b.outageCount - a.outageCount))
      }
    } catch (error) {
      console.error("Failed to load area outages:", error)
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

  const majorOutages = areaOutages.filter((area) => area.outageCount > 2)
  const hasMoreOutages = areaOutages.length > majorOutages.length

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Major Outages by Area</CardTitle>
        <CardDescription>Areas with significant outage activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {majorOutages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No major outages at this time</p>
          ) : (
            majorOutages.slice(0, 5).map((area) => (
              <div
                key={area.areaId}
                className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">{area.areaName}</p>
                  <p className="text-sm text-muted-foreground">{area.region}</p>
                </div>
                <Badge variant="destructive">
                  {area.outageCount} {area.outageCount === 1 ? "outage" : "outages"}
                </Badge>
              </div>
            ))
          )}
        </div>

        {hasMoreOutages && (
          <Link href="/outages" className="block">
            <Button variant="outline" className="w-full gap-2 bg-transparent">
              View All Outages
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
