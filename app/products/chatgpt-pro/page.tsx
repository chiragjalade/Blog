'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { useState, useEffect } from 'react'
import { Inter } from 'next/font/google'
import { useLoading } from '@/context/loading-context'

const inter = Inter({ subsets: ['latin'] })

export default function ChatGPTProPage() {
  const router = useRouter()
  const [isExiting, setIsExiting] = useState(false)
  const { resetLoading } = useLoading()

  useEffect(() => {
    resetLoading()
  }, [resetLoading])

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsExiting(true)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99],
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99],
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  return (
    <>
      <SiteHeader />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="min-h-screen bg-black"
      >
        <AnimatePresence mode="wait" onExitComplete={() => router.back()}>
          {!isExiting && (
            <motion.article 
              key="article"
              className="container mx-auto max-w-screen-xl px-6 sm:px-4 pt-24 pb-16 md:px-6 md:pt-32 md:pb-24"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="mx-auto max-w-3xl">
                <motion.div
                  variants={itemVariants}
                  className="mb-8"
                >
                  <Button
                    onClick={handleBack}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white hover:text-black transition-colors duration-200 rounded-full px-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </motion.div>
                <motion.header variants={itemVariants} className="mb-12 md:mb-16 text-center">
                  <motion.time 
                    variants={itemVariants}
                    dateTime="2024-12-05" 
                    className="block text-sm text-white/60 mb-4"
                  >
                    December 5, 2024
                  </motion.time>
                  <motion.h1 
                    variants={itemVariants}
                    className="text-4xl md:text-6xl font-medium text-white mb-6"
                  >
                    Introducing ChatGPT Pro
                  </motion.h1>
                  <motion.p 
                    variants={itemVariants}
                    className="text-xl md:text-2xl text-white/90 mb-4"
                  >
                    Broadening usage of frontier AI.
                  </motion.p>
                  <motion.div
                    variants={itemVariants}
                    className={`text-sm text-white/60 ${inter.className} font-medium`}
                  >
                    Chirag S J
                  </motion.div>
                </motion.header>
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
                >
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-black hover:bg-white/90 rounded-full px-8"
                  >
                    <Link href="https://chat.openai.com/auth/login" className="flex items-center gap-2">
                      Start now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div 
                  variants={itemVariants}
                  className="prose prose-invert mx-auto px-2 sm:px-0"
                >
                  <p className="text-lg md:text-xl text-white/90">
                    As AI becomes more advanced, it will solve increasingly complex and critical problems. It also takes significantly more compute to power these capabilities.
                  </p>
                  <p className="text-lg md:text-xl text-white/90">
                    Today, we&apos;re adding ChatGPT Pro, a $200 monthly plan that enables scaled access to the best of OpenAI&apos;s models and tools. This plan includes unlimited access to our smartest model, OpenAI o1, as well as to o1-mini, GPT-4o, and Advanced Voice. It also includes o1 pro mode, a version of o1 that uses more compute to think harder and provide even better answers to the hardest problems. In the future, we expect to add more powerful, compute-intensive productivity features to this plan.
                  </p>
                  <p className="text-lg md:text-xl text-white/90">
                    ChatGPT Pro provides a way for researchers, engineers, and other individuals who use research-grade intelligence daily to accelerate their productivity and be at the cutting edge of advancements in AI.
                  </p>
                </motion.div>
              </div>
            </motion.article>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

