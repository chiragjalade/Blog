import React from 'react'
import { motion } from 'framer-motion'

interface AnimatedPulseProps {
  path: string
  delay: number
  duration: number
  color: string
  play: boolean
}

export const AnimatedPulse: React.FC<AnimatedPulseProps> = ({ path, delay, duration, color, play }) => {
  return (
    <motion.circle
      r={3}
      fill={color}
      filter="url(#enhancedGlow)"
    >
      <animateMotion
        path={path}
        dur={`${duration}s`}
        repeatCount="indefinite"
        begin={play ? `${delay}s` : 'indefinite'}
      />
    </motion.circle>
  )
}

