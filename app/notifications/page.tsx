"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { notificationApi } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, CheckCircle2, Circle } from "lucide-react"
import RealTimeNotificationPanel from "@/components/dashboard/real-time-notification-panel"

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")

  useEffect(() => {
    loadNotifications()
  }, [user?.userId])

  const loadNotifications = async () => {
    if (!user?.userId) return
    setLoading(true)
    const response = await notificationApi.getNotifications(user.userId)
    if (response.data) {
      setNotifications(response.data)
    }
    setLoading(false)
  }

  const handleMarkAsRead = async (notificationId: number) => {
    await notificationApi.markAsRead(notificationId)
    await loadNotifications()
  }

  const handleMarkAllAsRead = async () => {
    if (user?.userId) {
      await notificationApi.markAllAsRead(user.userId)
      await loadNotifications()
    }
  }

  const handleDelete = async (notificationId: number) => {
    await notificationApi.deleteNotification(notificationId)
    await loadNotifications()
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead
    if (filter === "read") return n.isRead
    return true
  })

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "OUTAGE_REPORTED":
        return "bg-red-50 border-red-200"
      case "OUTAGE_RESOLVED":
        return "bg-green-50 border-green-200"
      case "STATUS_UPDATE":
        return "bg-blue-50 border-blue-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "OUTAGE_REPORTED":
        return "🔴"
      case "OUTAGE_RESOLVED":
        return "✅"
      case "STATUS_UPDATE":
        return "ℹ️"
      default:
        return "📢"
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
              <p className="text-muted-foreground mt-2">Stay updated with outage alerts and status changes</p>
            </div>
            {notifications.some((n) => !n.isRead) && (
              <Button onClick={handleMarkAllAsRead} variant="outline">
                Mark all as read
              </Button>
            )}
          </div>

          <RealTimeNotificationPanel />

          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className="rounded-full"
            >
              All ({notifications.length})
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "outline"}
              onClick={() => setFilter("unread")}
              className="rounded-full"
            >
              Unread ({notifications.filter((n) => !n.isRead).length})
            </Button>
            <Button
              variant={filter === "read" ? "default" : "outline"}
              onClick={() => setFilter("read")}
              className="rounded-full"
            >
              Read ({notifications.filter((n) => n.isRead).length})
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground text-lg">No notifications</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.notificationId}
                  className={`border-l-4 ${getNotificationColor(notification.type)} cursor-pointer hover:shadow-md transition-shadow`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-2xl mt-1">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">{notification.message}</p>
                            {!notification.isRead && (
                              <Circle className="h-2 w-2 fill-blue-500 text-blue-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(notification.sentTime).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.isRead && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMarkAsRead(notification.notificationId)}
                            title="Mark as read"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(notification.notificationId)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
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
