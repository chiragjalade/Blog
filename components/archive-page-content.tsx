'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { products, research, ContentItem } from '@/config/content'
import { SiteHeader } from '@/components/site-header'

const tabs = ['Products', 'Research']

export function ArchivePageContent({ initialCategory }: { initialCategory: string }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(initialCategory)
  const [items, setItems] = useState<ContentItem[]>(() => 
    activeTab === 'products' ? products : research
  )

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }), [])

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  }), [])

  useEffect(() => {
    setItems(activeTab === 'products' ? products : research)
  }, [activeTab])

  const handleBack = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    router.back()
  }, [router])

  const handleTabClick = useCallback((tab: string) => {
    setActiveTab(tab.toLowerCase())
  }, [])

  return (
    <>
      <SiteHeader />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-black pt-24"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <button
              onClick={handleBack}
              className="inline-flex items-center text-sm text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </button>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-4xl font-bold text-white mb-8"
          >
            Archive
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex space-x-4 mb-8"
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.toLowerCase()
                    ? 'bg-white text-black'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="aspect-video sm:aspect-[3/4] relative overflow-hidden rounded-lg"
                >
                  <Link href={`/${activeTab}/${item.id}`} className="block h-full">
                    <div 
                      className="absolute inset-0 w-full h-full transition-transform duration-300 hover:scale-105"
                      style={{ background: item.gradient }}
                    />
                    <div className="absolute inset-0 bg-black/50 p-4 sm:p-6 flex flex-col justify-end">
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">{item.title}</h3>
                      <p className="text-white/60 text-xs sm:text-sm mb-2 sm:mb-4">{item.date}</p>
                      <p className="text-white/80 text-sm line-clamp-2 sm:line-clamp-3">{item.content}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  )
}

