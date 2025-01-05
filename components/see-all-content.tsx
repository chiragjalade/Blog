'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { AnimatePresenceWrapper } from "@/components/animate-presence-wrapper"

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
    poster?: string
    fallback?: string
  }
}

interface SeeAllContentProps {
  category: string
  items: ContentItem[]
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

export function SeeAllContent({ category, items }: SeeAllContentProps) {
  return (
    <AnimatePresenceWrapper>
      <motion.div
        className="min-h-screen bg-black pt-24 pb-16"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.button
            onClick={() => window.history.back()}
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
            All {category}
          </motion.h1>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {[...items]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <Link href={item.link} className="block">
                    <div className="relative aspect-[3/2] rounded-lg overflow-hidden mb-4">
                      {item.background ? (
                        item.background.type === 'video' ? (
                          <>
                            <video
                              autoPlay
                              muted
                              loop
                              playsInline
                              className="absolute inset-0 w-full h-full object-cover"
                              poster={item.background.poster}
                            >
                              <source src={item.background.src} type="video/mp4" />
                            </video>
                            <div className="absolute inset-0 bg-black/20" />
                          </>
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
    </AnimatePresenceWrapper>
  )
}

