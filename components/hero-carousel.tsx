'use client'

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { useLoading } from '@/context/loading-context'
import { preloadAllVideos } from '@/lib/video-cache'

const heroItems = [
  {
    id: "sora",
    title: "Sora",
    description: "Bring your imagination to life from text, image, or video.",
    background: {
      type: "video",
      src: "https://res.cloudinary.com/ddpumiekp/video/upload/v1735823236/lzin8boldj9y0lwkr2c6.webm",
      poster: "https://res.cloudinary.com/ddpumiekp/image/upload/v1735945674/hero-carousel-preload-images/jwqdqj2hr0yqkukocaa3.png",
      fallback: "https://res.cloudinary.com/ddpumiekp/image/upload/v1735945674/hero-carousel-preload-images/jwqdqj2hr0yqkukocaa3.png",
    },
    link: "/sora",
  },
  {
    id: "chatgpt",
    title: "ChatGPT",
    description: "Get started with our most advanced AI assistant.",
    background: {
      type: "video",
      src: "https://res.cloudinary.com/ddpumiekp/video/upload/v1735823235/j00jvvlp7qbup2ssn0kp.webm",
      poster: "https://res.cloudinary.com/ddpumiekp/image/upload/v1735945787/hero-carousel-preload-images/a1jqcdhp5qxlirqdoks1.png",
      fallback: "https://res.cloudinary.com/ddpumiekp/image/upload/v1735945787/hero-carousel-preload-images/a1jqcdhp5qxlirqdoks1.png",
    },
    link: "/chatgpt",
  },
  {
    id: "dalle",
    title: "DALL·E 3",
    description: "Create stunning images with our most advanced image generation model.",
    background: {
      type: "video",
      src: "https://res.cloudinary.com/ddpumiekp/video/upload/v1735823685/udrlrpx0hq4sl3hmon21.webm",
      poster: "https://res.cloudinary.com/ddpumiekp/image/upload/v1735945879/hero-carousel-preload-images/lrwbj2hk1vfrna0dngau.png",
      fallback: "https://res.cloudinary.com/ddpumiekp/image/upload/v1735945879/hero-carousel-preload-images/lrwbj2hk1vfrna0dngau.png",
    },
    link: "/dalle",
  },
]

