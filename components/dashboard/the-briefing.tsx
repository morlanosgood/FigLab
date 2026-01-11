"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, TrendingUp, AlertTriangle, Zap, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

type BulletType = "win" | "blocker" | "velocity" | "alert" | "info"

interface BriefingBullet {
  type: BulletType
  text: string
}

interface TheBriefingProps {
  bullets: BriefingBullet[]
  generatedAt?: Date
  className?: string
}

const bulletConfig: Record<BulletType, { icon: typeof TrendingUp; color: string }> = {
  win: { icon: CheckCircle2, color: "text-chart-3" },
  blocker: { icon: AlertTriangle, color: "text-chart-5" },
  velocity: { icon: Zap, color: "text-primary" },
  alert: { icon: AlertTriangle, color: "text-chart-4" },
  info: { icon: Sparkles, color: "text-muted-foreground" },
}

export function TheBriefing({ bullets, generatedAt, className }: TheBriefingProps) {
  return (
    <Card className={cn("border-primary/20 bg-primary/5", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-medium text-foreground">This Week&apos;s Story</CardTitle>
          </div>
          {generatedAt && (
            <span className="text-xs text-muted-foreground">
              Updated {generatedAt.toLocaleDateString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit" })}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {bullets.map((bullet, index) => {
            const config = bulletConfig[bullet.type]
            const Icon = config.icon
            return (
              <li key={index} className="flex items-start gap-2">
                <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", config.color)} />
                <span className="text-sm text-foreground leading-relaxed">{bullet.text}</span>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
