import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { Preloader } from "@/components/preloader"
import { LoadingProvider } from "@/context/loading-context"
import { VideoProvider } from "@/context/video-context"

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
      <body className={`${inter.className} bg-black antialiased`}>
        <LoadingProvider>
          <VideoProvider>
            <Preloader />
            {children}
          </VideoProvider>
        </LoadingProvider>
      </body>
    </html>
  )
}

