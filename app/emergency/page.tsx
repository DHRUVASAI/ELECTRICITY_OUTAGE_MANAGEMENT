"use client"

import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { DynamicEmergencyContacts } from "@/components/dashboard/dynamic-emergency-contacts"

export default function EmergencyPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
            Emergency Contacts
          </h1>
          <p className="text-muted-foreground">
            Location-based emergency contact information that updates in real-time as you move between states
          </p>
        </div>

        <DynamicEmergencyContacts />
      </div>
    </DashboardLayout>
  )
}
