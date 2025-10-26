export interface NotificationSource {
  id: string
  name: string
  url: string
  refreshInterval: number // in milliseconds
  enabled: boolean
  parser: (data: any) => Notification[]
}

export interface Notification {
  notificationId: number
  userId: number
  outageId?: number
  message: string
  type: "OUTAGE_REPORTED" | "OUTAGE_RESOLVED" | "STATUS_UPDATE" | "EXTERNAL_ALERT"
  sentTime: string
  isRead: boolean
  source?: string
  severity?: "low" | "medium" | "high" | "critical"
}

export interface NotificationServiceConfig {
  sources: NotificationSource[]
  retryAttempts: number
  retryDelay: number
  timeout: number
}

class RealTimeNotificationService {
  private config: NotificationServiceConfig
  private activeIntervals: Map<string, NodeJS.Timeout> = new Map()
  private cache: Map<string, Notification[]> = new Map()
  private listeners: Set<(notifications: Notification[]) => void> = new Set()
  private errorListeners: Set<(error: Error, sourceId: string) => void> = new Set()

  constructor(config: NotificationServiceConfig) {
    this.config = config
  }

  /**
   * Start fetching notifications from all enabled sources
   */
  public startFetching(): void {
    this.config.sources.forEach((source) => {
      if (source.enabled) {
        this.startSourceFetching(source)
      }
    })
  }

  /**
   * Stop fetching notifications from all sources
   */
  public stopFetching(): void {
    this.activeIntervals.forEach((interval) => clearInterval(interval))
    this.activeIntervals.clear()
  }

  /**
   * Start fetching from a specific source
   */
  private startSourceFetching(source: NotificationSource): void {
    // Fetch immediately on start
    this.fetchFromSource(source)

    // Set up interval for continuous fetching
    const interval = setInterval(() => {
      this.fetchFromSource(source)
    }, source.refreshInterval)

    this.activeIntervals.set(source.id, interval)
  }

  /**
   * Fetch notifications from a specific external source with retry logic
   */
  private async fetchFromSource(source: NotificationSource, attempt = 1): Promise<void> {
    try {
      let data: any
      if (source.url.startsWith("mock://")) {
        // For mock sources, just call the parser with empty data
        data = {}
      } else {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

        const response = await fetch(source.url, {
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "PowerOutageSystem/1.0",
          },
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        data = await response.json()
      }

      const notifications = source.parser(data)

      // Cache and notify listeners
      this.cache.set(source.id, notifications)
      this.notifyListeners()
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))

      // Retry logic
      if (attempt < this.config.retryAttempts) {
        console.warn(
          `[v0] Notification fetch failed for ${source.id}, retrying (${attempt}/${this.config.retryAttempts})...`,
        )
        setTimeout(() => {
          this.fetchFromSource(source, attempt + 1)
        }, this.config.retryDelay * attempt)
      } else {
        console.error(`[v0] Failed to fetch notifications from ${source.id}:`, err.message)
        this.notifyErrorListeners(err, source.id)
      }
    }
  }

  /**
   * Get all cached notifications from all sources
   */
  public getAllNotifications(): Notification[] {
    const allNotifications: Notification[] = []
    this.cache.forEach((notifications) => {
      allNotifications.push(...notifications)
    })
    // Sort by time, newest first
    return allNotifications.sort((a, b) => new Date(b.sentTime).getTime() - new Date(a.sentTime).getTime())
  }

  /**
   * Get notifications from a specific source
   */
  public getNotificationsBySource(sourceId: string): Notification[] {
    return this.cache.get(sourceId) || []
  }

  /**
   * Subscribe to notification updates
   */
  public subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.add(listener)
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * Subscribe to error events
   */
  public onError(listener: (error: Error, sourceId: string) => void): () => void {
    this.errorListeners.add(listener)
    return () => {
      this.errorListeners.delete(listener)
    }
  }

  /**
   * Notify all listeners of updates
   */
  private notifyListeners(): void {
    const notifications = this.getAllNotifications()
    this.listeners.forEach((listener) => {
      try {
        listener(notifications)
      } catch (error) {
        console.error("[v0] Error in notification listener:", error)
      }
    })
  }

  /**
   * Notify error listeners
   */
  private notifyErrorListeners(error: Error, sourceId: string): void {
    this.errorListeners.forEach((listener) => {
      try {
        listener(error, sourceId)
      } catch (err) {
        console.error("[v0] Error in error listener:", err)
      }
    })
  }

  /**
   * Manually trigger a refresh for a specific source
   */
  public async refreshSource(sourceId: string): Promise<void> {
    const source = this.config.sources.find((s) => s.id === sourceId)
    if (source) {
      await this.fetchFromSource(source)
    }
  }

  /**
   * Manually trigger a refresh for all sources
   */
  public async refreshAll(): Promise<void> {
    await Promise.all(this.config.sources.map((source) => this.fetchFromSource(source)))
  }

  /**
   * Clear cache for a specific source
   */
  public clearSourceCache(sourceId: string): void {
    this.cache.delete(sourceId)
  }

  /**
   * Clear all caches
   */
  public clearAllCache(): void {
    this.cache.clear()
  }
}

