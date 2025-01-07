'use client'

import React, { useMemo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 700 },
]

const gradientCombinations = [
  ['#FF6B6B', '#4ECDC4', '#45B7D1'],
  ['#FF9A8B', '#FF6A88', '#FF99AC'],
  ['#A8FF78', '#78FFD6', '#78C7FF'],
  ['#FFD93D', '#FF6B6B', '#4ECDC4'],
  ['#FF61D2', '#FE9090', '#FFC796'],
  ['#72FFB6', '#10D164', '#00B3E6'],
  ['#FF6464', '#FFBD67', '#F9F871'],
  ['#00F5A0', '#00D9F5', '#0066FF'],
]

const getColor = (value: number, max: number) => {
  const hue = 210 // Base hue for blue
  const saturation = 100
  const lightness = 100 - (value / max) * 50
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

export function AnimatedGraph() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const [currentGradient, setCurrentGradient] = useState(gradientCombinations[0])

  const maxValue = Math.max(...data.map(item => item.value))
  const graphHeight = 300 // Fixed graph height in pixels

  const barColors = useMemo(() => 
    data.map(item => getColor(item.value, maxValue)),
    [maxValue]
  )

  const getRandomGradient = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * gradientCombinations.length)
    return gradientCombinations[randomIndex]
  }, [])

  const handleMouseEnter = useCallback((index: number) => {
    setHoveredBar(index)
    setCurrentGradient(getRandomGradient())
  }, [getRandomGradient])

  const calculateBarHeight = (value: number) => {
    return (value / maxValue) * graphHeight
  }

  const textVariants = {
    initial: { 
      backgroundImage: `linear-gradient(45deg, ${currentGradient.join(', ')})`,
    },
    animate: { 
      backgroundImage: "linear-gradient(45deg, #FFFFFF, #FFFFFF, #FFFFFF)",
      transition: { duration: 3, delay: 0.2 }
    }
  }

  const shineVariants = {
    initial: { backgroundPosition: "200% 0" },
    animate: { 
      backgroundPosition: "-200% 0",
      transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full h-[400px] my-8 p-4 sm:p-8"
    >
      <div className="relative h-full w-full">
        {/* Y-axis labels */}
        <div className="absolute left-0 h-[300px] flex flex-col justify-between text-white/60 text-xs sm:text-sm">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="relative h-0">
              {Math.round(maxValue - (i * maxValue / 4))}
            </div>
          ))}
        </div>

        {/* Grid lines */}
        <div className="absolute left-12 sm:left-16 right-2 sm:right-8 h-[300px] flex flex-col justify-between">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="border-t border-white/10 border-dashed w-full h-0"
            />
          ))}
        </div>

        {/* Bars */}
        <div className="absolute left-12 sm:left-16 right-2 sm:right-8 bottom-8 h-[300px] flex items-end justify-around sm:justify-around">
          {data.map((item, index) => (
            <div key={index} className="relative flex-1 mx-0.5 sm:mx-2 w-8 sm:w-auto">
              <motion.div
                initial={{ height: 0 }}
                animate={inView ? { height: `${calculateBarHeight(item.value)}px` } : { height: 0 }}
                transition={{ 
                  duration: 0.8, 
                  ease: "easeOut",
                  delay: index * 0.1 
                }}
                className="relative w-full rounded-sm sm:rounded-t-lg overflow-hidden cursor-pointer"
                style={{
                  background: barColors[index],
                }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Animated gradient overlay */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={inView ? {
                    opacity: [0, 0.5, 0],
                  } : { opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  style={{
                    background: `linear-gradient(45deg, transparent, rgba(255,255,255,0.5), transparent)`,
                  }}
                />
              </motion.div>
              <div className="absolute bottom-0 left-0 right-0 transform translate-y-full mt-2 text-center text-sm text-white/60">
                {item.name}
              </div>
              <AnimatePresence mode="wait">
                {hoveredBar === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 0, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute left-0 right-0 text-center"
                    style={{ bottom: `${calculateBarHeight(item.value)}px` }}
                  >
                    <motion.div
                      className="inline-block text-lg sm:text-2xl font-bold relative"
                      initial="initial"
                      animate="animate"
                      variants={textVariants}
                      style={{
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      <motion.div
                        className="absolute inset-0"
                        variants={shineVariants}
                        initial="initial"
                        animate="animate"
                        style={{
                          backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
                          backgroundSize: "200% 100%",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          mixBlendMode: "overlay",
                        }}
                      >
                        {item.value}
                      </motion.div>
                      {item.value}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

