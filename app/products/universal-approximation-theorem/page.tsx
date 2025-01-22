"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { useState } from "react"
import { Inter } from "next/font/google"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"

// Update the dynamic import to use a default import
const MathGraph = dynamic(() => import("./graph-component/math-graph"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[400px] rounded-xl" />,
}) as any // Add type assertion to resolve type issues

const inter = Inter({ subsets: ["latin"] })

export default function UniversalApproximationTheoremPage() {
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
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99],
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
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
                <motion.div variants={itemVariants} className="mb-8">
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
                    dateTime="2024-07-15"
                    className="block text-sm text-white/60 mb-4"
                  >
                    July 15, 2024
                  </motion.time>
                  <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-medium text-white mb-6">
                    Universal Approximation Theorem
                  </motion.h1>
                  <motion.p variants={itemVariants} className="text-xl md:text-2xl text-white/90 mb-4">
                    The foundation of neural networks&apos; power and versatility
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
                  <Button asChild size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-8">
                    <Link href="#learn-more">Learn more</Link>
                  </Button>
                  <Button asChild variant="ghost" size="lg" className="text-white hover:bg-white/10 rounded-full px-8">
                    <Link href="#interactive-demo" className="flex items-center gap-2">
                      Interactive Demo
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div variants={itemVariants} className="prose prose-invert mx-auto px-2 sm:px-0">
                  <p className="text-lg md:text-xl text-white/90">
                    The Universal Approximation Theorem is a fundamental concept in the theory of neural networks. It
                    states that a feed-forward network with a single hidden layer containing a finite number of neurons
                    can approximate any continuous function on compact subsets of R^n, under mild assumptions on the
                    activation function.
                  </p>
                  <motion.div variants={itemVariants} className="mt-12 mb-8 w-full mx-auto">
                    <div className="bg-black/50 rounded-xl p-4 sm:p-6 overflow-hidden">
                      <Suspense fallback={<Skeleton className="w-full h-[400px] rounded-xl" />}>
                        <MathGraph />
                      </Suspense>
                    </div>
                    <p className="text-sm text-white/60 text-center mt-4">
                      Figure 1: Example of a continuous function that can be approximated by a neural network
                    </p>
                  </motion.div>
                  <p className="text-lg md:text-xl text-white/90">
                    This theorem provides the theoretical foundation for why neural networks are so powerful and
                    versatile in various applications, from image recognition to natural language processing.
                  </p>
                </motion.div>
                <motion.div variants={itemVariants} className="mt-8 prose prose-invert mx-auto px-2 sm:px-0">
                  <h2 className="text-2xl font-semibold mb-4">Key Implications</h2>
                  <ul className="list-disc pl-6">
                    <li>Neural networks can approximate any continuous function</li>
                    <li>Provides theoretical justification for deep learning&apos;s success</li>
                    <li>Explains why neural networks can solve complex, non-linear problems</li>
                    <li>Highlights the importance of choosing appropriate activation functions</li>
                  </ul>
                  <p className="text-lg md:text-xl text-white/90 mt-4">
                    While the theorem guarantees the existence of a neural network that can approximate any function, it
                    doesn&apos;t provide a method for finding the optimal network architecture or weights. This is where
                    the art and science of deep learning come into play, as researchers and practitioners develop
                    techniques to train and optimize neural networks for specific tasks.
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

