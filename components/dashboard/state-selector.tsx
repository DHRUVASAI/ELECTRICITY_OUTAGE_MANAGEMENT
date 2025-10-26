"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { getAllStates } from "@/lib/indian-states-data"
import { userApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function StateSelector() {
  const { user, setUser } = useAuth()
  const { toast } = useToast()
  const [selectedState, setSelectedState] = useState(user?.state || "TS")
  const [isLoading, setIsLoading] = useState(false)

  const states = getAllStates()

  const handleSaveState = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const response = await userApi.updateUser(user.userId, { state: selectedState })

      if (response.data) {
        const updatedUser = { ...user, state: selectedState }
        setUser(updatedUser)
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))

        toast({
          title: "State Updated",
          description: "Your state preference has been saved. Service areas will now show locations in your state.",
        })
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update state",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update state preference",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Select Your State
        </CardTitle>
        <CardDescription>Choose your state to see relevant service areas and outage information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger>
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            {states.map((state) => (
              <SelectItem key={state.code} value={state.code}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleSaveState} disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : "Save State Preference"}
        </Button>
      </CardContent>
    </Card>
  )
}
