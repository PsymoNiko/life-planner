"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Target } from "lucide-react"
import { cn } from "@/lib/utils"

interface MitPlannerProps {
  mits: string[]
  onUpdateMit: (index: number, value: string) => void
}

export function MitPlanner({ mits, onUpdateMit }: MitPlannerProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Target className="size-4 text-primary" />
          {"Today's MITs"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {mits.map((mit, index) => (
          <div key={index} className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-mono font-bold",
                mit
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {index + 1}
            </span>
            <Input
              placeholder={`Most important task ${index + 1}...`}
              value={mit}
              onChange={(e) => onUpdateMit(index, e.target.value)}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground text-sm h-9"
            />
          </div>
        ))}
        <p className="text-[11px] text-muted-foreground mt-1">
          Set a clear endpoint for each. Focus on one MIT at a time during deep work.
        </p>
      </CardContent>
    </Card>
  )
}
