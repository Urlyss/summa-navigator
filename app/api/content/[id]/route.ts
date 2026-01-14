import { NextResponse } from 'next/server'
import { parseRouteId } from '@/lib/parseRouteId'
import { api } from '../../../../convex/_generated/api'
import { getConvexServerClient } from '@/lib/convexServer'

// Helper function to handle errors
const handleError = (error: unknown) => {
  console.error('Error:', error)
  return NextResponse.json({ error: 'Error fetching content' }, { status: 500 })
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const convex = getConvexServerClient()
    // If no id, return all parts
    if (params.id == "all") {
      const data = await convex.query(api.content.getAllParts, {})
      return NextResponse.json(data)
    }

    const { partId, treatiseId, questionId, articleId } = parseRouteId(params.id)

    // Case 1: Only partId - Get part and its treatises
    if (partId && !treatiseId) {
      const partWithTreatises = await convex.query(
        api.content.getPartWithTreatises,
        { originalId: partId }
      )
      return NextResponse.json({ part: partWithTreatises })
    }
    
    // Case 2: partId and treatiseId - Get treatise and its questions
    if (partId && treatiseId && !questionId) {
      const treatiseWithQuestions = await convex.query(
        api.content.getTreatiseWithQuestions,
        { partOriginalId: partId, treatiseOriginalId: treatiseId }
      )
      return NextResponse.json({ treatise: treatiseWithQuestions })
    }

    // Case 3: partId, treatiseId, and questionId - Get question and its articles
    if (partId && treatiseId && questionId && !articleId) {
      const questionWithArticles = await convex.query(
        api.content.getQuestionWithArticles,
        {
          partOriginalId: partId,
          treatiseOriginalId: treatiseId,
          questionOriginalId: questionId,
        }
      )
      return NextResponse.json({ question: questionWithArticles })
    }

    // Case 4: partId, treatiseId, questionId, and articleId - Get specific article
    if (partId && treatiseId && questionId && articleId) {
      const article = await convex.query(api.content.getArticleFull, {
        partOriginalId: partId,
        treatiseOriginalId: treatiseId,
        questionOriginalId: questionId,
        articleOriginalId: articleId,
      })
      return NextResponse.json({ article })
    }

    throw new Error('Invalid ID format')
  } catch (error) {
    return handleError(error)
  }
}