'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { useState } from 'react'
import { Inter } from 'next/font/google'
import { PerceptronDiagram } from "./perceptron-diagram-component/perceptron-diagram"

const inter = Inter({ subsets: ['latin'] })

export default function PerceptronPage() {
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
                    Introduction to Perceptrons
                  </motion.h1>
                  <motion.p 
                    variants={itemVariants}
                    className="text-xl md:text-2xl text-white/90 mb-4"
                  >
                    Understanding the building blocks of neural networks.
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
                    <Link href="#learn-more">Learn more</Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    size="lg"
                    className="text-white hover:bg-white/10 rounded-full px-8"
                  >
                    <Link href="#interactive-demo" className="flex items-center gap-2">
                      Interactive Demo
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div 
                  variants={itemVariants}
                  className="prose prose-invert mx-auto px-2 sm:px-0"
                >
                  <p className="text-lg md:text-xl text-white/90">
                    Explore the fundamentals of neural networks through our comprehensive guide to perceptrons at{" "}
                    <Link href="https://neural-fundamentals.com" className="text-white hover:text-white/90 underline underline-offset-4">
                      neural-fundamentals.com
                    </Link>
                    .
                  </p>
                  <p className="text-lg md:text-xl text-white/90">
                    A perceptron is the simplest form of a feedforward neural network. It&apos;s a fundamental building block that helps us understand how artificial neurons process information and make decisions. Through this guide, we&apos;ll explore how perceptrons learn from data and make predictions.
                  </p>
                  <p className="text-lg md:text-xl text-white/90">
                    We&apos;ve created an interactive learning environment where you can experiment with perceptrons and visualize their decision boundaries in real-time.
                  </p>
                </motion.div>
                <motion.div 
                  variants={itemVariants}
                  className="prose prose-invert mx-auto px-2 sm:px-0 mt-16"
                >
                  <h2 className="text-2xl font-semibold mb-4">Perceptron Architecture</h2>
                  <p className="text-lg md:text-xl text-white/90 mb-8">
                    The diagram below shows how inputs are weighted and combined to produce an output:
                  </p>
                  <div className="w-full bg-black/50 rounded-xl p-2 mb-8">
                    <PerceptronDiagram />
                  </div>
                  <p className="text-sm text-white/60 mt-2">
                    Note: The perceptron takes multiple inputs (x₁, x₂, ..., xₘ) and a bias term, combines them using weights, 
                    applies a non-linear activation function (ƒ), and produces an output (ŷ).
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

