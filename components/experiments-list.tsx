"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Plus,
  Search,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  User,
  MapPin,
  ChevronRight,
  Zap,
  Target,
  BarChart3,
} from "lucide-react"
import { QuickCreateWizard } from "@/components/quick-create-wizard"

export interface Experiment {
  id: string
  name: string
  status: "draft" | "pending_approval" | "approved" | "running" | "completed" | "stopped"
  owner: string
  locale: string
  startDate: string
  endDate: string
  approvalStatus: {
    legal: "pending" | "approved" | "rejected"
    brand: "pending" | "approved" | "rejected"
    security: "pending" | "approved" | "rejected"
  }
  riskLevel: "low" | "medium" | "high"
  description: string
  hypothesis?: string
  primaryMetric?: string
  currentLift?: number
  daysRemaining?: number
  sourceInsightId?: string
}

const mockExperiments: Experiment[] = [
  {
    id: "exp-001",
    name: "Growth SEO Test",
    status: "running",
    owner: "Sarah Chen",
    locale: "North America",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    approvalStatus: { legal: "approved", brand: "approved", security: "approved" },
    riskLevel: "low",
    description: "Testing new SEO landing page variations for organic traffic",
    hypothesis: "Optimized meta descriptions will increase organic CTR by 15%",
    primaryMetric: "Organic CTR",
    currentLift: 4.2,
    daysRemaining: 12,
  },
  {
    id: "exp-002",
    name: "Pricing Experiment",
    status: "pending_approval",
    owner: "Michael Torres",
    locale: "Europe",
    startDate: "2024-01-20",
    endDate: "2024-02-20",
    approvalStatus: { legal: "rejected", brand: "approved", security: "pending" },
    riskLevel: "high",
    description: "Dynamic pricing test for premium tier",
    hypothesis: "Personalized pricing will increase conversion by 10%",
    primaryMetric: "Conversion Rate",
  },
  {
    id: "exp-003",
    name: "Email Nurture Sequence",
    status: "running",
    owner: "Jessica Park",
    locale: "North America",
    startDate: "2024-01-22",
    endDate: "2024-02-22",
    approvalStatus: { legal: "approved", brand: "approved", security: "approved" },
    riskLevel: "low",
    description: "Personalized email sequence for trial users",
    hypothesis: "Personalized onboarding emails will increase Day-7 activation by 20%",
    primaryMetric: "Day-7 Activation",
    currentLift: 1.8,
    daysRemaining: 8,
  },
  {
    id: "exp-004",
    name: "Onboarding Flow V2",
    status: "draft",
    owner: "David Kim",
    locale: "Asia Pacific",
    startDate: "2024-01-25",
    endDate: "2024-02-25",
    approvalStatus: { legal: "pending", brand: "pending", security: "pending" },
    riskLevel: "medium",
    description: "Streamlined onboarding with progressive disclosure",
    hypothesis: "Simplified onboarding will increase completion rate by 25%",
    primaryMetric: "Onboarding Completion",
  },
  {
    id: "exp-005",
    name: "Mobile Checkout Optimization",
    status: "running",
    owner: "Emily Watson",
    locale: "North America",
    startDate: "2024-01-18",
    endDate: "2024-02-18",
    approvalStatus: { legal: "approved", brand: "approved", security: "approved" },
    riskLevel: "low",
    description: "Optimized checkout flow for mobile devices",
    hypothesis: "One-tap checkout will increase mobile conversion by 15%",
    primaryMetric: "Mobile Conversion",
    currentLift: 8.5,
    daysRemaining: 3,
  },
  {
    id: "exp-006",
    name: "Social Proof Banners",
    status: "running",
    owner: "Sarah Chen",
    locale: "Global",
    startDate: "2024-01-20",
    endDate: "2024-02-28",
    approvalStatus: { legal: "approved", brand: "approved", security: "approved" },
    riskLevel: "low",
    description: "Testing social proof messaging on product pages",
    hypothesis: "Real-time activity banners will increase add-to-cart by 8%",
    primaryMetric: "Add to Cart Rate",
    currentLift: -0.3,
    daysRemaining: 19,
  },
  {
    id: "exp-007",
    name: "UK ID Verification Alternative",
    status: "approved",
    owner: "David Kim",
    locale: "United Kingdom",
    startDate: "2024-01-28",
    endDate: "2024-02-28",
    approvalStatus: { legal: "approved", brand: "approved", security: "approved" },
    riskLevel: "medium",
    description: "Testing alternative ID verification methods for UK students",
    hypothesis: "Adding passport option will reduce UK drop-off by 30%",
    primaryMetric: "UK Verification Rate",
    sourceInsightId: "insight-002",
  },
]

