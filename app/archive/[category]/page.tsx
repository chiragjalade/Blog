import { ArchivePageContent } from '@/components/archive-page-content'

export function generateStaticParams() {
  return [
    { category: 'products' },
    { category: 'research' }
  ]
}

export default function ArchivePage({ params }: { params: { category: string } }) {
  return <ArchivePageContent initialCategory={params.category} />
}

