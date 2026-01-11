"use client"

import { useState } from "react"
import { Bell, CheckCircle2, Clock, AlertTriangle, Zap, MessageSquare, X, Check, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"

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
    createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
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
    createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 min ago
  },
  {
    id: "notif-3",
    type: "guardrail_alert",
    experimentId: "exp-003",
    experimentName: "Email Nurture Sequence",
    message: "Guardrail triggered: Bounce rate exceeded threshold",
    actionUrl: "/experiments/exp-003",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "notif-4",
    type: "experiment_started",
    experimentId: "exp-005",
    experimentName: "Brand Campaign",
    message: "Brand Campaign has started running",
    actionUrl: "/experiments/exp-005",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
  },
  {
    id: "notif-5",
    type: "mention",
    message: "Sarah Chen mentioned you in a comment on Onboarding Flow V2",
    actionUrl: "/experiments/exp-004",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
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
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
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

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [open, setOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs font-medium flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end" side="bottom" sideOffset={8} collisionPadding={16}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-foreground">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={markAllAsRead}
              >
                <Check className="w-3 h-3 mr-1" />
                Mark all read
              </Button>
            )}
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Notification List */}
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type]
                const colorClass = notificationColors[notification.type]

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "relative group px-4 py-3 hover:bg-muted/50 transition-colors",
                      !notification.read && "bg-primary/5"
                    )}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                          colorClass
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm leading-snug",
                            notification.read ? "text-muted-foreground" : "text-foreground"
                          )}
                        >
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation()
                              markAsRead(notification.id)
                            }}
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            dismissNotification(notification.id)
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Unread indicator */}
                      {!notification.read && (
                        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </div>

                    {/* Click to navigate */}
                    {notification.actionUrl && (
                      <Link
                        href={notification.actionUrl}
                        className="absolute inset-0"
                        onClick={() => {
                          markAsRead(notification.id)
                          setOpen(false)
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="px-4 py-2 border-t border-border">
            <Link href="/notifications" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full h-8 text-xs">
                View all notifications
              </Button>
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
