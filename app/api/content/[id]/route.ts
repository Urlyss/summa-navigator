import { supabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { parseRouteId } from '@/lib/parseRouteId'

// Helper function to handle errors
const handleError = (error: any) => {
  console.error('Error:', error)
  return NextResponse.json({ error: 'Error fetching content' }, { status: 500 })
}

// Helper function to get part by original_id
async function getPartByOriginalId(originalId: string) {
  const { data, error } = await supabase
    .from('parts')
    .select('*')
    .eq('original_id', originalId)
    .single()
  
  if (error) throw error
  return data
}

// Helper function to get treatise by original_id and part_id
async function getTreatiseByOriginalId(originalId: number, partId: number) {
  const { data, error } = await supabase
    .from('treatises')
    .select('*')
    .eq('original_id', originalId)
    .eq('part_id', partId)
    .single()
  
  if (error) throw error
  return data
}

// Helper function to get question by original_id and treatise_id
async function getQuestionByOriginalId(originalId: number, treatiseId: number) {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('original_id', originalId)
    .eq('treatise_id', treatiseId)
    .single()
  
  if (error) throw error
  return data
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    
    // If no id, return all parts
    if (params.id == "all") {
      const { data, error } = await supabase
        .from('parts')
        .select('*')
        .order("id")
      
      if (error) throw error
      return NextResponse.json(data)
    }

    const { partId, treatiseId, questionId, articleId } = parseRouteId(params.id)

    // Case 1: Only partId - Get part and its treatises
    if (partId && !treatiseId) {
      const part = await getPartByOriginalId(partId)
      
      const { data: treatises, error } = await supabase
        .from('treatises')
        .select('*')
        .eq('part_id', part.id)
        .order("original_id")
      
      if (error) throw error
      return NextResponse.json({part:{ ...part, treatises }})
    }
    
    // Case 2: partId and treatiseId - Get treatise and its questions
    if (partId && treatiseId && !questionId) {
      const part = await getPartByOriginalId(partId)
      const treatise = await getTreatiseByOriginalId(treatiseId, part.id)
      
      const { data: questions, error } = await supabase
        .from('questions')
        .select('*')
        .eq('treatise_id', treatise.id)
        .order("original_id")
      
      if (error) throw error
      return NextResponse.json({treatise:{ ...treatise, questions, part }})
    }

    // Case 3: partId, treatiseId, and questionId - Get question and its articles
    if (partId && treatiseId && questionId && !articleId) {
      const part = await getPartByOriginalId(partId)
      const treatise = await getTreatiseByOriginalId(treatiseId, part.id)
      const question = await getQuestionByOriginalId(questionId, treatise.id)
      
      const { data: articles, error } = await supabase
        .from('articles')
        .select('*')
        .eq('question_id', question.id)
        .order("original_id")
      
      if (error) throw error
      return NextResponse.json({question:{ ...question, articles, treatise, part }})
    }

    // Case 4: partId, treatiseId, questionId, and articleId - Get specific article
    if (partId && treatiseId && questionId && articleId) {
      const part = await getPartByOriginalId(partId)
      const treatise = await getTreatiseByOriginalId(treatiseId, part.id)
      const question = await getQuestionByOriginalId(questionId, treatise.id)
      
      const { data: article, error } = await supabase
        .from('articles')
        .select('*')
        .eq('original_id', articleId)
        .eq('question_id', question.id)
        .single()
      
      if (error) throw error
      return NextResponse.json({article:{ ...article, question, treatise, part }})
    }

    throw new Error('Invalid ID format')
  } catch (error) {
    return handleError(error)
  }
}