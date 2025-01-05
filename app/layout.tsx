import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { Preloader } from "@/components/preloader"
import { LoadingProvider } from "@/context/loading-context"
import { SiteHeader } from "@/components/site-header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "C27",
  description: "Chirag/Blog",
}

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
            {children}
          </div>
        </LoadingProvider>
      </body>
    </html>
  )
}

