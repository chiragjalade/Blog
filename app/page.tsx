'use client'

import { motion } from 'framer-motion'
import { HeroCarousel } from "@/components/hero-carousel"
import { ProductCarousel } from "@/components/product-carousel"
import { SiteFooter } from "@/components/site-footer"
import { products, research } from '@/config/content'
import { AnimatePresenceWrapper } from "@/components/animate-presence-wrapper"

export default function Home() {
  return (
    <AnimatePresenceWrapper>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
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
    </AnimatePresenceWrapper>
  )
}

