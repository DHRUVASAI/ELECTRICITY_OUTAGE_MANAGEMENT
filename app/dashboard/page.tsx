"use client"
import { ProtectedRoute } from "@/components/auth/protected-route"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import DashboardStats from "@/components/dashboard/dashboard-stats"
import AreaOutages from "@/components/dashboard/area-outages"
import RecentOutages from "@/components/dashboard/recent-outages"
import OutageReportForm from "@/components/outage/outage-report-form"
import OutagesList from "@/components/outage/outages-list"
import { StateCitiesDisplay } from "@/components/dashboard/state-cities-display"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Report and track electricity outages in your area</p>
          </div>

          <StateCitiesDisplay />

          <DashboardStats />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Tabs defaultValue="report" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="report">Report Outage</TabsTrigger>
                  <TabsTrigger value="outages">View Outages</TabsTrigger>
                </TabsList>

                <TabsContent value="report" className="space-y-4">
                  <OutageReportForm />
                </TabsContent>

                <TabsContent value="outages" className="space-y-4">
                  <OutagesList />
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <AreaOutages />
              <RecentOutages />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
