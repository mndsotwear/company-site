import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CmsImage } from '@/components/ui/CmsImage'
import type { IndustriesBlock } from '@/payload-types'

// کارت‌های صنایع (روی زمینه‌ی سرمه‌ای مثل سایت فعلی)
export function IndustriesSection({ eyebrow, heading, items }: IndustriesBlock) {
  if (!items?.length) return null
  return (
    <Section tone="navy">
      <SectionHeading eyebrow={eyebrow} title={heading} onDark />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <li key={it.id} className="relative overflow-hidden rounded-2xl border border-foam/10 p-6">
            {it.image && typeof it.image !== 'number' && (
              <div className="absolute inset-0 opacity-20" aria-hidden>
                <CmsImage media={it.image} size="thumb" fill sizes="33vw" />
              </div>
            )}
            <div className="relative">
              <h3 className="text-lg font-bold">{it.title}</h3>
              {it.text && <p className="mt-2 text-sm leading-7 text-foam/70">{it.text}</p>}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
