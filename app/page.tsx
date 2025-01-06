'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { HeroCarousel } from "@/components/hero-carousel"
import { ProductCarousel } from "@/components/product-carousel"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const products = [
  {
    title: "Sora is here",
    gradient: "linear-gradient(to bottom right, #9333ea, #6b21a8)",
    overlayImage: "https://res.cloudinary.com/ddpumiekp/image/upload/v1736168819/carousel-card-images/un181eqlzwimojzu9ld3.webp",
    link: "/products/sora"
  },
  {
    title: "Introducing ChatGPT Pro",
    gradient: "linear-gradient(to bottom right, #fbbf24, #d97706)",
    overlayImage: "https://res.cloudinary.com/ddpumiekp/image/upload/v1736168812/carousel-card-images/x7s17hftuv6hf8k5t0c9.webp",
    link: "/products/chatgpt-pro"
  },
  {
    title: "Introducing ChatGPT search",
    gradient: "linear-gradient(to bottom right, #60a5fa, #3b82f6)",
    link: "/products/chatgpt-search"
  },
  {
    title: "Introducing canvas",
    subtitle: "A new way to write and code with ChatGPT",
    gradient: "linear-gradient(to bottom right, #f87171, #dc2626)",
    link: "/products/canvas"
  },
  {
    title: "GPT-4 Turbo",
    gradient: "linear-gradient(to bottom right, #4ade80, #16a34a)",
    link: "/products/gpt-4-turbo"
  },
  {
    title: "DALL·E 3",
    gradient: "linear-gradient(to bottom right, #c084fc, #9333ea)",
    link: "/products/dalle-3"
  },
  {
    title: "API",
    gradient: "linear-gradient(to bottom right, #94a3b8, #475569)",
    link: "/products/api"
  },
  {
    title: "Enterprise",
    gradient: "linear-gradient(to bottom right, #2dd4bf, #0d9488)",
    link: "/products/enterprise"
  }
]

const research = [
  {
    title: "Safety & Alignment",
    date: "Dec 5, 2024",
    gradient: "linear-gradient(to bottom right, #f87171, #dc2626)",
    link: "/research/safety-alignment-dec-5"
  },
  {
    title: "Safety & Alignment",
    date: "Nov 30, 2024",
    gradient: "linear-gradient(to bottom right, #c084fc, #9333ea)",
    link: "/research/safety-alignment-nov-30"
  },
  {
    title: "Research",
    date: "Dec 5, 2024",
    gradient: "linear-gradient(to bottom right, #fbbf24, #d97706)",
    link: "/research/dec-5"
  },
  {
    title: "Research",
    date: "Sep 12, 2024",
    gradient: "linear-gradient(to bottom right, #2dd4bf, #0d9488)",
    link: "/research/sep-12"
  },
  {
    title: "Safety & Alignment",
    date: "Aug 28, 2024",
    gradient: "linear-gradient(to bottom right, #60a5fa, #3b82f6)",
    link: "/research/safety-alignment-aug-28"
  },
  {
    title: "Research",
    date: "Aug 15, 2024",
    gradient: "linear-gradient(to bottom right, #4ade80, #16a34a)",
    link: "/research/aug-15"
  },
  {
    title: "Safety & Alignment",
    date: "Jul 30, 2024",
    gradient: "linear-gradient(to bottom right, #f472b6, #db2777)",
    link: "/research/safety-alignment-jul-30"
  },
  {
    title: "Research",
    date: "Jul 15, 2024",
    gradient: "linear-gradient(to bottom right, #94a3b8, #475569)",
    link: "/research/jul-15"
  }
]

export default function Home() {
  useEffect(() => {
    // Any client-side effects can go here
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SiteHeader />
      <main className="min-h-screen bg-black pt-16">
        <div className="container mx-auto px-0 py-4">
          <HeroCarousel />
        </div>
        <div className="space-y-2 py-4">
          <ProductCarousel title="Products" items={products} />
          <ProductCarousel title="Research" items={research} />
        </div>
      </main>
      <SiteFooter />
    </motion.div>
  )
}

