import * as math from "mathjs"

export function parseAndEvaluate(equation: string, x: number): number {
  if (!equation.trim()) return 0 // Return 0 for empty equations

  try {
    const node = math.parse(equation)
    const compiled = node.compile()
    const result = compiled.evaluate({ x })
    return typeof result === "number" && !isNaN(result) ? result : 0
  } catch (error) {
    return 0 // Return 0 for invalid equations
  }
}

export function calculateRange(equation: string): { xMin: number; xMax: number; yMin: number; yMax: number } {
  if (!equation.trim()) {
    return { xMin: -10, xMax: 10, yMin: -10, yMax: 10 }
  }

  try {
    const node = math.parse(equation)
    const compiled = node.compile()

    let xMin = -10
    let xMax = 10
    let yMin = Number.POSITIVE_INFINITY
    let yMax = Number.NEGATIVE_INFINITY

    const samples = 1000
    const step = (xMax - xMin) / samples

    for (let x = xMin; x <= xMax; x += step) {
      try {
        const y = compiled.evaluate({ x })
        if (typeof y === "number" && !isNaN(y)) {
          if (y < yMin) yMin = y
          if (y > yMax) yMax = y
        }
      } catch {
        continue // Skip invalid points
      }
    }

    // If no valid points were found, return default range
    if (yMin === Number.POSITIVE_INFINITY || yMax === Number.NEGATIVE_INFINITY) {
      return { xMin: -10, xMax: 10, yMin: -10, yMax: 10 }
    }

    // Adjust y range
    const yRange = yMax - yMin
    yMin -= yRange * 0.1
    yMax += yRange * 0.1

    // Adjust x range if y range is very small
    if (yRange < 1) {
      const xRange = xMax - xMin
      xMin -= xRange * 0.1
      xMax += xRange * 0.1
    }

    return { xMin, xMax, yMin, yMax }
  } catch {
    // Return default range for invalid equations
    return { xMin: -10, xMax: 10, yMin: -10, yMax: 10 }
  }
}

