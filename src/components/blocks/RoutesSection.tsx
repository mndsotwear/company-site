import { getLocale, getTranslations } from 'next-intl/server'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { RouteMap } from '@/components/motion/RouteMap'
import { Reveal } from '@/components/motion/Reveal'
import type { RoutesBlock } from '@/payload-types'

// مسیرها: نقشه‌ی شماتیک خلیج فارس با خطوط متحرک + فهرست مسیرها مثل تابلوی حرکت بندر
export async function RoutesSection({ eyebrow, heading, intro, routes }: RoutesBlock) {
  if (!routes?.length) return null
  const t = await getTranslations()
  const ports = t.raw('ports') as string[]
  const locale = await getLocale()
  return (
    <Section>
      <SectionHeading eyebrow={eyebrow} title={heading} intro={intro} index="۰۳" />
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-center">
        <div className="rounded-[2rem] border border-border bg-surface p-4 text-text sm:p-8 lg:col-span-7">
          <RouteMap names={ports} rtl={locale === 'fa'} />
        </div>
        <ul className="border-b border-border lg:col-span-5">
          {routes.map((r, i) => (
            <Reveal as="li" key={r.id} delay={i * 0.08} className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-t border-border py-6">
              <span className="text-lg font-bold">{r.from}</span>
              <span className="text-accent rtl:rotate-180" aria-hidden>
                ⟶
              </span>
              <span className="text-end">
                <span className="block text-lg font-bold">{r.to}</span>
                {r.note && <span className="text-xs text-muted">{r.note}</span>}
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  )
}
