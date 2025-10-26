"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { wsClient } from "./websocket-client"

export function useWebSocket() {
  const subscriptionsRef = useRef<string[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    wsClient
      .connect()
      .then(() => {
        setIsConnected(wsClient.isConnected())
        setIsSupported(wsClient.isWebSocketSupported())
      })
      .catch((error) => {
        console.error("[WebSocket Hook] Connection failed:", error)
        setIsSupported(false)
      })

    return () => {
      subscriptionsRef.current.forEach((subId) => {
        wsClient.unsubscribe(subId)
      })
    }
  }, [])

  const subscribe = useCallback(
    (topic: string, handler: (message: any) => void) => {
      if (!isSupported) {
        console.log("[WebSocket Hook] WebSocket not supported, skipping subscription")
        return ""
      }

      const subId = wsClient.subscribe(topic, handler)
      if (subId) {
        subscriptionsRef.current.push(subId)
      }
      return subId
    },
    [isSupported],
  )

  const unsubscribe = useCallback((subId: string) => {
    if (subId) {
      wsClient.unsubscribe(subId)
      subscriptionsRef.current = subscriptionsRef.current.filter((id) => id !== subId)
    }
  }, [])

  const send = useCallback((destination: string, body: any) => {
    wsClient.send(destination, body)
  }, [])

  return {
    subscribe,
    unsubscribe,
    send,
    isConnected,
    isSupported,
  }
}
