import Link from "next/link"
import CustomLink from "./CustomLink"

type TreatiseProps = {
  partId: string
  treatiseId: number
  title: string
  questions: { id: number; title: string }[]
}

export function Treatise({ partId, treatiseId, title, questions }: TreatiseProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <h3 className="text-xl font-semibold mb-2">Questions</h3>
      <ul className="space-y-2">
        {questions.map((question) => (
          <li key={question.id}>
            <CustomLink title={question.title} href={`/explore/Pt${partId}-Tr${treatiseId}-Qu${question.id}`} />
          </li>
        ))}
      </ul>
    </div>
  )
}

