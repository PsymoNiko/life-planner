"use client"

import { useState, useCallback, useRef, useEffect } from "react"

export interface Track {
  id: string
  title: string
  artist: string
  duration: number // seconds, 0 until loaded
  src: string // blob URL or streaming URL
  category: "focus" | "ambient" | "lofi" | "nature" | "uploaded" | "stream"
}

export interface Playlist {
  id: string
  name: string
  trackIds: string[]
}

// Built-in demo tracks (no real audio -- they simulate progress only)
const DEMO_TRACKS: Track[] = [
  { id: "t1", title: "Deep Focus Flow", artist: "Ambient Lab", duration: 240, src: "", category: "focus" },
  { id: "t2", title: "Morning Code", artist: "Lo-Fi Waves", duration: 195, src: "", category: "lofi" },
  { id: "t3", title: "Zen Garden", artist: "Nature Sounds", duration: 300, src: "", category: "nature" },
  { id: "t4", title: "Neural Net", artist: "Synthwave FM", duration: 210, src: "", category: "focus" },
  { id: "t5", title: "Rain on Glass", artist: "Nature Sounds", duration: 360, src: "", category: "nature" },
  { id: "t6", title: "Warm Tape Hiss", artist: "Lo-Fi Waves", duration: 180, src: "", category: "lofi" },
  { id: "t7", title: "Orbital Drift", artist: "Ambient Lab", duration: 270, src: "", category: "ambient" },
  { id: "t8", title: "Coffee Shop Hum", artist: "Lo-Fi Waves", duration: 220, src: "", category: "lofi" },
  { id: "t9", title: "Forest Creek", artist: "Nature Sounds", duration: 330, src: "", category: "nature" },
  { id: "t10", title: "Binary Sunset", artist: "Synthwave FM", duration: 190, src: "", category: "ambient" },
  { id: "t11", title: "Keyboard Clicks", artist: "Ambient Lab", duration: 250, src: "", category: "focus" },
  { id: "t12", title: "Ocean Waves", artist: "Nature Sounds", duration: 400, src: "", category: "nature" },
]

const DEFAULT_PLAYLISTS: Playlist[] = [
  { id: "pl-focus", name: "Deep Focus", trackIds: ["t1", "t4", "t11"] },
  { id: "pl-chill", name: "Chill Coding", trackIds: ["t2", "t6", "t8"] },
  { id: "pl-nature", name: "Nature Calm", trackIds: ["t3", "t5", "t9", "t12"] },
]

