"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ShieldCheck, ShieldAlert, AlertCircle, Calendar, User } from "lucide-react"
import type { Experiment } from "@/components/lab-workspace"

interface ApprovalSidePanelProps {
  experiment: Experiment
  onClose: () => void
}

export function ApprovalSidePanel({ experiment, onClose }: ApprovalSidePanelProps) {
  const hasBlockingIssue = Object.values(experiment.approvalStatus).includes("red")

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Side Panel */}
      <div className="fixed right-0 top-0 h-screen w-[480px] bg-card border-l border-border z-50 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground">{experiment.name}</h2>
              <p className="text-sm text-muted-foreground">{experiment.id}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Risk Badge */}
          <div>
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
              {experiment.riskLevel.toUpperCase()} RISK
            </Badge>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{experiment.description}</p>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Details</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Owner:</span>
                <span className="text-foreground font-medium">{experiment.owner}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Timeline:</span>
                <span className="text-foreground font-medium">
                  {new Date(experiment.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
                  {new Date(experiment.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Locale:</span>
                <span className="text-foreground font-medium">{experiment.locale}</span>
              </div>
            </div>
          </div>

          {/* Approval Flow */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Approval Flow</h3>
            <div className="space-y-3">
              {/* Legal */}
              <div
                className={`p-4 rounded-lg border ${
                  experiment.approvalStatus.legal === "red"
                    ? "border-chart-5 bg-chart-5/5"
                    : experiment.approvalStatus.legal === "approved"
                      ? "border-chart-3 bg-chart-3/5"
                      : "border-border bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {experiment.approvalStatus.legal === "red" ? (
                      <ShieldAlert className="w-5 h-5 text-chart-5" />
                    ) : experiment.approvalStatus.legal === "approved" ? (
                      <ShieldCheck className="w-5 h-5 text-chart-3" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-muted-foreground" />
                    )}
                    <span className="font-semibold text-foreground">Legal</span>
                  </div>
                  <Badge
                    variant={
                      experiment.approvalStatus.legal === "red"
                        ? "destructive"
                        : experiment.approvalStatus.legal === "approved"
                          ? "default"
                          : "secondary"
                    }
                    className={
                      experiment.approvalStatus.legal === "approved" ? "bg-chart-3 text-white hover:bg-chart-3/90" : ""
                    }
                  >
                    {experiment.approvalStatus.legal}
                  </Badge>
                </div>
                {experiment.approvalStatus.legal === "red" && (
                  <p className="text-sm text-chart-5 mt-2">Data privacy concern requiring immediate review</p>
                )}
              </div>

              {/* Brand */}
              <div
                className={`p-4 rounded-lg border ${
                  experiment.approvalStatus.brand === "red"
                    ? "border-chart-5 bg-chart-5/5"
                    : experiment.approvalStatus.brand === "approved"
                      ? "border-chart-3 bg-chart-3/5"
                      : "border-border bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {experiment.approvalStatus.brand === "red" ? (
                      <ShieldAlert className="w-5 h-5 text-chart-5" />
                    ) : experiment.approvalStatus.brand === "approved" ? (
                      <ShieldCheck className="w-5 h-5 text-chart-3" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-muted-foreground" />
                    )}
                    <span className="font-semibold text-foreground">Brand</span>
                  </div>
                  <Badge
                    variant={
                      experiment.approvalStatus.brand === "red"
                        ? "destructive"
                        : experiment.approvalStatus.brand === "approved"
                          ? "default"
                          : "secondary"
                    }
                    className={
                      experiment.approvalStatus.brand === "approved" ? "bg-chart-3 text-white hover:bg-chart-3/90" : ""
                    }
                  >
                    {experiment.approvalStatus.brand}
                  </Badge>
                </div>
              </div>

              {/* Security */}
              <div
                className={`p-4 rounded-lg border ${
                  experiment.approvalStatus.security === "red"
                    ? "border-chart-5 bg-chart-5/5"
                    : experiment.approvalStatus.security === "approved"
                      ? "border-chart-3 bg-chart-3/5"
                      : "border-border bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {experiment.approvalStatus.security === "red" ? (
                      <ShieldAlert className="w-5 h-5 text-chart-5" />
                    ) : experiment.approvalStatus.security === "approved" ? (
                      <ShieldCheck className="w-5 h-5 text-chart-3" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-muted-foreground" />
                    )}
                    <span className="font-semibold text-foreground">Security</span>
                  </div>
                  <Badge
                    variant={
                      experiment.approvalStatus.security === "red"
                        ? "destructive"
                        : experiment.approvalStatus.security === "approved"
                          ? "default"
                          : "secondary"
                    }
                    className={
                      experiment.approvalStatus.security === "approved"
                        ? "bg-chart-3 text-white hover:bg-chart-3/90"
                        : ""
                    }
                  >
                    {experiment.approvalStatus.security}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 space-y-3">
            {hasBlockingIssue ? (
              <>
                <Button className="w-full bg-muted text-muted-foreground cursor-not-allowed" disabled>
                  Launch Experiment
                </Button>
                <p className="text-xs text-chart-5 text-center">Awaiting Legal Review</p>
              </>
            ) : (
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Launch Experiment
              </Button>
            )}
            <Button variant="outline" className="w-full bg-transparent">
              Edit Experiment
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
