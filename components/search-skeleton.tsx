import { Skeleton } from "@/components/ui/skeleton"

export function SearchSkeleton() {
  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden">
      <div className="flex-grow flex flex-col mx-auto max-w-4xl px-6 py-8 overflow-hidden">
        <div className="mb-12">
          <Skeleton className="h-12 w-full mb-2" />
          <Skeleton className="h-16 w-full" />
        </div>
        <div className="flex-grow overflow-y-auto space-y-3 pr-2">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

