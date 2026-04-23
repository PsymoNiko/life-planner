"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Moon,
  Droplets,
  Smile,
  Zap,
  Minus,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface EnergyInputProps {
  metrics: Record<string, number>
  onUpdate: (key: string, value: number) => void
}

const metricConfig = [
  { key: "sleep", label: "Sleep Hours", icon: Moon, max: 10, step: 0.5, color: "text-chart-3", bg: "bg-chart-3/10" },
  { key: "water", label: "Water Intake", icon: Droplets, max: 8, step: 1, color: "text-chart-1", bg: "bg-chart-1/10" },
  { key: "mood", label: "Mood", icon: Smile, max: 5, step: 1, color: "text-chart-4", bg: "bg-chart-4/10" },
  { key: "energy", label: "Energy Level", icon: Zap, max: 10, step: 1, color: "text-accent", bg: "bg-accent/10" },
]

export function EnergyInput({ metrics, onUpdate }: EnergyInputProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Zap className="size-4 text-chart-4" />
          Energy Monitor
        </CardTitle>
        <p className="text-[11px] text-muted-foreground">
          Log your daily energy inputs to track patterns.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {metricConfig.map((m) => {
          const Icon = m.icon
          const val = metrics[m.key] || 0
          return (
            <div
              key={m.key}
              className="flex items-center gap-3 rounded-lg bg-secondary p-3"
            >
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg",
                  m.bg
                )}
              >
                <Icon className={cn("size-4", m.color)} />
              </div>
              <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                <span className="text-xs font-medium text-foreground">
                  {m.label}
                </span>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      m.color.replace("text-", "bg-")
                    )}
                    style={{ width: `${(val / m.max) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-foreground"
                  onClick={() => onUpdate(m.key, Math.max(0, val - m.step))}
                  disabled={val <= 0}
                >
                  <Minus className="size-3" />
                  <span className="sr-only">Decrease {m.label}</span>
                </Button>
                <span
                  className={cn(
                    "w-8 text-center text-sm font-mono font-bold",
                    m.color
                  )}
                >
                  {val}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-foreground"
                  onClick={() => onUpdate(m.key, Math.min(m.max, val + m.step))}
                  disabled={val >= m.max}
                >
                  <Plus className="size-3" />
                  <span className="sr-only">Increase {m.label}</span>
                </Button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
