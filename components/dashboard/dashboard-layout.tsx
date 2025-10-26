"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, Zap } from "lucide-react"
import { useState } from "react"
import NotificationBell from "./notification-bell"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-card border-r border-border transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Power Outage</h2>
              </div>
            ) : (
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 hover:bg-muted rounded-lg transition-colors ${!sidebarOpen ? "hidden" : ""}`}
            >
              <Menu className="h-5 w-5 text-foreground" />
            </button>
          </div>
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full mt-2 p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5 text-foreground mx-auto" />
            </button>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink href="/dashboard" label="Dashboard" open={sidebarOpen} />
          {user?.userType === "ADMIN" && <NavLink href="/admin/dashboard" label="Admin Panel" open={sidebarOpen} />}
          <NavLink href="/state-info" label="State Info" open={sidebarOpen} />
          <NavLink href="/areas" label="Service Areas" open={sidebarOpen} />
          <NavLink href="/emergency" label="Emergency" open={sidebarOpen} />
          <NavLink href="/maintenance" label="Maintenance" open={sidebarOpen} />
          <NavLink href="/notifications" label="Notifications" open={sidebarOpen} />
        </nav>

        <div className="p-4 border-t border-border">
          {sidebarOpen ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{user?.username}</p>
                  <p className="text-xs text-muted-foreground">{user?.userType}</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full justify-center gap-2 bg-transparent"
                size="sm"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mx-auto mb-3">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full justify-center bg-transparent p-2"
                size="sm"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div></div>
          <NotificationBell />
        </div>
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}

interface NavLinkProps {
  href: string
  label: string
  open: boolean
}

function NavLink({ href, label, open }: NavLinkProps) {
  const router = useRouter()
  const isActive = typeof window !== "undefined" && window.location.pathname === href

  return (
    <button
      onClick={() => router.push(href)}
      className={`w-full px-4 py-2 rounded-lg transition-colors text-left ${
        isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
      }`}
      title={!open ? label : undefined}
    >
      {open ? label : label.charAt(0)}
    </button>
  )
}
