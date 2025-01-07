import Image, { type ImageProps } from 'next/image'
import { useState, useEffect } from 'react'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  aboveTheFold?: boolean
  alt: string // Make alt prop required
}

export function OptimizedImage({ aboveTheFold = false, alt, ...props }: OptimizedImageProps) {
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
      alt={alt} // Pass the alt prop to the Image component
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

