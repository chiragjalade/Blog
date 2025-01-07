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
    subtitle?: string
    background?: {
      type: "image" | "video"
      src: string
      fallback?: string
    }
    gradient?: string
    overlayImage?: string
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
                    {/* Base gradient background */}
                    <div
                      className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
                      style={{ background: item.gradient }}
                    />
                    
                    {/* Optional overlay image */}
                    {item.overlayImage && (
                      <div className="absolute inset-0 z-10">
                        <Image
                          src={item.overlayImage}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-black/20" />
                      </div>
                    )}

                    {/* Content overlay */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-between z-20">
                      {item.subtitle ? (
                        <>
                          <h3 className="text-lg font-medium text-white">
                            {item.title}
                          </h3>
                          <p className="text-sm text-white/90 mt-auto">
                            {item.subtitle}
                          </p>
                        </>
                      ) : (
                        <div className="mt-auto">
                          {item.date && (
                            <div className="text-sm text-white/80 mb-1">{item.date}</div>
                          )}
                          <h3 className="text-lg font-medium text-white">
                            {item.title}
                          </h3>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
            <CarouselItem className="pl-4 basis-[67.5%] sm:basis-[45%] md:basis-1/3 lg:basis-1/4 snap-start">
              <Link href={`/archive/${title.toLowerCase()}`} className="block">
                <div className="group relative aspect-[3/4] sm:aspect-[3/3.8] overflow-hidden rounded-md bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                  <div className="text-center transition-all duration-300 group-hover:scale-110">
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

