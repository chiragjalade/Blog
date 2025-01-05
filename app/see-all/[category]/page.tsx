import { products, research } from '@/config/content'
import { SeeAllContent } from '@/components/see-all-content'

interface SeeAllPageProps {
  params: {
    category: string
  }
}

export function generateStaticParams() {
  return [
    { category: 'products' },
    { category: 'research' },
  ]
}

export default function SeeAllPage({ params }: SeeAllPageProps) {
  const category = params.category.replace(/-/g, ' ')
  const items = category.toLowerCase() === 'products' ? products : research

  return <SeeAllContent category={category} items={items} />
}

