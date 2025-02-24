import Link from "next/link"

type QuestionProps = {
  partId: string
  treatiseId: number
  questionId: number
  title: string
  description: string[]
  articles: { id: number; title: string[] }[]
}

export function Question({ partId, treatiseId, questionId, title, description, articles }: QuestionProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Description</h3>
        {description.map((paragraph, index) => (
          <p key={index} className="mb-2">
            {paragraph}
          </p>
        ))}
      </div>
      <h3 className="text-xl font-semibold mb-2">Articles</h3>
      <ul className="space-y-2">
        {articles.map((article) => (
          <li key={article.id}>
            <Link
              href={`/Pt${partId}-Tr${treatiseId}-Qu${questionId}-Ar${article.id}`}
              className="text-blue-600 hover:underline"
            >
              {article.title[0]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

