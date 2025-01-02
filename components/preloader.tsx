'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [hasVideoError, setHasVideoError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => {
      setIsVideoReady(true)
      video.play().catch(error => {
        console.error('Video playback error:', error)
        setHasVideoError(true)
      })
    }

    const handleError = (e: ErrorEvent) => {
      console.error('Video error:', e)
      setHasVideoError(true)
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError as EventListener)

    // Lock scroll
    document.body.style.overflow = 'hidden'

    // Fallback timeout in case video doesn't load
    timeoutRef.current = setTimeout(() => {
      if (!isVideoReady && !hasVideoError) {
        setHasVideoError(true)
      }
    }, 5000) // 5 seconds timeout

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError as EventListener)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isVideoReady, hasVideoError])

  const handleVideoEnded = () => {
    setIsLoading(false)
  }

  useEffect(() => {
    if (!isLoading) {
      // Unlock scroll when preloader disappears
      document.body.style.overflow = ''
    }
  }, [isLoading])

  useEffect(() => {
    if (hasVideoError) {
      // If video fails to load, end the preloader after a short delay
      const errorTimeout = setTimeout(() => {
        setIsLoading(false)
      }, 2000) // 2 seconds delay to show the loading circle

      return () => clearTimeout(errorTimeout)
    }
  }, [hasVideoError])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-black"
        >
          <div className="relative h-screen w-screen overflow-hidden">
            {!hasVideoError && (
              <video
                ref={videoRef}
                muted
                playsInline
                preload="auto"
                onEnded={handleVideoEnded}
                className={`absolute inset-0 h-full w-full md:object-cover object-contain ${
                  isVideoReady ? 'opacity-100' : 'opacity-0'
                } transition-opacity duration-300`}
              >
                <source 
                  src="https://res.cloudinary.com/ddpumiekp/video/upload/q_auto,f_auto,w_auto,c_scale/v1735737212/laz0pfn5ufh7toqsgv5k.mp4" 
                  type="video/mp4" 
                />
              </video>
            )}
            <div className="absolute inset-0 bg-black/30" />
            {(!isVideoReady || hasVideoError) && (
              <div className="absolute inset-0 bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <motion.div 
              className="absolute bottom-16 sm:bottom-20 left-0 right-0 flex justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ 
                duration: 0.5, 
                ease: "easeOut",
                delay: isVideoReady ? 0.3 : 0 
              }}
            >
              <a 
                href="#" 
                className="text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200 border-b border-gray-400 hover:border-gray-300"
              >
                c27/blog
              </a>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

