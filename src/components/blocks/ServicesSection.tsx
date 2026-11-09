import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { MaritimeIcon } from '@/components/icons/MaritimeIcon'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getPayloadClient, type Locale } from '@/lib/payload'
import type { Service, ServicesBlock } from '@/payload-types'

// کارت‌های خدمات روی زمینه‌ی سرمه‌ای (مثل سایت فعلی)
export async function ServicesSection({ eyebrow, heading, intro, services }: ServicesBlock) {
  const locale = (await getLocale()) as Locale
  const t = await getTranslations('common')

  let items = (services || []).filter((s): s is Service => typeof s === 'object' && s.isActive !== false)
  if (!items.length) {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'services',
      locale,
      where: { isActive: { equals: true } },
      sort: 'order',
      limit: 12,
      depth: 0,
    })
    items = res.docs
  }
  if (!items.length) return null

  return (
    <Section tone="navy" grid>
      <SectionHeading eyebrow={eyebrow} title={heading} intro={intro} onDark />
      <ul className={`grid gap-4 ${items.length >= 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : items.length === 2 ? 'sm:grid-cols-2' : ''}`}>
        {items.map((s, i) => (
          <li key={s.id}>
            <Link href={`/services/${s.slug}`} className="group flex h-full flex-col rounded-2xl border border-foam/10 bg-navy p-8 transition hover:border-sky/60 hover:bg-[#0c2742]">
              <div className="flex items-start justify-between">
                <span className="text-sky">
                  <MaritimeIcon name={s.icon} className="h-9 w-9" />
                </span>
                <span className="text-xs tabular-nums text-foam/30">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-8 text-xl font-bold">{s.title}</h3>
              {s.summary && <p className="mt-3 text-sm leading-7 text-foam/65">{s.summary}</p>}
              <span className="mt-auto pt-8 text-sm text-sky opacity-80 transition group-hover:opacity-100">
                {t('more')} {t('arrow')}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  )
}
