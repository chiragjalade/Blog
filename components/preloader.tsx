'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLoading } from '@/context/loading-context'
import { preloadAllVideos } from '@/lib/video-cache'

// Define all video URLs that need to be preloaded
const ALL_VIDEOS = [
  // Preloader video
  "https://res.cloudinary.com/ddpumiekp/video/upload/v1735823235/h2bdp3suzfagpqlleohg.webm",
  // Hero carousel videos
  "https://res.cloudinary.com/ddpumiekp/video/upload/v1735823236/lzin8boldj9y0lwkr2c6.webm",
  "https://res.cloudinary.com/ddpumiekp/video/upload/v1735823235/j00jvvlp7qbup2ssn0kp.webm",
  "https://res.cloudinary.com/ddpumiekp/video/upload/v1735823685/udrlrpx0hq4sl3hmon21.webm"
]

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [hasVideoError, setHasVideoError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const maxRetries = 3
  const { setPreloaderFinished } = useLoading()

  // Preload all videos when component mounts
  useEffect(() => {
    const preloadVideos = async () => {
      await preloadAllVideos(ALL_VIDEOS)
    }
    preloadVideos()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const loadVideo = async () => {
      try {
        setHasVideoError(false)
        await video.load()
        await video.play()
        setIsVideoReady(true)
      } catch (error) {
        console.error('Video loading/playing error:', error)
        if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1)
          setTimeout(loadVideo, Math.pow(2, retryCount) * 1000)
        } else {
          setHasVideoError(true)
        }
      }
    }

    const handleCanPlay = () => {
      if (video.readyState >= 3) {
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

    loadVideo()
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)
    document.body.style.overflow = 'hidden'

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
      document.body.style.overflow = ''
    }
  }, [retryCount])

  const handleVideoEnded = () => {
    if (isVideoReady) {
      setIsLoading(false)
      setPreloaderFinished(true)
    }
  }

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