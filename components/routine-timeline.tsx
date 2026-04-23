"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Sun,
  Zap,
  Coffee,
  Briefcase,
  Moon,
  Clock,
  Play,
} from "lucide-react"
import type { RoutineItem } from "@/lib/routine-data"
import { categoryLabels } from "@/lib/routine-data"
import { cn } from "@/lib/utils"

const categoryIcons: Record<RoutineItem["category"], React.ReactNode> = {
  morning: <Sun className="size-3.5" />,
  "deep-work": <Zap className="size-3.5" />,
  midday: <Coffee className="size-3.5" />,
  afternoon: <Briefcase className="size-3.5" />,
  evening: <Moon className="size-3.5" />,
}

const categoryAccentClasses: Record<RoutineItem["category"], string> = {
  morning: "border-l-primary",
  "deep-work": "border-l-accent",
  midday: "border-l-chart-3",
  afternoon: "border-l-chart-4",
  evening: "border-l-chart-5",
}

const categoryBadgeClasses: Record<RoutineItem["category"], string> = {
  morning: "bg-primary/15 text-primary border-primary/20",
  "deep-work": "bg-accent/15 text-accent border-accent/20",
  midday: "bg-chart-3/15 text-chart-3 border-chart-3/20",
  afternoon: "bg-chart-4/15 text-chart-4 border-chart-4/20",
  evening: "bg-chart-5/15 text-chart-5 border-chart-5/20",
}

interface RoutineTimelineProps {
  items: RoutineItem[]
  checkedItems: Record<string, boolean>
  onToggle: (id: string) => void
  filterCategory: string
  activeTimerTaskId?: string
  onStartTimer?: (taskId: string) => void
}

export function RoutineTimeline({
  items,
  checkedItems,
  onToggle,
  filterCategory,
  activeTimerTaskId,
  onStartTimer,
}: RoutineTimelineProps) {
  const filtered =
    filterCategory === "all"
      ? items
      : items.filter((item) => item.category === filterCategory)

  let currentCategory = ""

  return (
    <div className="flex flex-col gap-2">
      {filtered.map((item) => {
        const showCategoryHeader = item.category !== currentCategory
        currentCategory = item.category
        const isChecked = checkedItems[item.id] || false
        const isTimerActive = activeTimerTaskId === item.id

        return (
          <div key={item.id}>
            {showCategoryHeader && filterCategory === "all" && (
              <div className="flex items-center gap-2 pt-4 pb-2 first:pt-0 md:pt-6 md:pb-3">
                <div
                  className={cn(
                    "flex items-center gap-1.5",
                    getCategoryTextColor(item.category)
                  )}
                >
                  {categoryIcons[item.category]}
                  <span className="text-[10px] font-semibold uppercase tracking-wider md:text-xs">
                    {categoryLabels[item.category]}
                  </span>
                </div>
                <div className="flex-1 h-px bg-border" />
              </div>
            )}
            <div
              className={cn(
                "group flex items-start gap-3 rounded-lg border-l-2 bg-card p-3 text-left transition-all md:gap-4 md:p-4",
                categoryAccentClasses[item.category],
                isChecked && "opacity-60",
                isTimerActive && "ring-1 ring-primary/40 bg-primary/5"
              )}
            >
              {/* Checkbox */}
              <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => onToggle(item.id)}
                  className="size-5"
                />
              </div>

              {/* Content */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => onToggle(item.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    onToggle(item.id)
                  }
                }}
                className="flex flex-1 flex-col gap-1 min-w-0 cursor-pointer focus-visible:outline-none"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span
                      className={cn(
                        "font-medium text-sm text-foreground transition-all leading-tight",
                        isChecked && "line-through text-muted-foreground"
                      )}
                    >
                      {item.title}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] px-1.5 py-0 h-5 font-mono shrink-0",
                        categoryBadgeClasses[item.category]
                      )}
                    >
                      {item.duration}
                    </Badge>
                    {isTimerActive && (
                      <Badge className="text-[10px] px-1.5 py-0 h-5 bg-primary text-primary-foreground animate-pulse shrink-0">
                        Timing
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono text-muted-foreground md:text-xs">
                      {item.time}
                    </span>
                  </div>
                </div>
                <p
                  className={cn(
                    "text-[11px] text-muted-foreground leading-relaxed md:text-xs",
                    isChecked && "line-through"
                  )}
                >
                  {item.description}
                </p>
              </div>

              {/* Timer start button */}
              {onStartTimer && !isChecked && !activeTimerTaskId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onStartTimer(item.id)
                  }}
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-primary/15 hover:text-primary md:size-9"
                  title={`Start timer for ${item.title}`}
                >
                  <Play className="size-3.5 ml-0.5" />
                  <span className="sr-only">Start timer for {item.title}</span>
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function getCategoryTextColor(category: RoutineItem["category"]): string {
  const map: Record<RoutineItem["category"], string> = {
    morning: "text-primary",
    "deep-work": "text-accent",
    midday: "text-chart-3",
    afternoon: "text-chart-4",
    evening: "text-chart-5",
  }
  return map[category]
}
