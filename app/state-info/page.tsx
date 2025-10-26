"use client"

import DashboardLayout from "@/components/dashboard/dashboard-layout"
import StateInfoPanel from "@/components/dashboard/state-info-panel"

export default function StateInfoPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">State Information</h1>
          <p className="text-muted-foreground mt-2">
            Explore detailed information about Indian states including demographics, key cities, and regional highlights
          </p>
        </div>

        <StateInfoPanel />
      </div>
    </DashboardLayout>
  )
}
