'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { products, research } from '@/config/content'

interface ContentItem {
  id: string
  title: string
  content: string
  date: string
  description?: string
  gradient?: string
  link: string
  background?: {
    type: 'image' | 'video'
    src: string
    fallback?: string
  }
}

interface SeeAllPageProps {
  params: {
    category: string
  }
}

export default function SeeAllPage({ params }: SeeAllPageProps) {
  const [items, setItems] = useState<ContentItem[]>([])
  const [isExiting, setIsExiting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const category = params.category.replace(/-/g, ' ')
    if (category.toLowerCase() === 'products') {
      setItems(products as ContentItem[])
    } else if (category.toLowerCase() === 'research') {
      setItems(research as ContentItem[])
    }
  }, [params.category])

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsExiting(true)
    setTimeout(() => router.back(), 300)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren"
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  return (
    <AnimatePresence mode="wait" onExitComplete={() => router.back()}>
      {!isExiting && (
        <motion.div
          className="min-h-screen bg-black pt-24 pb-16"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.button
              onClick={handleBack}
              className="mb-8 flex items-center text-white hover:text-white/80 transition-colors"
              variants={itemVariants}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </motion.button>
            <motion.h1 
              className="text-4xl font-bold text-white mb-12"
              variants={itemVariants}
            >
              All {params.category.replace(/-/g, ' ')}
            </motion.h1>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
            >
              {items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((item, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Link href={item.link} className="block">
                    <div className="relative aspect-[3/2] rounded-lg overflow-hidden mb-4">
                      {item.background ? (
                        item.background.type === 'video' ? (
                          <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                            poster={item.background.fallback}
                          >
                            <source src={item.background.src} type="video/mp4" />
                          </video>
                        ) : (
                          <Image
                            src={item.background.src}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        )
                      ) : (
                        <div
                          className="absolute inset-0"
                          style={{ background: item.gradient }}
                        />
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">{item.title}</h2>
                    {item.description ? (
                      <p className="text-white/70 mb-2">{item.description}</p>
                    ) : (
                      <div className="h-12" /> // Empty space for missing description
                    )}
                    <p className="text-sm text-white/50">{item.date}</p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

