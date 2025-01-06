'use client'

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { useMemo, useCallback } from 'react'

interface CarouselProps {
  title: string
  items: {
    title: string
    date?: string
    background?: {
      type: "image" | "video"
      src: string
      fallback?: string
    }
    gradient?: string
    link: string
  }[]
}

export function ProductCarousel({ title, items }: CarouselProps) {
  const [api, setApi] = React.useState<CarouselApi | null>(null)

  const carouselOptions = useMemo(() => ({
    align: "start" as const,
    loop: false,
    dragFree: false,
    containScroll: "trimSnaps" as const,
  }), [])

  const handlePrevClick = useCallback(() => api?.scrollPrev(), [api])
  const handleNextClick = useCallback(() => api?.scrollNext(), [api])

  return (
    <section className="py-4 md:py-8 overflow-hidden">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="mb-4 md:mb-6 flex items-center justify-between">
          <h2 className="text-2xl md:text-4xl font-medium text-white">
            {title}
          </h2>
          <div className="hidden md:flex gap-4">
            <button
              onClick={handlePrevClick}
              className="rounded-full p-2 hover:bg-white/10"
              aria-label="Previous item"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <button
              onClick={handleNextClick}
              className="rounded-full p-2 hover:bg-white/10"
              aria-label="Next item"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      </div>
      <div className="relative">
        <Carousel
          setApi={setApi}
          opts={carouselOptions}
          className="w-full"
        >
          <CarouselContent className="ml-0 sm:ml-6 lg:ml-8 snap-x snap-mandatory">
            {items.map((item, index) => (
              <CarouselItem 
                key={index} 
                className="pl-4 basis-[67.5%] sm:basis-[45%] md:basis-1/3 lg:basis-1/4 snap-start"
              >
                <Link href={item.link} className="block">
                  <div className="group relative aspect-[3/4] sm:aspect-[3/3.8] overflow-hidden rounded-md">
                    {item.background ? (
                      item.background.type === 'video' ? (
                        <>
                          <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                            poster={item.background.fallback}
                          >
                            <source src={item.background.src} type="video/mp4" />
                          </video>
                          <div className="absolute inset-0 bg-black/20" />
                        </>
                      ) : (
                        <Image
                          src={item.background.src}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      )
                    ) : (
                      <div
                        className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
                        style={{ background: item.gradient }}
                      />
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                      {item.date && (
                        <div className="mb-1 text-sm text-white/80">{item.date}</div>
                      )}
                      <h3 className="text-lg font-medium text-white">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
            <CarouselItem className="pl-4 basis-[67.5%] sm:basis-[45%] md:basis-1/3 lg:basis-1/4 snap-start">
              <Link href={`/archive/${title.toLowerCase()}`} className="block">
                <div className="group relative aspect-[3/4] sm:aspect-[3/3.8] overflow-hidden rounded-md bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center transition-transform duration-300 hover:scale-105">
                  <div className="text-center">
                    <h3 className="text-xl font-medium text-white mb-2">See All</h3>
                    <ArrowRight className="h-6 w-6 text-white mx-auto transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}

