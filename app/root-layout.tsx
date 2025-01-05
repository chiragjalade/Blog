import { Inter } from 'next/font/google'
import "./globals.css"
import { Preloader } from "@/components/preloader"
import { LoadingProvider } from "@/context/loading-context"
import { SiteHeader } from "@/components/site-header"
import { AnimatePresence } from 'framer-motion'

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black antialiased overflow-x-hidden`}>
        <LoadingProvider>
          <Preloader />
          <div className="relative w-full">
            <SiteHeader />
            <AnimatePresence mode="wait">
              {children}
            </AnimatePresence>
          </div>
        </LoadingProvider>
      </body>
    </html>
  )
}

