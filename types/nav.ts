export interface FeaturedItem {
    title: string
    href: string
    image: string
  }
  
  export interface NavItem {
    name: string
    href: string
    external?: boolean
  }
  
  export interface NavSection {
    title: string
    items?: NavItem[]
    featured?: FeaturedItem
  }
  
  export interface NavigationItem {
    name: string
    href: string
    sections?: NavSection[]
  }
  
  