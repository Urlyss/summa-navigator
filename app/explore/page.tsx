'use client'

import CustomLink from "@/components/CustomLink"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useContent } from "@/lib/hooks/useContent"
import type { Doc } from "../../convex/_generated/dataModel"

export default function Home() {
  const { data, isLoading, error,refetch } = useContent("all")

  if (isLoading) {
    return <PartsSkeleton />
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-28 lg:px-36">
        <div className="flex justify-between">
          <div>
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> Failed to load parts.</span>
          </div>
          <div>
            <Button onClick={()=>{refetch()}}>Try again</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-28 lg:px-36">
      <h2 className="text-2xl font-semibold mb-4">Parts of Summa Theologica</h2>
      <ul className="space-y-2">
        {data && Array.isArray(data) && data.map((part: Doc<"parts">) => (
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

