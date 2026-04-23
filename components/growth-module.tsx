"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  Code,
  DollarSign,
  Package,
  Minus,
  Plus,
} from "lucide-react"
import { growthActivities } from "@/lib/routine-data"
import { cn } from "@/lib/utils"

const typeIcons = {
  skill: Code,
  income: DollarSign,
  product: Package,
}

const typeColors = {
  skill: { text: "text-chart-3", bg: "bg-chart-3/10", badge: "bg-chart-3/15 text-chart-3 border-chart-3/20" },
  income: { text: "text-primary", bg: "bg-primary/10", badge: "bg-primary/15 text-primary border-primary/20" },
  product: { text: "text-accent", bg: "bg-accent/10", badge: "bg-accent/15 text-accent border-accent/20" },
}

interface GrowthModuleProps {
  notes: Record<string, string>
  durations: Record<string, number>
  onUpdateNote: (key: string, value: string) => void
  onUpdateDuration: (key: string, value: number) => void
}

export function GrowthModule({
  notes,
  durations,
  onUpdateNote,
  onUpdateDuration,
}: GrowthModuleProps) {
  const totalMinutes = Object.values(durations).reduce((a, b) => a + b, 0)
  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMins = totalMinutes % 60

  return (
    <div className="flex flex-col gap-4">
      {/* Summary */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Growth Today
              </h3>
            </div>
            <Badge
              variant="outline"
              className="bg-primary/15 text-primary border-primary/20 font-mono text-xs"
            >
              {totalHours > 0 ? `${totalHours}h ` : ""}
              {remainingMins}m invested
            </Badge>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {growthActivities.map((activity) => {
              const colors = typeColors[activity.type]
              const dur = durations[activity.id] || 0
              return (
                <div
                  key={activity.id}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg p-2",
                    colors.bg
                  )}
                >
                  <span className={cn("text-lg font-mono font-bold", colors.text)}>
                    {dur}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    min
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Activity Cards */}
      {growthActivities.map((activity) => {
        const Icon = typeIcons[activity.type]
        const colors = typeColors[activity.type]
        const dur = durations[activity.id] || 0

        return (
          <Card key={activity.id} className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <div
                  className={cn(
                    "flex size-6 items-center justify-center rounded-md",
                    colors.bg
                  )}
                >
                  <Icon className={cn("size-3.5", colors.text)} />
                </div>
                {activity.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground shrink-0 w-14">
                  Duration
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-foreground"
                    onClick={() =>
                      onUpdateDuration(
                        activity.id,
                        Math.max(0, dur - 15)
                      )
                    }
                    disabled={dur <= 0}
                  >
                    <Minus className="size-3" />
                    <span className="sr-only">Decrease duration</span>
                  </Button>
                  <span
                    className={cn(
                      "w-12 text-center text-sm font-mono font-bold",
                      colors.text
                    )}
                  >
                    {dur}m
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-foreground"
                    onClick={() =>
                      onUpdateDuration(activity.id, dur + 15)
                    }
                  >
                    <Plus className="size-3" />
                    <span className="sr-only">Increase duration</span>
                  </Button>
                </div>
              </div>
              <Textarea
                placeholder={activity.placeholder}
                value={notes[activity.id] || ""}
                onChange={(e) => onUpdateNote(activity.id, e.target.value)}
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground text-xs min-h-16 resize-none"
                rows={2}
              />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
