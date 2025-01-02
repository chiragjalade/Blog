export interface SearchResult {
  id: string
  type: 'Hero' | 'Product' | 'Research'
  title: string
  description?: string
  content?: string
  date?: string
  match: number
  key: string
}

export interface SearchItem {
  id: string
  type: 'Hero' | 'Product' | 'Research'
  title: string
  description?: string
  content?: string
  date?: string
}

function calculateMatchScore(query: string, text: string): number {
  const normalizedQuery = query.toLowerCase().trim()
  const normalizedText = text.toLowerCase()
  
  const words = normalizedQuery.split(/\s+/)
  let matchedWords = 0
  
  words.forEach(word => {
    if (normalizedText.includes(word)) {
      matchedWords++
    }
  })
  
  return matchedWords / words.length
}

export function searchContent(query: string, items: SearchItem[]): SearchResult[] {
  if (!query) return []
  
  const results: SearchResult[] = []
  
  items.forEach(item => {
    const titleScore = calculateMatchScore(query, item.title) * 2
    const descriptionScore = item.description ? calculateMatchScore(query, item.description) : 0
    const contentScore = item.content ? calculateMatchScore(query, item.content) : 0
    
    const maxScore = Math.max(titleScore, descriptionScore, contentScore)
    
    if (maxScore > 0) {
      results.push({
        ...item,
        match: Math.round(maxScore * 100),
        key: `${item.type}-${item.id}`
      })
    }
  })
  
  return results.sort((a, b) => b.match - a.match)
}

