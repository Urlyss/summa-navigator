import Link from "next/link"
import { db } from "@/lib/db"

export default function Home() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Parts of Summa Theologica</h2>
      <ul className="space-y-2">
        {db.map((part) => (
          <li key={part.id}>
            <Link href={`/Pt${part.id}`} className="text-blue-600 hover:underline">
              {part.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

