import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CmsImage } from '@/components/ui/CmsImage'
import { Reveal } from '@/components/motion/Reveal'
import type { IndustriesBlock } from '@/payload-types'

// کارت‌های صنایع (روی زمینه‌ی سرمه‌ای مثل سایت فعلی)
export function IndustriesSection({ eyebrow, heading, items }: IndustriesBlock) {
  if (!items?.length) return null
  return (
    <Section tone="navy">
      <SectionHeading eyebrow={eyebrow} title={heading} onDark index="۰۵" />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <Reveal as="li" key={it.id} delay={i * 0.08} className="group relative min-h-56 overflow-hidden rounded-3xl border border-white/10 p-8 transition duration-500 hover:border-white/30">
            {it.image && typeof it.image !== 'number' && (
              <div className="absolute inset-0 opacity-25 transition duration-700 group-hover:scale-105 group-hover:opacity-45" aria-hidden>
                <CmsImage media={it.image} size="thumb" fill sizes="33vw" />
              </div>
            )}
            <div className="relative flex h-full flex-col justify-end">
              <h3 className="text-xl font-bold">{it.title}</h3>
              {it.text && <p className="mt-2 text-sm leading-7 text-foam/70">{it.text}</p>}
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
