import { db } from "./db"
import { parseRouteId } from "./parseRouteId"

export function getContent(id: string) {
  const { partId, treatiseId, questionId, articleId } = parseRouteId(id)

  const part = db.find((p) => p.id === partId)
  if (!part) return null

  if (!treatiseId) return { part }

  const treatise = part.treatises.find((t) => t.id.toString() === treatiseId)
  if (!treatise) return null

  if (!questionId) return { part, treatise }

  const question = treatise.questions.find((q) => q.id.toString() === questionId)
  if (!question) return null

  if (!articleId) return { part, treatise, question }

  const article = question.articles.find((a) => a.id.toString() === articleId)
  if (!article) return null

  return { part, treatise, question, article }
}

