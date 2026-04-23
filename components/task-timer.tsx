"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Play,
  Pause,
  Square,
  AlertCircle,
  Zap,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import type { TaskSession } from "@/hooks/use-task-timer"
import { cn } from "@/lib/utils"

interface ActiveTimerBarProps {
  taskTitle: string
  category: string
  elapsedSeconds: number
  interruptions: number
  isPaused: boolean
  onPause: () => void
  onResume: () => void
  onInterrupt: () => void
  onEnd: () => void
}

export function ActiveTimerBar({
  taskTitle,
  category,
  elapsedSeconds,
  interruptions,
  isPaused,
  onPause,
  onResume,
  onInterrupt,
  onEnd,
}: ActiveTimerBarProps) {
  const minutes = Math.floor(elapsedSeconds / 60)
  const seconds = elapsedSeconds % 60

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-b border-primary/30 md:sticky md:top-0">
      <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-2.5 md:px-6">
        {/* Pulsing indicator */}
        <div className="relative shrink-0">
          <div
            className={cn(
              "size-2.5 rounded-full",
              isPaused ? "bg-chart-4" : "bg-primary animate-pulse"
            )}
          />
        </div>

        {/* Task info */}
        <div className="flex flex-1 flex-col gap-0 min-w-0">
          <span className="text-xs font-semibold text-foreground truncate">
            {taskTitle}
          </span>
          <span className="text-[10px] text-muted-foreground capitalize">
            {category.replace("-", " ")}
          </span>
        </div>

        {/* Timer display */}
        <span className="font-mono text-lg font-bold tabular-nums text-primary shrink-0 md:text-xl">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>

        {/* Interruptions */}
        <button
          onClick={onInterrupt}
          className="flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-1 text-destructive transition-colors hover:bg-destructive/20 shrink-0"
          title="Log interruption"
        >
          <AlertCircle className="size-3" />
          <span className="text-[10px] font-mono font-bold">{interruptions}</span>
        </button>

        {/* Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={isPaused ? onResume : onPause}
          >
            {isPaused ? (
              <Play className="size-3.5 text-primary" />
            ) : (
              <Pause className="size-3.5 text-chart-4" />
            )}
            <span className="sr-only">{isPaused ? "Resume" : "Pause"}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={onEnd}
          >
            <Square className="size-3.5 text-destructive" />
            <span className="sr-only">End task</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

// End-task modal with energy rating and comparison
interface EndTaskModalProps {
  session: TaskSession
  previousAvgDuration: number
  onDismiss: () => void
  suggestion: { type: string; reason: string }
}

export function EndTaskModal({
  session,
  previousAvgDuration,
  onDismiss,
  suggestion,
}: EndTaskModalProps) {
  const delta = session.actualDuration - session.estimatedDuration
  const deltaPercent =
    session.estimatedDuration > 0
      ? Math.round((delta / session.estimatedDuration) * 100)
      : 0

  const vsYesterday =
    previousAvgDuration > 0
      ? Math.round(
          ((session.actualDuration - previousAvgDuration) / previousAvgDuration) *
            100
        )
      : 0

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-background/80 backdrop-blur-sm md:items-center">
      <Card className="mx-4 mb-6 w-full max-w-md border-primary/20 bg-card shadow-xl md:mb-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground">
            Task Completed
          </CardTitle>
          <p className="text-xs text-muted-foreground">{session.taskTitle}</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary p-3">
              <Clock className="size-4 text-primary" />
              <span className="text-lg font-mono font-bold text-foreground">
                {session.actualDuration}
              </span>
              <span className="text-[10px] text-muted-foreground">min actual</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary p-3">
              <span
                className={cn(
                  "text-lg font-mono font-bold",
                  delta > 0 ? "text-chart-4" : delta < 0 ? "text-primary" : "text-foreground"
                )}
              >
                {delta > 0 ? "+" : ""}
                {deltaPercent}%
              </span>
              <span className="text-[10px] text-muted-foreground">vs estimate</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary p-3">
              <AlertCircle className="size-4 text-destructive" />
              <span className="text-lg font-mono font-bold text-foreground">
                {session.interruptions}
              </span>
              <span className="text-[10px] text-muted-foreground">interrupts</span>
            </div>
          </div>

          {/* Comparison with previous */}
          {previousAvgDuration > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-secondary p-3">
              <div
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-md",
                  vsYesterday <= 0 ? "bg-primary/10" : "bg-chart-4/10"
                )}
              >
                <Zap
                  className={cn(
                    "size-3.5",
                    vsYesterday <= 0 ? "text-primary" : "text-chart-4"
                  )}
                />
              </div>
              <div className="min-w-0">
                <span className="text-xs text-foreground">
                  {vsYesterday <= 0
                    ? `${Math.abs(vsYesterday)}% faster than your average`
                    : `${vsYesterday}% slower than your average`}
                </span>
                <p className="text-[10px] text-muted-foreground">
                  Avg: {previousAvgDuration}min across previous sessions
                </p>
              </div>
            </div>
          )}

          {/* Smart suggestion */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-[11px] font-semibold text-primary mb-1">
              Next Suggestion
            </p>
            <p className="text-xs text-foreground leading-relaxed">
              {suggestion.reason}
            </p>
          </div>

          <Button
            onClick={onDismiss}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// Session history list
interface SessionHistoryProps {
  sessions: TaskSession[]
}

export function SessionHistory({ sessions }: SessionHistoryProps) {
  const [expanded, setExpanded] = useState(false)
  const todaySessions = sessions.slice(0, expanded ? undefined : 5)

  if (sessions.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex flex-col items-center gap-2 p-6">
          <Clock className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">
            No sessions tracked yet. Start a task timer from the Routine tab.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Clock className="size-4 text-chart-3" />
            Session History
          </CardTitle>
          <span className="text-[10px] text-muted-foreground font-mono">
            {sessions.length} total
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {todaySessions.map((session) => {
          const delta = session.actualDuration - session.estimatedDuration
          const startDate = new Date(session.startTime)
          return (
            <div
              key={session.id}
              className="flex items-center gap-3 rounded-lg bg-secondary p-2.5 md:p-3"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Clock className="size-3.5 text-muted-foreground" />
              </div>
              <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                <span className="text-xs font-medium text-foreground truncate">
                  {session.taskTitle}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {startDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" -- "}
                  {session.actualDuration}min
                </span>
              </div>
              <div className="flex flex-col items-end gap-0.5 shrink-0">
                <span
                  className={cn(
                    "text-[10px] font-mono font-bold",
                    delta > 0
                      ? "text-chart-4"
                      : delta < 0
                        ? "text-primary"
                        : "text-muted-foreground"
                  )}
                >
                  {delta > 0 ? "+" : ""}
                  {delta}min
                </span>
                {session.interruptions > 0 && (
                  <span className="text-[9px] text-destructive font-mono">
                    {session.interruptions} int.
                  </span>
                )}
              </div>
            </div>
          )
        })}
        {sessions.length > 5 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center gap-1 rounded-lg py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="size-3" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="size-3" />
                Show all {sessions.length} sessions
              </>
            )}
          </button>
        )}
      </CardContent>
    </Card>
  )
}
