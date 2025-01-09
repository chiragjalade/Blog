'use client'
import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Plus, Minus, RefreshCw } from 'lucide-react'
import { AnimatedPulse } from './AnimatedPulse'
import { WeightLabel } from './WeightLabel'

const unselectable = "select-none user-select-none"

const debounce = (func: (...args: unknown[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout
  const debouncedFunc = (...args: unknown[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
  debouncedFunc.cancel = () => clearTimeout(timeout)
  return debouncedFunc
}

interface PerceptronDiagramProps {
  initialInputs?: number
  className?: string
}

export function PerceptronDiagram({ initialInputs = 3, className = '' }: PerceptronDiagramProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [lines, setLines] = useState<Array<{ start: DOMRect; end: DOMRect; id: string; path: string; length: number }>>([])
  const [containerWidth, setContainerWidth] = useState(0)
  const [inputCount, setInputCount] = useState(initialInputs)
  const [longPressedNode, setLongPressedNode] = useState<string | null>(null)
  const longPressTimerRef = useRef<NodeJS.Timeout>()
  const MAX_INPUTS = 7
  const [removingLines, setRemovingLines] = useState<string[]>([])
  const [removingNodes, setRemovingNodes] = useState<string[]>([])
  const [isReverting, setIsReverting] = useState(false)
  const revertButtonControls = useAnimation()
  const [showAddInfo, setShowAddInfo] = useState(false)
  const [showRevertInfo, setShowRevertInfo] = useState(false)
  const [initialShowPassed, setInitialShowPassed] = useState(false)

  const { ref: inViewRef, inView } = useInView({
    threshold: 0.75,
    triggerOnce: true,
  })

  const getContainerHeight = useCallback(() => {
    const baseHeight = 300
    const additionalHeight = Math.max(0, inputCount - 3) * 50
    return baseHeight + additionalHeight
  }, [inputCount])

  const inputNodes = useMemo(() => {
    const nodes = [
      { id: 'bias', label: '1', color: 'bg-green-200' },
      ...Array.from({ length: Math.min(inputCount, MAX_INPUTS) - 1 }, (_, i) => ({
        id: `x${i + 1}`,
        label: `x${i + 1}`,
        color: 'bg-blue-200'
      }))
    ]
    if (inputCount <= 3) {
      nodes.push({ id: 'xm', label: 'xₘ', color: 'bg-blue-200' })
    }
    return nodes
  }, [inputCount])

  const middleNodes = useMemo(() => [
    { id: 'sum', label: 'Σ', color: 'bg-orange-200' },
    { id: 'function', label: 'ƒ', color: 'bg-yellow-200' }
  ], [])

  const outputNodes = useMemo(() => [
    { id: 'output', label: 'ŷ', color: 'bg-purple-200' }
  ], [])

  const handleAddInput = () => {
    if (inputCount < MAX_INPUTS) {
      setInputCount(prev => prev + 1)
    }
  }

  const handleRemoveInput = (nodeId: string) => {
    if (nodeId !== 'bias' && inputCount > 1) {
      setInputCount(prev => prev - 1)
      setLongPressedNode(null)
    }
  }

  const handleLongPressStart = (nodeId: string) => {
    if (nodeId === 'bias' || nodeId === 'x1' || nodeId === 'x2' || nodeId === `x${inputCount}`) return
    longPressTimerRef.current = setTimeout(() => {
      setLongPressedNode(nodeId)
    }, 500)
  }

  const handleLongPressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
    }
  }

  const handleRevert = () => {
    if (inputCount > 3 && !isReverting) {
      setIsReverting(true)
      const nodesToRemove = inputNodes
        .slice(3)
        .map(node => node.id)
      
      nodesToRemove.forEach((nodeId, index) => {
        setTimeout(() => {
          setRemovingLines(prev => [...prev, `${nodeId}-sum`])
        }, index * 100)
      })

      setTimeout(() => {
        setRemovingNodes(nodesToRemove)
        const interval = setInterval(() => {
          setInputCount((prev) => {
            if (prev <= 3) {
              clearInterval(interval)
              setTimeout(() => {
                setRemovingLines([])
                setRemovingNodes([])
                setIsReverting(false)
              }, 500)
              return 3
            }
            return prev - 1
          })
        }, 300)
      }, nodesToRemove.length * 100 + 300)
    }
  }

  const createPath = (start: DOMRect, end: DOMRect, containerRect: DOMRect) => {
    const startX = (start.left + start.right) / 2 - containerRect.left
    const startY = (start.top + start.bottom) / 2 - containerRect.top
    const endX = (end.left + end.right) / 2 - containerRect.left
    const endY = (end.top + end.bottom) / 2 - containerRect.top
    const midX = (startX + endX) / 2
    const path = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    pathElement.setAttribute('d', path)
    const length = pathElement.getTotalLength()
    return { path, length }
  }

  useEffect(() => {
    const updateLines = () => {
      if (!containerRef.current) return
      const update = () => {
        const container = containerRef.current
        if (!container) return
        const containerRect = container.getBoundingClientRect()
        setContainerWidth(containerRect.width)

        const newLines: typeof lines = []
        const sumNode = container.querySelector('[data-node="sum"]')
        const functionNode = container.querySelector('[data-node="function"]')
        const outputNode = container.querySelector('[data-node="output"]')

        if (!sumNode || !functionNode || !outputNode) return

        inputNodes.forEach((inputNode) => {
          const startNode = container.querySelector(`[data-node="${inputNode.id}"]`)
          if (startNode) {
            const start = startNode.getBoundingClientRect()
            const end = sumNode.getBoundingClientRect()
            const pathData = createPath(start, end, containerRect)
            newLines.push({
              start,
              end,
              id: `${inputNode.id}-sum`,
              path: pathData.path,
              length: pathData.length
            })
          }
        })

        const sumToFunctionPath = createPath(
          sumNode.getBoundingClientRect(),
          functionNode.getBoundingClientRect(),
          containerRect
        )
        newLines.push({
          start: sumNode.getBoundingClientRect(),
          end: functionNode.getBoundingClientRect(),
          id: 'sum-function',
          path: sumToFunctionPath.path,
          length: sumToFunctionPath.length
        })

        const functionToOutputPath = createPath(
          functionNode.getBoundingClientRect(),
          outputNode.getBoundingClientRect(),
          containerRect
        )
        newLines.push({
          start: functionNode.getBoundingClientRect(),
          end: outputNode.getBoundingClientRect(),
          id: 'function-output',
          path: functionToOutputPath.path,
          length: functionToOutputPath.length
        })

        setLines(newLines)
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(update)
      })
    }

    const debouncedUpdateLines = debounce(updateLines, 100)
    updateLines()

    const resizeObserver = new ResizeObserver(debouncedUpdateLines)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
      debouncedUpdateLines.cancel()
    }
  }, [inputNodes])

  useEffect(() => {
    if (inputCount > 3) {
      revertButtonControls.start({
        scale: [1, 1.1, 1],
        transition: { repeat: Infinity, duration: 1.5 }
      })
    } else {
      revertButtonControls.stop()
      revertButtonControls.set({ scale: 1 })
    }
  }, [inputCount, revertButtonControls])

  useEffect(() => {
    if (inView && !initialShowPassed) {
      setShowAddInfo(true)
      setShowRevertInfo(true)
      const timer = setTimeout(() => {
        setShowAddInfo(false)
        setShowRevertInfo(false)
        setInitialShowPassed(true)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [inView, initialShowPassed])

  const handleRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      containerRef.current = node
      inViewRef(node)
    }
  }, [inViewRef])

  return (
    <div
      ref={handleRef}
      className={`relative w-full px-0 sm:px-4 mb-24 ${className}`}
      style={{
        height: `${getContainerHeight()}px`,
        minHeight: '300px',
        transition: 'height 0.3s ease-out'
      }}
    >
      {/* Rest of your JSX remains the same */}
    </div>
  )
}
