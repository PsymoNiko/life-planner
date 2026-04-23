"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import {
  Zap,
  Target,
  Flame,
  Clock,
  Moon,
  Droplets,
  Smile,
  ChevronRight,
  Activity,
  Brain,
} from "lucide-react"
import { routineItems } from "@/lib/routine-data"
import { cn } from "@/lib/utils"
import type { NavSection } from "@/components/app-nav"
import type { TaskSession, TaskAnalytics } from "@/hooks/use-task-timer"

interface DashboardProps {
  checkedItems: Record<string, boolean>
  completionPercentage: number
  completedCount: number
  totalCount: number
  mits: string[]
  energyMetrics: Record<string, number>
  focusMinutes: number
  onNavigate: (section: NavSection) => void
  todaySessions: TaskSession[]
  analytics: TaskAnalytics
  suggestion: { type: string; reason: string }
}

export function Dashboard({
  checkedItems,
  completionPercentage,
  completedCount,
  totalCount,
  mits,
  energyMetrics,
  focusMinutes,
  onNavigate,
  todaySessions,
  analytics,
  suggestion,
}: DashboardProps) {
  const today = new Date()
  const [greeting, setGreeting] = useState("")
  const activeMits = mits.filter((m) => m.trim() !== "")

  useEffect(() => {
    setGreeting(getGreeting())
  }, [])
  const focusHours = Math.floor(focusMinutes / 60)
  const focusMins = focusMinutes % 60

  const morningItems = routineItems.filter((i) => i.category === "morning")
  const morningDone = morningItems.filter((i) => checkedItems[i.id]).length

  const energyScore = Math.round(
    ((energyMetrics.sleep || 0) / 10 +
      (energyMetrics.water || 0) / 8 +
      (energyMetrics.mood || 0) / 5 +
      (energyMetrics.energy || 0) / 10) *
      25
  )

  const todayTrackedMinutes = todaySessions.reduce((s, t) => s + t.actualDuration, 0)
  const todayTrackedHours = Math.floor(todayTrackedMinutes / 60)
  const todayTrackedMins = todayTrackedMinutes % 60

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium text-muted-foreground md:text-sm">
          {greeting}
        </p>
        <h1 className="text-xl font-bold tracking-tight text-foreground md:text-3xl text-balance">
          {"Ali's Daily OS"}
        </h1>
        <p className="text-[11px] text-muted-foreground font-mono md:text-sm">
          {format(today, "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      {/* Top stat cards -- 2x2 on mobile, 4-col on desktop */}
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3">
        {/* Execution */}
        <Card
          className="border-border bg-card cursor-pointer hover:bg-secondary/30 transition-colors"
          onClick={() => onNavigate("routine")}
        >
          <CardContent className="flex flex-col items-center gap-2 p-3 md:p-4">
            <ProgressRing value={completionPercentage} color="text-primary" size={56} />
            <div className="text-center">
              <p className="text-[11px] font-semibold text-foreground">Execution</p>
              <p className="text-[10px] text-muted-foreground font-mono">
                {completedCount}/{totalCount}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Energy */}
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center gap-2 p-3 md:p-4">
            <ProgressRing value={energyScore} color="text-chart-4" size={56}>
              <Zap className="size-4 text-chart-4" />
            </ProgressRing>
            <div className="text-center">
              <p className="text-[11px] font-semibold text-foreground">Energy</p>
              <p className="text-[10px] text-muted-foreground font-mono">{energyScore}/100</p>
            </div>
          </CardContent>
        </Card>

        {/* Focus/Tracked time */}
        <Card
          className="border-border bg-card cursor-pointer hover:bg-secondary/30 transition-colors"
          onClick={() => onNavigate("analytics")}
        >
          <CardContent className="flex flex-col items-center gap-2 p-3 md:p-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-accent/10">
              <Clock className="size-5 text-accent" />
            </div>
            <div className="text-center">
              <p className="text-[11px] font-semibold text-foreground">Tracked</p>
              <p className="text-[10px] text-muted-foreground font-mono">
                {todayTrackedHours > 0 ? `${todayTrackedHours}h ` : ""}
                {todayTrackedMins}m
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Morning Score */}
        <Card
          className="border-border bg-card cursor-pointer hover:bg-secondary/30 transition-colors"
          onClick={() => onNavigate("routine")}
        >
          <CardContent className="flex flex-col items-center gap-2 p-3 md:p-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
              <Flame className="size-5 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-[11px] font-semibold text-foreground">Morning</p>
              <p className="text-[10px] text-muted-foreground font-mono">
                {morningDone}/{morningItems.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Efficiency + Focus scores row */}
      {analytics.totalSessions > 0 && (
        <div className="grid grid-cols-3 gap-2.5">
          <MiniScore
            label="Efficiency"
            value={analytics.efficiency}
            icon={<Target className="size-3" />}
            color="text-accent"
            onClick={() => onNavigate("analytics")}
          />
          <MiniScore
            label="Focus"
            value={analytics.focusScore}
            icon={<Brain className="size-3" />}
            color="text-primary"
            onClick={() => onNavigate("analytics")}
          />
          <MiniScore
            label="Consistency"
            value={analytics.consistencyScore}
            icon={<Activity className="size-3" />}
            color="text-chart-3"
            onClick={() => onNavigate("analytics")}
          />
        </div>
      )}

      {/* Energy Monitor */}
      <Card className="border-border bg-card">
        <CardContent className="p-3 md:p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Energy Monitor</h3>
            <span className="text-[10px] text-muted-foreground font-mono">Log your inputs</span>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <EnergyPill icon={<Moon className="size-3.5" />} label="Sleep" value={energyMetrics.sleep} max={10} unit="hrs" color="text-chart-3" bgColor="bg-chart-3/10" />
            <EnergyPill icon={<Droplets className="size-3.5" />} label="Water" value={energyMetrics.water} max={8} unit="glasses" color="text-chart-1" bgColor="bg-chart-1/10" />
            <EnergyPill icon={<Smile className="size-3.5" />} label="Mood" value={energyMetrics.mood} max={5} unit="/5" color="text-chart-4" bgColor="bg-chart-4/10" />
            <EnergyPill icon={<Zap className="size-3.5" />} label="Energy" value={energyMetrics.energy} max={10} unit="/10" color="text-accent" bgColor="bg-accent/10" />
          </div>
        </CardContent>
      </Card>

      {/* MITs quick view */}
      <Card
        className="border-border bg-card cursor-pointer hover:bg-secondary/30 transition-colors"
        onClick={() => onNavigate("routine")}
      >
        <CardContent className="p-3 md:p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="size-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">{"Today's MITs"}</h3>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </div>
          {activeMits.length > 0 ? (
            <div className="flex flex-col gap-2">
              {activeMits.map((mit, i) => (
                <div key={i} className="flex items-center gap-2 rounded-md bg-secondary px-3 py-2">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-mono font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="text-xs text-foreground truncate">{mit}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              No MITs set yet. Tap to add your top priorities.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Smart suggestion */}
      {suggestion.reason && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-start gap-3 p-3 md:p-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15">
              <Brain className="size-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-primary mb-1">Smart Suggestion</p>
              <p className="text-xs text-foreground leading-relaxed">{suggestion.reason}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function ProgressRing({
  value,
  color,
  size = 56,
  children,
}: {
  value: number
  color: string
  size?: number
  children?: React.ReactNode
}) {
  const radius = (size / 2) - 4
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (value / 100) * circumference
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="-rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth="3" className="text-secondary" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth="3" strokeLinecap="round" className={cn("transition-all duration-700 ease-out", color)} stroke="currentColor" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} />
      </svg>
      <div className="absolute">
        {children || (
          <span className="text-xs font-mono font-bold text-foreground">{value}%</span>
        )}
      </div>
    </div>
  )
}

function MiniScore({
  label,
  value,
  icon,
  color,
  onClick,
}: {
  label: string
  value: number
  icon: React.ReactNode
  color: string
  onClick: () => void
}) {
  return (
    <Card
      className="border-border bg-card cursor-pointer hover:bg-secondary/30 transition-colors"
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-2 p-2.5 md:p-3">
        <div className={cn("flex size-6 items-center justify-center rounded-md bg-secondary", color)}>
          {icon}
        </div>
        <div className="min-w-0">
          <span className={cn("text-sm font-mono font-bold", color)}>{value}%</span>
          <p className="text-[9px] text-muted-foreground truncate">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function EnergyPill({
  icon,
  label,
  value,
  max,
  unit,
  color,
  bgColor,
}: {
  icon: React.ReactNode
  label: string
  value: number
  max: number
  unit: string
  color: string
  bgColor: string
}) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="flex flex-col gap-1.5 rounded-lg bg-secondary p-2.5 md:p-3">
      <div className="flex items-center gap-1.5">
        <div className={cn("flex size-5 items-center justify-center rounded-md", bgColor, color)}>{icon}</div>
        <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-end gap-1">
        <span className={cn("text-base font-mono font-bold md:text-lg", color)}>{value}</span>
        <span className="text-[10px] text-muted-foreground mb-0.5">{unit}</span>
      </div>
      <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-500", color.replace("text-", "bg-"))} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning,"
  if (hour < 17) return "Good afternoon,"
  return "Good evening,"
}
