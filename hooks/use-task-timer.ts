"use client"

import { useState, useCallback, useRef, useEffect } from "react"

export interface TaskSession {
  id: string
  taskId: string
  taskTitle: string
  category: string
  startTime: number
  endTime: number | null
  actualDuration: number
  estimatedDuration: number
  interruptions: number
  energyScore: number | null
}

export interface TaskAnalytics {
  averageDuration: number
  estimatedDuration: number
  totalSessions: number
  totalMinutes: number
  efficiency: number
  focusScore: number
  consistencyScore: number
  categoryBreakdown: Record<string, number>
  bestHour: number | null
  deviationPercent: number
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function useTaskTimer() {
  const [sessions, setSessions] = useState<TaskSession[]>([])
  const [activeSession, setActiveSession] = useState<TaskSession | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Live tick for the active session
  useEffect(() => {
    if (activeSession && !isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1)
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [activeSession, isPaused])

  const startTask = useCallback(
    (taskId: string, taskTitle: string, category: string, estimatedMinutes: number) => {
      if (activeSession) return // Don't allow multiple active
      const session: TaskSession = {
        id: generateId(),
        taskId,
        taskTitle,
        category,
        startTime: Date.now(),
        endTime: null,
        actualDuration: 0,
        estimatedDuration: estimatedMinutes,
        interruptions: 0,
        energyScore: null,
      }
      setActiveSession(session)
      setElapsedSeconds(0)
      setIsPaused(false)
    },
    [activeSession]
  )

  const pauseTask = useCallback(() => {
    if (!activeSession) return
    setIsPaused(true)
  }, [activeSession])

  const resumeTask = useCallback(() => {
    if (!activeSession) return
    setIsPaused(false)
  }, [activeSession])

  const addInterruption = useCallback(() => {
    if (!activeSession) return
    setActiveSession((prev) =>
      prev ? { ...prev, interruptions: prev.interruptions + 1 } : null
    )
  }, [activeSession])

  const endTask = useCallback(
    (energyScore?: number) => {
      if (!activeSession) return null
      const endTime = Date.now()
      const actualDuration = Math.round(elapsedSeconds / 60)
      const completedSession: TaskSession = {
        ...activeSession,
        endTime,
        actualDuration,
        energyScore: energyScore ?? null,
      }
      setSessions((prev) => [completedSession, ...prev])
      setActiveSession(null)
      setElapsedSeconds(0)
      setIsPaused(false)
      return completedSession
    },
    [activeSession, elapsedSeconds]
  )

  const getTaskHistory = useCallback(
    (taskId: string) => {
      return sessions.filter((s) => s.taskId === taskId).slice(0, 7)
    },
    [sessions]
  )

  const getAdaptiveEstimate = useCallback(
    (taskId: string, fallbackMinutes: number): number => {
      const history = getTaskHistory(taskId)
      if (history.length === 0) return fallbackMinutes
      if (history.length === 1) return history[0].actualDuration || fallbackMinutes

      const yesterday = history[0]?.actualDuration || fallbackMinutes
      const weeklyAvg =
        history.reduce((sum, s) => sum + s.actualDuration, 0) / history.length
      const monthlyAvg = weeklyAvg // approximate

      return Math.round(yesterday * 0.5 + weeklyAvg * 0.3 + monthlyAvg * 0.2)
    },
    [getTaskHistory]
  )

  const getAnalytics = useCallback((): TaskAnalytics => {
    if (sessions.length === 0) {
      return {
        averageDuration: 0,
        estimatedDuration: 0,
        totalSessions: 0,
        totalMinutes: 0,
        efficiency: 0,
        focusScore: 0,
        consistencyScore: 0,
        categoryBreakdown: {},
        bestHour: null,
        deviationPercent: 0,
      }
    }

    const totalMinutes = sessions.reduce((sum, s) => sum + s.actualDuration, 0)
    const averageDuration = Math.round(totalMinutes / sessions.length)
    const avgEstimated =
      sessions.reduce((sum, s) => sum + s.estimatedDuration, 0) / sessions.length

    // Efficiency: how close actual is to estimated (capped at 100)
    const efficiencyScores = sessions.map((s) => {
      if (s.estimatedDuration === 0) return 100
      const ratio = s.actualDuration / s.estimatedDuration
      return Math.max(0, Math.min(100, 100 - Math.abs(1 - ratio) * 100))
    })
    const efficiency = Math.round(
      efficiencyScores.reduce((a, b) => a + b, 0) / efficiencyScores.length
    )

    // Focus score: based on interruptions (fewer = better)
    const avgInterruptions =
      sessions.reduce((sum, s) => sum + s.interruptions, 0) / sessions.length
    const focusScore = Math.max(0, Math.round(100 - avgInterruptions * 15))

    // Consistency: deviation from average
    const deviations = sessions.map((s) =>
      Math.abs(s.actualDuration - averageDuration)
    )
    const avgDeviation =
      deviations.reduce((a, b) => a + b, 0) / deviations.length
    const consistencyScore = Math.max(
      0,
      Math.round(100 - (avgDeviation / Math.max(averageDuration, 1)) * 100)
    )

    // Category breakdown
    const categoryBreakdown: Record<string, number> = {}
    sessions.forEach((s) => {
      categoryBreakdown[s.category] =
        (categoryBreakdown[s.category] || 0) + s.actualDuration
    })

    // Best hour
    const hourCounts: Record<number, number> = {}
    sessions.forEach((s) => {
      const hour = new Date(s.startTime).getHours()
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })
    const bestHour =
      Object.keys(hourCounts).length > 0
        ? Number(
            Object.entries(hourCounts).sort(
              ([, a], [, b]) => b - a
            )[0][0]
          )
        : null

    // Deviation from estimate
    const deviationPercent =
      avgEstimated > 0
        ? Math.round(((averageDuration - avgEstimated) / avgEstimated) * 100)
        : 0

    return {
      averageDuration,
      estimatedDuration: Math.round(avgEstimated),
      totalSessions: sessions.length,
      totalMinutes,
      efficiency,
      focusScore,
      consistencyScore,
      categoryBreakdown,
      bestHour,
      deviationPercent,
    }
  }, [sessions])

  const getSmartSuggestion = useCallback(
    (energyLevel: number, currentHour: number): { type: string; reason: string } => {
      if (energyLevel >= 7 && currentHour < 12) {
        return {
          type: "deep-work",
          reason: "High energy + morning hours = peak productivity. Tackle your hardest MIT now.",
        }
      }
      if (energyLevel >= 7 && currentHour >= 12) {
        return {
          type: "deep-work",
          reason: "Energy is high. Use this window for focused coding or complex problem-solving.",
        }
      }
      if (energyLevel >= 4 && energyLevel < 7 && currentHour >= 13 && currentHour <= 15) {
        return {
          type: "afternoon",
          reason: "Moderate energy in the afternoon slump. Handle admin, emails, or lighter tasks.",
        }
      }
      if (energyLevel < 4) {
        return {
          type: "midday",
          reason: "Low energy detected. Take a walk, stretch, or do a micro-routine before continuing.",
        }
      }
      return {
        type: "afternoon",
        reason: "Balanced energy. Good time for moderate-complexity tasks or learning.",
      }
    },
    []
  )

  const getTodaySessions = useCallback(() => {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    return sessions.filter((s) => s.startTime >= todayStart.getTime())
  }, [sessions])

  return {
    sessions,
    activeSession,
    elapsedSeconds,
    isPaused,
    startTask,
    pauseTask,
    resumeTask,
    addInterruption,
    endTask,
    getTaskHistory,
    getAdaptiveEstimate,
    getAnalytics,
    getSmartSuggestion,
    getTodaySessions,
  }
}
