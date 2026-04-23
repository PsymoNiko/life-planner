"use client"

import { useState, useRef } from "react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Music,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  ListMusic,
  Headphones,
  Plus,
  X,
  Disc3,
  Upload,
  Link2,
  Trash2,
  Radio,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Track, Playlist } from "@/hooks/use-music-player"

type MusicView = "player" | "browse" | "playlists" | "favorites"

const categoryColors: Record<Track["category"], string> = {
  focus: "text-primary",
  ambient: "text-chart-3",
  lofi: "text-accent",
  nature: "text-chart-5",
  uploaded: "text-chart-4",
  stream: "text-chart-2",
}

const categoryBg: Record<Track["category"], string> = {
  focus: "bg-primary/10",
  ambient: "bg-chart-3/10",
  lofi: "bg-accent/10",
  nature: "bg-chart-5/10",
  uploaded: "bg-chart-4/10",
  stream: "bg-chart-2/10",
}

interface MusicPlayerWidgetProps {
  tracks: Track[]
  playlists: Playlist[]
  currentTrack: Track | null
  isPlaying: boolean
  volume: number
  progress: number
  currentTime: number
  activePlaylistId: string | null
  onPlay: (trackId: string) => void
  onTogglePlay: () => void
  onSkipNext: () => void
  onSkipPrev: () => void
  onSeekTo: (percent: number) => void
  onToggleFavorite: (trackId: string) => void
  isFavorite: (trackId: string) => boolean
  onCreatePlaylist: (name: string, trackIds: string[]) => void
  onAddToPlaylist: (playlistId: string, trackId: string) => void
  onRemoveFromPlaylist: (playlistId: string, trackId: string) => void
  onPlayPlaylist: (playlistId: string) => void
  onSetVolume: (v: number) => void
  onUploadFiles: (files: FileList) => void
  onAddStreamUrl: (url: string, title?: string) => void
  onRemoveTrack: (trackId: string) => void
}