export function ExperimentsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [ownerFilter, setOwnerFilter] = useState<string>("all")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const filteredExperiments = mockExperiments.filter((exp) => {
    const matchesSearch = exp.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || exp.status === statusFilter
    const matchesOwner = ownerFilter === "all" || exp.owner === ownerFilter
    return matchesSearch && matchesStatus && matchesOwner
  })

  const experimentsByStatus = {
    running: filteredExperiments.filter((e) => e.status === "running"),
    pending_approval: filteredExperiments.filter((e) => e.status === "pending_approval"),
    approved: filteredExperiments.filter((e) => e.status === "approved"),
    draft: filteredExperiments.filter((e) => e.status === "draft"),
    completed: filteredExperiments.filter((e) => e.status === "completed"),
  }

  const owners = Array.from(new Set(mockExperiments.map((e) => e.owner)))

  // Calculate stats
  const stats = {
    velocity: 12.4,
    velocityChange: 18,
    winRate: 68,
    activeExperiments: mockExperiments.filter((e) => e.status === "running").length,
    pendingApprovals: mockExperiments.filter((e) => e.status === "pending_approval").length,
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Experiments</h1>
          <p className="text-muted-foreground mt-1">
            Manage your experiment portfolio and track results
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Experiment
        </Button>
      </div>

      {/* Create Experiment Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Experiment</DialogTitle>
          </DialogHeader>
          <QuickCreateWizard
            onComplete={(experiment) => {
              console.log("New experiment created:", experiment)
              setCreateDialogOpen(false)
              // In production, this would save to API and refresh the list
            }}
            onCancel={() => setCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Experiment Velocity
              </CardTitle>
              <Zap className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.velocity}</div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="w-3 h-3 text-chart-3" />
              <span className="text-chart-3">+{stats.velocityChange}%</span>
              <span className="text-muted-foreground">vs last quarter</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
              <Target className="w-4 h-4 text-chart-3" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.winRate}%</div>
            <Progress value={stats.winRate} className="h-1.5 mt-2" />
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Running Now
              </CardTitle>
              <div className="w-2 h-2 rounded-full bg-chart-3 animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.activeExperiments}</div>
            <p className="text-xs text-muted-foreground">Active experiments</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Approval
              </CardTitle>
              <AlertTriangle className="w-4 h-4 text-chart-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search experiments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px] bg-card border-border">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="pending_approval">Pending Approval</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={ownerFilter} onValueChange={setOwnerFilter}>
          <SelectTrigger className="w-full md:w-[180px] bg-card border-border">
            <SelectValue placeholder="Owner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Owners</SelectItem>
            {owners.map((owner) => (
              <SelectItem key={owner} value={owner}>
                {owner}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Experiment Groups */}
      <div className="space-y-6">
        {/* Running Experiments */}
        {experimentsByStatus.running.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-chart-3 animate-pulse" />
              <h2 className="text-sm font-semibold text-foreground">
                Running ({experimentsByStatus.running.length})
              </h2>
            </div>
            <div className="grid gap-3">
              {experimentsByStatus.running.map((exp) => (
                <ExperimentCard key={exp.id} experiment={exp} />
              ))}
            </div>
          </div>
        )}

        {/* Pending Approval */}
        {experimentsByStatus.pending_approval.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-chart-4" />
              <h2 className="text-sm font-semibold text-foreground">
                Pending Approval ({experimentsByStatus.pending_approval.length})
              </h2>
            </div>
            <div className="grid gap-3">
              {experimentsByStatus.pending_approval.map((exp) => (
                <ExperimentCard key={exp.id} experiment={exp} />
              ))}
            </div>
          </div>
        )}

        {/* Approved - Ready to Launch */}
        {experimentsByStatus.approved.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-chart-3" />
              <h2 className="text-sm font-semibold text-foreground">
                Ready to Launch ({experimentsByStatus.approved.length})
              </h2>
            </div>
            <div className="grid gap-3">
              {experimentsByStatus.approved.map((exp) => (
                <ExperimentCard key={exp.id} experiment={exp} />
              ))}
            </div>
          </div>
        )}

        {/* Drafts */}
        {experimentsByStatus.draft.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">
                Drafts ({experimentsByStatus.draft.length})
              </h2>
            </div>
            <div className="grid gap-3">
              {experimentsByStatus.draft.map((exp) => (
                <ExperimentCard key={exp.id} experiment={exp} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredExperiments.length === 0 && (
          <Card className="border-dashed border-border">
            <CardContent className="py-12 text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground">No experiments found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function ExperimentCard({ experiment }: { experiment: Experiment }) {
  const hasBlockingApproval =
    experiment.approvalStatus.legal === "rejected" ||
    experiment.approvalStatus.brand === "rejected" ||
    experiment.approvalStatus.security === "rejected"

  const pendingApprovals = [
    experiment.approvalStatus.legal === "pending" && "Legal",
    experiment.approvalStatus.brand === "pending" && "Brand",
    experiment.approvalStatus.security === "pending" && "Security",
  ].filter(Boolean)

  return (
    <Link href={`/experiments/${experiment.id}`}>
      <Card className="border-border bg-card hover:border-primary/50 transition-colors cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-2">
              {/* Title Row */}
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-foreground">{experiment.name}</h3>
                <Badge
                  variant="secondary"
                  className={
                    experiment.riskLevel === "high"
                      ? "bg-chart-5/10 text-chart-5"
                      : experiment.riskLevel === "medium"
                      ? "bg-chart-4/10 text-chart-4"
                      : "bg-chart-3/10 text-chart-3"
                  }
                >
                  {experiment.riskLevel.toUpperCase()}
                </Badge>
                {experiment.sourceInsightId && (
                  <Badge variant="outline" className="text-xs">
                    <Lightbulb className="w-3 h-3 mr-1" />
                    From Insight
                  </Badge>
                )}
              </div>

              {/* Hypothesis */}
              {experiment.hypothesis && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {experiment.hypothesis}
                </p>
              )}

              {/* Metadata */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{experiment.owner}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{experiment.locale}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(experiment.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {experiment.primaryMetric && (
                  <div className="flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" />
                    <span>{experiment.primaryMetric}</span>
                  </div>
                )}
              </div>

              {/* Approval Status for Pending */}
              {experiment.status === "pending_approval" && (
                <div className="flex items-center gap-2 flex-wrap">
                  {hasBlockingApproval && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Blocked
                    </Badge>
                  )}
                  {pendingApprovals.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      Waiting: {pendingApprovals.join(", ")}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Right Side - Metrics or Status */}
            <div className="flex items-center gap-4">
              {experiment.status === "running" && experiment.currentLift !== undefined && (
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    {experiment.currentLift > 0 ? (
                      <TrendingUp className="w-4 h-4 text-chart-3" />
                    ) : experiment.currentLift < 0 ? (
                      <TrendingDown className="w-4 h-4 text-chart-5" />
                    ) : (
                      <Minus className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span
                      className={`text-lg font-bold ${
                        experiment.currentLift > 0
                          ? "text-chart-3"
                          : experiment.currentLift < 0
                          ? "text-chart-5"
                          : "text-muted-foreground"
                      }`}
                    >
                      {experiment.currentLift > 0 ? "+" : ""}
                      {experiment.currentLift}%
                    </span>
                  </div>
                  {experiment.daysRemaining !== undefined && (
                    <p className="text-xs text-muted-foreground">
                      {experiment.daysRemaining} days left
                    </p>
                  )}
                </div>
              )}
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// Re-export for backward compatibility
import { Lightbulb } from "lucide-react"
