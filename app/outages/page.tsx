"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import OutagesList from "@/components/outage/outages-list"

export default function OutagesPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">All Outages</h1>
            <p className="text-muted-foreground mt-2">View and manage all reported power outages</p>
          </div>

          <OutagesList />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
