import { Database } from "@/types/database.types"
import CustomLink from "./CustomLink"

type TreatiseProps = Database['public']['Tables']['treatises']['Row'] & {
  questions: Database['public']['Tables']['questions']['Row'][],
  part: Database['public']['Tables']['parts']['Row']
}

export function Treatise({ title, questions,part,original_id }: TreatiseProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <h3 className="text-xl font-semibold mb-2">Questions</h3>
      <ul className="space-y-2">
        {questions.map((question) => (
          <li key={question.id}>
            <CustomLink title={question.title} href={`/explore/Pt${part.original_id}-Tr${original_id}-Qu${question.original_id}`} />
          </li>
        ))}
      </ul>
    </div>
  )
}

