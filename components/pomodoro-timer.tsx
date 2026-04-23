"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Play, Pause, RotateCcw, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type TimerMode = "focus" | "break"

interface PomodoroPreset {
  label: string
  focus: number
  break: number
}

const presets: PomodoroPreset[] = [
  { label: "25/5", focus: 25, break: 5 },
  { label: "52/17", focus: 52, break: 17 },
  { label: "45/10", focus: 45, break: 10 },
]

export function PomodoroTimer() {
  const [selectedPreset, setSelectedPreset] = useState(0)
  const [mode, setMode] = useState<TimerMode>("focus")
  const [secondsLeft, setSecondsLeft] = useState(presets[0].focus * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [showPresets, setShowPresets] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentPreset = presets[selectedPreset]
  const totalSeconds =
    mode === "focus" ? currentPreset.focus * 60 : currentPreset.break * 60
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100

  const reset = useCallback(() => {
    setIsRunning(false)
    setMode("focus")
    setSecondsLeft(presets[selectedPreset].focus * 60)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [selectedPreset])

  const switchMode = useCallback(() => {
    if (mode === "focus") {
      setCompletedPomodoros((p) => p + 1)
      setMode("break")
      setSecondsLeft(currentPreset.break * 60)
    } else {
      setMode("focus")
      setSecondsLeft(currentPreset.focus * 60)
    }
    setIsRunning(false)
  }, [mode, currentPreset])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  useEffect(() => {
    if (secondsLeft === 0 && !isRunning) {
      switchMode()
    }
  }, [secondsLeft, isRunning, switchMode])

  const selectPreset = (index: number) => {
    setSelectedPreset(index)
    setIsRunning(false)
    setMode("focus")
    setSecondsLeft(presets[index].focus * 60)
    setShowPresets(false)
  }

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  const circumference = 2 * Math.PI * 54
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">
            Pomodoro Timer
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">
              {completedPomodoros} completed
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPresets(!showPresets)}
            >
              <Settings className="size-3.5" />
              <span className="sr-only">Timer settings</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {showPresets && (
          <div className="flex items-center gap-2 w-full">
            {presets.map((preset, i) => (
              <button
                key={preset.label}
                onClick={() => selectPreset(i)}
                className={cn(
                  "flex-1 rounded-md px-3 py-1.5 text-xs font-mono font-medium transition-colors",
                  i === selectedPreset
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}

        <div className="relative flex items-center justify-center">
          <svg className="size-32 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-secondary"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              className={cn(
                "transition-all duration-1000 ease-linear",
                mode === "focus" ? "text-primary" : "text-accent"
              )}
              stroke="currentColor"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-mono font-bold text-foreground tabular-nums">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-widest",
                mode === "focus" ? "text-primary" : "text-accent"
              )}
            >
              {mode}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-9 border-border text-muted-foreground hover:text-foreground"
            onClick={reset}
          >
            <RotateCcw className="size-4" />
            <span className="sr-only">Reset timer</span>
          </Button>
          <Button
            size="icon"
            className={cn(
              "size-12 rounded-full",
              mode === "focus"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-accent text-accent-foreground hover:bg-accent/90"
            )}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? (
              <Pause className="size-5" />
            ) : (
              <Play className="size-5 ml-0.5" />
            )}
            <span className="sr-only">{isRunning ? "Pause" : "Start"} timer</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-9 border-border text-muted-foreground hover:text-foreground"
            onClick={switchMode}
          >
            <span className="text-xs font-mono font-bold">
              {mode === "focus" ? "B" : "F"}
            </span>
            <span className="sr-only">Switch to {mode === "focus" ? "break" : "focus"}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
