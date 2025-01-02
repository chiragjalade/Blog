import Link from "next/link"
import { Github, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react'

const footerLinks = {
  "Our research": [
    { name: "Overview", href: "/overview" },
    { name: "Index", href: "/index" },
    { name: "Latest advancements", href: "/advancements" },
  ],
  "ChatGPT": [
    { name: "For Everyone", href: "/chatgpt" },
    { name: "For Teams", href: "/teams" },
    { name: "For Enterprises", href: "/enterprise" },
  ],
  "Safety overview": [
    { name: "Safety overview", href: "/safety" },
  ],
  "Company": [
    { name: "About us", href: "/about" },
    { name: "News", href: "/news" },
    { name: "Careers", href: "/careers" },
  ],
  "Terms & policies": [
    { name: "Terms of use", href: "/terms" },
    { name: "Privacy policy", href: "/privacy" },
    { name: "Brand guidelines", href: "/brand" },
  ],
}

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-16 px-4 md:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 text-sm font-semibold">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              © 2015-2024 OpenAI
            </span>
          </div>
          <div className="flex space-x-4">
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Youtube className="h-5 w-5" />
              <span className="sr-only">YouTube</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

