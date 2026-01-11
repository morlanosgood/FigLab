"use client"

import type React from "react"
import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FlaskConical,
  Lightbulb,
  BookOpen,
  BarChart3,
  Settings,
  Zap,
  Search,
  Clock,
  AlertCircle,
  LineChart,
  Map,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CommandPalette } from "@/components/command-palette"
import { NotificationsDropdown } from "@/components/notifications-dropdown"

const navigation = [
  { name: "Experiments", href: "/", icon: FlaskConical, description: "Active experiments & portfolio" },
  { name: "Roadmap", href: "/roadmap", icon: Map, description: "Prioritization & scheduling" },
  { name: "Strategy", href: "/strategy", icon: Target, description: "OKR alignment & coverage" },
  { name: "Insights", href: "/insights", icon: Lightbulb, description: "Data-driven observations" },
  { name: "Metrics", href: "/metrics", icon: LineChart, description: "Metric catalog & goals" },
  { name: "Library", href: "/library", icon: BookOpen, description: "Templates & past learnings" },
  { name: "Reports", href: "/reports", icon: BarChart3, description: "Portfolio metrics & analytics" },
  { name: "Settings", href: "/settings", icon: Settings, description: "Integrations & configuration" },
]

// Mock experiments data for sidebar stats (in production, this would come from a shared store or API)
const mockExperimentsForStats = [
  { id: "exp-001", status: "running" },
  { id: "exp-002", status: "pending_approval" },
  { id: "exp-003", status: "running" },
  { id: "exp-004", status: "draft" },
  { id: "exp-005", status: "running" },
  { id: "exp-006", status: "running" },
  { id: "exp-007", status: "approved" },
]

export function FigLabLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  // Calculate stats dynamically
  const sidebarStats = useMemo(() => ({
    runningExperiments: mockExperimentsForStats.filter((e) => e.status === "running").length,
    pendingApprovals: mockExperimentsForStats.filter((e) => e.status === "pending_approval").length,
  }), [])

  // Check if current path starts with the nav item href (for nested routes)
  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return pathname === "/" || pathname.startsWith("/experiments")
    }
    return pathname.startsWith(href)
  }

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">FigLab</h1>
            <p className="text-xs text-muted-foreground">Growth OS</p>
          </div>
        </div>

        {/* Quick Search */}
        <div className="p-4 border-b border-border">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            <Search className="w-4 h-4" />
            <span className="flex-1 text-left">Search...</span>
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="px-4 py-3 border-b border-border">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-chart-3/10">
              <Clock className="w-3.5 h-3.5 text-chart-3" />
              <span className="text-xs font-medium text-chart-3">{sidebarStats.runningExperiments} Running</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-chart-4/10">
              <AlertCircle className="w-3.5 h-3.5 text-chart-4" />
              <span className="text-xs font-medium text-chart-4">{sidebarStats.pendingApprovals} Pending</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = isActiveRoute(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="w-5 h-5" />
                <div className="flex-1 min-w-0">
                  <span className="block">{item.name}</span>
                  {!isActive && (
                    <span className="block text-xs text-muted-foreground font-normal truncate">
                      {item.description}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-primary-foreground">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">Growth PM</p>
            </div>
            <NotificationsDropdown />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>

      {/* Command Palette */}
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
    </div>
  )
}
