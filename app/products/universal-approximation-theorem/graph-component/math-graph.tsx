"use client"

import { motion, useAnimation, cubicBezier } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useState, useEffect, useRef, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { parseAndEvaluate, calculateRange } from "./math-utils"
import { RefreshCw } from "lucide-react"

interface MathGraphProps {
  className?: string
}

// Change from named export to default export
export default function MathGraph({ className = "" }: MathGraphProps) {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  })

  const [dimensions, setDimensions] = useState({ width: 600, height: 400 })
  const containerRef = useRef<HTMLDivElement>(null)
  const [equation, setEquation] = useState("x^3 - 3*x^2 + 2*x + 5")
  const [debouncedEquation, setDebouncedEquation] = useState(equation) // Added debouncedEquation state
  const [ranges, setRanges] = useState({ xRange: [-10, 10], yRange: [-10, 10] })
  const [xInterval, setXInterval] = useState({
    min: -6,
    max: 6,
    step: 2,
    defaultStep: 1,
    defaultMin: -4,
    defaultMax: 4,
  })
  const [yInterval, setYInterval] = useState({
    min: -30,
    max: 30,
    step: 10,
    defaultStep: 1,
    defaultMin: -4,
    defaultMax: 4,
  })
  const [initialValues, setInitialValues] = useState({
    xMin: -6,
    xMax: 6,
    xStep: 2,
    yMin: -30,
    yMax: 30,
    yStep: 10,
    defaultMin: -4,
    defaultMax: 4,
  })
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const updateDimensions = () => {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 640
      if (isMobile) {
        const width = window.innerWidth - 32 // Account for padding
        const height = Math.min(window.innerHeight * 0.6, width * 1.2) // Maintain aspect ratio
        setDimensions({ width, height })
      } else {
        const width = Math.min(600, window.innerWidth - 40)
        const height = Math.max((width * 2) / 3, 300)
        setDimensions({ width, height })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      const scrollWidth = containerRef.current.scrollWidth
      const clientWidth = containerRef.current.clientWidth
      const scrollTo = Math.max(0, (scrollWidth - clientWidth) / 2)
      containerRef.current.scrollLeft = scrollTo
      containerRef.current.offsetHeight
    }
  }, [dimensions, inView])

  const generatePoints = useCallback(() => {
    const points: number[][] = []
    const [xMin, xMax] = ranges.xRange
    const step = (xMax - xMin) / 200

    try {
      // Validate equation first
      const testPoint = parseAndEvaluate(debouncedEquation, xMin) // Use debouncedEquation
      if (typeof testPoint !== "number" || isNaN(testPoint)) {
        return points // Return empty array if equation is invalid
      }

      for (let x = xMin; x <= xMax; x += step) {
        try {
          const y = parseAndEvaluate(debouncedEquation, x) // Use debouncedEquation
          if (typeof y === "number" && !isNaN(y)) {
            points.push([x, y])
          }
        } catch (error) {
          // Skip invalid points
        }
      }
    } catch (error) {
      // Return empty array if equation is completely invalid
    }

    return points
  }, [debouncedEquation, ranges.xRange]) // Updated dependency

  const scalePoint = useCallback(
    (point: number[], width: number, height: number) => {
      const [x, y] = point
      const [xMin, xMax] = [xInterval.min, xInterval.max]
      const [yMin, yMax] = [yInterval.min, yInterval.max]
      const xRange = xMax - xMin
      const yRange = yMax - yMin

      const scaledX = ((x - xMin) / xRange) * width
      const scaledY = height - ((y - yMin) / yRange) * height
      return [scaledX, scaledY]
    },
    [xInterval, yInterval],
  )

  const generatePath = useCallback(
    (width: number, height: number) => {
      const points = generatePoints()
      if (points.length === 0) return "" // Return empty path if no valid points

      const scaledPoints = points.map((point) => scalePoint(point, width, height))
      return (
        `M ${scaledPoints[0][0]},${scaledPoints[0][1]} ` +
        scaledPoints
          .slice(1)
          .map((point) => `L ${point[0]},${point[1]}`)
          .join(" ")
      )
    },
    [generatePoints, scalePoint],
  )

  const generateGridLines = useCallback(
    (width: number, height: number) => {
      const lines = []
      const [xMin, xMax] = [xInterval.min, xInterval.max]
      const [yMin, yMax] = [yInterval.min, yInterval.max]

      // Vertical grid lines
      for (let x = xMin; x <= xMax; x += xInterval.step) {
        const scaledX = ((x - xMin) / (xMax - xMin)) * width
        lines.push(
          <line
            key={`x-${x}`}
            x1={scaledX}
            y1={0}
            x2={scaledX}
            y2={height}
            stroke="white"
            strokeWidth="1"
            strokeDasharray="4 4"
            strokeOpacity="0.15"
          />,
        )
      }

      // Horizontal grid lines
      for (let y = yMin; y <= yMax; y += yInterval.step) {
        const scaledY = height - ((y - yMin) / (yMax - yMin)) * height
        lines.push(
          <line
            key={`y-${y}`}
            x1={0}
            y1={scaledY}
            x2={width}
            y2={scaledY}
            stroke="white"
            strokeWidth="1"
            strokeDasharray="4 4"
            strokeOpacity="0.15"
          />,
        )
      }

      return lines
    },
    [xInterval, yInterval],
  )

  const generateLabels = useCallback(
    (width: number, height: number) => {
      const labels = []
      const [xMin, xMax] = [xInterval.min, xInterval.max]
      const [yMin, yMax] = [yInterval.min, yInterval.max]
      const isMobile = typeof window !== "undefined" && window.innerWidth < 640

      // X-axis labels
      for (let x = xMin; x <= xMax; x += xInterval.step) {
        const scaledX = ((x - xMin) / (xMax - xMin)) * width
        labels.push(
          <text
            key={`x-label-${x}`}
            x={scaledX}
            y={height + (isMobile ? 25 : 25)} // Updated y position for x-axis labels on mobile
            textAnchor="middle"
            className="text-[11px] sm:text-xs fill-white/60"
          >
            {x.toFixed(2)}
          </text>,
        )
      }

      // Y-axis labels
      for (let y = yMin; y <= yMax; y += yInterval.step) {
        const scaledY = height - ((y - yMin) / (yMax - yMin)) * height
        labels.push(
          <text
            key={`y-label-${y}`}
            x={isMobile ? -20 : -16} // Increased spacing from axis
            y={scaledY}
            textAnchor="end"
            dominantBaseline="middle"
            className="text-[11px] sm:text-xs fill-white/60"
          >
            {y.toFixed(2)}
          </text>,
        )
      }

      return labels
    },
    [xInterval, yInterval],
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      // Added setTimeout for debouncing
      try {
        const points = generatePoints()
        setHasError(points.length === 0)
        const { xMin, xMax, yMin, yMax } = calculateRange(equation)
        setRanges({
          xRange: [Math.min(xInterval.min, xMin), Math.max(xInterval.max, xMax)],
          yRange: [Math.min(yInterval.min, yMin), Math.max(yInterval.max, yMax)],
        })
      } catch (error) {
        console.error("Error processing equation:", error)
        setHasError(true)
      }
    }, 300) // Add small delay to allow for typing

    return () => clearTimeout(timer)
  }, [equation, generatePoints, xInterval.min, xInterval.max, yInterval.min, yInterval.max])

  useEffect(() => {
    const { xMin, xMax, yMin, yMax } = calculateRange(equation)
    setRanges({
      xRange: [Math.min(xInterval.min, xMin), Math.max(xInterval.max, xMax)],
      yRange: [Math.min(yInterval.min, yMin), Math.max(yInterval.max, yMax)],
    })
    setInitialValues({
      xMin: -6,
      xMax: 6,
      xStep: 2,
      yMin: -30,
      yMax: 30,
      yStep: 10,
      defaultMin: -4,
      defaultMax: 4,
    })
    setXInterval({ min: -6, max: 6, step: 2, defaultStep: 1, defaultMin: -4, defaultMax: 4 })
    setYInterval({ min: -30, max: 30, step: 10, defaultStep: 1, defaultMin: -4, defaultMax: 4 })
  }, [equation])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedEquation(equation)
    }, 300)
    return () => clearTimeout(timer)
  }, [equation]) // Added debounced equation useEffect

  const margin = {
    top: typeof window !== "undefined" && window.innerWidth < 640 ? 40 : 40,
    right: typeof window !== "undefined" && window.innerWidth < 640 ? 30 : 40,
    bottom: typeof window !== "undefined" && window.innerWidth < 640 ? 70 : 60,
    left: typeof window !== "undefined" && window.innerWidth < 640 ? 60 : 80, // Increased from 45/60 to 60/80
  }
  const innerWidth = dimensions.width - margin.left - margin.right
  const innerHeight = dimensions.height - margin.top - margin.bottom

  return (
    <div ref={ref} className={`w-full overflow-hidden ${className}`}>
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <Input
            type="text"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            placeholder="Enter equation (e.g., x^3 - 3*x^2 + 2*x + 5)"
            className="w-full pr-10"
          />
          <button
            onClick={() => setEquation("x^3 - 3*x^2 + 2*x + 5")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="relative">
            <Input
              type="number"
              value={xInterval.min}
              onChange={(e) => {
                const value = e.target.value === "" ? xInterval.defaultMin : Number(e.target.value)
                setXInterval({ ...xInterval, min: value })
              }}
              placeholder="X Min"
              className="w-full pr-8 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              onClick={() => setXInterval({ ...xInterval, min: initialValues.xMin })}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <div className="relative">
            <Input
              type="number"
              value={xInterval.max}
              onChange={(e) => {
                const value = e.target.value === "" ? xInterval.defaultMax : Number(e.target.value)
                setXInterval({ ...xInterval, max: value })
              }}
              placeholder="X Max"
              className="w-full pr-8 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              onClick={() => setXInterval({ ...xInterval, max: initialValues.xMax })}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <div className="relative">
            <Input
              type="number"
              value={xInterval.step}
              onChange={(e) => {
                const value = e.target.value === "" ? 1 : Math.max(0.1, Number(e.target.value))
                setXInterval({ ...xInterval, step: value })
              }}
              placeholder="X Step"
              className="w-full pr-8 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              onClick={() => setXInterval({ ...xInterval, step: initialValues.xStep })}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="relative">
            <Input
              type="number"
              value={yInterval.min}
              onChange={(e) => {
                const value = e.target.value === "" ? yInterval.defaultMin : Number(e.target.value)
                setYInterval({ ...yInterval, min: value })
              }}
              placeholder="Y Min"
              className="w-full pr-8 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              onClick={() => setYInterval({ ...yInterval, min: initialValues.yMin })}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <div className="relative">
            <Input
              type="number"
              value={yInterval.max}
              onChange={(e) => {
                const value = e.target.value === "" ? yInterval.defaultMax : Number(e.target.value)
                setYInterval({ ...yInterval, max: value })
              }}
              placeholder="Y Max"
              className="w-full pr-8 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              onClick={() => setYInterval({ ...yInterval, max: initialValues.yMax })}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <div className="relative">
            <Input
              type="number"
              value={yInterval.step}
              onChange={(e) => {
                const value = e.target.value === "" ? 1 : Math.max(0.1, Number(e.target.value))
                setYInterval({ ...yInterval, step: value })
              }}
              placeholder="Y Step"
              className="w-full pr-8 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              onClick={() => setYInterval({ ...yInterval, step: initialValues.yStep })}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div
        className="relative w-full mx-auto"
        style={{
          paddingBottom: typeof window !== "undefined" && window.innerWidth < 640 ? "130%" : "66.67%", // Updated padding-bottom for mobile
          maxHeight: typeof window !== "undefined" && window.innerWidth < 640 ? "none" : "calc(100vh - 300px)",
        }}
      >
        <div ref={containerRef} className="absolute inset-0 overflow-x-auto overflow-y-hidden scroll-smooth">
          <svg
            viewBox={`0 0 ${dimensions.width} ${typeof window !== "undefined" && window.innerWidth < 640 ? dimensions.height * 1.3 : dimensions.height}`}
            style={{
              width: dimensions.width,
              height:
                typeof window !== "undefined" && window.innerWidth < 640 ? dimensions.height * 1.3 : dimensions.height,
              minWidth: "300px",
            }}
            className="mx-auto bg-black"
          >
            <defs>
              <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4361ee" />
                <stop offset="50%" stopColor="#3a0ca3" />
                <stop offset="100%" stopColor="#4361ee" />
              </linearGradient>
              <linearGradient id="fadeOutGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="5%" stopColor="white" stopOpacity="1" />
                <stop offset="95%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <mask id="fadeMask">
                <rect width={innerWidth} height={innerHeight} fill="url(#fadeOutGradient)" />
              </mask>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g transform={`translate(${margin.left}, ${margin.top})`}>
              {generateGridLines(innerWidth, innerHeight)}

              <line
                x1={innerWidth * ((0 - xInterval.min) / (xInterval.max - xInterval.min))}
                y1={0}
                x2={innerWidth * ((0 - xInterval.min) / (xInterval.max - xInterval.min))}
                y2={innerHeight}
                stroke="white"
                strokeWidth="2"
              />
              <line
                x1={0}
                y1={innerHeight * (1 - -yInterval.min / (yInterval.max - yInterval.min))}
                x2={innerWidth}
                y2={innerHeight * (1 - -yInterval.min / (yInterval.max - yInterval.min))}
                stroke="white"
                strokeWidth="2"
              />

              {generateLabels(innerWidth, innerHeight)}

              <text
                x={innerWidth + 20}
                y={innerHeight * (1 - -yInterval.min / (yInterval.max - yInterval.min))}
                className="text-sm font-medium fill-white"
              >
                x
              </text>
              <text
                x={innerWidth * ((0 - xInterval.min) / (xInterval.max - xInterval.min))}
                y={-10}
                className="text-sm font-medium fill-white"
                textAnchor="middle"
              >
                y
              </text>

              <motion.path
                key={equation} // Added key prop for re-animation
                d={generatePath(innerWidth, innerHeight)}
                stroke="url(#curveGradient)"
                strokeWidth="2.5"
                fill="none"
                filter="url(#glow)"
                strokeDasharray="5 3"
                mask="url(#fadeMask)"
                initial={{ pathLength: 0, opacity: hasError ? 0 : 1 }}
                animate={{ pathLength: inView && !hasError ? 1 : 0, opacity: hasError ? 0 : 1 }}
                transition={{
                  pathLength: { duration: 2, ease: "easeInOut" }, // Reduced duration for better responsiveness
                  opacity: { duration: 0.3 },
                }}
              />

              <text
                x={innerWidth / 2}
                y={typeof window !== "undefined" && window.innerWidth < 640 ? innerHeight + 60 : innerHeight + 40}
                textAnchor="middle"
                className="text-xs sm:text-sm fill-white/80"
              >
                {equation}
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  )

}

