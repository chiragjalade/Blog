'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

type LoadingContextType = {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  resetLoading: () => void
  preloaderFinished: boolean
  setPreloaderFinished: (finished: boolean) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [preloaderFinished, setPreloaderFinished] = useState(false)

  const resetLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, resetLoading, preloaderFinished, setPreloaderFinished }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (typeof window === 'undefined') {
    // Return a dummy context for server-side rendering
    return {
      isLoading: false,
      setIsLoading: () => {},
      resetLoading: () => {},
      preloaderFinished: true,
      setPreloaderFinished: () => {},
    }
  }
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

