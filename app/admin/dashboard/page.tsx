"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import AdminStats from "@/components/admin/admin-stats"
import OutageManagement from "@/components/admin/outage-management"
import AreaManagement from "@/components/admin/area-management"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage outages, areas, and system operations</p>
          </div>

          <AdminStats />

          <Tabs defaultValue="outages" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="outages">Manage Outages</TabsTrigger>
              <TabsTrigger value="areas">Manage Areas</TabsTrigger>
            </TabsList>

            <TabsContent value="outages" className="space-y-4">
              <OutageManagement />
            </TabsContent>

            <TabsContent value="areas" className="space-y-4">
              <AreaManagement />
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
