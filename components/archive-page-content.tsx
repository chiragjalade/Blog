'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { products, research, ContentItem } from '@/config/content'
import { SiteHeader } from '@/components/site-header'

const tabs = ['Products', 'Research']

interface ArchivePageContentProps {
  initialCategory: string
}

export function ArchivePageContent({ initialCategory }: ArchivePageContentProps) {
  const [activeTab, setActiveTab] = useState(initialCategory)
  const [items, setItems] = useState<ContentItem[]>(() => 
    activeTab === 'products' ? products : research
  )

  useEffect(() => {
    setItems(activeTab === 'products' ? products : research)
  }, [activeTab])

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
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-8">Archive</h1>
          <div className="flex space-x-4 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.toLowerCase()
                    ? 'bg-white text-black'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="aspect-[3/4] relative overflow-hidden rounded-lg"
                >
                  <Link href={`/${activeTab}/${item.id}`} className="block h-full">
                    <div 
                      className="absolute inset-0 w-full h-full"
                      style={{ background: item.gradient }}
                    />
                    <div className="absolute inset-0 bg-black/50 p-6 flex flex-col justify-end">
                      <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                      <p className="text-white/60 text-sm mb-4">{item.date}</p>
                      <p className="text-white/80 line-clamp-3">{item.content}</p>
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

