"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { notificationApi } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function NotificationBell() {
  const { user } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (user?.userId) {
      loadNotifications()
      // Poll for new notifications every 10 seconds
      const interval = setInterval(loadNotifications, 10000)
      return () => clearInterval(interval)
    }
  }, [user?.userId])

  const loadNotifications = async () => {
    if (!user?.userId) return
    const response = await notificationApi.getNotifications(user.userId)
    if (response.data) {
      setNotifications(response.data)
      const unread = response.data.filter((n: any) => !n.isRead).length
      setUnreadCount(unread)
    }
  }

  const handleMarkAsRead = async (notificationId: number) => {
    await notificationApi.markAsRead(notificationId)
    await loadNotifications()
  }

  const handleViewAll = () => {
    router.push("/notifications")
  }

  const recentNotifications = notifications.slice(0, 5)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {recentNotifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No notifications</div>
        ) : (
          <>
            {recentNotifications.map((notification: any) => (
              <DropdownMenuItem
                key={notification.notificationId}
                className="flex flex-col items-start gap-2 p-3 cursor-pointer"
                onClick={() => handleMarkAsRead(notification.notificationId)}
              >
                <div className="flex items-start gap-2 w-full">
                  {!notification.isRead && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-2">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.sentTime).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleViewAll} className="justify-center text-primary cursor-pointer">
              View All Notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
