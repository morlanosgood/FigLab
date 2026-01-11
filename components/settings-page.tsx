"use client"

import type React from "react"
import { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, AlertCircle, Database, BarChart3, Flag, Loader2, RefreshCw } from "lucide-react"

interface Integration {
  id: string
  name: string
  description: string
  status: "connected" | "disconnected" | "error"
  icon: React.ElementType
  lastSync?: string
}

const integrations: Integration[] = [
  {
    id: "gsc",
    name: "Google Search Console",
    description: "SEO performance data and search analytics",
    status: "connected",
    icon: BarChart3,
    lastSync: "2 hours ago",
  },
  {
    id: "mode",
    name: "Mode Analytics",
    description: "SQL-based business intelligence platform",
    status: "connected",
    icon: Database,
    lastSync: "5 minutes ago",
  },
  {
    id: "feature-flags",
    name: "Feature Flags",
    description: "Feature flag management and rollout control",
    status: "connected",
    icon: Flag,
    lastSync: "Just now",
  },
]

export function SettingsPage() {
  const [integrationStatuses, setIntegrationStatuses] = useState<Record<string, Integration["status"]>>({
    gsc: "connected",
    mode: "connected",
    "feature-flags": "connected",
  })
  const [configureDialogOpen, setConfigureDialogOpen] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [testingConnection, setTestingConnection] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; message: string } | null>(null)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")

  const handleTestConnection = async (integration: Integration) => {
    setTestingConnection(integration.id)
    setTestResult(null)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate success (90% chance)
    const success = Math.random() > 0.1
    setTestResult({
      id: integration.id,
      success,
      message: success ? "Connection successful!" : "Connection failed. Please check your credentials.",
    })
    setTestingConnection(null)

    // Clear result after 3 seconds
    setTimeout(() => setTestResult(null), 3000)
  }

  const handleConfigure = (integration: Integration) => {
    setSelectedIntegration(integration)
    setConfigureDialogOpen(true)
  }

  const handleInvite = () => {
    if (inviteEmail) {
      console.log("Inviting:", inviteEmail)
      setInviteEmail("")
      setInviteDialogOpen(false)
    }
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground text-balance">Settings</h1>
        <p className="text-muted-foreground mt-1">Integration status and system configuration</p>
      </div>

      {/* Integrations */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Integrations</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {integrations.map((integration) => {
            const IntegrationIcon = integration.icon
            return (
              <Card key={integration.id} className="border-border bg-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <IntegrationIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-foreground text-base">{integration.name}</CardTitle>
                        <CardDescription className="text-xs">{integration.description}</CardDescription>
                      </div>
                    </div>
                    {integration.status === "connected" ? (
                      <CheckCircle2 className="w-5 h-5 text-chart-3 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-chart-5 flex-shrink-0" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={integration.status === "connected" ? "default" : "destructive"}
                        className={
                          integration.status === "connected"
                            ? "bg-chart-3 text-white hover:bg-chart-3/90"
                            : "bg-chart-5 text-white"
                        }
                      >
                        {integration.status}
                      </Badge>
                      {integration.lastSync && (
                        <span className="text-xs text-muted-foreground">Last sync: {integration.lastSync}</span>
                      )}
                    </div>
                  </div>
                  {testResult?.id === integration.id && (
                    <div
                      className={`text-xs p-2 rounded ${
                        testResult.success
                          ? "bg-chart-3/10 text-chart-3"
                          : "bg-chart-5/10 text-chart-5"
                      }`}
                    >
                      {testResult.message}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleConfigure(integration)}
                    >
                      Configure
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleTestConnection(integration)}
                      disabled={testingConnection === integration.id}
                    >
                      {testingConnection === integration.id ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Test Connection
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Experiment Settings */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Experiment Settings</h2>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Default Configuration</CardTitle>
            <CardDescription>Global settings for all experiments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Auto-generate experiment IDs</p>
                <p className="text-xs text-muted-foreground">Automatically create unique IDs for new experiments</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Collision detection alerts</p>
                <p className="text-xs text-muted-foreground">
                  Email notifications when experiments overlap in the same locale
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Required governance approval</p>
                <p className="text-xs text-muted-foreground">Block launch until all stakeholders approve</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">AI post-mortem generation</p>
                <p className="text-xs text-muted-foreground">
                  Automatically generate insights when experiments complete
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Settings */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">In-App Notifications</CardTitle>
            <CardDescription>Real-time notifications in the FigLab interface</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Approval requests</p>
                <p className="text-xs text-muted-foreground">When experiments need your approval or review</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Results ready</p>
                <p className="text-xs text-muted-foreground">When experiments reach statistical significance</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Guardrail alerts</p>
                <p className="text-xs text-muted-foreground">When guardrails are triggered or thresholds exceeded</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Experiment started</p>
                <p className="text-xs text-muted-foreground">When your experiments begin running</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Decision pending</p>
                <p className="text-xs text-muted-foreground">When experiments are waiting for rollout decisions</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Mentions</p>
                <p className="text-xs text-muted-foreground">When someone mentions you in comments</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Email Notifications</CardTitle>
            <CardDescription>Notifications sent to your email</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Daily digest</p>
                <p className="text-xs text-muted-foreground">Summary of activity from the past 24 hours</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Weekly report</p>
                <p className="text-xs text-muted-foreground">Experiment velocity, wins, and learning density</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Critical alerts only</p>
                <p className="text-xs text-muted-foreground">Guardrail failures and urgent approvals</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Collision warnings</p>
                <p className="text-xs text-muted-foreground">When experiment conflicts are detected</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Settings */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Team & Access</h2>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Team Members</CardTitle>
            <CardDescription>Manage user roles and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-primary-foreground">
                    JD
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">John Doe (You)</p>
                    <p className="text-xs text-muted-foreground">john@figma.com</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Admin
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-chart-3 flex items-center justify-center text-xs font-semibold text-white">
                    SC
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Sarah Chen</p>
                    <p className="text-xs text-muted-foreground">sarah@figma.com</p>
                  </div>
                </div>
                <Badge variant="secondary">Growth PM</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-chart-2 flex items-center justify-center text-xs font-semibold text-white">
                    MT
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Michael Torres</p>
                    <p className="text-xs text-muted-foreground">michael@figma.com</p>
                  </div>
                </div>
                <Badge variant="secondary">Growth PM</Badge>
              </div>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => setInviteDialogOpen(true)}
              >
                Invite Team Member
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configure Integration Dialog */}
      <Dialog open={configureDialogOpen} onOpenChange={setConfigureDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure {selectedIntegration?.name}</DialogTitle>
            <DialogDescription>
              Update the settings for this integration.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="••••••••••••••••"
                defaultValue="sk-xxxxxxxxxxxx"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endpoint">Endpoint URL</Label>
              <Input
                id="endpoint"
                placeholder="https://api.example.com"
                defaultValue={
                  selectedIntegration?.id === "gsc"
                    ? "https://searchconsole.googleapis.com"
                    : selectedIntegration?.id === "mode"
                    ? "https://app.mode.com/api"
                    : "https://api.featureflags.io"
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sync-frequency">Sync Frequency</Label>
              <Input id="sync-frequency" placeholder="Every 5 minutes" defaultValue="Every 5 minutes" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigureDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setConfigureDialogOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Team Member Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your FigLab workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email Address</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite} disabled={!inviteEmail}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
