'use client'
import Navigation from "@/components/Navigation"
import { Part } from "@/components/Part"
import { Treatise } from "@/components/Treatise"
import { Question } from "@/components/Question"
import { Article } from "@/components/Article"
import { Skeleton } from "@/components/ui/skeleton"
import { useContent } from "@/lib/hooks/useContent"


export default function DynamicPage({ params }: { params: { id: string } }) {
  const { data: content, isLoading, error } = useContent(params.id)

  if (isLoading) {
    return <ContentSkeleton />
  }

  if (error || !content) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> The requested content does not exist.</span>
      </div>
    )
  }

  const { part, treatise, question, article } = content

  return (
    <>
    <Navigation currentId={params.id} />
      {article ? (
        <Article {...article} />
      ) : question ? (
        <Question {...question}  />
      ) : treatise ? (
        <Treatise {...treatise} />
      ) : (
        <Part {...part} />
      )}
    </>
  )
}

function ContentSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-16">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-6 w-24" />
        ))}
      </div>
      <Skeleton className="h-10 w-3/4 mb-6" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  )
}

