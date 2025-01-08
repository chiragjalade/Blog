'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Play, Pause } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { useState, useRef, useEffect } from 'react'
import { Inter } from 'next/font/google'
import { OptimizedImage } from "@/components/optimized-image"
import { useInView } from 'react-intersection-observer'

const inter = Inter({ subsets: ['latin'] })

export default function GANPage() {
  const router = useRouter()
  const [isExiting, setIsExiting] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.5, // autoplay only when : 50% of the video is visible in viewport
  })

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsExiting(true)
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle video playback based on viewport visibility
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (inView) {
      if (isPlaying) {
        video.play().catch(() => {
          // Handle autoplay failure
          setIsPlaying(false)
        })
      }
    } else {
      video.pause()
    }
  }, [inView, isPlaying])

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99],
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99],
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  return (
    <>
      <SiteHeader />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="min-h-screen bg-black"
      >
        <AnimatePresence mode="wait" onExitComplete={() => router.back()}>
          {!isExiting && (
            <motion.article 
              key="article"
              className="container mx-auto max-w-screen-xl px-6 sm:px-4 pt-24 pb-16 md:px-6 md:pt-32 md:pb-24"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="mx-auto max-w-3xl">
                <motion.div
                  variants={itemVariants}
                  className="mb-8"
                >
                  <Button
                    onClick={handleBack}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white hover:text-black transition-colors duration-200 rounded-full px-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </motion.div>
                <motion.header variants={itemVariants} className="mb-12 md:mb-16 text-center">
                  <motion.time 
                    variants={itemVariants}
                    dateTime="2024-01-08" 
                    className="block text-sm text-white/60 mb-4"
                  >
                    January 8, 2024
                  </motion.time>
                  <motion.h1 
                    variants={itemVariants}
                    className="text-4xl md:text-6xl font-medium text-white mb-6"
                  >
                    WTF are GANs?
                  </motion.h1>
                  <motion.p 
                    variants={itemVariants}
                    className="text-xl md:text-2xl text-white/90 mb-4"
                  >
                    The AI wizardry behind generating fake stuff that looks real AF
                  </motion.p>
                  <motion.div
                    variants={itemVariants}
                    className={`text-sm text-white/60 ${inter.className} font-medium`}
                  >
                    Chirag Jalade
                  </motion.div>
                </motion.header>
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
                >
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-black hover:bg-white/90 rounded-full px-8"
                  >
                    <Link href="#learn-more">See Examples</Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    size="lg"
                    className="text-white hover:bg-white/10 rounded-full px-8"
                  >
                    <Link href="#playground" className="flex items-center gap-2">
                      Try it yourself
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div 
                  variants={itemVariants}
                  className="prose prose-invert mx-auto px-2 sm:px-0 mb-12"
                >
                  <p className="text-lg md:text-xl text-white/90">
                    Imagine two AI networks locked in an epic battle: one trying to create fake stuff, the other trying to spot the fakes. That&apos;s a GAN (Generative Adversarial Network) in a nutshell. Check out more at{" "}
                    <Link href="https://gan-explained.com" className="text-white hover:text-white/90 underline underline-offset-4">
                      gan-explained.com
                    </Link>
                    .
                  </p>
                  <p className="text-lg md:text-xl text-white/90">
                    The &quot;Generator&quot; is like an art forger, getting better at creating fake images, videos, or whatever you want. Meanwhile, the &quot;Discriminator&quot; is like a detective, trying to catch these fakes. As they duke it out, both get scary good at their jobs.
                  </p>
                  <p className="text-lg md:text-xl text-white/90">
                    Welcome to our no-BS guide to understanding how GANs create those mind-bending deepfakes and AI art you&apos;ve been seeing everywhere.
                  </p>
                </motion.div>
                <motion.div 
                  ref={inViewRef}
                  variants={itemVariants}
                  className="relative w-full lg:w-[135%] lg:-ml-[17.5%] aspect-video mb-8 overflow-hidden rounded-lg"
                >
                  <OptimizedImage
                    src="https://res.cloudinary.com/ddpumiekp/image/upload/v1736337402/carousel-card-images/Article's%20media/hb3msjtgrrzkabcuo6l8.webp"
                    alt="Generative Adversarial Networks"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 1200px, 1600px"
                    priority
                  />
                  <div className="absolute inset-2 overflow-hidden rounded-lg">
                    <video
                      ref={videoRef}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
                      src="https://res.cloudinary.com/ddpumiekp/video/upload/v1736337185/carousel-card-images/Article's%20media/kn50px927rhivvxku97f.webm"
                      loop
                      muted
                      playsInline
                      onCanPlay={() => setIsVideoLoaded(true)}
                    />
                    <button
                      onClick={togglePlayPause}
                      className="absolute bottom-4 left-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-200"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.article>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

