import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { CmsImage } from '@/components/ui/CmsImage'
import { MaritimeIcon } from '@/components/icons/MaritimeIcon'
import { formatNumber } from '@/lib/format'
import { labelOf, VESSEL_TYPE_OPTIONS } from '@/lib/options'
import { priceText } from '@/lib/vessels'
import type { Vessel } from '@/payload-types'
import { StatusBadge } from './StatusBadge'

// کارت کشتی: عکس اصلی، وضعیت، نوع، نام، سه مشخصه‌ی کلیدی، قیمت یا «تماس بگیرید»
export async function VesselCard({ vessel: v, locale }: { vessel: Vessel; locale: 'fa' | 'en' }) {
  const t = await getTranslations('fleet')
  const cover = v.gallery?.[0]
  const price = priceText(v, locale)
  const specs = [
    v.specs?.dwt ? { label: 'DWT', value: `${formatNumber(v.specs.dwt, locale)} ${t('ton')}` } : null,
    v.specs?.loa ? { label: t('loa'), value: `${formatNumber(v.specs.loa, locale)} ${t('meter')}` } : null,
    v.yearBuilt ? { label: t('built'), value: formatNumber(v.yearBuilt, locale, { useGrouping: false }) } : null,
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <Link
      href={`/fleet/${v.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-primary ${
        v.status === 'sold' ? 'opacity-75' : ''
      }`}
    >
      <div className="relative aspect-[16/10] bg-navy">
        {cover && typeof cover !== 'number' ? (
          <CmsImage media={cover} size="card" fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="transition duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className="chart-grid grid h-full place-items-center text-foam/30">
            <MaritimeIcon name="ship" className="h-14 w-14" />
          </div>
        )}
        <span className="absolute start-4 top-4">
          <StatusBadge status={v.status} locale={locale} />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs text-muted">{labelOf(VESSEL_TYPE_OPTIONS, v.vesselType, locale)}</p>
        <h3 className="mt-1 text-lg font-bold">{v.name}</h3>
        {!!specs.length && (
          <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4 text-sm">
            {specs.map((s) => (
              <div key={s.label}>
                <dt className="text-xs text-muted">{s.label}</dt>
                <dd className="mt-1 font-semibold">{s.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <p className="mt-auto pt-5 font-bold text-primary">{price ?? t('callForPrice')}</p>
      </div>
    </Link>
  )
}
