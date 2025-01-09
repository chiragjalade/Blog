'use client'

import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Plus, Minus, RefreshCw } from 'lucide-react'
import { AnimatedPulse } from './AnimatedPulse'
import { WeightLabel } from './WeightLabel'

const unselectable = "select-none user-select-none"

const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout
  const debouncedFunc = (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
  debouncedFunc.cancel = () => clearTimeout(timeout)
  return debouncedFunc
}

interface Node {
  id: string
  label: string
  color: string
}

interface PerceptronDiagramProps {
  initialInputs?: number
  className?: string
}

export function PerceptronDiagram({ initialInputs = 3, className = '' }: PerceptronDiagramProps) {
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [lines, setLines] = useState<Array<{ start: DOMRect; end: DOMRect; id: string; path: string; length: number }>>([])
  const [containerWidth, setContainerWidth] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const [inputCount, setInputCount] = useState(initialInputs)
  const [initialInputCount] = useState(initialInputs) 
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
  const [showInitialInfo, setShowInitialInfo] = useState(false)

  const { ref: inViewRef, inView } = useInView({
    threshold: 0.75,
    triggerOnce: true,
  })

  const getContainerHeight = () => {
    const baseHeight = 300 
    const additionalHeight = Math.max(0, inputCount - 3) * 50 
    return baseHeight + additionalHeight
  }

  const inputNodes = useMemo(() => {
    const nodes = [
      { id: 'bias', label: '1', color: 'bg-green-200' },
      ...Array.from({ length: Math.min(inputCount, MAX_INPUTS) - 1 }, (_, i) => ({
        id: `x${i + 1}`,
        label: `x${i + 1}`,
        color: 'bg-blue-200'
      }))
    ];
    if (inputCount <= 3) {
      nodes.push({ id: 'xm', label: 'xₘ', color: 'bg-blue-200' });
    }
    return nodes;
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
      setInputCount(prev => prev + 1);
    }
  }

  const handleRemoveInput = (nodeId: string) => {
    if (nodeId !== 'bias' && inputCount > 1) {
      setInputCount(prev => prev - 1);
      setLongPressedNode(null);
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

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const updateLines = () => {
      if (!containerRef.current) return

      const update = () => {
        const container = containerRef.current
        if (!container) return

        const containerRect = container.getBoundingClientRect()
        setContainerWidth(containerRect.width)
        setContainerHeight(containerRect.height)

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
            newLines.push({ start, end, id: `${inputNode.id}-sum`, path: pathData.path, length: pathData.length })
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

        setLines(newLines.map(line => ({
          ...line,
          length: createPath(line.start, line.end, containerRect).length
        })))
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
  }, [inputNodes, getContainerHeight])

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

  const wiggleAnimation = {
    rotate: [0, -3, 3, -3, 3, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (longPressedNode && !(e.target as Element).closest('.node-container')) {
        setLongPressedNode(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [longPressedNode])

  const handleRevert = () => {
    if (inputCount > 3 && !isReverting) {
      setIsReverting(true);
      const nodesToRemove = inputNodes
        .slice(3) 
        .map(node => node.id);

      nodesToRemove.forEach((nodeId, index) => {
        setTimeout(() => {
          setRemovingLines(prev => [...prev, `${nodeId}-sum`]);
        }, index * 100);
      });

      setTimeout(() => {
        setRemovingNodes(nodesToRemove);

        const interval = setInterval(() => {
          setInputCount((prev) => {
            if (prev <= 3) {
              clearInterval(interval);
              setTimeout(() => {
                setRemovingLines([]);
                setRemovingNodes([]);
                setIsReverting(false);
              }, 500);
              return 3;
            }
            return prev - 1;
          });
        }, 300);
      }, nodesToRemove.length * 100 + 300);
    }
  }

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
      setContainerElement(node);
      containerRef.current = node;
      inViewRef(node);
    }
  }, [inViewRef]);

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
      <div className="absolute top-4 -right-2 sm:right-4 flex items-center"> 
        <AnimatePresence>
          {(showAddInfo && inputCount < MAX_INPUTS) && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="mr-2 bg-white/10 backdrop-blur-sm rounded-lg p-2 text-xs text-white/80 select-none"
            >
              Add a new input node
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          onClick={handleAddInput}
          onMouseEnter={() => setShowAddInfo(true)}
          onMouseLeave={() => setShowAddInfo(false)}
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white/90 transition-colors z-10 ${
            inputCount >= MAX_INPUTS ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          whileHover={inputCount < MAX_INPUTS ? { scale: 1.1 } : undefined}
          whileTap={inputCount < MAX_INPUTS ? { scale: 0.95 } : undefined}
          disabled={inputCount >= MAX_INPUTS}
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="absolute top-16 -right-2 sm:right-4 flex items-center"> 
        <AnimatePresence>
          {(showRevertInfo && inputCount > 3 && !isReverting) && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="mr-2 bg-white/10 backdrop-blur-sm rounded-lg p-2 text-xs text-white/80 select-none"
            >
              Remove extra input nodes
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          onClick={handleRevert}
          onMouseEnter={() => setShowRevertInfo(true)}
          onMouseLeave={() => setShowRevertInfo(false)}
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white/90 transition-colors z-10 ${
            inputCount <= 3 || isReverting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          whileHover={inputCount > 3 && !isReverting ? { scale: 1.1 } : undefined}
          whileTap={inputCount > 3 && !isReverting ? { scale: 0.95 } : undefined}
          disabled={inputCount <= 3 || isReverting}
          animate={revertButtonControls}
        >
          <RefreshCw className="w-5 h-5" />
        </motion.button>
      </div>

      <AnimatePresence>
        {inView && (
          <motion.svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            style={{
              width: containerWidth,
              height: '100%'
            }}
            preserveAspectRatio="xMidYMid meet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            layout
          >
            <defs>
              <filter id="enhancedGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <AnimatePresence>
              {lines.map(({ path, id, length }, index) => {
                const isInputToSum = id.includes('-sum') && !id.includes('bias')
                const isBiasToSum = id.includes('bias-sum')
                const isSumToFunction = id === 'sum-function'
                const isRemoving = removingLines.includes(id)

                return (
                  <motion.g key={id} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <motion.path
                      d={path}
                      stroke={id.includes('bias') ? '#16a34a' : '#3b82f6'}
                      strokeWidth="2.2"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      exit={{ pathLength: 0 }}
                      transition={{
                        pathLength: { duration: isRemoving ? 0.3 : 1, ease: "easeInOut" },
                        default: { duration: 0.3, ease: "easeInOut" }
                      }}
                      layout
                    />
                    {!isRemoving && (
                      <AnimatedPulse
                        path={path}
                        delay={isInputToSum || isBiasToSum ? 0 : (isSumToFunction ? 1 : 2)}
                        duration={isInputToSum || isBiasToSum ? 1 : 0.75}
                        color={id.includes('bias') ? '#16a34a' : '#3b82f6'}
                        play={inView && !isReverting}
                      />
                    )}
                  </motion.g>
                )
              })}
            </AnimatePresence>
            {lines.map(({ path, id, length }, index) => {
              if (id.includes('-sum') && !id.includes('bias')) {
                const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                pathElement.setAttribute('d', path);
                const point = pathElement.getPointAtLength(length * 0.4); 

                let label;
                if (id === 'xm-sum') {
                  label = 'wₘ';
                } else {
                  const nodeIndex = parseInt(id.split('-')[0].slice(1));
                  label = `w${nodeIndex}`;
                }

                return (
                  <WeightLabel
                    key={`weight-${id}`}
                    x={point.x}
                    y={point.y}
                    label={label}
                  />
                );
              }
              return null;
            })}
          </motion.svg>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 flex justify-between items-center -ml-2 sm:ml-0 px-0 sm:px-[5%] md:px-[10%]">
        <div className="flex flex-col justify-center gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {inputNodes.map((node, index) => (
              <motion.div
                key={node.id}
                className="relative node-container"
                onMouseDown={() => handleLongPressStart(node.id)}
                onMouseUp={handleLongPressEnd}
                onMouseLeave={handleLongPressEnd}
                onTouchStart={() => handleLongPressStart(node.id)}
                onTouchEnd={handleLongPressEnd}
                initial={index === inputCount - 1 && inputCount > 3 ? { scale: 0, opacity: 0 } : false}
                animate={{ scale: 1, opacity: 1 }}
                exit={{
                  scale: 0,
                  opacity: 0,
                  transition: { duration: 0.2 }
                }}
                layout
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                  mass: 1
                }}
              >
                <motion.div
                  data-node={node.id}
                  className={`w-12 h-12 md:w-12 md:h-12 rounded-full ${node.color} flex items-center justify-center text-base md:text-lg font-medium shadow-lg text-black ${unselectable}`}
                  animate={longPressedNode === node.id ? wiggleAnimation : { scale: 1, opacity: 1 }}
                >
                  {node.label}
                </motion.div>
                <AnimatePresence>
                  {removingNodes.includes(node.id) && node.id !== 'bias' && node.id !== 'xm' && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-red-500/50"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1.2 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {longPressedNode === node.id && node.id !== 'bias' && node.id !== 'xm' && (
                    <motion.button
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center text-white"
                      onClick={() => handleRemoveInput(node.id)}
                    >
                      <Minus className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-8 md:gap-16">
          {middleNodes.map((node, index) => (
            <motion.div
              key={node.id}
              data-node={node.id}
              className={`w-12 h-12 md:w-12 md:h-12 rounded-full ${node.color} flex items-center justify-center text-base md:text-lg font-medium shadow-lg text-black ${unselectable}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            >
              {node.label}
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col justify-center">
          {outputNodes.map((node, index) => (
            <motion.div
              key={node.id}
              data-node={node.id}
              className={`w-12 h-12 md:w-12 md:h-12 rounded-full ${node.color} flex items-center justify-center text-base md:text-lg font-medium shadow-lg text-black ${unselectable}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
            >
              {node.label}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute -bottom-16 left-0 right-0 flex justify-between -ml-2 sm:ml-0 px-0 sm:px-[5%] md:px-[10%] text-xs md:text-sm text-white/60">
        <div className="w-12 text-center">
          <span>Input</span>
        </div>
        <div className="flex gap-8 md:gap-16">
          <div className="w-12 text-center">
            <span>Sum</span>
          </div>
          <div className="w-12 text-center">
            <span>Non-Linearity</span>
          </div>
        </div>
        <div className="w-12 text-center">
          <span>Output</span>
        </div>
      </div>
    </div>
  )
}

