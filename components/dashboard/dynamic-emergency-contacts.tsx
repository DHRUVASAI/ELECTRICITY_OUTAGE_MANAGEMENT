"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useEmergencyContacts } from "@/hooks/use-emergency-contacts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, AlertTriangle, Clock, Zap, RefreshCw, MailCheck as MapPinCheck } from "lucide-react"

export function DynamicEmergencyContacts() {
  const { user } = useAuth()
  const [displayState, setDisplayState] = useState<string>("")

  const { contacts, isLoading, error, lastUpdated, refetch } = useEmergencyContacts({
    stateCode: displayState || user?.state,
    autoRefresh: true,
    refreshInterval: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (user?.state) {
      setDisplayState(user.state)
    }
  }, [user?.state])

  if (!displayState) {
    return (
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <CardHeader>
          <CardTitle className="text-amber-700 dark:text-amber-400">Location Required</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-600 dark:text-amber-300">
            Please select your state to view emergency contacts.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Location Indicator */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-lg border border-blue-200 dark:border-blue-800 animate-in fade-in slide-in-from-top-2 duration-500">
        <div className="flex items-center gap-2">
          <MapPinCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-pulse" />
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Current Location</p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              {contacts?.stateName || "Loading..."}{" "}
              {lastUpdated && `• Updated ${new Date(lastUpdated).toLocaleTimeString()}`}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
          className="gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 animate-in fade-in duration-300">
          <CardContent className="pt-6">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Emergency Alert */}
      <Card className="border-red-500 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-in fade-in slide-in-from-top-2 duration-500 delay-100">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="relative">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <div className="absolute inset-0 animate-pulse">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 opacity-50" />
              </div>
            </div>
            <CardTitle className="text-red-700 dark:text-red-400">Emergency Situations</CardTitle>
          </div>
          <CardDescription className="text-red-600 dark:text-red-300">
            For life-threatening emergencies involving downed power lines or electrical hazards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {contacts?.contacts
              .filter((c) => c.type === "emergency")
              .map((contact, idx) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-background rounded-lg border border-red-200 dark:border-red-800 hover:border-red-400 dark:hover:border-red-600 transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-left duration-500"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div>
                    <p className="font-semibold text-foreground">{contact.name}</p>
                    {contact.hours && <p className="text-xs text-muted-foreground">{contact.hours}</p>}
                  </div>
                  <Button
                    variant="destructive"
                    size="lg"
                    className="gap-2 hover:scale-105 transition-transform duration-200"
                    onClick={() => (window.location.href = `tel:${contact.phone}`)}
                  >
                    <Phone className="h-4 w-4" />
                    {contact.phone}
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Service */}
      <Card className="border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow duration-300 animate-in fade-in slide-in-from-top-2 duration-500 delay-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <Phone className="h-5 w-5" />
            Customer Service
          </CardTitle>
          <CardDescription>For non-emergency outage reports and inquiries</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts?.contacts
              .filter((c) => c.type === "customer_service")
              .map((contact, idx) => (
                <div
                  key={contact.id}
                  className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-lg space-y-3 border border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-md animate-in fade-in duration-500"
                  style={{ animationDelay: `${200 + idx * 100}ms` }}
                >
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    {contact.phone && <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                    {contact.email && <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                    <span>{contact.name}</span>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{contact.phone}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 bg-transparent"
                        onClick={() => (window.location.href = `tel:${contact.phone}`)}
                      >
                        <Phone className="h-3 w-3" />
                        Call
                      </Button>
                    </div>
                  )}
                  {contact.email && <p className="text-sm text-muted-foreground break-all">{contact.email}</p>}
                  {contact.hours && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {contact.hours}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Regional Offices */}
      <Card className="border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow duration-300 animate-in fade-in slide-in-from-top-2 duration-500 delay-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <MapPin className="h-5 w-5" />
            Regional Service Centers
          </CardTitle>
          <CardDescription>Visit our offices for in-person assistance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts?.contacts
              .filter((c) => c.type === "regional_office")
              .map((contact, idx) => (
                <div
                  key={contact.id}
                  className="p-4 border border-green-200 dark:border-green-800 rounded-lg space-y-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 hover:shadow-md animate-in fade-in duration-500"
                  style={{ animationDelay: `${300 + idx * 100}ms` }}
                >
                  <h3 className="font-semibold text-foreground">{contact.name}</h3>
                  {contact.address && (
                    <p className="text-sm text-muted-foreground flex items-start gap-2">
                      <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0 text-green-600 dark:text-green-400" />
                      <span>{contact.address}</span>
                    </p>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3 text-green-600 dark:text-green-400" />
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  )}
                  {contact.hours && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-3 w-3 text-green-600 dark:text-green-400" />
                      <span className="text-muted-foreground">{contact.hours}</span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Safety Tips */}
      <Card className="border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow duration-300 animate-in fade-in slide-in-from-top-2 duration-500 delay-400">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
            <Zap className="h-5 w-5" />
            Power Outage Safety Tips
          </CardTitle>
          <CardDescription>Important safety information during outages</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {[
              {
                title: "Stay away from downed power lines",
                desc: "Always assume they are live and dangerous. Keep at least 10 meters away.",
              },
              {
                title: "Turn off major appliances",
                desc: "Prevent damage from power surges when electricity is restored.",
              },
              {
                title: "Use flashlights, not candles",
                desc: "Candles pose a fire risk. Keep battery-powered flashlights ready.",
              },
              {
                title: "Keep refrigerator and freezer closed",
                desc: "Food will stay cold for 4 hours in refrigerator, 48 hours in full freezer.",
              },
              {
                title: "Never use generators indoors",
                desc: "Carbon monoxide poisoning risk. Use only outdoors in well-ventilated areas.",
              },
            ].map((tip, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 animate-in fade-in duration-500"
                style={{ animationDelay: `${400 + idx * 100}ms` }}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-xs font-bold">
                  {idx + 1}
                </div>
                <div>
                  <p className="font-medium text-foreground">{tip.title}</p>
                  <p className="text-sm text-muted-foreground">{tip.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
