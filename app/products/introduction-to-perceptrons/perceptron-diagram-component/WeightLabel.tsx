import { motion } from 'framer-motion'

interface WeightLabelProps {
  x: number
  y: number
  label: string
}

export const WeightLabel: React.FC<WeightLabelProps> = ({ x, y, label }) => {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.3 }}
    >
      <circle
        cx={x}
        cy={y}
        r="10"
        fill="rgba(255, 255, 255, 0.2)"
        stroke="rgba(255, 255, 255, 0.5)"
        strokeWidth="1"
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize="8"
        fontWeight="bold"
      >
        {label}
      </text>
    </motion.g>
  )
}

