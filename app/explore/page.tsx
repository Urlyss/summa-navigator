import { db } from "@/lib/db"
import CustomLink from "@/components/CustomLink"

export default function Home() {
  return (
    <div className="mt-28 lg:px-36">
      <h2 className="text-2xl font-semibold mb-4">Parts of Summa Theologica</h2>
      <ul className="space-y-2">
        {db.map((part) => (
          <li key={part.id}>
            <CustomLink title={part.title} href={`/explore/Pt${part.id}`}/>
          </li>
        ))}
      </ul>
    </div>
  )
}