export function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi | null>(null)
  const [current, setCurrent] = React.useState(0)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const { preloaderFinished } = useLoading()
  const autoplayRef = React.useRef<NodeJS.Timeout | null>(null)
  const videoRefs = React.useRef<Map<string, HTMLVideoElement>>(new Map())
  const [isPaused, setIsPaused] = React.useState(false)
  const [videoStates, setVideoStates] = React.useState<Map<string, { isLoaded: boolean, isPlaying: boolean, hasError: boolean }>>(new Map())

  // Initialize video states
  React.useEffect(() => {
    const initialStates = new Map()
    heroItems.forEach(item => {
      initialStates.set(item.id, { isLoaded: false, isPlaying: false, hasError: false })
    })
    setVideoStates(initialStates)
  }, [])

  React.useEffect(() => {
    // Preload all videos and poster images
    preloadAllVideos(heroItems.map(item => ({
      src: item.background.src,
      poster: item.background.poster
    })))
  }, [])

  const startAutoplay = React.useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
    }
    autoplayRef.current = setInterval(() => {
      if (!isPaused && api) {
        api.scrollNext()
      }
    }, 5000)
  }, [api, isPaused])

  const resetAutoplay = React.useCallback(() => {
    setIsPaused(false);
    startAutoplay();
  }, [startAutoplay]);

  React.useEffect(() => {
    if (!api || !preloaderFinished) return

    const onSelect = () => {
      setActiveIndex(api.selectedScrollSnap())
      setCurrent(api.selectedScrollSnap())
    }

    api.on("select", onSelect)
    startAutoplay()

    return () => {
      api.off("select", onSelect)
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [api, startAutoplay, preloaderFinished])

  const handleVideoLoad = React.useCallback((id: string) => {
    setVideoStates(prev => {
      const newStates = new Map(prev)
      newStates.set(id, { ...newStates.get(id)!, isLoaded: true })
      return newStates
    })
  }, [])

  const handleVideoPlay = React.useCallback((id: string) => {
    setVideoStates(prev => {
      const newStates = new Map(prev)
      newStates.set(id, { ...newStates.get(id)!, isPlaying: true })
      return newStates
    })
  }, [])

  const handleVideoError = React.useCallback((id: string) => {
    setVideoStates(prev => {
      const newStates = new Map(prev)
      newStates.set(id, { ...newStates.get(id)!, hasError: true })
      return newStates
    })
    console.error(`Error loading video for ${id}`)
  }, [])

  const playVideo = React.useCallback(async (video: HTMLVideoElement, id: string) => {
    try {
      await video.play()
      handleVideoPlay(id)
    } catch (error) {
      console.error('Video playback error:', error)
      handleVideoError(id)
    }
  }, [handleVideoPlay, handleVideoError])

  React.useEffect(() => {
    videoRefs.current.forEach((video, id) => {
      if (video && !videoStates.get(id)?.isPlaying && !videoStates.get(id)?.hasError) {
        playVideo(video, id)
      }
    })
  }, [videoStates, playVideo])

  const setVideoRef = React.useCallback((el: HTMLVideoElement | null, id: string) => {
    if (el) {
      videoRefs.current.set(id, el)
      // Attempt to play the video as soon as the ref is set
      playVideo(el, id)
    } else {
      videoRefs.current.delete(id)
    }
  }, [playVideo])

  const handleMouseEnter = (event: React.MouseEvent) => {
    if (event.currentTarget === event.target) {
      setIsPaused(true);
    }
  }

  const handleMouseLeave = (event: React.MouseEvent) => {
    if (event.currentTarget === event.target) {
      setIsPaused(false);
      startAutoplay();
    }
  }

  return (
    <div 
      className="w-screen relative overflow-visible left-1/2 right-1/2 -mx-[50vw]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          loop: true,
          align: "center",
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4 overflow-visible">
          {heroItems.map((item, index) => (
            <CarouselItem 
              key={index} 
              className="pl-4 basis-[85%] md:basis-[85%] overflow-visible"
              onClick={resetAutoplay}
            >
              <div className="relative h-[60vh] md:h-[75vh] overflow-hidden rounded-md">
                {item.background.type === 'video' ? (
                  <>
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.background.poster})` }}
                    />
                    <video
                      ref={(el) => setVideoRef(el, item.id)}
                      src={item.background.src}
                      poster={item.background.poster}
                      muted
                      loop
                      playsInline
                      autoPlay
                      className="absolute inset-0 w-full h-full object-cover"
                      onLoadedData={() => handleVideoLoad(item.id)}
                      onPlaying={() => handleVideoPlay(item.id)}
                      onError={() => handleVideoError(item.id)}
                    >
                      <source src={item.background.src} type="video/webm" />
                      <source src={item.background.src.replace('.webm', '.mp4')} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    {videoStates.get(item.id)?.hasError && (
                      <Image
                        src={item.background.fallback}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20 rounded-xl" />
                  </>
                ) : (
                  <Image
                    src={item.background.src}
                    alt={item.title}
                    fill
                    className="object-cover rounded-xl"
                    priority={index === 0}
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  <div 
                    className={`text-center transition-all duration-1000 ease-out ${
                      index === activeIndex ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-16 opacity-0 scale-95'
                    }`}
                  >
                    <h1 className="mb-4 text-4xl md:text-6xl font-bold text-white">
                      {item.title}
                    </h1>
                    <p className="mb-8 text-lg md:text-xl text-white/90 max-w-2xl mx-auto px-4">
                      {item.description}
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="bg-white text-black hover:bg-white/90 rounded-full px-8"
                    >
                      <Link href={item.link}>Learn more</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
          {heroItems.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === current ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => {
                api?.scrollTo(index);
                resetAutoplay();
              }}
            />
          ))}
        </div>
      </Carousel>
    </div>
  )
}

