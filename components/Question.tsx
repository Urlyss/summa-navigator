import { Database } from "@/types/database.types"
import CustomLink from "./CustomLink"

type QuestionProps = Database['public']['Tables']['questions']['Row'] & {
  articles: Database['public']['Tables']['articles']['Row'][]
  part: Database['public']['Tables']['parts']['Row']
  treatise: Database['public']['Tables']['treatises']['Row']
}

export function Question({ part,treatise,original_id, title, description, articles }: QuestionProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Description</h3>
        {typeof description == "string" ? 
        <p className="mb-2">{description}</p> : 
        description?.map((paragraph, index) => (
          <p key={index} className="mb-2">
            {paragraph}
          </p>
        ))}
      </div>
      <h3 className="text-xl font-semibold mb-2">Articles</h3>
      <ul className="space-y-2">
        {articles.map((article) => (
          <li key={article.id}>
            <CustomLink
              title={article.title[0]}
              href={`/explore/Pt${part.original_id}-Tr${treatise.original_id}-Qu${original_id}-Ar${article.original_id}`}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

