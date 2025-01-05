'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { allContent } from "@/config/content"
import { searchContent, type SearchResult } from "@/lib/search"
import { Input } from "@/components/ui/input"

export function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ""
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const searchResults = searchContent(query, allContent)
    setResults(searchResults)
  }, [query])

  useEffect(() => {
    // Focus the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <form onSubmit={handleSearch} className="mb-12">
          <div className="space-y-3">
            <div className="text-sm text-white/60">Your search</div>
            <Input
              ref={inputRef} // Attach the ref to the input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent text-[48px] leading-none font-medium text-white border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 hover:ring-0 p-0 shadow-none outline-none w-full h-15"
              placeholder="Search..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSearch(e)
                }
              }}
            />
          </div>
        </form>
        {results.length > 0 ? (
          <div className="space-y-6">
            <div className="text-sm text-white/60">Your results</div>
            <div className="space-y-3">
              {results.map((result) => (
                <div
                  key={result.key}
                  className="flex items-center justify-between rounded-lg bg-white/5 px-6 py-4 hover:bg-white/10 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <span>{result.type}</span>
                      {result.date && (
                        <>
                          <span>·</span>
                          <span>{result.date}</span>
                        </>
                      )}
                    </div>
                    <div className="text-white text-lg">{result.title}</div>
                  </div>
                  <div className="text-sm text-white/60">
                    {result.match}% match
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-white/60">
            No results found for &quot;{query}&quot;
          </div>
        )}
      </div>
    </div>
  )
}