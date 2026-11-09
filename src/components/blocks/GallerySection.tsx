import { Section } from '@/components/ui/Section'
import { CmsImage } from '@/components/ui/CmsImage'
import type { GalleryBlock } from '@/payload-types'

export function GallerySection({ heading, images }: GalleryBlock) {
  const list = (images || []).filter((m) => typeof m !== 'number')
  if (!list.length) return null
  return (
    <Section>
      {heading && <h2 className="mb-10 text-3xl font-extrabold">{heading}</h2>}
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {list.map((m, i) => (
          <li key={typeof m === 'number' ? m : m.id} className={`relative overflow-hidden rounded-xl ${i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-[4/3]'}`}>
            <CmsImage media={m} size="card" fill sizes="(min-width:768px) 33vw, 50vw" />
          </li>
        ))}
      </ul>
    </Section>
  )
}
