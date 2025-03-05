import { createClient } from '@supabase/supabase-js'
import { data } from './data'
import dotenv from 'dotenv'
import { Database } from '@/types/database.types'

dotenv.config({ path: '.env.local' })

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

async function migrate() {
  try {
    console.log('Starting migration...')

    // Clear existing data to avoid conflicts
    console.log('Clearing existing data...')
    await supabase.from('articles').delete().neq('id', 0)
    await supabase.from('questions').delete().neq('id', 0)
    await supabase.from('treatises').delete().neq('id', 0)
    await supabase.from('parts').delete().neq('id', 0)
    console.log('Existing data cleared')

    // Insert parts and get their IDs
    const partsToInsert = data.parts.map(part => ({
      original_id: part.original_id,
      title: part.title
    }))

    const { data: insertedParts, error: partsError } = await supabase
      .from('parts')
      .insert(partsToInsert)
      .select()

    if (partsError) throw partsError
    console.log(`Inserted ${insertedParts.length} parts`)

    // Create a map of original_id to database id for parts
    const partsMap = new Map(
      insertedParts.map(part => [part.original_id, part.id])
    )

    // Insert treatises with correct part_id references
    const treatisesToInsert = []
    for (const part of data.parts) {
      const partId = partsMap.get(part.original_id)
      if (!partId) {
        console.error(`Part ID not found for original_id: ${part.original_id}`)
        continue
      }
      
      for (const treatise of part.treatises) {
        treatisesToInsert.push({
          original_id: treatise.original_id,
          title: treatise.title,
          part_id: partId
        })
      }
    }

    const { data: insertedTreatises, error: treatisesError } = await supabase
      .from('treatises')
      .insert(treatisesToInsert)
      .select()

    if (treatisesError) throw treatisesError
    console.log(`Inserted ${insertedTreatises.length} treatises`)

    // Create a map for treatises
    // We need a composite key since original_id might not be unique across different parts
    const treatisesMap = new Map()
    insertedTreatises.forEach(treatise => {
      treatisesMap.set(`${treatise.part_id}-${treatise.original_id}`, treatise.id)
    })

    // Insert questions with correct treatise_id references
    const questionsToInsert = []
    for (const part of data.parts) {
      const partId = partsMap.get(part.original_id)
      if (!partId) continue
      
      for (const treatise of part.treatises) {
        const treatiseId = treatisesMap.get(`${partId}-${treatise.original_id}`)
        if (!treatiseId) {
          console.error(`Treatise ID not found for part_id: ${partId}, original_id: ${treatise.original_id}`)
          continue
        }
        
        for (const question of treatise.questions) {
          questionsToInsert.push({
            original_id: question.original_id,
            title: question.title,
            description: question.description,
            treatise_id: treatiseId
          })
        }
      }
    }

    const { data: insertedQuestions, error: questionsError } = await supabase
      .from('questions')
      .insert(questionsToInsert)
      .select()

    if (questionsError) throw questionsError
    console.log(`Inserted ${insertedQuestions.length} questions`)

    // Create a map for questions
    const questionsMap = new Map()
    insertedQuestions.forEach(question => {
      questionsMap.set(`${question.treatise_id}-${question.original_id}`, question.id)
    })

    // Insert articles with correct question_id references
    const articlesToInsert = []
    for (const part of data.parts) {
      const partId = partsMap.get(part.original_id)
      if (!partId) continue
      
      for (const treatise of part.treatises) {
        const treatiseId = treatisesMap.get(`${partId}-${treatise.original_id}`)
        if (!treatiseId) continue
        
        for (const question of treatise.questions) {
          const questionId = questionsMap.get(`${treatiseId}-${question.original_id}`)
          if (!questionId) {
            console.error(`Question ID not found for treatise_id: ${treatiseId}, original_id: ${question.original_id}`)
            continue
          }
          
          for (const article of question.articles) {
            articlesToInsert.push({
              original_id: article.original_id,
              title: article.title,
              body: article.body,
              counter: article.counter,
              objections: article.objections,
              replies: article.replies,
              question_id: questionId
            })
          }
        }
      }
    }

    // Split articles into chunks due to potential size limitations
    const chunkSize = 500 // Smaller chunk size for better reliability
    for (let i = 0; i < articlesToInsert.length; i += chunkSize) {
      const chunk = articlesToInsert.slice(i, i + chunkSize)
      const { error: articlesError } = await supabase
        .from('articles')
        .insert(chunk)

      if (articlesError) {
        console.error('Error inserting articles:', articlesError)
        throw articlesError
      }
      console.log(`Inserted articles ${i + 1} to ${i + chunk.length}`)
    }

    console.log('Migration completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

migrate()