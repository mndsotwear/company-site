import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CmsImage } from '@/components/ui/CmsImage'
import { getPayloadClient, type Locale } from '@/lib/payload'
import { formatNumber } from '@/lib/format'
import { labelOf, VESSEL_STATUS_OPTIONS, VESSEL_TYPE_OPTIONS } from '@/lib/options'
import type { FeaturedVesselsBlock } from '@/payload-types'

// کشتی‌های منتخب برای صفحه اصلی (اگر کشتی منتخبی نباشد، بخش نمایش داده نمی‌شود)
export async function FeaturedVesselsSection({ eyebrow, heading, limit }: FeaturedVesselsBlock) {
  const locale = (await getLocale()) as Locale
  const t = await getTranslations('common')
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'vessels',
    locale,
    where: { featured: { equals: true }, status: { not_equals: 'sold' } },
    limit: limit || 3,
    depth: 1,
  })
  if (!docs.length) return null

  return (
    <Section>
      <SectionHeading eyebrow={eyebrow} title={heading} />
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {docs.map((v) => (
          <li key={v.id}>
            <Link href={`/fleet/${v.slug}`} className="group block overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-primary">
              <div className="relative aspect-[16/10] bg-navy">
                <CmsImage media={v.gallery?.[0]} size="card" fill sizes="(min-width:1024px) 33vw, 100vw" className="transition duration-500 group-hover:scale-[1.03]" />
                <span className="absolute start-4 top-4 rounded-full bg-bg/90 px-3 py-1 text-xs">
                  {labelOf(VESSEL_STATUS_OPTIONS, v.status, locale)}
                </span>
              </div>
              <div className="p-6">
                <p className="text-xs text-muted">{labelOf(VESSEL_TYPE_OPTIONS, v.vesselType, locale)}</p>
                <h3 className="mt-1 text-lg font-bold">{v.name}</h3>
                <dl className="mt-4 flex gap-6 text-sm">
                  {v.specs?.dwt ? (
                    <div>
                      <dt className="text-muted">DWT</dt>
                      <dd className="font-semibold">{formatNumber(v.specs.dwt, locale)} {t('ton')}</dd>
                    </div>
                  ) : null}
                  {v.yearBuilt ? (
                    <div>
                      <dt className="text-muted">{t('built')}</dt>
                      <dd className="font-semibold">{formatNumber(v.yearBuilt, locale, { useGrouping: false })}</dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <Link href="/fleet" className="text-primary underline-offset-8 hover:underline">
          {t('allVessels')} {t('arrow')}
        </Link>
      </div>
    </Section>
  )
}
