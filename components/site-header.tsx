'use client'

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Search, ArrowUpRight } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { SearchOverlay } from "./search-overlay"
import { MobileMenu } from "./mobile-menu"
import { usePathname } from 'next/navigation'
import { type NavigationItem } from "@/types/nav"

const navItems: NavigationItem[] = [
  {
    name: "Research",
    href: "/research",
    sections: [
      {
        title: "Research",
        items: [
          { name: "Overview", href: "/research/overview" },
          { name: "Index", href: "/research/index" },
          { name: "Latest papers", href: "/research/papers" },
        ],
      },
      {
        title: "Models",
        items: [
          { name: "GPT-4", href: "/research/gpt-4" },
          { name: "DALL·E 3", href: "/research/dalle-3" },
          { name: "Sora", href: "/research/sora" },
        ],
      },
      {
        title: "Featured",
        featured: {
          title: "Introducing Sora",
          href: "/research/sora",
          image: "https://img.freepik.com/free-photo/vivid-blurred-colorful-background_58702-2563.jpg?semt=ais_hybrid",
        },
      },
    ],
  },
  {
    name: "Products",
    href: "/products",
    sections: [
      {
        title: "ChatGPT",
        items: [
          { name: "Overview", href: "/chatgpt" },
          { name: "For Teams", href: "/teams" },
          { name: "For Enterprises", href: "/enterprise" },
          { name: "For Education", href: "/education" },
          { name: "Pricing", href: "/pricing" },
          { name: "ChatGPT login", href: "/login", external: true },
        ],
      },
      {
        title: "API",
        items: [
          { name: "Overview", href: "/api" },
          { name: "Pricing", href: "/api/pricing" },
          { name: "Documentation", href: "/docs", external: true },
          { name: "API login", href: "/api/login", external: true },
        ],
      },
      {
        title: "Sora",
        items: [
          { name: "Overview", href: "/sora" },
          { name: "Features", href: "/sora/features" },
          { name: "Pricing", href: "/sora/pricing" },
          { name: "Help center", href: "/sora/help", external: true },
          { name: "Sora login", href: "/sora/login", external: true },
        ],
      },
      {
        title: "Explore more",
        items: [
          { name: "OpenAI for business", href: "/business" },
          { name: "Stories", href: "/stories" },
        ],
        featured: {
          title: "Introducing Sora",
          href: "/sora",
          image: "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTAxL3Jhd3BpeGVsX29mZmljZV8zMF9yZXRyb19kYXJrX2dyZWVuX2dyYWlueS1ncmFkaWVudF9ibHVyX2Fic3RyYV80NTMwNGVjYy0yMDAxLTQ4NDItODgyMi0zZmYzOTM5OTIzZTZfMS5qcGc.jpg",
        },
      },
    ],
  },
  { name: "Safety", href: "/safety" },
  { name: "Company", href: "/company" },
]

export function SiteHeader() {
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [menuOpen, setMenuOpen] = React.useState(false)
  const pathname = usePathname()

  const handleLogoClick = () => {
    // Only trigger preloader when clicking logo
    const win = window as Window & typeof globalThis & {
      startPreloader?: () => void;
    };
    if (typeof window !== 'undefined' && win.startPreloader) {
      win.startPreloader();
    }
  }

  return (
    <>
      <header className="fixed top-0 z-50 w-full bg-black/50 backdrop-blur-md h-16">
        <div className="container flex h-full items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-12">
            <Link href="/" className="text-xl font-medium text-white" onClick={handleLogoClick}>
              C27/Blog
            </Link>
            <NavigationMenu className="hidden md:block">
              <NavigationMenuList className="flex space-x-4">
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    {item.sections ? (
                      <>
                        <NavigationMenuTrigger className="text-sm text-white/90 hover:text-white px-4 py-2 transition-colors bg-transparent">
                          {item.name}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="w-[1120px] p-6">
                            <div className="grid grid-cols-4 gap-6">
                              {item.sections.map((section, idx) => (
                                <div key={idx} className="space-y-4">
                                  <h3 className="text-sm font-medium text-white/60">
                                    {section.title}
                                  </h3>
                                  {section.items && (
                                    <ul className="space-y-4">
                                      {section.items.map((subItem) => (
                                        <li key={subItem.name}>
                                          <Link
                                            href={subItem.href}
                                            className="group flex items-center gap-1 text-sm text-white/90 hover:text-white transition-colors"
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
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-sm text-white/90 hover:text-white px-4 py-2 transition-colors"
                      >
                        {item.name}
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center gap-2">
            {pathname !== '/search' && (
              <button
                className="rounded-full p-2 hover:bg-white/10"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-5 w-5 text-white" />
                <span className="sr-only">Search</span>
              </button>
            )}
            <button
              className="rounded-full p-2 hover:bg-white/10 md:hidden"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="h-5 w-5 text-white" />
              <span className="sr-only">Menu</span>
            </button>
          </div>
        </div>
      </header>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} navItems={navItems} />
    </>
  )
}

