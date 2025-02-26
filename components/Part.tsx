import CustomLink from "./CustomLink"

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
            <CustomLink title={treatise.title || title} href={`/explore/Pt${id}-Tr${treatise.id}`}/>
          </li>
        ))}
      </ul>
    </div>
  )
}

