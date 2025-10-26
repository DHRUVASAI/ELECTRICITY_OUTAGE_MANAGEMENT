"use client"

import { useRealTimeNotifications } from "@/hooks/use-real-time-notifications"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, AlertTriangle, CheckCircle2, Info } from "lucide-react"
import { useState } from "react"

export default function RealTimeNotificationPanel() {
  const { notifications, isLoading, error, refresh } = useRealTimeNotifications({
    filterBySource: undefined, // Show all sources
  })
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "critical":
        return "border-red-500 bg-red-50"
      case "high":
        return "border-orange-500 bg-orange-50"
      case "medium":
        return "border-yellow-500 bg-yellow-50"
      default:
        return "border-blue-500 bg-blue-50"
    }
  }

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "medium":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Live Notifications</CardTitle>
          <CardDescription>Real-time alerts from external data sources</CardDescription>
        </div>
        <Button size="sm" variant="outline" onClick={refresh} disabled={isLoading} className="gap-2 bg-transparent">
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Error loading notifications</p>
              <p className="text-sm text-red-700">{error.message}</p>
            </div>
          </div>
        )}

        {isLoading && notifications.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No active notifications</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.notificationId}
                className={`border-l-4 rounded-lg p-4 cursor-pointer transition-all ${getSeverityColor(notification.severity)}`}
                onClick={() =>
                  setExpandedId(expandedId === notification.notificationId ? null : notification.notificationId)
                }
              >
                <div className="flex items-start gap-3">
                  {getSeverityIcon(notification.severity)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-foreground line-clamp-2">{notification.message}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>{notification.source || "System"}</span>
                          <span>•</span>
                          <span>{new Date(notification.sentTime).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      {notification.severity && (
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-white/50 flex-shrink-0">
                          {notification.severity.toUpperCase()}
                        </span>
                      )}
                    </div>

                    {expandedId === notification.notificationId && (
                      <div className="mt-3 pt-3 border-t border-current/20 text-sm">
                        <p className="text-foreground">{notification.message}</p>
                        <div className="mt-2 text-xs text-muted-foreground space-y-1">
                          <p>Type: {notification.type}</p>
                          <p>Received: {new Date(notification.sentTime).toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-muted-foreground pt-2 border-t">
          <p>Auto-refreshing every 5-30 minutes • {notifications.length} total notifications</p>
        </div>
      </CardContent>
    </Card>
  )
}
