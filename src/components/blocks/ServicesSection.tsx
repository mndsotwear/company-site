import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { MaritimeIcon } from '@/components/icons/MaritimeIcon'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
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

  const num = (i: number) => (i + 1).toLocaleString(locale === 'fa' ? 'fa-IR' : 'en-US', { minimumIntegerDigits: 2 })

  // فهرست مجله‌ای: هر خدمت یک ردیف بزرگ با شماره، تیتر، خلاصه و فلش؛ با هاور روشن می‌شود
  return (
    <Section tone="navy" grid>
      <SectionHeading eyebrow={eyebrow} title={heading} intro={intro} onDark index="۰۱" />
      <ul className="border-b border-white/10">
        {items.map((s, i) => (
          <Reveal as="li" key={s.id} delay={i * 0.08}>
            <Link
              href={`/services/${s.slug}`}
              className="group grid grid-cols-1 items-center gap-4 border-t border-white/10 py-8 transition-colors duration-500 hover:bg-white/[0.03] sm:grid-cols-12 sm:gap-8 sm:px-4 lg:py-10"
            >
              <span className="display text-sm text-foam/35 sm:col-span-1">{num(i)}</span>
              <span className="flex items-center gap-5 sm:col-span-5">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-white/10 text-sky transition duration-500 group-hover:border-accent group-hover:text-accent">
                  <MaritimeIcon name={s.icon} className="h-7 w-7" />
                </span>
                <h3 className="text-2xl font-bold transition-transform duration-500 ease-[var(--ease-luxe)] group-hover:-translate-x-2 ltr:group-hover:translate-x-2 lg:text-3xl">
                  {s.title}
                </h3>
              </span>
              {s.summary && <p className="text-sm leading-7 text-foam/55 sm:col-span-5">{s.summary}</p>}
              <span
                className="hidden justify-self-end text-2xl text-foam/40 transition duration-500 group-hover:text-accent sm:col-span-1 sm:block rtl:rotate-180"
                aria-label={t('more')}
              >
                →
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
