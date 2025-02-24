import Link from "next/link"

type PartProps = {
  id: string
  title: string
  treatises: { id: number; title: string }[]
}

export function Part({ id, title, treatises }: PartProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <h3 className="text-xl font-semibold mb-2">Treatises</h3>
      <ul className="space-y-2">
        {treatises.map((treatise) => (
          <li key={treatise.id}>
            <Link href={`/Pt${id}-Tr${treatise.id}`} className="text-blue-600 hover:underline">
              {treatise.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

