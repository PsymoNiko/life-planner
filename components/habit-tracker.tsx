"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"

export function HabitTracker() {
  const [streakDays, setStreakDays] = useState<boolean[]>(Array(7).fill(false))
  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"]
  const currentStreak = streakDays.filter(Boolean).length

  const toggleDay = (index: number) => {
    setStreakDays((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Flame className="size-4 text-chart-4" />
            Weekly Streak
          </CardTitle>
          <span className="text-xs font-mono font-bold text-foreground">
            {currentStreak}/7
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1.5 md:gap-2">
          {dayLabels.map((label, index) => (
            <button
              key={index}
              onClick={() => toggleDay(index)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-lg py-2 transition-colors",
                streakDays[index]
                  ? "bg-primary/15"
                  : "bg-secondary hover:bg-secondary/80"
              )}
            >
              <div
                className={cn(
                  "size-6 rounded-full flex items-center justify-center transition-colors md:size-7",
                  streakDays[index]
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {streakDays[index] ? (
                  <Flame className="size-3" />
                ) : (
                  <span className="text-[10px] font-mono">{label}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-[9px] font-medium md:text-[10px]",
                  streakDays[index]
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-secondary p-2.5 md:p-3">
          <Flame className="size-4 text-chart-4 shrink-0 md:size-5" />
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-foreground md:text-xs">
              {currentStreak === 0
                ? "Start your streak today"
                : currentStreak === 7
                  ? "Perfect week! Keep it going."
                  : `${currentStreak} day streak! Don't break the chain.`}
            </p>
            <p className="text-[10px] text-muted-foreground md:text-[11px]">
              Small consistency beats big bursts.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
