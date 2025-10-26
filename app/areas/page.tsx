"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Loader2, MapPin, Users, Search } from "lucide-react"
import { areaApi, outageApi } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"

interface Area {
  areaId: number
  areaName: string
  region: string
  state: string
  stateName: string
  totalUsers: number
  cities: string[]
}

export default function AreasPage() {
  const { user } = useAuth()
  const [areas, setAreas] = useState<Area[]>([])
  const [filteredAreas, setFilteredAreas] = useState<Area[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [outagesByArea, setOutagesByArea] = useState<Record<number, number>>({})

  useEffect(() => {
    loadAreas()
  }, [user?.state])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAreas(areas)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredAreas(
        areas.filter(
          (area) =>
            area.areaName.toLowerCase().includes(query) ||
            area.region.toLowerCase().includes(query) ||
            area.cities.some((city) => city.toLowerCase().includes(query)),
        ),
      )
    }
  }, [searchQuery, areas])

  const loadAreas = async () => {
    setIsLoading(true)
    try {
      const userState = user?.state || "TS"
      const response = await areaApi.getAllAreas(userState)
      if (response.data) {
        const areasData = response.data as Area[]
        setAreas(areasData)
        setFilteredAreas(areasData)

        // Load outage counts for each area
        const outagesCount: Record<number, number> = {}
        for (const area of areasData) {
          const outagesResponse = await outageApi.getOutagesByArea(area.areaId)
          if (outagesResponse.data) {
            const activeOutages = outagesResponse.data.filter(
              (o: any) => o.status === "REPORTED" || o.status === "IN_PROGRESS",
            )
            outagesCount[area.areaId] = activeOutages.length
          }
        }
        setOutagesByArea(outagesCount)
      }
    } catch (err) {
      console.error("Failed to load areas:", err)
    } finally {
      setIsLoading(false)
    }
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

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Service Areas</h1>
            <p className="text-muted-foreground mt-2">
              Browse electricity service areas in {areas[0]?.stateName || "your state"}
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by area name, region, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredAreas.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No areas found matching your search
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAreas.map((area) => (
                <Card key={area.areaId} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          {area.areaName}
                        </CardTitle>
                        <CardDescription className="mt-1">{area.region}</CardDescription>
                      </div>
                      {outagesByArea[area.areaId] > 0 && (
                        <Badge variant="destructive">{outagesByArea[area.areaId]} Active</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{area.totalUsers.toLocaleString()} users</span>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Coverage Areas:</p>
                      <div className="flex flex-wrap gap-1">
                        {area.cities.map((city, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {city}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
