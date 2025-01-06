import Image, { type ImageProps } from 'next/image'
import { useState, useEffect } from 'react'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  aboveTheFold?: boolean
}

export function OptimizedImage({ aboveTheFold = false, ...props }: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (aboveTheFold && typeof props.src === 'string') {
      const preloadImage = new window.Image()
      preloadImage.src = props.src
      preloadImage.onload = () => setIsLoaded(true)
    }
  }, [aboveTheFold, props.src])

  return (
    <Image
      {...props}
      priority={aboveTheFold}
      loading={aboveTheFold ? 'eager' : 'lazy'}
      onLoad={() => setIsLoaded(true)}
      style={{
        ...props.style,
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
      }}
    />
  )
}

