import Link from "next/link"
import { getContent } from "@/lib/getContent"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb"

type NavigationProps = {
  currentId: string
}

export default function Navigation({ currentId }: NavigationProps) {
  const content = getContent(currentId)

  if (!content || content == null) {
    return null
  }

  const { part, treatise, question, article } = content

  const links = [
    { href: "/explore", label: "Home" },
    part && { href: `/explore/Pt${part.id}`, label: part.title },
    treatise && { href: `/explore/Pt${part.id}-Tr${treatise.id}`, label: treatise.title || part.title },
    question && { href: `/explore/Pt${part.id}-Tr${treatise.id}-Qu${question.id}`, label: question.title },
    article && { href: `/explore/Pt${part.id}-Tr${treatise.id}-Qu${question.id}-Ar${article.id}`, label: article.title[0] },
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

