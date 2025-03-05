'use client'

import Link from "next/link"
import { useContent } from "@/lib/hooks/useContent"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb"
import { Skeleton } from "./ui/skeleton"

type NavigationProps = {
  currentId: string
}

export default function Navigation({ currentId }: NavigationProps) {
  const { data: content, isLoading } = useContent(currentId)

  if (isLoading) {
    return <NavigationSkeleton />
  }

  if (!content || content == null) {
    return null
  }

  // Extract the relevant data based on the content structure
  const part = content.part || (content.treatise?.part) || (content.question?.part) || (content.article?.part)
  const treatise = content.treatise || (content.question?.treatise) || (content.article?.treatise)
  const question = content.question || (content.article?.question)
  const article = content.article

  // Create the navigation links with the correct structure
  const links = [
    { href: "/explore", label: "Home" },
    part && { href: `/explore/Pt${part.original_id}`, label: part.title },
    treatise && { href: `/explore/Pt${part.original_id}-Tr${treatise.original_id}`, label: treatise.title || part.title },
    question && { href: `/explore/Pt${part.original_id}-Tr${treatise.original_id}-Qu${question.original_id}`, label: question.title },
    article && { href: `/explore/Pt${part.original_id}-Tr${treatise.original_id}-Qu${question.original_id}-Ar${article.original_id}`, label: article.title[0] },
  ].filter(Boolean)

  return (
    <Breadcrumb className="mb-16">
      <BreadcrumbList>
        {links.map((link, ind) => (
          <div key={ind} className="flex items-center gap-4">
            <BreadcrumbItem>
              {links.length == 1 || ind < links.length - 1 ? (
                <BreadcrumbLink asChild className="text-blue-700 hover:text-blue-900">
                  <Link href={link?.href || '/'}>{link?.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{link?.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {ind != links.length-1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

function NavigationSkeleton() {
  return (
    <div className="flex gap-2 mb-16">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-6 w-24" />
      ))}
    </div>
  )
}