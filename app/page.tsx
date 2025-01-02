import { HeroCarousel } from "@/components/hero-carousel"
import { ProductCarousel } from "@/components/product-carousel"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Globe, Pencil } from 'lucide-react'

const products = [
  {
    title: "Sora is here",
    gradient: "linear-gradient(to bottom right, #9333ea, #6b21a8)",
    overlay: (
      <div className="rounded-lg bg-black/20 backdrop-blur-sm px-4 py-2 flex items-center gap-2 text-white text-sm">
        <span>Describe your video...</span>
        <div className="flex items-center gap-2 ml-4">
          <span>16:9</span>
          <span>480p</span>
        </div>
      </div>
    ),
    link: "/products/sora"
  },
  {
    title: "Introducing ChatGPT Pro",
    gradient: "linear-gradient(to bottom right, #fbbf24, #d97706)",
    overlay: (
      <div className="rounded-lg bg-white px-4 py-3 max-w-[80%]">
        <div className="h-2 w-32 bg-black/10 rounded" />
        <div className="mt-2 text-sm text-black/60">Issues with mutexes...</div>
      </div>
    ),
    link: "/products/chatgpt-pro"
  },
  {
    title: "Introducing ChatGPT search",
    gradient: "linear-gradient(to bottom right, #60a5fa, #3b82f6)",
    overlay: (
      <div className="rounded-full bg-white px-6 py-3 flex items-center gap-2">
        <Globe className="h-5 w-5 text-blue-500" />
        <span className="text-lg font-medium text-blue-500">Search</span>
      </div>
    ),
    link: "/products/chatgpt-search"
  },
  {
    title: "Introducing canvas",
    subtitle: "A new way to write and code with ChatGPT",
    gradient: "linear-gradient(to bottom right, #f87171, #dc2626)",
    icon: <div className="rounded-full bg-white p-2"><Pencil className="h-5 w-5 text-red-500" /></div>,
    link: "/products/canvas"
  },
  {
    title: "GPT-4 Turbo",
    gradient: "linear-gradient(to bottom right, #4ade80, #16a34a)",
    icon: <div className="rounded-full bg-white p-2"><Pencil className="h-5 w-5 text-green-500" /></div>,
    link: "/products/gpt-4-turbo"
  },
  {
    title: "DALL·E 3",
    gradient: "linear-gradient(to bottom right, #c084fc, #9333ea)",
    icon: <div className="rounded-full bg-white p-2"><Pencil className="h-5 w-5 text-purple-500" /></div>,
    link: "/products/dalle-3"
  },
  {
    title: "API",
    gradient: "linear-gradient(to bottom right, #94a3b8, #475569)",
    icon: <div className="rounded-full bg-white p-2"><Pencil className="h-5 w-5 text-slate-500" /></div>,
    link: "/products/api"
  },
  {
    title: "Enterprise",
    gradient: "linear-gradient(to bottom right, #2dd4bf, #0d9488)",
    icon: <div className="rounded-full bg-white p-2"><Pencil className="h-5 w-5 text-teal-500" /></div>,
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
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-black pt-16"> {/* Added pt-16 for top padding */}
        <div className="container mx-auto px-0 py-4">
          <HeroCarousel />
        </div>
        <div className="space-y-2 py-4">
          <ProductCarousel title="Products" items={products} />
          <ProductCarousel title="Research" items={research} />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

