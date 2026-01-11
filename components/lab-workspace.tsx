"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { ExperimentCard } from "@/components/experiment-card"
import { CollisionCalendar } from "@/components/collision-calendar"
import { ApprovalSidePanel } from "@/components/approval-side-panel"

export interface Experiment {
  id: string
  name: string
  status: "draft" | "pending" | "approved" | "running" | "completed"
  owner: string
  locale: string
  startDate: string
  endDate: string
  approvalStatus: {
    legal: "pending" | "approved" | "red"
    brand: "pending" | "approved" | "red"
    security: "pending" | "approved" | "red"
  }
  riskLevel: "low" | "medium" | "high"
  description: string
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
  },
  {
    id: "exp-002",
    name: "Pricing Experiment",
    status: "pending",
    owner: "Michael Torres",
    locale: "Europe",
    startDate: "2024-01-20",
    endDate: "2024-02-20",
    approvalStatus: { legal: "red", brand: "approved", security: "pending" },
    riskLevel: "high",
    description: "Dynamic pricing test for premium tier",
  },
  {
    id: "exp-003",
    name: "Email Nurture Sequence",
    status: "approved",
    owner: "Jessica Park",
    locale: "North America",
    startDate: "2024-01-22",
    endDate: "2024-02-22",
    approvalStatus: { legal: "approved", brand: "approved", security: "approved" },
    riskLevel: "low",
    description: "Personalized email sequence for trial users",
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
  },
  {
    id: "exp-005",
    name: "Brand Campaign",
    status: "approved",
    owner: "Emily Watson",
    locale: "North America",
    startDate: "2024-01-18",
    endDate: "2024-02-18",
    approvalStatus: { legal: "approved", brand: "approved", security: "approved" },
    riskLevel: "low",
    description: "Brand awareness campaign for new market segment",
  },
]

export function LabWorkspace() {
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null)

  const experimentsByStatus = {
    draft: mockExperiments.filter((e) => e.status === "draft"),
    pending: mockExperiments.filter((e) => e.status === "pending"),
    approved: mockExperiments.filter((e) => e.status === "approved"),
    running: mockExperiments.filter((e) => e.status === "running"),
    completed: mockExperiments.filter((e) => e.status === "completed"),
  }

  return (
    <>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground text-balance">Lab Workspace</h1>
            <p className="text-muted-foreground mt-1">Active experiments and collision detection</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            New Experiment
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="kanban" className="w-full">
          <TabsList className="bg-muted">
            <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
            <TabsTrigger value="calendar">Collision Calendar</TabsTrigger>
          </TabsList>

          {/* Kanban Board */}
          <TabsContent value="kanban" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Draft */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Draft</h3>
                  <Badge variant="secondary" className="text-xs">
                    {experimentsByStatus.draft.length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {experimentsByStatus.draft.map((exp) => (
                    <ExperimentCard key={exp.id} experiment={exp} onClick={() => setSelectedExperiment(exp)} />
                  ))}
                </div>
              </div>

              {/* Pending Approval */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Pending Approval</h3>
                  <Badge variant="secondary" className="text-xs">
                    {experimentsByStatus.pending.length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {experimentsByStatus.pending.map((exp) => (
                    <ExperimentCard key={exp.id} experiment={exp} onClick={() => setSelectedExperiment(exp)} />
                  ))}
                </div>
              </div>

              {/* Approved */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Approved</h3>
                  <Badge variant="secondary" className="text-xs">
                    {experimentsByStatus.approved.length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {experimentsByStatus.approved.map((exp) => (
                    <ExperimentCard key={exp.id} experiment={exp} onClick={() => setSelectedExperiment(exp)} />
                  ))}
                </div>
              </div>

              {/* Running */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Running</h3>
                  <Badge variant="secondary" className="text-xs">
                    {experimentsByStatus.running.length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {experimentsByStatus.running.map((exp) => (
                    <ExperimentCard key={exp.id} experiment={exp} onClick={() => setSelectedExperiment(exp)} />
                  ))}
                </div>
              </div>

              {/* Completed */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Completed</h3>
                  <Badge variant="secondary" className="text-xs">
                    {experimentsByStatus.completed.length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {experimentsByStatus.completed.map((exp) => (
                    <ExperimentCard key={exp.id} experiment={exp} onClick={() => setSelectedExperiment(exp)} />
                  ))}
                  {experimentsByStatus.completed.length === 0 && (
                    <Card className="border-dashed border-border bg-card/50">
                      <CardContent className="pt-6 pb-6 text-center">
                        <p className="text-sm text-muted-foreground">No completed experiments</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Collision Calendar */}
          <TabsContent value="calendar" className="mt-6">
            <CollisionCalendar experiments={mockExperiments} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Approval Side Panel */}
      {selectedExperiment && (
        <ApprovalSidePanel experiment={selectedExperiment} onClose={() => setSelectedExperiment(null)} />
      )}
    </>
  )
}
