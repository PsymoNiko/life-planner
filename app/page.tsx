"use client"

import { useState } from "react"
import { MobileNav, DesktopNav, type NavSection } from "@/components/app-nav"
import { Dashboard } from "@/components/dashboard"
import { CategoryNav } from "@/components/planner-header"
import { RoutineTimeline } from "@/components/routine-timeline"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { MitPlanner } from "@/components/mit-planner"
import { EnergyInput } from "@/components/energy-input"
import { GrowthModule } from "@/components/growth-module"
import { ReflectionJournal } from "@/components/reflection-journal"
import { HabitTracker } from "@/components/habit-tracker"
import { WeeklyReview } from "@/components/weekly-review"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { ActiveTimerBar, EndTaskModal, SessionHistory } from "@/components/task-timer"
import { routineItems } from "@/lib/routine-data"
import { usePlannerState } from "@/hooks/use-planner-state"
import { useTaskTimer } from "@/hooks/use-task-timer"
import { useMusicPlayer } from "@/hooks/use-music-player"
import { MusicPlayerWidget } from "@/components/music-player"

// Map routine items to estimated minutes
function parseDuration(dur: string): number {
  if (dur.includes("hr")) {
    const val = parseFloat(dur)
    return Math.round(val * 60)
  }
  return parseInt(dur) || 15
}

