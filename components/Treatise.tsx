import Link from "next/link"

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
            <Link href={`/Pt${partId}-Tr${treatiseId}-Qu${question.id}`} className="text-blue-600 hover:underline">
              {question.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

