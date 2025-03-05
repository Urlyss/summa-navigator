import { db } from '@/lib/db'

export const data = {
  parts: db.map(part => ({
    original_id: part.id,
    title: part.title,
    treatises: part.treatises.map((treatise,ind2) => ({
      original_id: ind2+1,
      title: treatise.title,
      questions: treatise.questions.map((question,ind3) => ({
        original_id: ind3+1,
        title: question.title,
        description: Array.isArray(question.description) ? question.description : [question.description],
        articles: question.articles.map((article,ind4) => ({
          original_id: ind4+1,
          title: article.title,
          body: article.body,
          counter: article.counter,
          objections: article.objections,
          replies: article.replies
        }))
      }))
    }))
  }))
}