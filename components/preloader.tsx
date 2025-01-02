'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLoading } from '@/context/loading-context'

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [hasVideoError, setHasVideoError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const maxRetries = 3
  const { setPreloaderFinished } = useLoading()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const loadVideo = async () => {
      try {
        // Reset error state on retry
        setHasVideoError(false)

        // Ensure video is loaded
        await video.load()

        // Try to play the video
        await video.play()

        // If successful, mark as ready
        setIsVideoReady(true)
      } catch (error) {
        console.error('Video loading/playing error:', error)
        
        // If we haven't exceeded max retries, try again
        if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1)
          // Exponential backoff for retries
          setTimeout(loadVideo, Math.pow(2, retryCount) * 1000)
        } else {
          setHasVideoError(true)
        }
      }
    }

    const handleCanPlay = () => {
      // Additional check to ensure video can actually play
      if (video.readyState >= 3) { // HAVE_FUTURE_DATA or better
        setIsVideoReady(true)
        video.play().catch(error => {
          console.error('Video playback error:', error)
          setHasVideoError(true)
        })
      }
    }

    const handleError = (e: Event) => {
      console.error('Video error:', e)
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1)
        loadVideo()
      } else {
        setHasVideoError(true)
      }
    }

    // Start loading the video
    loadVideo()

    // Add event listeners
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)

    // Lock scroll while loading
    document.body.style.overflow = 'hidden'

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
      document.body.style.overflow = ''
    }
  }, [retryCount])

  const handleVideoEnded = () => {
    // Only proceed if video has actually played
    if (isVideoReady) {
      setIsLoading(false)
      setPreloaderFinished(true)
    }
  }

  // Unlock scroll when preloader is done
  useEffect(() => {
    if (!isLoading) {
      document.body.style.overflow = ''
      setPreloaderFinished(true)
    }
  }, [isLoading, setPreloaderFinished])

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
                {/* Provide multiple sources for better compatibility */}
                <source 
                  src="https://res.cloudinary.com/ddpumiekp/video/upload/v1735823235/h2bdp3suzfagpqlleohg.webm" 
                  type="video/webm" 
                />
                <source 
                  src="https://res.cloudinary.com/ddpumiekp/video/upload/f_mp4/v1735823235/h2bdp3suzfagpqlleohg.webm" 
                  type="video/mp4" 
                />
                Your browser does not support the video tag.
              </video>
            )}
            <div className="absolute inset-0 bg-black/30" />
            {(!isVideoReady || hasVideoError) && (
              <div className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
                {hasVideoError && retryCount >= maxRetries && (
                  <p className="text-white/60 text-sm">
                    Having trouble loading the video...
                  </p>
                )}
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

