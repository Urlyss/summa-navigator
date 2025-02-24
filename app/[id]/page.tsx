import { getContent } from "@/lib/getContent"
import Navigation from "@/components/Navigation"
import { Part } from "@/components/Part"
import { Treatise } from "@/components/Treatise"
import { Question } from "@/components/Question"
import { Article } from "@/components/Article"


export default function DynamicPage({ params }: { params: { id: string } }) {
  const content = getContent(params.id)

  if (!content || content == null) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> The requested content does not exist.</span>
      </div>
    )
  }

  const { part, treatise, question, article } = content

  return (
    <>
    <Navigation currentId={params.id} />
      {article ? (
        <Article {...article} />
      ) : question ? (
        <Question partId={part.id} treatiseId={treatise.id} questionId={question.id} {...question} />
      ) : treatise ? (
        <Treatise partId={part.id} treatiseId={treatise.id} title={treatise.title} questions={treatise.questions} />
      ) : (
        <Part id={part.id} title={part.title} treatises={part.treatises} />
      )}
    </>
  )
}

