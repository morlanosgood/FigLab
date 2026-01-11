"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  MessageSquare,
  Check,
  X,
  Settings,
  Filter,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ConfirmDialog } from "@/components/confirm-dialog"

interface Notification {
  id: string
  type: "approval_needed" | "experiment_started" | "results_ready" | "decision_pending" | "mention" | "guardrail_alert"
  experimentId?: string
  experimentName?: string
  message: string
  actionUrl?: string
  read: boolean
  createdAt: Date
  actor?: string
}

const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "approval_needed",
    experimentId: "exp-002",
    experimentName: "Pricing Experiment",
    message: "Legal review requested for Pricing Experiment",
    actionUrl: "/experiments/exp-002",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
    actor: "Michael Torres",
  },
  {
    id: "notif-2",
    type: "results_ready",
    experimentId: "exp-001",
    experimentName: "Growth SEO Test",
    message: "Growth SEO Test has reached statistical significance",
    actionUrl: "/experiments/exp-001",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: "notif-3",
    type: "guardrail_alert",
    experimentId: "exp-003",
    experimentName: "Email Nurture Sequence",
    message: "Guardrail triggered: Bounce rate exceeded threshold",
    actionUrl: "/experiments/exp-003",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "notif-4",
    type: "experiment_started",
    experimentId: "exp-005",
    experimentName: "Brand Campaign",
    message: "Brand Campaign has started running",
    actionUrl: "/experiments/exp-005",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: "notif-5",
    type: "mention",
    message: "Sarah Chen mentioned you in a comment on Onboarding Flow V2",
    actionUrl: "/experiments/exp-004",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    actor: "Sarah Chen",
  },
  {
    id: "notif-6",
    type: "decision_pending",
    experimentId: "exp-001",
    experimentName: "Growth SEO Test",
    message: "Decision needed: Growth SEO Test is ready for rollout decision",
    actionUrl: "/experiments/exp-001",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
  {
    id: "notif-7",
    type: "approval_needed",
    experimentId: "exp-006",
    experimentName: "Checkout Flow Test",
    message: "Security review requested for Checkout Flow Test",
    actionUrl: "/experiments/exp-006",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    actor: "David Kim",
  },
  {
    id: "notif-8",
    type: "results_ready",
    experimentId: "exp-007",
    experimentName: "Mobile App Onboarding",
    message: "Mobile App Onboarding experiment completed with positive results",
    actionUrl: "/experiments/exp-007",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
  },
]

const notificationIcons: Record<Notification["type"], React.ElementType> = {
  approval_needed: Clock,
  experiment_started: Zap,
  results_ready: CheckCircle2,
  decision_pending: AlertTriangle,
  mention: MessageSquare,
  guardrail_alert: AlertTriangle,
}

const notificationColors: Record<Notification["type"], string> = {
  approval_needed: "text-chart-4 bg-chart-4/10",
  experiment_started: "text-chart-3 bg-chart-3/10",
  results_ready: "text-primary bg-primary/10",
  decision_pending: "text-chart-5 bg-chart-5/10",
  mention: "text-chart-2 bg-chart-2/10",
  guardrail_alert: "text-destructive bg-destructive/10",
}

const notificationLabels: Record<Notification["type"], string> = {
  approval_needed: "Approval Needed",
  experiment_started: "Experiment Started",
  results_ready: "Results Ready",
  decision_pending: "Decision Pending",
  mention: "Mention",
  guardrail_alert: "Guardrail Alert",
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) return `${diffMins} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [activeTab, setActiveTab] = useState("all")
  const [clearAllConfirmOpen, setClearAllConfirmOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !n.read
    return n.type === activeTab
  })

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated on experiment activity and approvals
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setClearAllConfirmOpen(true)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear all
            </Button>
          )}
          <Link href="/settings">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Preferences
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <div className="text-2xl font-bold text-foreground">{notifications.length}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <div className="text-2xl font-bold text-primary">{unreadCount}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Action Required</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-chart-5" />
              <div className="text-2xl font-bold text-chart-5">
                {notifications.filter((n) => n.type === "approval_needed" || n.type === "decision_pending").length}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-chart-4" />
              <div className="text-2xl font-bold text-foreground">
                {notifications.filter((n) => n.type === "guardrail_alert").length}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">
            Unread {unreadCount > 0 && <Badge variant="secondary" className="ml-1">{unreadCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="approval_needed">Approvals</TabsTrigger>
          <TabsTrigger value="results_ready">Results</TabsTrigger>
          <TabsTrigger value="guardrail_alert">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredNotifications.length === 0 ? (
            <Card className="border-dashed border-border bg-card">
              <CardContent className="py-12 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium text-foreground">No notifications</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeTab === "unread" ? "You're all caught up!" : "No notifications in this category"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => {
                const Icon = notificationIcons[notification.type]
                const colorClass = notificationColors[notification.type]

                return (
                  <Card
                    key={notification.id}
                    className={cn(
                      "border-border bg-card hover:border-primary/30 transition-colors",
                      !notification.read && "border-l-4 border-l-primary"
                    )}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                            colorClass
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <p
                                className={cn(
                                  "text-sm leading-snug",
                                  notification.read ? "text-muted-foreground" : "text-foreground font-medium"
                                )}
                              >
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span>{formatTimeAgo(notification.createdAt)}</span>
                                <Badge variant="outline" className="text-xs">
                                  {notificationLabels[notification.type]}
                                </Badge>
                                {notification.actor && (
                                  <span>by {notification.actor}</span>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {notification.actionUrl && (
                                <Link href={notification.actionUrl}>
                                  <Button size="sm" variant="outline">
                                    View
                                  </Button>
                                </Link>
                              )}
                              {!notification.read && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => dismissNotification(notification.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Clear all confirmation dialog */}
      <ConfirmDialog
        open={clearAllConfirmOpen}
        onOpenChange={setClearAllConfirmOpen}
        title="Clear all notifications"
        description="Are you sure you want to clear all notifications? This action cannot be undone."
        confirmLabel="Clear all"
        variant="destructive"
        onConfirm={clearAllNotifications}
      />
    </div>
  )
}
