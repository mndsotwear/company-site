import { getLocale } from 'next-intl/server'
import { Section } from '@/components/ui/Section'
import { CountUp } from '@/components/motion/CountUp'
import { Reveal } from '@/components/motion/Reveal'
import type { StatsBlock } from '@/payload-types'

// آمار با اعداد خیلی درشت که هنگام رسیدن به بخش از صفر می‌شمارند
export async function StatsSection({ heading, items }: StatsBlock) {
  if (!items?.length) return null
  const locale = await getLocale()
  return (
    <Section tone="surface" className="!py-20 lg:!py-28">
      {heading && (
        <Reveal>
          <h2 className="mb-14 max-w-xl text-2xl font-bold leading-10">{heading}</h2>
        </Reveal>
      )}
      <dl className="grid grid-cols-2 gap-y-14 lg:grid-cols-4">
        {items.map((s, i) => (
          <Reveal key={s.id} delay={i * 0.1} className="border-s border-border ps-6 lg:ps-8">
            <dd className="display text-grad text-5xl font-light tracking-tight sm:text-7xl">
              <CountUp value={s.value} locale={locale} />
              {s.suffix && <span className="text-accent">{s.suffix}</span>}
            </dd>
            <dt className="mt-4 text-sm text-muted">{s.label}</dt>
          </Reveal>
        ))}
      </dl>
    </Section>
  )
}
