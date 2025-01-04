'use client'

import { useState } from 'react'
import { Suspense } from 'react'
import { SearchContent } from '@/components/search-content'
import { SearchOverlay } from '@/components/search-overlay'
import { useRouter } from 'next/navigation'

export default function SearchPage() {
  const [searchOpen, setSearchOpen] = useState(true)
  const router = useRouter()

  const handleCloseSearch = () => {
    setSearchOpen(false)
    router.back()
  }

  return (
    <>
      <Suspense fallback={<SearchSkeleton />}>
        <SearchContent />
      </Suspense>
      <SearchOverlay open={searchOpen} onClose={handleCloseSearch} />
    </>
  )
}

function SearchSkeleton() {
  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="container max-w-4xl py-8">
        <div className="mb-8">
          <div className="h-4 w-24 bg-white/10 rounded mb-2" />
          <div className="h-8 w-64 bg-white/10 rounded" />
        </div>
        <div className="space-y-4">
          <div className="h-4 w-24 bg-white/10 rounded" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}

