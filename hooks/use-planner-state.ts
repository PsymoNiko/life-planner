"use client"

import { useState, useCallback } from "react"

interface DayData {
  checkedItems: Record<string, boolean>
  reflections: Record<string, string>
  mits: string[]
  energyMetrics: Record<string, number>
  growthNotes: Record<string, string>
  growthDurations: Record<string, number>
  mood: number
  focusMinutes: number
}

const DEFAULT_DAY_DATA: DayData = {
  checkedItems: {},
  reflections: {},
  mits: ["", "", ""],
  energyMetrics: { sleep: 0, water: 0, mood: 0, energy: 0 },
  growthNotes: { skill: "", income: "", product: "" },
  growthDurations: { skill: 0, income: 0, product: 0 },
  mood: 0,
  focusMinutes: 0,
}

export function usePlannerState() {
  const [dayData, setDayData] = useState<DayData>(() => ({
    ...DEFAULT_DAY_DATA,
    energyMetrics: { ...DEFAULT_DAY_DATA.energyMetrics },
    growthNotes: { ...DEFAULT_DAY_DATA.growthNotes },
    growthDurations: { ...DEFAULT_DAY_DATA.growthDurations },
  }))

  const toggleItem = useCallback((id: string) => {
    setDayData((prev) => ({
      ...prev,
      checkedItems: {
        ...prev.checkedItems,
        [id]: !prev.checkedItems[id],
      },
    }))
  }, [])

  const updateReflection = useCallback((key: string, value: string) => {
    setDayData((prev) => ({
      ...prev,
      reflections: {
        ...prev.reflections,
        [key]: value,
      },
    }))
  }, [])

  const updateMit = useCallback((index: number, value: string) => {
    setDayData((prev) => {
      const newMits = [...prev.mits]
      newMits[index] = value
      return { ...prev, mits: newMits }
    })
  }, [])

  const updateEnergyMetric = useCallback((key: string, value: number) => {
    setDayData((prev) => ({
      ...prev,
      energyMetrics: {
        ...prev.energyMetrics,
        [key]: value,
      },
    }))
  }, [])

  const updateGrowthNote = useCallback((key: string, value: string) => {
    setDayData((prev) => ({
      ...prev,
      growthNotes: {
        ...prev.growthNotes,
        [key]: value,
      },
    }))
  }, [])

  const updateGrowthDuration = useCallback((key: string, value: number) => {
    setDayData((prev) => ({
      ...prev,
      growthDurations: {
        ...prev.growthDurations,
        [key]: value,
      },
    }))
  }, [])

  const addFocusMinutes = useCallback((minutes: number) => {
    setDayData((prev) => ({
      ...prev,
      focusMinutes: prev.focusMinutes + minutes,
    }))
  }, [])

  const getCompletionPercentage = useCallback(
    (itemIds: string[]) => {
      if (itemIds.length === 0) return 0
      const completed = itemIds.filter((id) => dayData.checkedItems[id]).length
      return Math.round((completed / itemIds.length) * 100)
    },
    [dayData.checkedItems]
  )

  return {
    dayData,
    toggleItem,
    updateReflection,
    updateMit,
    updateEnergyMetric,
    updateGrowthNote,
    updateGrowthDuration,
    addFocusMinutes,
    getCompletionPercentage,
  }
}
