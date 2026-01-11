"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShieldCheck, ShieldAlert, Clock, CheckCircle2, XCircle, User, Calendar, AlertTriangle } from "lucide-react"

interface ApprovalTask {
  id: string
  experimentName: string
  submitter: string
  submittedDate: string
  riskLevel: "low" | "medium" | "high"
  stakeholder: "legal" | "brand" | "security"
  status: "pending" | "approved" | "rejected"
  description: string
  dataPrivacyImpact: string
  urgency: "low" | "medium" | "high"
}

const mockTasks: ApprovalTask[] = [
  {
    id: "task-001",
    experimentName: "Pricing Experiment",
    submitter: "Michael Torres",
    submittedDate: "2024-01-18",
    riskLevel: "high",
    stakeholder: "legal",
    status: "pending",
    description: "Dynamic pricing test for premium tier across EU markets",
    dataPrivacyImpact: "High - Involves processing payment data and user behavior patterns",
    urgency: "high",
  },
  {
    id: "task-002",
    experimentName: "Email Personalization V2",
    submitter: "Jessica Park",
    submittedDate: "2024-01-17",
    riskLevel: "medium",
    stakeholder: "brand",
    status: "pending",
    description: "Advanced email personalization using browsing history",
    dataPrivacyImpact: "Medium - Uses anonymized browsing data for segmentation",
    urgency: "medium",
  },
  {
    id: "task-003",
    experimentName: "Third-Party Integration",
    submitter: "David Kim",
    submittedDate: "2024-01-16",
    riskLevel: "high",
    stakeholder: "security",
    status: "pending",
    description: "Integration with external analytics provider for attribution",
    dataPrivacyImpact: "High - Shares user identifiers with third-party service",
    urgency: "high",
  },
  {
    id: "task-004",
    experimentName: "Landing Page Copy Test",
    submitter: "Sarah Chen",
    submittedDate: "2024-01-15",
    riskLevel: "low",
    stakeholder: "brand",
    status: "approved",
    description: "A/B test of hero section copy for SEO landing pages",
    dataPrivacyImpact: "Low - No data collection, pure copy changes",
    urgency: "low",
  },
  {
    id: "task-005",
    experimentName: "Social Login Options",
    submitter: "Emily Watson",
    submittedDate: "2024-01-14",
    riskLevel: "medium",
    stakeholder: "security",
    status: "approved",
    description: "Adding Google and Apple sign-in options",
    dataPrivacyImpact: "Medium - OAuth tokens stored, but handled by providers",
    urgency: "medium",
  },
  {
    id: "task-006",
    experimentName: "User Location Tracking",
    submitter: "Alex Johnson",
    submittedDate: "2024-01-13",
    riskLevel: "high",
    stakeholder: "legal",
    status: "rejected",
    description: "Continuous GPS tracking for location-based features",
    dataPrivacyImpact: "Critical - Continuous location tracking without clear user benefit",
    urgency: "low",
  },
]

export function GovernanceHub() {
  const [selectedTask, setSelectedTask] = useState<ApprovalTask | null>(null)

  const pendingTasks = mockTasks.filter((t) => t.status === "pending")
  const approvedTasks = mockTasks.filter((t) => t.status === "approved")
  const rejectedTasks = mockTasks.filter((t) => t.status === "rejected")

  return (
    <>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">Governance Hub</h1>
          <p className="text-muted-foreground mt-1">Approval queue for Legal, Brand, and Security stakeholders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
                <Clock className="w-4 h-4 text-chart-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{pendingTasks.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">High Priority</CardTitle>
                <AlertTriangle className="w-4 h-4 text-chart-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-5">
                {pendingTasks.filter((t) => t.urgency === "high").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Urgent reviews needed</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
                <CheckCircle2 className="w-4 h-4 text-chart-3" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-3">{approvedTasks.length}</div>
              <p className="text-xs text-muted-foreground mt-1">This week</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
                <XCircle className="w-4 h-4 text-chart-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{rejectedTasks.length}</div>
              <p className="text-xs text-muted-foreground mt-1">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Approval Queue Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="bg-muted">
            <TabsTrigger value="pending">Pending ({pendingTasks.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedTasks.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedTasks.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6 space-y-4">
            {pendingTasks.map((task) => (
              <Card
                key={task.id}
                className="border-border bg-card cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setSelectedTask(task)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <CardTitle className="text-foreground">{task.experimentName}</CardTitle>
                        <Badge
                          variant="secondary"
                          className={
                            task.riskLevel === "high"
                              ? "bg-chart-5/10 text-chart-5"
                              : task.riskLevel === "medium"
                                ? "bg-chart-4/10 text-chart-4"
                                : "bg-chart-3/10 text-chart-3"
                          }
                        >
                          {task.riskLevel.toUpperCase()} RISK
                        </Badge>
                        {task.urgency === "high" && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            URGENT
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{task.submitter}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(task.submittedDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {task.stakeholder === "legal" && <ShieldAlert className="w-4 h-4 text-chart-5" />}
                          {task.stakeholder === "brand" && <ShieldCheck className="w-4 h-4 text-chart-4" />}
                          {task.stakeholder === "security" && <ShieldAlert className="w-4 h-4 text-chart-4" />}
                          <span className="capitalize">{task.stakeholder} Review</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0">
                      Review
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
                  <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border">
                    <p className="text-xs font-semibold text-foreground mb-1">Data Privacy Impact:</p>
                    <p className="text-xs text-muted-foreground">{task.dataPrivacyImpact}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="approved" className="mt-6 space-y-4">
            {approvedTasks.map((task) => (
              <Card key={task.id} className="border-chart-3 bg-chart-3/5">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <CheckCircle2 className="w-5 h-5 text-chart-3" />
                        <CardTitle className="text-foreground">{task.experimentName}</CardTitle>
                        <Badge
                          variant="secondary"
                          className={
                            task.riskLevel === "high"
                              ? "bg-chart-5/10 text-chart-5"
                              : task.riskLevel === "medium"
                                ? "bg-chart-4/10 text-chart-4"
                                : "bg-chart-3/10 text-chart-3"
                          }
                        >
                          {task.riskLevel.toUpperCase()} RISK
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{task.submitter}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Approved{" "}
                            {new Date(task.submittedDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="rejected" className="mt-6 space-y-4">
            {rejectedTasks.map((task) => (
              <Card key={task.id} className="border-chart-5 bg-chart-5/5">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <XCircle className="w-5 h-5 text-chart-5" />
                        <CardTitle className="text-foreground">{task.experimentName}</CardTitle>
                        <Badge variant="destructive">{task.riskLevel.toUpperCase()} RISK</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{task.submitter}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Rejected{" "}
                            {new Date(task.submittedDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
                  <div className="mt-3 p-3 rounded-lg bg-chart-5/10 border border-chart-5">
                    <p className="text-xs font-semibold text-chart-5 mb-1">Rejection Reason:</p>
                    <p className="text-xs text-muted-foreground">{task.dataPrivacyImpact}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
