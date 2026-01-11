"use client"

import { TheBriefing } from "@/components/dashboard/the-briefing"
import { VelocityCard } from "@/components/dashboard/velocity-card"
import { ImpactCard } from "@/components/dashboard/impact-card"
import { FocusCard } from "@/components/dashboard/focus-card"
import { AttentionRequired } from "@/components/dashboard/attention-required"
import { CoverageMap } from "@/components/dashboard/coverage-map"

// Mock data for the dashboard
const mockBriefingBullets = [
  { type: "win" as const, text: "2 experiments shipped this week with +$480K combined impact (SEO Landing Page, Email Personalization)" },
  { type: "blocker" as const, text: "Pricing Test blocked for 3 days awaiting Legal review — high priority" },
  { type: "velocity" as const, text: "Velocity on track at 12.4/week vs 10 target — 18% above goal" },
]

const mockVelocityData = {
  currentWeekly: 12.4,
  target: 10,
  trend: [8, 9, 11, 10, 12, 11, 13, 12.4],
}

const mockImpactData = {
  cumulativeValue: 2400000,
  unit: "currency" as const,
  quarterlyGoal: 3000000,
  period: "Q1 2024",
}

const mockPriorities = [
  { name: "EDU Growth", experimentCount: 5, status: "covered" as const },
  { name: "Enterprise", experimentCount: 6, status: "covered" as const },
  { name: "Virality", experimentCount: 0, status: "gap" as const },
  { name: "Monetization", experimentCount: 7, status: "covered" as const },
  { name: "Mobile", experimentCount: 1, status: "partial" as const },
]

const mockAttentionItems = [
  {
    id: "attn-1",
    type: "blocked" as const,
    experimentName: "Pricing Test EU",
    experimentId: "exp-001",
    context: "Waiting on Legal review for GDPR compliance",
    age: "3 days",
    priority: "high" as const,
  },
  {
    id: "attn-2",
    type: "ready_to_ship" as const,
    experimentName: "SEO Landing Page V2",
    experimentId: "exp-002",
    context: "+23% conversion lift, statistically significant",
    age: "Ready since Jan 15",
    priority: "high" as const,
  },
  {
    id: "attn-3",
    type: "stale" as const,
    experimentName: "Email Nurture Sequence",
    experimentId: "exp-003",
    context: "Running for 45 days without decision",
    age: "45 days",
    priority: "medium" as const,
  },
  {
    id: "attn-4",
    type: "guardrail" as const,
    experimentName: "Checkout Flow Test",
    experimentId: "exp-004",
    context: "Error rate approaching 2% threshold (currently 1.8%)",
    age: "Alert triggered 2h ago",
    priority: "high" as const,
  },
]

const mockCoverageData = {
  priorities: ["EDU Growth", "Enterprise", "Virality", "Monetization", "Mobile"],
  funnelStages: ["Acquisition", "Activation", "Retention", "Revenue"],
  matrix: {
    "EDU Growth": {
      Acquisition: { experimentCount: 3, winRate: 67, status: "covered" as const },
      Activation: { experimentCount: 2, winRate: 50, status: "active" as const },
      Retention: { experimentCount: 0, winRate: 0, status: "gap" as const },
      Revenue: { experimentCount: 0, winRate: 0, status: "gap" as const },
    },
    Enterprise: {
      Acquisition: { experimentCount: 1, winRate: 100, status: "active" as const },
      Activation: { experimentCount: 2, winRate: 50, status: "active" as const },
      Retention: { experimentCount: 2, winRate: 50, status: "active" as const },
      Revenue: { experimentCount: 1, winRate: 0, status: "active" as const },
    },
    Virality: {
      Acquisition: { experimentCount: 0, winRate: 0, status: "gap" as const },
      Activation: { experimentCount: 0, winRate: 0, status: "gap" as const },
      Retention: { experimentCount: 0, winRate: 0, status: "gap" as const },
      Revenue: { experimentCount: 0, winRate: 0, status: "gap" as const },
    },
    Monetization: {
      Acquisition: { experimentCount: 1, winRate: 100, status: "active" as const },
      Activation: { experimentCount: 1, winRate: 0, status: "active" as const },
      Retention: { experimentCount: 2, winRate: 100, status: "covered" as const },
      Revenue: { experimentCount: 3, winRate: 33, status: "covered" as const },
    },
    Mobile: {
      Acquisition: { experimentCount: 1, winRate: 100, status: "active" as const },
      Activation: { experimentCount: 0, winRate: 0, status: "gap" as const },
      Retention: { experimentCount: 0, winRate: 0, status: "gap" as const },
      Revenue: { experimentCount: 0, winRate: 0, status: "gap" as const },
    },
  },
}

export function Dashboard() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Growth Dashboard</h1>
        <p className="text-muted-foreground mt-1">Executive view of experiment velocity and impact</p>
      </div>

      {/* The Briefing */}
      <TheBriefing bullets={mockBriefingBullets} generatedAt={new Date()} />

      {/* Three Questions Scorecard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <VelocityCard
          currentWeekly={mockVelocityData.currentWeekly}
          target={mockVelocityData.target}
          trend={mockVelocityData.trend}
        />
        <ImpactCard
          cumulativeValue={mockImpactData.cumulativeValue}
          unit={mockImpactData.unit}
          quarterlyGoal={mockImpactData.quarterlyGoal}
          period={mockImpactData.period}
        />
        <FocusCard priorities={mockPriorities} />
      </div>

      {/* Coverage Map & Attention Required */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CoverageMap data={mockCoverageData} compact={true} />
        <AttentionRequired items={mockAttentionItems} />
      </div>
    </div>
  )
}
