'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { useState } from 'react'
import { Inter } from 'next/font/google'
import { AnimatedGraph } from "@/components/animated-graph"

const inter = Inter({ subsets: ['latin'] })

export default function GANPage() {
  const router = useRouter()
  const [isExiting, setIsExiting] = useState(false)

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
                    dateTime="2024-01-08" 
                    className="block text-sm text-white/60 mb-4"
                  >
                    January 8, 2024
                  </motion.time>
                  <motion.h1 
                    variants={itemVariants}
                    className="text-4xl md:text-6xl font-medium text-white mb-6"
                  >
                    WTF are GANs?
                  </motion.h1>
                  <motion.p 
                    variants={itemVariants}
                    className="text-xl md:text-2xl text-white/90 mb-4"
                  >
                    The AI wizardry behind generating fake stuff that looks real AF
                  </motion.p>
                  <motion.div
                    variants={itemVariants}
                    className={`text-sm text-white/60 ${inter.className} font-medium`}
                  >
                    Chirag Jalade
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
                    <Link href="#learn-more">See Examples</Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    size="lg"
                    className="text-white hover:bg-white/10 rounded-full px-8"
                  >
                    <Link href="#playground" className="flex items-center gap-2">
                      Try it yourself
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div 
                  variants={itemVariants}
                  className="prose prose-invert mx-auto px-2 sm:px-0"
                >
                  <p className="text-lg md:text-xl text-white/90">
                    Imagine two AI networks locked in an epic battle: one trying to create fake stuff, the other trying to spot the fakes. That&apos;s a GAN (Generative Adversarial Network) in a nutshell. Check out more at{" "}
                    <Link href="https://gan-explained.com" className="text-white hover:text-white/90 underline underline-offset-4">
                      gan-explained.com
                    </Link>
                    .
                  </p>
                  <p className="text-lg md:text-xl text-white/90">
                    The &quot;Generator&quot; is like an art forger, getting better at creating fake images, videos, or whatever you want. Meanwhile, the &quot;Discriminator&quot; is like a detective, trying to catch these fakes. As they duke it out, both get scary good at their jobs.
                  </p>
                  <p className="text-lg md:text-xl text-white/90">
                    Welcome to our no-BS guide to understanding how GANs create those mind-bending deepfakes and AI art you&apos;ve been seeing everywhere.
                  </p>
                </motion.div>
                <motion.div 
                  variants={itemVariants}
                  className="prose prose-invert mx-auto px-2 sm:px-0 mt-16"
                >
                  <h2 className="text-2xl font-semibold mb-4">The Battle of Generator vs Discriminator</h2>
                  <p className="text-lg md:text-xl text-white/90 mb-4">
                    Watch these two networks duke it out in real-time. The graph shows how the quality of generated images improves as the Generator gets better at fooling the Discriminator:
                  </p>
                  <AnimatedGraph />
                  <p className="text-sm text-white/60 mt-2">
                    Note: Higher values mean the Generator is creating more realistic fakes. Lower values mean the Discriminator is better at spotting them.
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