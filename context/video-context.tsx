'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type VideoContextType = {
  loadedVideos: Set<string>
  setVideoLoaded: (id: string) => void
}

const VideoContext = createContext<VideoContextType | undefined>(undefined)

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const [loadedVideos, setLoadedVideos] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('loadedVideos')
      return new Set(saved ? JSON.parse(saved) as string[] : [])
    }
    return new Set()
  })

  useEffect(() => {
    localStorage.setItem('loadedVideos', JSON.stringify(Array.from(loadedVideos)))
  }, [loadedVideos])

  const setVideoLoaded = (id: string) => {
    setLoadedVideos(prev => new Set(prev).add(id))
  }

  return (
    <VideoContext.Provider value={{ loadedVideos, setVideoLoaded }}>
      {children}
    </VideoContext.Provider>
  )
}

export function useVideo() {
  const context = useContext(VideoContext)
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider')
  }
  return context
}

