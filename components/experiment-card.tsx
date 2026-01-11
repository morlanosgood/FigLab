"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Calendar, ShieldAlert, ShieldCheck } from "lucide-react"
import type { Experiment } from "@/components/lab-workspace"

interface ExperimentCardProps {
  experiment: Experiment
  onClick: () => void
}

export function ExperimentCard({ experiment, onClick }: ExperimentCardProps) {
  const hasBlockingIssue = Object.values(experiment.approvalStatus).includes("red")
  const needsApproval = Object.values(experiment.approvalStatus).includes("pending")

  return (
    <Card className="border-border bg-card cursor-pointer hover:border-primary/50 transition-colors" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-foreground leading-tight">{experiment.name}</h4>
          {hasBlockingIssue && <AlertTriangle className="w-4 h-4 text-chart-5 flex-shrink-0" />}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className={
              experiment.riskLevel === "high"
                ? "bg-chart-5/10 text-chart-5 hover:bg-chart-5/20"
                : experiment.riskLevel === "medium"
                  ? "bg-chart-4/10 text-chart-4 hover:bg-chart-4/20"
                  : "bg-chart-3/10 text-chart-3 hover:bg-chart-3/20"
            }
          >
            {experiment.riskLevel}
          </Badge>
          <span className="text-xs text-muted-foreground">{experiment.locale}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>
            {new Date(experiment.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
            {new Date(experiment.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {experiment.approvalStatus.legal === "approved" && (
            <ShieldCheck className="w-3 h-3 text-chart-3" title="Legal Approved" />
          )}
          {experiment.approvalStatus.legal === "red" && (
            <ShieldAlert className="w-3 h-3 text-chart-5" title="Legal Blocked" />
          )}
          {experiment.approvalStatus.brand === "approved" && (
            <ShieldCheck className="w-3 h-3 text-chart-3" title="Brand Approved" />
          )}
          {experiment.approvalStatus.brand === "red" && (
            <ShieldAlert className="w-3 h-3 text-chart-5" title="Brand Blocked" />
          )}
          {experiment.approvalStatus.security === "approved" && (
            <ShieldCheck className="w-3 h-3 text-chart-3" title="Security Approved" />
          )}
          {experiment.approvalStatus.security === "red" && (
            <ShieldAlert className="w-3 h-3 text-chart-5" title="Security Blocked" />
          )}
        </div>
        <p className="text-xs text-muted-foreground">Owner: {experiment.owner}</p>
      </CardContent>
    </Card>
  )
}
