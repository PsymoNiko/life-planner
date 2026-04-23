"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart3,
  Clock,
  Target,
  Zap,
  Brain,
  Shield,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react"
import type { TaskAnalytics, TaskSession } from "@/hooks/use-task-timer"
import { cn } from "@/lib/utils"

interface AnalyticsDashboardProps {
  analytics: TaskAnalytics
  todaySessions: TaskSession[]
  suggestion: { type: string; reason: string }
}

const categoryColorMap: Record<string, { text: string; bg: string }> = {
  morning: { text: "text-primary", bg: "bg-primary" },
  "deep-work": { text: "text-accent", bg: "bg-accent" },
  midday: { text: "text-chart-3", bg: "bg-chart-3" },
  afternoon: { text: "text-chart-4", bg: "bg-chart-4" },
  evening: { text: "text-chart-5", bg: "bg-chart-5" },
}

export function AnalyticsDashboard({
  analytics,
  todaySessions,
  suggestion,
}: AnalyticsDashboardProps) {
  const todayMinutes = todaySessions.reduce((sum, s) => sum + s.actualDuration, 0)
  const todayHours = Math.floor(todayMinutes / 60)
  const todayRemainingMins = todayMinutes % 60
  const todayInterruptions = todaySessions.reduce((sum, s) => sum + s.interruptions, 0)

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-foreground md:text-xl">
          Performance Analytics
        </h2>
        <p className="text-xs text-muted-foreground">
          Track your execution quality over time
        </p>
      </div>

      {/* Today report */}
      <Card className="border-primary/20 bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Activity className="size-4 text-primary" />
            {"Today's Report"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <Stat
              label="Time Tracked"
              value={todayHours > 0 ? `${todayHours}h ${todayRemainingMins}m` : `${todayRemainingMins}m`}
              icon={<Clock className="size-3.5" />}
              color="text-primary"
              bg="bg-primary/10"
            />
            <Stat
              label="Sessions"
              value={String(todaySessions.length)}
              icon={<Target className="size-3.5" />}
              color="text-accent"
              bg="bg-accent/10"
            />
            <Stat
              label="Interruptions"
              value={String(todayInterruptions)}
              icon={<Zap className="size-3.5" />}
              color="text-destructive"
              bg="bg-destructive/10"
            />
            <Stat
              label="Efficiency"
              value={`${analytics.efficiency}%`}
              icon={<BarChart3 className="size-3.5" />}
              color="text-chart-3"
              bg="bg-chart-3/10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Score cards */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <ScoreCard
          title="Focus Score"
          score={analytics.focusScore}
          icon={<Brain className="size-4" />}
          color="text-primary"
          description="Based on interruption frequency. Fewer interruptions = higher score."
        />
        <ScoreCard
          title="Consistency"
          score={analytics.consistencyScore}
          icon={<Shield className="size-4" />}
          color="text-chart-3"
          description="How predictable your task durations are. Low variance = high consistency."
        />
        <ScoreCard
          title="Efficiency"
          score={analytics.efficiency}
          icon={<Target className="size-4" />}
          color="text-accent"
          description="How close actual duration matches your estimates."
        />
      </div>

      {/* Deviation and category */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* Estimate Deviation */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
              {analytics.deviationPercent > 0 ? (
                <TrendingUp className="size-4 text-chart-4" />
              ) : (
                <TrendingDown className="size-4 text-primary" />
              )}
              Estimation Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary p-3 flex-1">
                <span className="text-[10px] text-muted-foreground">Planned</span>
                <span className="text-xl font-mono font-bold text-foreground">
                  {analytics.estimatedDuration}m
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary p-3 flex-1">
                <span className="text-[10px] text-muted-foreground">Actual Avg</span>
                <span className="text-xl font-mono font-bold text-foreground">
                  {analytics.averageDuration}m
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary p-3 flex-1">
                <span className="text-[10px] text-muted-foreground">Deviation</span>
                <span
                  className={cn(
                    "text-xl font-mono font-bold",
                    analytics.deviationPercent > 0 ? "text-chart-4" : "text-primary"
                  )}
                >
                  {analytics.deviationPercent > 0 ? "+" : ""}
                  {analytics.deviationPercent}%
                </span>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
              {analytics.deviationPercent > 10
                ? "You consistently exceed estimates. Consider increasing task time allocation."
                : analytics.deviationPercent < -10
                  ? "You finish faster than estimated. Great efficiency -- consider adding stretch goals."
                  : "Your estimates are well-calibrated. Keep it up."}
            </p>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <BarChart3 className="size-4 text-chart-3" />
              Time by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(analytics.categoryBreakdown).length > 0 ? (
              <div className="flex flex-col gap-2">
                {Object.entries(analytics.categoryBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, minutes]) => {
                    const totalCat = Object.values(analytics.categoryBreakdown).reduce(
                      (a, b) => a + b,
                      0
                    )
                    const pct = totalCat > 0 ? Math.round((minutes / totalCat) * 100) : 0
                    const colors = categoryColorMap[category] || {
                      text: "text-muted-foreground",
                      bg: "bg-muted",
                    }
                    return (
                      <div key={category} className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className={cn("text-xs font-medium capitalize", colors.text)}>
                            {category.replace("-", " ")}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {minutes}min ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all duration-500", colors.bg)}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">
                Complete sessions to see category breakdown.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Best performing hour */}
      {analytics.bestHour !== null && (
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="size-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground">
                Peak Productivity Hour
              </p>
              <p className="text-[11px] text-muted-foreground">
                You start the most tasks at{" "}
                <span className="font-mono font-bold text-primary">
                  {String(analytics.bestHour).padStart(2, "0")}:00
                </span>
                . Schedule deep work here.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Smart Suggestion */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-3 p-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15">
            <Brain className="size-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-primary mb-1">
              Smart Suggestion
            </p>
            <p className="text-xs text-foreground leading-relaxed">
              {suggestion.reason}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Stat({
  label,
  value,
  icon,
  color,
  bg,
}: {
  label: string
  value: string
  icon: React.ReactNode
  color: string
  bg: string
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-secondary p-3">
      <div className="flex items-center gap-1.5">
        <div className={cn("flex size-5 items-center justify-center rounded-md", bg, color)}>
          {icon}
        </div>
        <span className="text-[10px] text-muted-foreground">{label}</span>
      </div>
      <span className={cn("text-lg font-mono font-bold", color)}>{value}</span>
    </div>
  )
}

function ScoreCard({
  title,
  score,
  icon,
  color,
  description,
}: {
  title: string
  score: number
  icon: React.ReactNode
  color: string
  description: string
}) {
  const circumference = 2 * Math.PI * 32
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <Card className="border-border bg-card">
      <CardContent className="flex flex-col items-center gap-3 p-4">
        <div className="relative flex items-center justify-center">
          <svg className="size-20 -rotate-90" viewBox="0 0 72 72">
            <circle
              cx="36"
              cy="36"
              r="32"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-secondary"
            />
            <circle
              cx="36"
              cy="36"
              r="32"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              className={cn("transition-all duration-700 ease-out", color)}
              stroke="currentColor"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={cn("text-xl font-mono font-bold", color)}>
              {score}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={cn(color)}>{icon}</span>
          <span className="text-xs font-semibold text-foreground">{title}</span>
        </div>
        <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
