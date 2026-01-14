import type { Doc } from "../convex/_generated/dataModel"
import CustomLink from "./CustomLink"

type TreatiseProps = Doc<"treatises"> & {
  questions: Doc<"questions">[],
  part: Doc<"parts">
}

export function Treatise({ title, questions,part,original_id }: TreatiseProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <h3 className="text-xl font-semibold mb-2">Questions</h3>
      <ul className="space-y-2">
        {questions.map((question) => (
          <li key={question._id}>
            <CustomLink title={question.title} href={`/explore/Pt${part.original_id}-Tr${original_id}-Qu${question.original_id}`} />
          </li>
        ))}
      </ul>
    </div>
  )
}

