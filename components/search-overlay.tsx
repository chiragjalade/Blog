'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { X } from 'lucide-react'

interface SearchOverlayProps {
  open: boolean
  onClose: () => void
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const router = useRouter()
  const [value, setValue] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (open) {
      setValue("")
      inputRef.current?.focus()
    }
  }, [open])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [onClose])

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && value) {
      router.push(`/search?q=${encodeURIComponent(value)}`)
      onClose()
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="container flex h-full items-center justify-center">
        <div className="relative w-full max-w-2xl">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/50 hover:text-white"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </button>
          <Command className="rounded-lg border bg-black/50 shadow-md">
            <Command.Input
              ref={inputRef}
              value={value}
              onValueChange={setValue}
              onKeyDown={onKeyDown}
              className="h-16 w-full border-none bg-transparent px-4 text-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-0"
              placeholder="Press 'Return' to search"
            />
          </Command>
        </div>
      </div>
    </div>
  )
}

