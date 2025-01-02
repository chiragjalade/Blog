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

const heroItems = [
  {
    id: "sora",
    title: "Sora",
    description: "Bring your imagination to life from text, image, or video.",
    background: {
      type: "video",
      src: "https://res.cloudinary.com/ddpumiekp/video/upload/v1735823236/lzin8boldj9y0lwkr2c6.webm",
      fallback: "/placeholder.svg?height=800&width=1600",
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
      fallback: "/placeholder.svg?height=800&width=1600",
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
      fallback: "/placeholder.svg?height=800&width=1600",
    },
    link: "/dalle",
  },
]

export function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi | null>(null)
  const [current, setCurrent] = React.useState(0)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const { isLoading } = useLoading()
  const autoplayRef = React.useRef<NodeJS.Timeout>()
  const videoRefs = React.useRef<Map<string, HTMLVideoElement>>(new Map())

  React.useEffect(() => {
    if (!api) return
    
    const onSelect = () => {
      setActiveIndex(api.selectedScrollSnap())
      setCurrent(api.selectedScrollSnap())
    }

    api.on("select", onSelect)
    api.on("settle", onSelect)

    return () => {
      api.off("select", onSelect)
      api.off("settle", onSelect)
    }
  }, [api])

  React.useEffect(() => {
    if (!api || isLoading) return

    const startAutoplay = () => {
      autoplayRef.current = setInterval(() => {
        api.scrollNext()
      }, 5000)
    }

    startAutoplay()

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [api, isLoading])

  React.useEffect(() => {
    if (!isLoading) {
      videoRefs.current.forEach((video) => {
        if (video) {
          video.play().catch(error => console.error('Video playback error:', error))
        }
      })
    }
  }, [isLoading])

  const setVideoRef = React.useCallback((el: HTMLVideoElement | null, id: string) => {
    if (el) {
      videoRefs.current.set(id, el)
    } else {
      videoRefs.current.delete(id)
    }
  }, [])

  return (
    <div className="w-screen relative overflow-visible left-1/2 right-1/2 -mx-[50vw]">
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
            <CarouselItem key={index} className="pl-4 basis-[85%] md:basis-[85%] overflow-visible">
              <div className="relative h-[60vh] md:h-[75vh] overflow-hidden rounded-md">
                {item.background.type === 'video' ? (
                  <>
                    <video
                      ref={(el) => setVideoRef(el, item.id)}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                      poster={item.background.fallback}
                    >
                      <source src={item.background.src} type="video/mp4" />
                    </video>
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
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      </Carousel>
    </div>
  )
}

