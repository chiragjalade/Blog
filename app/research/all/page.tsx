'use client'

import { SiteHeader } from "@/components/site-header"
import { research } from "@/config/content"
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

export default function AllResearchPage() {
  const router = useRouter()

  const sortedResearch = [...research].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return (
    <>
      <SiteHeader />
      <AnimatePresence mode="wait">
        <motion.main
          className="container mx-auto px-4 py-24" // Increased top padding to avoid navbar overlap
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          <div className="flex items-center mb-8">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-white" />
            </button>
            <h1 className="text-4xl font-bold text-white">All Research</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedResearch.map((article) => (
              <motion.div key={article.id} variants={itemVariants}>
                <Link href={`/research/${article.id}`} className="block">
                  <div className="rounded-lg overflow-hidden">
                    <div className="aspect-[3/2] relative">
                      <div className="absolute inset-0" style={{ background: article.gradient }} />
                    </div>
                    <div className="p-6 bg-gray-900"> {/* Changed to dark background */}
                      <h2 className="text-xl font-semibold mb-2 text-white">{article.title}</h2>
                      <p className="text-white/70 mb-4 h-12 overflow-hidden">
                        {article.content || '\u00A0'}
                      </p>
                      <span className="text-sm text-white/50">{article.date}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.main>
      </AnimatePresence>
    </>
  )
}

