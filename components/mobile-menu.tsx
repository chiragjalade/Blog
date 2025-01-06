'use client'

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, X, ArrowUpRight } from 'lucide-react'
import { cn } from "@/lib/utils"
import { type NavigationItem } from "@/types/nav"

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  navItems: NavigationItem[]
}

export function MobileMenu({ open, onClose, navItems }: MobileMenuProps) {
  const [expanded, setExpanded] = React.useState<string | null>(null)

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black transition-all duration-300 ease-in-out",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      <div
        className={cn(
          "h-full w-full transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-medium text-white" onClick={onClose}>
            C27/Blog
          </Link>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-white/10 flex items-center justify-center"
          >
            <X className="h-5 w-5 text-white" />
            <span className="sr-only">Close menu</span>
          </button>
        </div>
        <div className="h-[calc(100vh-4rem)] overflow-y-auto px-4 pb-16">
          <nav>
            {navItems.map((item) => (
              <div key={item.name} className="border-b border-white/10">
                {item.sections ? (
                  <>
                    <button
                      onClick={() => setExpanded(expanded === item.name ? null : item.name)}
                      className="flex w-full items-center justify-between py-4 pr-2 text-xl text-white"
                    >
                      {item.name}
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-white/50 transition-transform duration-300",
                          expanded === item.name && "rotate-180"
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-300 ease-in-out",
                        expanded === item.name ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className={cn(
                          "space-y-6 pb-4 transition-all duration-300 ease-in-out",
                          expanded === item.name ? "opacity-100" : "opacity-0"
                        )}>
                          {item.sections.map((section) => (
                            <div key={section.title} className="space-y-4">
                              <h3 className="text-sm font-medium text-white/60">
                                {section.title}
                              </h3>
                              {section.items && (
                                <ul className="space-y-4">
                                  {section.items.map((subItem) => (
                                    <li key={subItem.name}>
                                      <Link
                                        href={subItem.href}
                                        className="group flex items-center gap-1 text-base text-white/90 hover:text-white transition-colors"
                                        onClick={onClose}
                                      >
                                        {subItem.name}
                                        {subItem.external && (
                                          <ArrowUpRight className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                                        )}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                              {section.featured && (
                                <Link 
                                  href={section.featured.href}
                                  className="block aspect-[2/1] overflow-hidden rounded-lg"
                                  onClick={onClose}
                                >
                                  <div className="relative h-full w-full">
                                    <Image
                                      src={section.featured.image}
                                      alt={section.featured.title}
                                      fill
                                      className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                      <div className="text-lg font-medium text-white">
                                        {section.featured.title}
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block py-4 text-xl text-white"
                    onClick={onClose}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}