function formatTime(secs: number): string {
  if (!secs || isNaN(secs) || secs < 0) return "0:00"
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${String(s).padStart(2, "0")}`
}

export function MusicPlayerWidget({
  tracks,
  playlists,
  currentTrack,
  isPlaying,
  volume,
  progress,
  currentTime,
  activePlaylistId,
  onPlay,
  onTogglePlay,
  onSkipNext,
  onSkipPrev,
  onSeekTo,
  onToggleFavorite,
  isFavorite,
  onCreatePlaylist,
  onAddToPlaylist,
  onRemoveFromPlaylist,
  onPlayPlaylist,
  onSetVolume,
  onUploadFiles,
  onAddStreamUrl,
  onRemoveTrack,
}: MusicPlayerWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [view, setView] = useState<MusicView>("player")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [showNewPlaylist, setShowNewPlaylist] = useState(false)
  const [addToPlaylistTrackId, setAddToPlaylistTrackId] = useState<string | null>(null)
  const [streamUrl, setStreamUrl] = useState("")
  const [streamTitle, setStreamTitle] = useState("")
  const [showStreamInput, setShowStreamInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const favoriteTracks = tracks.filter((t) => isFavorite(t.id))
  const filteredTracks =
    filterCategory === "all"
      ? tracks
      : filterCategory === "favorites"
        ? favoriteTracks
        : tracks.filter((t) => t.category === filterCategory)

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return
    onCreatePlaylist(newPlaylistName.trim(), [])
    setNewPlaylistName("")
    setShowNewPlaylist(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadFiles(e.target.files)
      e.target.value = ""
    }
  }

  const handleAddStream = () => {
    if (!streamUrl.trim()) return
    onAddStreamUrl(streamUrl.trim(), streamTitle.trim() || undefined)
    setStreamUrl("")
    setStreamTitle("")
    setShowStreamInput(false)
  }

  // ---- Mini Player (always visible) ----
  if (!isExpanded) {
    return (
      <div className="fixed bottom-[68px] left-2 right-2 z-30 md:bottom-4 md:left-auto md:right-4 md:w-[340px]">
        <Card className="border-border bg-card/95 backdrop-blur-lg shadow-xl overflow-hidden">
          <CardContent className="p-0">
            {/* Progress bar */}
            <div className="h-[3px] w-full bg-secondary">
              <div
                className="h-full bg-primary transition-all duration-200 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center gap-2 px-2.5 py-2">
              {/* Album art */}
              <button
                onClick={() => setIsExpanded(true)}
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                  currentTrack ? categoryBg[currentTrack.category] : "bg-secondary"
                )}
                aria-label="Expand music player"
              >
                {isPlaying ? (
                  <Disc3
                    className={cn(
                      "size-4 animate-spin",
                      currentTrack ? categoryColors[currentTrack.category] : "text-muted-foreground"
                    )}
                    style={{ animationDuration: "3s" }}
                  />
                ) : (
                  <Music
                    className={cn(
                      "size-3.5",
                      currentTrack ? categoryColors[currentTrack.category] : "text-muted-foreground"
                    )}
                  />
                )}
              </button>

              {/* Track info */}
              <button
                onClick={() => setIsExpanded(true)}
                className="flex flex-1 flex-col min-w-0 text-left"
              >
                <span className="text-xs font-semibold text-foreground truncate">
                  {currentTrack?.title || "No track selected"}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {currentTrack?.artist || "Upload or stream music"}
                </span>
              </button>

              {/* Controls */}
              <div className="flex items-center shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-foreground"
                  onClick={onSkipPrev}
                >
                  <SkipBack className="size-3" />
                  <span className="sr-only">Previous track</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-foreground"
                  onClick={onTogglePlay}
                >
                  {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5 ml-0.5" />}
                  <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-foreground"
                  onClick={onSkipNext}
                >
                  <SkipForward className="size-3" />
                  <span className="sr-only">Next track</span>
                </Button>
              </div>

              {/* Expand */}
              <Button
                variant="ghost"
                size="icon"
                className="size-6 shrink-0 text-muted-foreground hover:text-foreground"
                onClick={() => setIsExpanded(true)}
              >
                <ChevronUp className="size-3.5" />
                <span className="sr-only">Expand player</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ---- Expanded Player ----
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-xl md:inset-auto md:bottom-4 md:right-4 md:w-[400px] md:max-h-[calc(100dvh-2rem)] md:rounded-xl md:border md:border-border md:shadow-2xl">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 shrink-0 md:rounded-t-xl">
        <div className="flex items-center gap-2">
          <Headphones className="size-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Music Player</span>
        </div>
        <div className="flex items-center gap-1">
          {/* Upload button in header */}
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-foreground"
            onClick={() => fileInputRef.current?.click()}
            title="Upload audio files"
          >
            <Upload className="size-3.5" />
            <span className="sr-only">Upload files</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-foreground"
            onClick={() => {
              setShowStreamInput(!showStreamInput)
              setView("browse")
            }}
            title="Add stream URL"
          >
            <Link2 className="size-3.5" />
            <span className="sr-only">Add stream URL</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-foreground"
            onClick={() => setIsExpanded(false)}
          >
            <ChevronDown className="size-4" />
            <span className="sr-only">Collapse player</span>
          </Button>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex border-b border-border bg-card/50 shrink-0">
        {(
          [
            { id: "player", label: "Now Playing", icon: Music },
            { id: "browse", label: "Browse", icon: Headphones },
            { id: "playlists", label: "Playlists", icon: ListMusic },
            { id: "favorites", label: "Likes", icon: Heart },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors md:flex-row md:justify-center md:gap-1.5 md:text-xs",
                view === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-3.5" />
              <span className="truncate">{tab.label}</span>
              {view === tab.id && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* ===== NOW PLAYING ===== */}
        {view === "player" && (
          <div className="flex flex-col items-center gap-4 px-6 py-6">
            {/* Large album art */}
            <div
              className={cn(
                "flex size-32 items-center justify-center rounded-2xl md:size-36",
                currentTrack ? categoryBg[currentTrack.category] : "bg-secondary"
              )}
            >
              {isPlaying ? (
                <Disc3
                  className={cn(
                    "size-14 animate-spin",
                    currentTrack ? categoryColors[currentTrack.category] : "text-muted-foreground"
                  )}
                  style={{ animationDuration: "3s" }}
                />
              ) : (
                <Music
                  className={cn(
                    "size-10",
                    currentTrack ? categoryColors[currentTrack.category] : "text-muted-foreground"
                  )}
                />
              )}
            </div>

            {/* Track info */}
            <div className="flex flex-col items-center gap-1 text-center w-full">
              <h3 className="text-base font-bold text-foreground truncate max-w-full">
                {currentTrack?.title || "Select a track"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {currentTrack?.artist || "Upload, stream, or browse below"}
              </p>
              {currentTrack && (
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
                      categoryBg[currentTrack.category],
                      categoryColors[currentTrack.category]
                    )}
                  >
                    {currentTrack.category}
                  </span>
                  {currentTrack.src && (
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {currentTrack.category === "stream" ? "Streaming" : "Real Audio"}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Seekable progress bar */}
            <div className="flex w-full flex-col gap-1.5">
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => onSeekTo(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:appearance-none"
                aria-label="Seek"
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted-foreground">
                  {formatTime(currentTime)}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {currentTrack ? formatTime(currentTrack.duration) : "0:00"}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {currentTrack && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "size-9",
                    isFavorite(currentTrack.id) ? "text-destructive" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => onToggleFavorite(currentTrack.id)}
                >
                  <Heart className="size-4" fill={isFavorite(currentTrack.id) ? "currentColor" : "none"} />
                  <span className="sr-only">Toggle favorite</span>
                </Button>
              )}
              <Button variant="ghost" size="icon" className="size-10 text-foreground" onClick={onSkipPrev}>
                <SkipBack className="size-5" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button
                size="icon"
                className="size-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={onTogglePlay}
              >
                {isPlaying ? <Pause className="size-6" /> : <Play className="size-6 ml-0.5" />}
                <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
              </Button>
              <Button variant="ghost" size="icon" className="size-10 text-foreground" onClick={onSkipNext}>
                <SkipForward className="size-5" />
                <span className="sr-only">Next</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "size-9",
                  volume === 0 ? "text-destructive" : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => onSetVolume(volume === 0 ? 70 : 0)}
              >
                {volume === 0 ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                <span className="sr-only">Toggle mute</span>
              </Button>
            </div>

            {/* Volume slider */}
            <div className="flex w-full items-center gap-3 px-2">
              <VolumeX className="size-3.5 text-muted-foreground shrink-0" />
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => onSetVolume(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:appearance-none"
                aria-label="Volume"
              />
              <Volume2 className="size-3.5 text-muted-foreground shrink-0" />
              <span className="text-[10px] font-mono text-muted-foreground w-7 text-right shrink-0">
                {volume}
              </span>
            </div>

            {/* Quick-add actions */}
            <div className="flex w-full gap-2 pt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-secondary py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary/80"
              >
                <Upload className="size-3.5" />
                Upload File
              </button>
              <button
                onClick={() => {
                  setShowStreamInput(true)
                  setView("browse")
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-secondary py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary/80"
              >
                <Link2 className="size-3.5" />
                Stream URL
              </button>
            </div>
          </div>
        )}

        {/* ===== BROWSE ===== */}
        {view === "browse" && (
          <div className="flex flex-col gap-0 p-3">
            {/* Stream URL input */}
            {showStreamInput && (
              <div className="flex flex-col gap-2 rounded-lg bg-secondary/80 p-3 mb-3">
                <div className="flex items-center gap-2">
                  <Radio className="size-4 text-chart-2 shrink-0" />
                  <span className="text-xs font-semibold text-foreground">Add Streaming URL</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 ml-auto text-muted-foreground"
                    onClick={() => setShowStreamInput(false)}
                  >
                    <X className="size-3.5" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
                <Input
                  placeholder="https://example.com/audio.mp3"
                  value={streamUrl}
                  onChange={(e) => setStreamUrl(e.target.value)}
                  className="h-8 text-xs bg-card border-border text-foreground placeholder:text-muted-foreground"
                />
                <Input
                  placeholder="Title (optional)"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddStream()}
                  className="h-8 text-xs bg-card border-border text-foreground placeholder:text-muted-foreground"
                />
                <Button
                  size="sm"
                  className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleAddStream}
                  disabled={!streamUrl.trim()}
                >
                  Add Stream
                </Button>
              </div>
            )}

            {/* Upload drop zone */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-secondary/30 p-3 mb-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary/50 hover:border-primary/30"
            >
              <Upload className="size-4 shrink-0" />
              <div className="flex flex-col text-left">
                <span>Upload audio files</span>
                <span className="text-[10px] font-normal">MP3, WAV, OGG, FLAC, M4A supported</span>
              </div>
            </button>

            {/* Category filters */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-3 -mx-1 px-1">
              {["all", "focus", "lofi", "ambient", "nature", "uploaded", "stream"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={cn(
                    "rounded-lg px-2.5 py-1.5 text-[11px] font-medium whitespace-nowrap transition-colors capitalize",
                    filterCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-secondary-foreground"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Track list */}
            <div className="flex flex-col gap-1.5">
              {filteredTracks.length > 0 ? (
                filteredTracks.map((track) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    isActive={track.id === currentTrack?.id}
                    isPlaying={track.id === currentTrack?.id && isPlaying}
                    isFav={isFavorite(track.id)}
                    onPlay={() => onPlay(track.id)}
                    onToggleFav={() => onToggleFavorite(track.id)}
                    onAddToPlaylist={() => setAddToPlaylistTrackId(track.id)}
                    isRemovable={track.category === "uploaded" || track.category === "stream"}
                    onRemove={() => onRemoveTrack(track.id)}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center gap-2 py-6 text-center">
                  <Headphones className="size-8 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    No tracks in this category. Upload files or add a stream URL.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== PLAYLISTS ===== */}
        {view === "playlists" && (
          <div className="flex flex-col gap-3 p-3">
            {showNewPlaylist ? (
              <div className="flex items-center gap-2 rounded-lg bg-secondary p-3">
                <Input
                  placeholder="Playlist name..."
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreatePlaylist()}
                  className="h-8 text-xs bg-card border-border text-foreground placeholder:text-muted-foreground"
                  autoFocus
                />
                <Button
                  size="sm"
                  className="h-8 px-3 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleCreatePlaylist}
                >
                  Create
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 text-muted-foreground"
                  onClick={() => setShowNewPlaylist(false)}
                >
                  <X className="size-3.5" />
                  <span className="sr-only">Cancel</span>
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setShowNewPlaylist(true)}
                className="flex items-center gap-2 rounded-lg bg-secondary p-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary/80"
              >
                <Plus className="size-4" />
                New Playlist
              </button>
            )}

            {playlists.map((pl) => {
              const isActive = pl.id === activePlaylistId
              const plTracks = pl.trackIds
                .map((id) => tracks.find((t) => t.id === id))
                .filter(Boolean) as Track[]
              const totalDuration = plTracks.reduce((s, t) => s + t.duration, 0)

              return (
                <div
                  key={pl.id}
                  className={cn(
                    "rounded-lg border bg-card p-3 transition-colors",
                    isActive ? "border-primary/30" : "border-border"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <ListMusic
                        className={cn("size-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")}
                      />
                      <span className="text-xs font-semibold text-foreground truncate">{pl.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {plTracks.length} tracks - {formatTime(totalDuration)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => onPlayPlaylist(pl.id)}
                      >
                        <Play className="size-3 ml-0.5 text-primary" />
                        <span className="sr-only">Play playlist {pl.name}</span>
                      </Button>
                    </div>
                  </div>
                  {plTracks.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {plTracks.map((track) => (
                        <div
                          key={track.id}
                          className="flex items-center gap-2 rounded-md bg-secondary px-2.5 py-1.5"
                        >
                          <Disc3 className={cn("size-3 shrink-0", categoryColors[track.category])} />
                          <span className="text-[11px] text-foreground truncate flex-1">{track.title}</span>
                          <span className="text-[9px] font-mono text-muted-foreground shrink-0">
                            {formatTime(track.duration)}
                          </span>
                          <button
                            onClick={() => onRemoveFromPlaylist(pl.id, track.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                          >
                            <X className="size-3" />
                            <span className="sr-only">Remove from playlist</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-muted-foreground">
                      Empty playlist. Add tracks from Browse.
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ===== FAVORITES ===== */}
        {view === "favorites" && (
          <div className="flex flex-col gap-1.5 p-3">
            {favoriteTracks.length > 0 ? (
              favoriteTracks.map((track) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  isActive={track.id === currentTrack?.id}
                  isPlaying={track.id === currentTrack?.id && isPlaying}
                  isFav
                  onPlay={() => onPlay(track.id)}
                  onToggleFav={() => onToggleFavorite(track.id)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Heart className="size-8 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  No favorites yet. Tap the heart on any track.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add to playlist popover */}
      {addToPlaylistTrackId && (
        <div className="border-t border-border bg-card p-3 shrink-0 md:rounded-b-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground">Add to Playlist</span>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 text-muted-foreground"
              onClick={() => setAddToPlaylistTrackId(null)}
            >
              <X className="size-3.5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto scrollbar-hide">
            {playlists.map((pl) => (
              <button
                key={pl.id}
                onClick={() => {
                  onAddToPlaylist(pl.id, addToPlaylistTrackId)
                  setAddToPlaylistTrackId(null)
                }}
                className="flex items-center gap-2 rounded-lg bg-secondary p-2.5 text-left transition-colors hover:bg-secondary/80"
              >
                <ListMusic className="size-3.5 text-muted-foreground shrink-0" />
                <span className="text-xs text-foreground truncate">{pl.name}</span>
                <span className="text-[10px] font-mono text-muted-foreground ml-auto shrink-0">
                  {pl.trackIds.length} tracks
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TrackRow({
  track,
  isActive,
  isPlaying,
  isFav,
  onPlay,
  onToggleFav,
  onAddToPlaylist,
  isRemovable,
  onRemove,
}: {
  track: Track
  isActive: boolean
  isPlaying: boolean
  isFav: boolean
  onPlay: () => void
  onToggleFav: () => void
  onAddToPlaylist?: () => void
  isRemovable?: boolean
  onRemove?: () => void
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg p-2 transition-colors",
        isActive ? "bg-primary/10 border border-primary/20" : "bg-secondary hover:bg-secondary/80"
      )}
    >
      {/* Play button */}
      <button
        onClick={onPlay}
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
          categoryBg[track.category]
        )}
        aria-label={`Play ${track.title}`}
      >
        {isPlaying ? (
          <Disc3
            className={cn("size-3.5 animate-spin", categoryColors[track.category])}
            style={{ animationDuration: "3s" }}
          />
        ) : (
          <Play className={cn("size-3 ml-0.5", categoryColors[track.category])} />
        )}
      </button>

      {/* Info */}
      <button onClick={onPlay} className="flex flex-1 flex-col min-w-0 text-left">
        <span className={cn("text-xs font-medium truncate", isActive ? "text-primary" : "text-foreground")}>
          {track.title}
        </span>
        <span className="text-[10px] text-muted-foreground truncate">
          {track.artist}
          {track.duration > 0 ? ` - ${formatTime(track.duration)}` : ""}
        </span>
      </button>

      {/* Actions */}
      <div className="flex items-center shrink-0">
        <button
          onClick={onToggleFav}
          className={cn(
            "flex size-7 items-center justify-center rounded-md transition-colors",
            isFav ? "text-destructive" : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className="size-3" fill={isFav ? "currentColor" : "none"} />
        </button>
        {onAddToPlaylist && (
          <button
            onClick={onAddToPlaylist}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Add to playlist"
          >
            <Plus className="size-3" />
          </button>
        )}
        {isRemovable && onRemove && (
          <button
            onClick={onRemove}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Remove track"
          >
            <Trash2 className="size-3" />
          </button>
        )}
      </div>
    </div>
  )
}
