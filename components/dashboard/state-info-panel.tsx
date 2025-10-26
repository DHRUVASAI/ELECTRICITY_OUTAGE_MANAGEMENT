"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { getStateByCode, getAllStates, type StateData } from "@/lib/indian-states-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Globe, BookOpen, TrendingUp, Sparkles } from "lucide-react"

export default function StateInfoPanel() {
  const { user, updateUserState } = useAuth()
  const [selectedState, setSelectedState] = useState<string>(user?.state || "TS")
  const [stateInfo, setStateInfo] = useState<StateData | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadStateInfo = () => {
      setIsLoading(true)
      const info = getStateByCode(selectedState)
      setStateInfo(info)
      setIsLoading(false)
    }
    loadStateInfo()
  }, [selectedState])

  const handleStateChange = async (stateCode: string) => {
    setSelectedState(stateCode)
    await updateUserState(stateCode)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* State Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Select Your State
          </CardTitle>
          <CardDescription>Choose your state to view relevant information and service areas</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedState} onValueChange={handleStateChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent>
              {getAllStates().map((state) => (
                <SelectItem key={state.code} value={state.code}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* State Information Display */}
      {stateInfo && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Overview Card */}
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{stateInfo.stateName}</CardTitle>
                <Badge variant="secondary" className="text-sm">
                  Capital: {stateInfo.capital}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Users className="h-4 w-4" />
                    Population
                  </div>
                  <p className="text-lg font-semibold">{stateInfo.population}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Globe className="h-4 w-4" />
                    Area
                  </div>
                  <p className="text-lg font-semibold">{stateInfo.area}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <BookOpen className="h-4 w-4" />
                    Language
                  </div>
                  <p className="text-lg font-semibold">{stateInfo.language}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <TrendingUp className="h-4 w-4" />
                    Literacy
                  </div>
                  <p className="text-lg font-semibold">{stateInfo.demographics.literacy}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demographics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Demographics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Literacy Rate</p>
                  <p className="text-2xl font-bold text-primary">{stateInfo.demographics.literacy}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Urban Population</p>
                  <p className="text-2xl font-bold text-primary">{stateInfo.demographics.urbanPopulation}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Rural Population</p>
                  <p className="text-2xl font-bold text-primary">{stateInfo.demographics.ruralPopulation}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Cities Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Key Cities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stateInfo.keyCities.map((city, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    {city}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Regional Highlights Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Regional Highlights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {stateInfo.regionalHighlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <p className="text-sm leading-relaxed">{highlight}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
