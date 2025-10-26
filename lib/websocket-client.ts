import SockJS from "sockjs-client"
import { Client, type IMessage } from "@stomp/stompjs"

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080/ws-outages"

class WebSocketClient {
  private client: Client | null = null
  private subscriptions: Map<string, string> = new Map()
  private messageHandlers: Map<string, (message: any) => void> = new Map()
  private connectionPromise: Promise<void> | null = null
  private isSupported = true

  private checkWebSocketSupport(): boolean {
    try {
      // Check if we're in a browser environment that supports WebSocket
      if (typeof window === "undefined") return false

      // Check if WebSocket protocol is allowed (not in v0 preview or similar sandboxed environments)
      const wsUrl = new URL(WS_URL)
      if (wsUrl.protocol !== "ws:" && wsUrl.protocol !== "wss:") {
        console.warn("[WebSocket] Invalid protocol:", wsUrl.protocol)
        return false
      }

      return true
    } catch (error) {
      console.warn("[WebSocket] Support check failed:", error)
      return false
    }
  }

  connect(): Promise<void> {
    if (!this.checkWebSocketSupport()) {
      this.isSupported = false
      console.log("[WebSocket] WebSocket not supported in this environment, using polling fallback")
      return Promise.resolve()
    }

    if (this.client?.active) {
      return Promise.resolve()
    }

    if (this.connectionPromise) {
      return this.connectionPromise
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      this.client = new Client({
        webSocketFactory: () => new SockJS(WS_URL),
        onConnect: () => {
          console.log("[WebSocket] Connected")
          this.isSupported = true
          resolve()
        },
        onStompError: (frame) => {
          console.error("[WebSocket] Error:", frame)
          this.isSupported = false
          resolve() // Resolve instead of reject to allow fallback
        },
        onDisconnect: () => {
          console.log("[WebSocket] Disconnected")
          this.client = null
          this.connectionPromise = null
        },
      })

      this.client.activate()
    })

    return this.connectionPromise
  }

  disconnect(): void {
    if (this.client?.active) {
      this.client.deactivate()
    }
  }

  subscribe(topic: string, handler: (message: any) => void): string {
    if (!this.isSupported || !this.client?.active) {
      console.log("[WebSocket] WebSocket not available, polling will be used instead")
      return ""
    }

    const subscriptionId = `${topic}-${Date.now()}`
    this.messageHandlers.set(subscriptionId, handler)

    const subscription = this.client.subscribe(topic, (message: IMessage) => {
      try {
        const data = JSON.parse(message.body)
        handler(data)
      } catch (error) {
        console.error("[WebSocket] Failed to parse message:", error)
      }
    })

    this.subscriptions.set(subscriptionId, subscription.id)
    return subscriptionId
  }

  unsubscribe(subscriptionId: string): void {
    const id = this.subscriptions.get(subscriptionId)
    if (id && this.client?.active) {
      this.client.unsubscribe(id)
    }
    this.subscriptions.delete(subscriptionId)
    this.messageHandlers.delete(subscriptionId)
  }

  send(destination: string, body: any): void {
    if (!this.client?.active) {
      console.error("[WebSocket] Not connected")
      return
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body),
    })
  }

  isConnected(): boolean {
    return this.client?.active ?? false
  }

  isWebSocketSupported(): boolean {
    return this.isSupported
  }
}

export const wsClient = new WebSocketClient()