export function useMusicPlayer() {
  const [tracks, setTracks] = useState<Track[]>(DEMO_TRACKS)
  const [playlists, setPlaylists] = useState<Playlist[]>(DEFAULT_PLAYLISTS)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(70)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const simulatedInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const simulatedProgress = useRef(0)
  const skipNextRef = useRef<() => void>(() => {})

  const currentTrack = tracks.find((t) => t.id === currentTrackId) || null
  const hasRealAudio = currentTrack ? currentTrack.src !== "" : false

  // ---- Real audio element management ----
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }
    const audio = audioRef.current

    const onTimeUpdate = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setProgress((audio.currentTime / audio.duration) * 100)
        setCurrentTime(audio.currentTime)
      }
    }

    const onEnded = () => {
      skipNextRef.current()
    }

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && currentTrackId) {
        setTracks((prev) =>
          prev.map((t) =>
            t.id === currentTrackId ? { ...t, duration: Math.round(audio.duration) } : t
          )
        )
      }
    }

    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("ended", onEnded)
    audio.addEventListener("loadedmetadata", onLoadedMetadata)

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("ended", onEnded)
      audio.removeEventListener("loadedmetadata", onLoadedMetadata)
    }
  }, [currentTrackId])

  // Volume sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  // ---- Simulated progress for demo tracks (no src) ----
  useEffect(() => {
    if (isPlaying && currentTrack && !hasRealAudio) {
      const stepMs = 200
      const totalSteps = (currentTrack.duration * 1000) / stepMs
      const stepPercent = 100 / totalSteps
      simulatedInterval.current = setInterval(() => {
        simulatedProgress.current += stepPercent
        if (simulatedProgress.current >= 100) {
          simulatedProgress.current = 0
          skipNextRef.current()
          return
        }
        setProgress(simulatedProgress.current)
        setCurrentTime((simulatedProgress.current / 100) * currentTrack.duration)
      }, stepMs)
    }
    return () => {
      if (simulatedInterval.current) clearInterval(simulatedInterval.current)
    }
  }, [isPlaying, currentTrackId, currentTrack, hasRealAudio])

  // ---- Core controls ----
  const play = useCallback(
    (trackId: string) => {
      const track = tracks.find((t) => t.id === trackId) || DEMO_TRACKS.find((t) => t.id === trackId)
      if (!track) return

      setCurrentTrackId(trackId)
      setProgress(0)
      setCurrentTime(0)
      simulatedProgress.current = 0

      if (track.src) {
        const audio = audioRef.current
        if (audio) {
          audio.src = track.src
          audio.load()
          audio.play().catch(() => {})
        }
      } else {
        // Pause real audio if switching to a demo track
        audioRef.current?.pause()
      }

      setIsPlaying(true)
    },
    [tracks]
  )

  const togglePlay = useCallback(() => {
    if (!currentTrackId && tracks.length > 0) {
      play(tracks[0].id)
      return
    }

    setIsPlaying((prev) => {
      const next = !prev
      if (hasRealAudio && audioRef.current) {
        if (next) {
          audioRef.current.play().catch(() => {})
        } else {
          audioRef.current.pause()
        }
      }
      return next
    })
  }, [currentTrackId, tracks, play, hasRealAudio])

  const pause = useCallback(() => {
    setIsPlaying(false)
    audioRef.current?.pause()
  }, [])

  const getQueue = useCallback((): Track[] => {
    if (activePlaylistId) {
      const pl = playlists.find((p) => p.id === activePlaylistId)
      if (pl) return pl.trackIds.map((id) => tracks.find((t) => t.id === id)!).filter(Boolean)
    }
    return tracks
  }, [activePlaylistId, playlists, tracks])

  const skipNext = useCallback(() => {
    const queue = getQueue()
    if (queue.length === 0) return
    const currentIndex = queue.findIndex((t) => t.id === currentTrackId)
    const nextIndex = (currentIndex + 1) % queue.length
    play(queue[nextIndex].id)
  }, [currentTrackId, getQueue, play])

  useEffect(() => {
    skipNextRef.current = skipNext
  }, [skipNext])

  const skipPrev = useCallback(() => {
    const queue = getQueue()
    if (queue.length === 0) return
    const currentIndex = queue.findIndex((t) => t.id === currentTrackId)
    const prevIndex = currentIndex <= 0 ? queue.length - 1 : currentIndex - 1
    play(queue[prevIndex].id)
  }, [currentTrackId, getQueue, play])

  // ---- Seek ----
  const seekTo = useCallback(
    (percent: number) => {
      setProgress(percent)
      if (hasRealAudio && audioRef.current && audioRef.current.duration) {
        audioRef.current.currentTime = (percent / 100) * audioRef.current.duration
      } else if (currentTrack) {
        simulatedProgress.current = percent
        setCurrentTime((percent / 100) * currentTrack.duration)
      }
    },
    [hasRealAudio, currentTrack]
  )

  // ---- Upload files ----
  const addUploadedFiles = useCallback(
    (files: FileList) => {
      const newTracks: Track[] = []
      Array.from(files).forEach((file) => {
        if (!file.type.startsWith("audio/")) return
        const blobUrl = URL.createObjectURL(file)
        const name = file.name.replace(/\.[^/.]+$/, "")
        const id = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
        newTracks.push({
          id,
          title: name,
          artist: "Local File",
          duration: 0, // will be resolved on loadedmetadata
          src: blobUrl,
          category: "uploaded",
        })
      })
      if (newTracks.length > 0) {
        setTracks((prev) => [...prev, ...newTracks])
      }
      return newTracks
    },
    []
  )

  // ---- Add streaming URL ----
  const addStreamUrl = useCallback(
    (url: string, title?: string) => {
      const id = `stream-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      const track: Track = {
        id,
        title: title || url.split("/").pop()?.split("?")[0] || "Stream",
        artist: "Streaming",
        duration: 0,
        src: url,
        category: "stream",
      }
      setTracks((prev) => [...prev, track])
      return track
    },
    []
  )

  // ---- Favorites ----
  const toggleFavorite = useCallback((trackId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(trackId)) next.delete(trackId)
      else next.add(trackId)
      return next
    })
  }, [])

  const isFavorite = useCallback(
    (trackId: string) => favorites.has(trackId),
    [favorites]
  )

  // ---- Playlists ----
  const createPlaylist = useCallback(
    (name: string, trackIds: string[]) => {
      const newPl: Playlist = { id: `pl-${Date.now()}`, name, trackIds }
      setPlaylists((prev) => [...prev, newPl])
      return newPl
    },
    []
  )

  const addToPlaylist = useCallback(
    (playlistId: string, trackId: string) => {
      setPlaylists((prev) =>
        prev.map((pl) =>
          pl.id === playlistId && !pl.trackIds.includes(trackId)
            ? { ...pl, trackIds: [...pl.trackIds, trackId] }
            : pl
        )
      )
    },
    []
  )

  const removeFromPlaylist = useCallback(
    (playlistId: string, trackId: string) => {
      setPlaylists((prev) =>
        prev.map((pl) =>
          pl.id === playlistId
            ? { ...pl, trackIds: pl.trackIds.filter((id) => id !== trackId) }
            : pl
        )
      )
    },
    []
  )

  const playPlaylist = useCallback(
    (playlistId: string) => {
      const pl = playlists.find((p) => p.id === playlistId)
      if (!pl || pl.trackIds.length === 0) return
      setActivePlaylistId(playlistId)
      play(pl.trackIds[0])
    },
    [playlists, play]
  )

  const setVolumeLevel = useCallback((v: number) => {
    setVolume(Math.max(0, Math.min(100, v)))
  }, [])

  // ---- Remove track ----
  const removeTrack = useCallback(
    (trackId: string) => {
      const track = tracks.find((t) => t.id === trackId)
      if (track?.src?.startsWith("blob:")) {
        URL.revokeObjectURL(track.src)
      }
      if (currentTrackId === trackId) {
        audioRef.current?.pause()
        setCurrentTrackId(null)
        setIsPlaying(false)
        setProgress(0)
      }
      setTracks((prev) => prev.filter((t) => t.id !== trackId))
      setPlaylists((prev) =>
        prev.map((pl) => ({
          ...pl,
          trackIds: pl.trackIds.filter((id) => id !== trackId),
        }))
      )
    },
    [tracks, currentTrackId]
  )

  return {
    tracks,
    playlists,
    favorites,
    currentTrack,
    currentTrackId,
    isPlaying,
    volume,
    progress,
    currentTime,
    activePlaylistId,
    play,
    togglePlay,
    pause,
    skipNext,
    skipPrev,
    seekTo,
    toggleFavorite,
    isFavorite,
    createPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    playPlaylist,
    setVolumeLevel,
    setActivePlaylistId,
    addUploadedFiles,
    addStreamUrl,
    removeTrack,
  }
}
