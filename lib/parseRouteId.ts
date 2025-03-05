type ParsedRoute = {
  partId?: string
  treatiseId?: number
  questionId?: number
  articleId?: number
}

export function parseRouteId(id: string): ParsedRoute {
  const parts = id.split("-")
  const result: ParsedRoute = {}

  parts.forEach((part) => {
    if (part.startsWith("Pt")) result.partId = part.slice(2)
    else if (part.startsWith("Tr")) result.treatiseId = parseInt(part.slice(2))
    else if (part.startsWith("Qu")) result.questionId = parseInt(part.slice(2))
    else if (part.startsWith("Ar")) result.articleId = parseInt(part.slice(2))
  })

  return result
}

