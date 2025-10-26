"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import notificationService, { type Notification } from "@/lib/real-time-notification-service"

export interface UseRealTimeNotificationsOptions {
  autoStart?: boolean
  onError?: (error: Error, sourceId: string) => void
  filterBySource?: string
}

export function useRealTimeNotifications(options: UseRealTimeNotificationsOptions = {}) {
  const { autoStart = true, onError, filterBySource } = options
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const unsubscribeRef = useRef<(() => void) | null>(null)
  const errorUnsubscribeRef = useRef<(() => void) | null>(null)

  // Handle notification updates
  const handleNotificationUpdate = useCallback(
    (allNotifications: Notification[]) => {
      const filtered = filterBySource ? allNotifications.filter((n) => n.source === filterBySource) : allNotifications
      setNotifications(filtered)
      setError(null)
    },
    [filterBySource],
  )

  // Handle errors
  const handleError = useCallback(
    (err: Error, sourceId: string) => {
      setError(err)
      onError?.(err, sourceId)
    },
    [onError],
  )

  // Start fetching on mount
  useEffect(() => {
    if (autoStart) {
      setIsLoading(true)
      notificationService.startFetching()

      // Subscribe to updates
      unsubscribeRef.current = notificationService.subscribe(handleNotificationUpdate)
      errorUnsubscribeRef.current = notificationService.onError(handleError)

      // Initial load
      handleNotificationUpdate(notificationService.getAllNotifications())
      setIsLoading(false)
    }

    return () => {
      unsubscribeRef.current?.()
      errorUnsubscribeRef.current?.()
    }
  }, [autoStart, handleNotificationUpdate, handleError])

  // Manual refresh function
  const refresh = useCallback(async () => {
    setIsLoading(true)
    try {
      if (filterBySource) {
        await notificationService.refreshSource(filterBySource)
      } else {
        await notificationService.refreshAll()
      }
      handleNotificationUpdate(notificationService.getAllNotifications())
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }, [filterBySource, handleNotificationUpdate])

  // Stop fetching function
  const stop = useCallback(() => {
    notificationService.stopFetching()
    unsubscribeRef.current?.()
    errorUnsubscribeRef.current?.()
  }, [])

  // Start fetching function
  const start = useCallback(() => {
    notificationService.startFetching()
    unsubscribeRef.current = notificationService.subscribe(handleNotificationUpdate)
    errorUnsubscribeRef.current = notificationService.onError(handleError)
  }, [handleNotificationUpdate, handleError])

  return {
    notifications,
    isLoading,
    error,
    refresh,
    stop,
    start,
    unreadCount: notifications.filter((n) => !n.isRead).length,
  }
}
