import { getLocale } from 'next-intl/server'
import { Section } from '@/components/ui/Section'
import { formatNumber } from '@/lib/format'
import type { StatsBlock } from '@/payload-types'

// آمار با اعداد درشت (ارقام فارسی در نسخه‌ی فارسی)
export async function StatsSection({ heading, items }: StatsBlock) {
  if (!items?.length) return null
  const locale = await getLocale()
  return (
    <Section tone="surface" className="!py-16">
      {heading && <h2 className="mb-10 text-2xl font-bold">{heading}</h2>}
      <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
        {items.map((s) => (
          <div key={s.id} className="border-s border-border ps-6">
            <dt className="order-2 mt-2 text-sm text-muted">{s.label}</dt>
            <dd className="text-4xl font-extrabold text-primary sm:text-5xl">
              {formatNumber(s.value, locale)}
              {s.suffix && <span className="text-accent">{s.suffix}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
