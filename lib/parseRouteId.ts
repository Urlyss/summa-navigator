type ParsedRoute = {
  partId?: string
  treatiseId?: string
  questionId?: string
  articleId?: string
}

export function parseRouteId(id: string): ParsedRoute {
  const parts = id.split("-")
  const result: ParsedRoute = {}

  parts.forEach((part) => {
    if (part.startsWith("Pt")) result.partId = part.slice(2)
    else if (part.startsWith("Tr")) result.treatiseId = part.slice(2)
    else if (part.startsWith("Qu")) result.questionId = part.slice(2)
    else if (part.startsWith("Ar")) result.articleId = part.slice(2)
  })

  return result
}

