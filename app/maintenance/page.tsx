"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Wrench, AlertCircle } from "lucide-react"

interface MaintenanceSchedule {
  id: number
  title: string
  area: string
  date: string
  startTime: string
  endTime: string
  status: "scheduled" | "in-progress" | "completed"
  affectedUsers: number
  description: string
}

export default function MaintenancePage() {
  const [schedules] = useState<MaintenanceSchedule[]>([
    {
      id: 1,
      title: "Transformer Upgrade",
      area: "Downtown Area",
      date: "2025-01-15",
      startTime: "02:00 AM",
      endTime: "06:00 AM",
      status: "scheduled",
      affectedUsers: 1200,
      description: "Scheduled maintenance to upgrade transformer capacity for improved reliability.",
    },
    {
      id: 2,
      title: "Power Line Inspection",
      area: "Suburban Zone",
      date: "2025-01-18",
      startTime: "09:00 AM",
      endTime: "03:00 PM",
      status: "scheduled",
      affectedUsers: 450,
      description: "Routine inspection and maintenance of overhead power lines.",
    },
    {
      id: 3,
      title: "Substation Maintenance",
      area: "Industrial District",
      date: "2025-01-20",
      startTime: "01:00 AM",
      endTime: "05:00 AM",
      status: "scheduled",
      affectedUsers: 2100,
      description: "Preventive maintenance on substation equipment to ensure optimal performance.",
    },
    {
      id: 4,
      title: "Cable Replacement",
      area: "Residential Area",
      date: "2025-01-12",
      startTime: "10:00 AM",
      endTime: "04:00 PM",
      status: "completed",
      affectedUsers: 680,
      description: "Replacement of aging underground cables to prevent future outages.",
    },
    {
      id: 5,
      title: "Grid Modernization",
      area: "Commercial Zone",
      date: "2025-01-22",
      startTime: "12:00 AM",
      endTime: "06:00 AM",
      status: "scheduled",
      affectedUsers: 1850,
      description: "Installation of smart grid technology for better monitoring and control.",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "default"
      case "in-progress":
        return "secondary"
      case "completed":
        return "outline"
      default:
        return "default"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Scheduled"
      case "in-progress":
        return "In Progress"
      case "completed":
        return "Completed"
      default:
        return status
    }
  }

  const upcomingSchedules = schedules.filter((s) => s.status === "scheduled")
  const completedSchedules = schedules.filter((s) => s.status === "completed")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Scheduled Maintenance</h1>
          <p className="text-muted-foreground mt-2">View planned maintenance activities and power interruptions</p>
        </div>

        {/* Info Alert */}
        <Card className="border-blue-500 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-700 dark:text-blue-400">Planned Maintenance Notice</p>
                <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                  We schedule regular maintenance to improve service reliability. Affected customers will receive
                  advance notification via email and SMS.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{upcomingSchedules.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Scheduled activities</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Affected Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">
                {upcomingSchedules.reduce((sum, s) => sum + s.affectedUsers, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">For upcoming work</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{completedSchedules.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Successfully completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Maintenance */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Upcoming Maintenance</h2>
          <div className="space-y-4">
            {upcomingSchedules.map((schedule) => (
              <Card key={schedule.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <Wrench className="h-5 w-5 text-primary" />
                        {schedule.title}
                      </CardTitle>
                      <CardDescription>{schedule.description}</CardDescription>
                    </div>
                    <Badge variant={getStatusColor(schedule.status)}>{getStatusText(schedule.status)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="text-sm font-medium text-foreground">{schedule.area}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="text-sm font-medium text-foreground">
                          {new Date(schedule.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="text-sm font-medium text-foreground">
                          {schedule.startTime} - {schedule.endTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Affected Users</p>
                        <p className="text-sm font-medium text-orange-500">{schedule.affectedUsers.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Completed Maintenance */}
        {completedSchedules.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Recently Completed</h2>
            <div className="space-y-4">
              {completedSchedules.map((schedule) => (
                <Card key={schedule.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-muted-foreground">
                          <Wrench className="h-5 w-5" />
                          {schedule.title}
                        </CardTitle>
                        <CardDescription>{schedule.description}</CardDescription>
                      </div>
                      <Badge variant={getStatusColor(schedule.status)}>{getStatusText(schedule.status)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Location</p>
                          <p className="text-sm font-medium text-foreground">{schedule.area}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Date</p>
                          <p className="text-sm font-medium text-foreground">
                            {new Date(schedule.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Duration</p>
                          <p className="text-sm font-medium text-foreground">
                            {schedule.startTime} - {schedule.endTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Affected Users</p>
                          <p className="text-sm font-medium text-foreground">
                            {schedule.affectedUsers.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
