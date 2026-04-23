"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, AlertTriangle } from "lucide-react"
import { reflectionPrompts } from "@/lib/routine-data"
import { cn } from "@/lib/utils"

interface ReflectionJournalProps {
  reflections: Record<string, string>
  onUpdateReflection: (key: string, value: string) => void
}

const moodLabels = ["Rough", "Low", "Okay", "Good", "Great"]
const moodColors = [
  "bg-destructive/20 text-destructive border-destructive/30",
  "bg-chart-4/20 text-chart-4 border-chart-4/30",
  "bg-muted text-muted-foreground border-border",
  "bg-chart-3/20 text-chart-3 border-chart-3/30",
  "bg-primary/20 text-primary border-primary/30",
]

export function ReflectionJournal({
  reflections,
  onUpdateReflection,
}: ReflectionJournalProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [relapse, setRelapse] = useState<boolean | null>(null)

  return (
    <div className="flex flex-col gap-4">
      {/* Mood */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground">
            How are you feeling?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {moodLabels.map((label, i) => (
              <button
                key={label}
                onClick={() => setSelectedMood(i)}
                className={cn(
                  "flex-1 rounded-lg border py-2.5 text-xs font-medium transition-all",
                  selectedMood === i
                    ? moodColors[i]
                    : "border-border bg-secondary text-muted-foreground hover:bg-secondary/80"
                )}
              >
                <span className="block text-center">{i + 1}</span>
                <span className="block text-center text-[9px] mt-0.5 opacity-80">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Relapse check */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <AlertTriangle className="size-4 text-chart-4" />
            Habit Relapse Today?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <button
              onClick={() => setRelapse(false)}
              className={cn(
                "flex-1 rounded-lg border py-2.5 text-xs font-semibold transition-all",
                relapse === false
                  ? "border-primary/30 bg-primary/15 text-primary"
                  : "border-border bg-secondary text-muted-foreground hover:bg-secondary/80"
              )}
            >
              No - Clean day
            </button>
            <button
              onClick={() => setRelapse(true)}
              className={cn(
                "flex-1 rounded-lg border py-2.5 text-xs font-semibold transition-all",
                relapse === true
                  ? "border-chart-4/30 bg-chart-4/15 text-chart-4"
                  : "border-border bg-secondary text-muted-foreground hover:bg-secondary/80"
              )}
            >
              Yes - Reset
            </button>
          </div>
          {relapse === true && (
            <p className="mt-2 text-[11px] text-chart-4 leading-relaxed">
              {"No judgment. Log it, learn from it. What triggered it? Write below."}
            </p>
          )}
          {relapse === false && (
            <p className="mt-2 text-[11px] text-primary leading-relaxed">
              Great discipline. Keep the chain going.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Journal prompts */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <BookOpen className="size-4 text-chart-5" />
            Evening Reflection
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {reflectionPrompts.map((prompt, index) => (
            <div key={index} className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {prompt}
              </label>
              <Textarea
                placeholder="Write your thoughts..."
                value={reflections[`reflection-${index}`] || ""}
                onChange={(e) =>
                  onUpdateReflection(`reflection-${index}`, e.target.value)
                }
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground text-sm min-h-16 resize-none"
                rows={2}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
