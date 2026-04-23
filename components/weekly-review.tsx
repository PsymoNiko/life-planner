"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Calendar,
  Sparkles,
  Wind,
  PenLine,
  Brush,
  Heart,
  Target,
  Shield,
  RefreshCw,
  Clock,
  Users,
  BarChart3,
  Flame,
} from "lucide-react"
import { weeklyChecklist, microRoutines, habitHacks } from "@/lib/routine-data"
import { cn } from "@/lib/utils"

const microIcons = [Brush, PenLine, Wind]
const hackIcons = [Shield, RefreshCw, Clock, Users, BarChart3]

export function WeeklyReview() {
  const [checkedWeekly, setCheckedWeekly] = useState<Record<number, boolean>>(
    {}
  )
  const [weeklyPriorities, setWeeklyPriorities] = useState(["", "", ""])

  const toggleWeekly = (index: number) => {
    setCheckedWeekly((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const updatePriority = (index: number, value: string) => {
    setWeeklyPriorities((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const completedWeekly = Object.values(checkedWeekly).filter(Boolean).length

  return (
    <div className="flex flex-col gap-4">
      {/* Weekly Priorities */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Target className="size-4 text-primary" />
            Weekly Priorities
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {weeklyPriorities.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-mono font-bold",
                  p
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {i + 1}
              </span>
              <Input
                placeholder={`Priority ${i + 1} for this week...`}
                value={p}
                onChange={(e) => updatePriority(i, e.target.value)}
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground text-xs h-8"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Review Checklist */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Calendar className="size-4 text-chart-3" />
              Weekly Review
            </CardTitle>
            <span className="text-[10px] font-mono text-muted-foreground">
              {completedWeekly}/{weeklyChecklist.length}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            30-60 min, Saturday or Sunday
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {weeklyChecklist.map((item, index) => (
            <div
              key={index}
              role="button"
              tabIndex={0}
              onClick={() => toggleWeekly(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  toggleWeekly(index)
                }
              }}
              className={cn(
                "flex items-center gap-3 rounded-lg bg-secondary p-2.5 text-left transition-colors hover:bg-secondary/80 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:p-3",
                checkedWeekly[index] && "opacity-60"
              )}
            >
              <Checkbox
                checked={checkedWeekly[index] || false}
                onCheckedChange={() => toggleWeekly(index)}
                className="size-4"
                onClick={(e) => e.stopPropagation()}
              />
              <span
                className={cn(
                  "text-xs text-foreground",
                  checkedWeekly[index] && "line-through text-muted-foreground"
                )}
              >
                {item}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Two column on desktop: Micro-routines + Habit Hacks */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Micro-routines */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Sparkles className="size-4 text-accent" />
              Micro-Routines
            </CardTitle>
            <p className="text-[11px] text-muted-foreground">
              Quick resets you can do anytime
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {microRoutines.map((routine, index) => {
              const Icon = microIcons[index] || Sparkles
              return (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg bg-secondary p-2.5 md:p-3"
                >
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent/10">
                    <Icon className="size-3 text-accent" />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-xs font-semibold text-foreground">
                      {routine.title}
                    </span>
                    <span className="text-[11px] text-muted-foreground leading-relaxed">
                      {routine.description}
                    </span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Habit Hacks */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Shield className="size-4 text-primary" />
              Habit Hacks
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {habitHacks.map((hack, index) => {
              const Icon = hackIcons[index] || Shield
              return (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg bg-secondary p-2.5 md:p-3"
                >
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <Icon className="size-3 text-primary" />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-xs font-semibold text-foreground">
                      {hack.title}
                    </span>
                    <span className="text-[11px] text-muted-foreground leading-relaxed">
                      {hack.description}
                    </span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* If you miss a day */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Heart className="size-4 text-destructive" />
            If You Miss a Day
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {[
            "If you miss a morning, don't punish: do a 15-minute reset and continue.",
            "One missed day does not equal failure. Reconnect with the checklist next morning.",
            "Small consistency beats big bursts.",
          ].map((rule, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-lg bg-secondary p-2.5 md:p-3"
            >
              <span className="text-primary text-xs font-mono font-bold mt-0.5 shrink-0">
                {i + 1}.
              </span>
              <span className="text-xs text-foreground leading-relaxed">
                {rule}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