// Default notification sources configuration
export const DEFAULT_NOTIFICATION_SOURCES: NotificationSource[] = [
  {
    id: "government-alerts",
    name: "Government Power Alerts",
    url: "mock://government-alerts", // Mock source
    refreshInterval: 5 * 60 * 1000, // 5 minutes
    enabled: true,
    parser: (data: any) => {
      // Generate mock government alerts
      const mockAlerts = [
        {
          notificationId: 10001,
          userId: 0,
          message: "High voltage maintenance scheduled in Hyderabad region",
          type: "STATUS_UPDATE" as const,
          sentTime: new Date().toISOString(),
          isRead: false,
          source: "government-alerts",
          severity: "medium" as const,
        },
        {
          notificationId: 10002,
          userId: 0,
          message: "Power grid stability alert for Telangana state",
          type: "EXTERNAL_ALERT" as const,
          sentTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          isRead: false,
          source: "government-alerts",
          severity: "high" as const,
        },
      ]
      return mockAlerts
    },
  },
  {
    id: "weather-alerts",
    name: "Weather-Related Power Alerts",
    url: "mock://weather-alerts", // Mock source
    refreshInterval: 10 * 60 * 1000, // 10 minutes
    enabled: true,
    parser: (data: any) => {
      // Generate mock weather alerts
      const mockAlerts = [
        {
          notificationId: 20001,
          userId: 0,
          message: "Severe thunderstorm warning may affect power lines in Hyderabad",
          type: "EXTERNAL_ALERT" as const,
          sentTime: new Date().toISOString(),
          isRead: false,
          source: "weather-alerts",
          severity: "high" as const,
        },
        {
          notificationId: 20002,
          userId: 0,
          message: "Heavy rainfall expected - increased outage risk",
          type: "STATUS_UPDATE" as const,
          sentTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          isRead: false,
          source: "weather-alerts",
          severity: "medium" as const,
        },
      ]
      return mockAlerts
    },
  },
  {
    id: "maintenance-schedule",
    name: "Scheduled Maintenance Alerts",
    url: "mock://maintenance-schedule", // Mock source
    refreshInterval: 30 * 60 * 1000, // 30 minutes
    enabled: true,
    parser: (data: any) => {
      // Generate mock maintenance alerts
      const mockAlerts = [
        {
          notificationId: 30001,
          userId: 0,
          message: "Scheduled Maintenance: Banjara Hills transformer upgrade - 2:00 AM to 4:00 AM",
          type: "STATUS_UPDATE" as const,
          sentTime: new Date().toISOString(),
          isRead: false,
          source: "maintenance-schedule",
          severity: "low" as const,
        },
        {
          notificationId: 30002,
          userId: 0,
          message: "Scheduled Maintenance: Secunderabad North line inspection - 10:00 PM to 12:00 AM",
          type: "STATUS_UPDATE" as const,
          sentTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isRead: false,
          source: "maintenance-schedule",
          severity: "low" as const,
        },
      ]
      return mockAlerts
    },
  },
]

export const notificationService = new RealTimeNotificationService({
  sources: DEFAULT_NOTIFICATION_SOURCES,
  retryAttempts: 3,
  retryDelay: 1000, // 1 second base delay
  timeout: 10000, // 10 seconds
})

export default notificationService
