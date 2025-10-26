"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { areaApi } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users } from "lucide-react"
import { INDIAN_STATES } from "@/lib/indian-states-data"

export function StateCitiesDisplay() {
  const { user } = useAuth()
  const [areas, setAreas] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAreas = async () => {
      if (!user?.state) return

      setIsLoading(true)
      const response = await areaApi.getAllAreas(user.state)
      if (response.data) {
        setAreas(response.data)
      }
      setIsLoading(false)
    }

    loadAreas()
  }, [user?.state])

  const selectedState = INDIAN_STATES.find((s) => s.stateCode === user?.state)

  if (!user?.state) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Cities in {selectedState?.stateName}
        </CardTitle>
        <CardDescription>Service areas available in your state</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading cities...</div>
        ) : areas.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No service areas found</div>
        ) : (
          <div className="space-y-4">
            {areas.map((area) => (
              <div key={area.areaId} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{area.areaName}</h3>
                    <p className="text-sm text-muted-foreground">{area.region}</p>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {area.totalUsers.toLocaleString()}
                  </Badge>
                </div>
                {area.cities && area.cities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {area.cities.slice(0, 5).map((city: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {city}
                      </Badge>
                    ))}
                    {area.cities.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{area.cities.length - 5} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
