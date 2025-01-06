import { Suspense } from 'react'
import { SearchContent } from '@/components/search-content'
import { SiteHeader } from "@/components/site-header"
import { SearchSkeleton } from '@/components/search-skeleton'

export default function SearchPage() {
  return (
    <>
      <SiteHeader />
      <Suspense fallback={<SearchSkeleton />}>
        <SearchContent />
      </Suspense>
    </>
  )
}

