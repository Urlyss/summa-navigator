import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getContent } from "@/lib/getContent"

type NavigationProps = {
  currentId: string
}

export default function Navigation({ currentId }: NavigationProps) {
  const { part, treatise, question, article } = getContent(currentId)

  const links = [
    { href: "/", label: "Home" },
    part && { href: `/Pt${part.id}`, label: part.title },
    treatise && { href: `/Pt${part.id}-Tr${treatise.id}`, label: treatise.title },
    question && { href: `/Pt${part.id}-Tr${treatise.id}-Qu${question.id}`, label: question.title },
    article && { href: `/Pt${part.id}-Tr${treatise.id}-Qu${question.id}-Ar${article.id}`, label: article.title[0] },
  ].filter(Boolean)

  return (
    <nav className="mb-4" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2">
        {links.map((link, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-2 text-gray-400" aria-hidden="true" />}
            {index === links.length - 1 ? (
              <span className="text-gray-700 font-normal" aria-current="page">
                {link.label}
              </span>
            ) : (
              <Link href={link.href} className="text-blue-600 hover:underline">
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

