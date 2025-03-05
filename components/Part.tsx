import { Database } from "@/types/database.types"
import CustomLink from "./CustomLink"

type PartProps = Database['public']['Tables']['parts']['Row'] & {
  treatises: Database['public']['Tables']['treatises']['Row'][]
}

export function Part({ title, treatises,original_id }: PartProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <h3 className="text-xl font-semibold mb-2">Treatises</h3>
      <ul className="space-y-2">
        {treatises.map((treatise) => (
          <li key={treatise.id}>
            <CustomLink title={treatise.title || title} href={`/explore/Pt${original_id}-Tr${treatise.original_id}`}/>
          </li>
        ))}
      </ul>
    </div>
  )
}

