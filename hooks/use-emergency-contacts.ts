"use client"

import { useState, useEffect, useCallback } from "react"
import { EmergencyContactsService, type StateEmergencyContacts } from "@/lib/emergency-contacts-service"

interface UseEmergencyContactsOptions {
  stateCode?: string
  autoRefresh?: boolean
  refreshInterval?: number
}

export function useEmergencyContacts(options: UseEmergencyContactsOptions = {}) {
  const { stateCode, autoRefresh = true, refreshInterval = 5 * 60 * 1000 } = options

  const [contacts, setContacts] = useState<StateEmergencyContacts | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchContacts = useCallback(async () => {
    if (!stateCode) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await EmergencyContactsService.getContactsByState(stateCode)

      if (data) {
        setContacts(data)
        setLastUpdated(new Date())
      } else {
        setError("Failed to load emergency contacts")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [stateCode])

  useEffect(() => {
    fetchContacts()

    if (!autoRefresh) return

    const interval = setInterval(fetchContacts, refreshInterval)
    return () => clearInterval(interval)
  }, [fetchContacts, autoRefresh, refreshInterval])

  return {
    contacts,
    isLoading,
    error,
    lastUpdated,
    refetch: fetchContacts,
  }
}