export default function PlannerPage() {
  const {
    dayData,
    toggleItem,
    updateReflection,
    updateMit,
    updateEnergyMetric,
    updateGrowthNote,
    updateGrowthDuration,
    addFocusMinutes,
    getCompletionPercentage,
  } = usePlannerState()

  const timer = useTaskTimer()
  const music = useMusicPlayer()

  const [activeSection, setActiveSection] = useState<NavSection>("dashboard")
  const [filterCategory, setFilterCategory] = useState("all")
  const [completedSession, setCompletedSession] = useState<ReturnType<typeof timer.endTask>>(null)

  const allItemIds = routineItems.map((item) => item.id)
  const completionPercentage = getCompletionPercentage(allItemIds)
  const completedItems = allItemIds.filter((id) => dayData.checkedItems[id]).length

  const currentHour = new Date().getHours()
  const energyLevel = dayData.energyMetrics.energy || 5
  const suggestion = timer.getSmartSuggestion(energyLevel, currentHour)
  const analytics = timer.getAnalytics()
  const todaySessions = timer.getTodaySessions()

  const handleStartTimer = (taskId: string) => {
    const item = routineItems.find((r) => r.id === taskId)
    if (!item || timer.activeSession) return
    const estimated = parseDuration(item.duration)
    timer.startTask(taskId, item.title, item.category, estimated)
  }

  const handleEndTimer = () => {
    const session = timer.endTask(dayData.energyMetrics.energy || undefined)
    if (session) {
      addFocusMinutes(session.actualDuration)
      setCompletedSession(session)
    }
  }

  const dismissEndModal = () => {
    setCompletedSession(null)
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Active timer bar - always on top */}
      {timer.activeSession && (
        <ActiveTimerBar
          taskTitle={timer.activeSession.taskTitle}
          category={timer.activeSession.category}
          elapsedSeconds={timer.elapsedSeconds}
          interruptions={timer.activeSession.interruptions}
          isPaused={timer.isPaused}
          onPause={timer.pauseTask}
          onResume={timer.resumeTask}
          onInterrupt={timer.addInterruption}
          onEnd={handleEndTimer}
        />
      )}

      {/* Desktop Nav */}
      <DesktopNav
        active={activeSection}
        onChange={setActiveSection}
        hasActiveTimer={!!timer.activeSession}
      />

      {/* Main Content */}
      <main className="flex-1 pb-32 md:pb-6">
        <div className="mx-auto max-w-5xl px-3 py-3 md:px-6 md:py-6">
          {/* Dashboard */}
          {activeSection === "dashboard" && (
            <Dashboard
              checkedItems={dayData.checkedItems}
              completionPercentage={completionPercentage}
              completedCount={completedItems}
              totalCount={allItemIds.length}
              mits={dayData.mits}
              energyMetrics={dayData.energyMetrics}
              focusMinutes={dayData.focusMinutes}
              onNavigate={setActiveSection}
              todaySessions={todaySessions}
              analytics={analytics}
              suggestion={suggestion}
            />
          )}

          {/* Routine */}
          {activeSection === "routine" && (
            <div className="flex flex-col gap-3 md:gap-5">
              {/* Title row */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground md:text-xl">
                  Daily Routine
                </h2>
                <span className="text-xs font-mono text-muted-foreground">
                  {completedItems}/{allItemIds.length} done
                </span>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-primary font-semibold shrink-0">
                  {completionPercentage}%
                </span>
              </div>

              <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
                {/* Main column */}
                <div className="flex-1 min-w-0 flex flex-col gap-3">
                  <CategoryNav
                    activeCategory={filterCategory}
                    onCategoryChange={setFilterCategory}
                  />
                  <RoutineTimeline
                    items={routineItems}
                    checkedItems={dayData.checkedItems}
                    onToggle={toggleItem}
                    filterCategory={filterCategory}
                    activeTimerTaskId={timer.activeSession?.taskId}
                    onStartTimer={handleStartTimer}
                  />
                </div>

                {/* Sidebar */}
                <aside className="flex flex-col gap-3 lg:w-80 lg:shrink-0">
                  <PomodoroTimer />
                  <MitPlanner mits={dayData.mits} onUpdateMit={updateMit} />
                  <EnergyInput
                    metrics={dayData.energyMetrics}
                    onUpdate={updateEnergyMetric}
                  />
                </aside>
              </div>
            </div>
          )}

          {/* Analytics */}
          {activeSection === "analytics" && (
            <div className="flex flex-col gap-4 md:gap-5">
              <AnalyticsDashboard
                analytics={analytics}
                todaySessions={todaySessions}
                suggestion={suggestion}
              />
              <SessionHistory sessions={timer.sessions} />
            </div>
          )}

          {/* Growth */}
          {activeSection === "growth" && (
            <div className="flex flex-col gap-3 md:gap-5">
              <h2 className="text-lg font-bold text-foreground md:text-xl">
                Growth & Income
              </h2>
              <GrowthModule
                notes={dayData.growthNotes}
                durations={dayData.growthDurations}
                onUpdateNote={updateGrowthNote}
                onUpdateDuration={updateGrowthDuration}
              />
            </div>
          )}

          {/* Reflect */}
          {activeSection === "reflect" && (
            <div className="flex flex-col gap-3 md:gap-5">
              <h2 className="text-lg font-bold text-foreground md:text-xl">
                Evening Reflection
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-4">
                  <ReflectionJournal
                    reflections={dayData.reflections}
                    onUpdateReflection={updateReflection}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <HabitTracker />
                </div>
              </div>
            </div>
          )}

          {/* Weekly */}
          {activeSection === "weekly" && (
            <div className="flex flex-col gap-3 md:gap-5">
              <h2 className="text-lg font-bold text-foreground md:text-xl">
                Weekly Planning
              </h2>
              <WeeklyReview />
            </div>
          )}
        </div>
      </main>

      {/* Footer - desktop */}
      <footer className="hidden border-t border-border py-3 text-center md:block">
        <p className="text-[11px] text-muted-foreground">
          {"Built for Ali. Small consistency > big bursts. You got this."}
        </p>
      </footer>

      {/* Music Player Widget */}
      <MusicPlayerWidget
        tracks={music.tracks}
        playlists={music.playlists}
        currentTrack={music.currentTrack}
        isPlaying={music.isPlaying}
        volume={music.volume}
        progress={music.progress}
        currentTime={music.currentTime}
        activePlaylistId={music.activePlaylistId}
        onPlay={music.play}
        onTogglePlay={music.togglePlay}
        onSkipNext={music.skipNext}
        onSkipPrev={music.skipPrev}
        onSeekTo={music.seekTo}
        onToggleFavorite={music.toggleFavorite}
        isFavorite={music.isFavorite}
        onCreatePlaylist={music.createPlaylist}
        onAddToPlaylist={music.addToPlaylist}
        onRemoveFromPlaylist={music.removeFromPlaylist}
        onPlayPlaylist={music.playPlaylist}
        onSetVolume={music.setVolumeLevel}
        onUploadFiles={music.addUploadedFiles}
        onAddStreamUrl={music.addStreamUrl}
        onRemoveTrack={music.removeTrack}
      />

      {/* Mobile bottom nav */}
      <MobileNav
        active={activeSection}
        onChange={setActiveSection}
        hasActiveTimer={!!timer.activeSession}
      />

      {/* End task modal */}
      {completedSession && (
        <EndTaskModal
          session={completedSession}
          previousAvgDuration={
            timer.getAdaptiveEstimate(
              completedSession.taskId,
              completedSession.estimatedDuration
            )
          }
          suggestion={suggestion}
          onDismiss={dismissEndModal}
        />
      )}
    </div>
  )
}
