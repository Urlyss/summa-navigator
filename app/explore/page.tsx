'use client'

import CustomLink from "@/components/CustomLink"
import { Skeleton } from "@/components/ui/skeleton"
import { useContent } from "@/lib/hooks/useContent"
import { Database } from "@/types/database.types"

export default function Home() {
  const { data, isLoading, error } = useContent("all")

  if (isLoading) {
    return <PartsSkeleton />
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-28 lg:px-36">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> Failed to load parts.</span>
      </div>
    )
  }

  return (
    <div className="mt-28 lg:px-36">
      <h2 className="text-2xl font-semibold mb-4">Parts of Summa Theologica</h2>
      <ul className="space-y-2">
        {data && Array.isArray(data) && data.map((part:Database['public']['Tables']['parts']['Row']) => (
          <li key={part.id}>
            <CustomLink title={part.title} href={`/explore/Pt${part.original_id}`}/>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PartsSkeleton() {
  return (
    <div className="mt-28 lg:px-36">
      <Skeleton className="h-8 w-64 mb-4" />
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  )
}

