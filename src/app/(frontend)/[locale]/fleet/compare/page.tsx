import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { PageHeader } from '@/components/sections/PageHeader'
import { Container } from '@/components/ui/Container'
import { CmsImage } from '@/components/ui/CmsImage'
import { StatusBadge } from '@/components/vessels/StatusBadge'
import { formatNumber } from '@/lib/format'
import { labelOf, VESSEL_TYPE_OPTIONS } from '@/lib/options'
import { getPayloadClient, type Locale } from '@/lib/payload'
import { priceText } from '@/lib/vessels'
import type { Vessel } from '@/payload-types'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ v?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'compare' })
  return { title: t('title'), robots: { index: false } }
}

// مقایسه‌ی ۲ تا ۳ کشتی کنار هم؛ آدرس: /fleet/compare?v=slug1,slug2
export default async function ComparePage({ params, searchParams }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const l = locale as 'fa' | 'en'
  const t = await getTranslations()
  const slugs = ((await searchParams).v || '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 3)

  const payload = await getPayloadClient()
  const { docs } = slugs.length
    ? await payload.find({
        collection: 'vessels',
        locale: locale as Locale,
        where: { and: [{ slug: { in: slugs } }, { or: [{ status: { not_equals: 'sold' } }, { showWhenSold: { equals: true } }] }] },
        limit: 3,
        depth: 1,
      })
    : { docs: [] as Vessel[] }
  const vessels = slugs.map((s) => docs.find((d) => d.slug === s)).filter(Boolean) as Vessel[]

  const num = (n?: number | null, unit?: string) => (n ? `${formatNumber(n, l)}${unit ? ` ${unit}` : ''}` : null)
  const rows: { label: string; get: (v: Vessel) => string | null | undefined; best?: (v: Vessel) => number | null | undefined }[] = [
    { label: t('fleet.type'), get: (v) => labelOf(VESSEL_TYPE_OPTIONS, v.vesselType, l) },
    { label: t('fleet.built'), get: (v) => (v.yearBuilt ? formatNumber(v.yearBuilt, l, { useGrouping: false }) : null), best: (v) => v.yearBuilt },
    { label: 'DWT', get: (v) => num(v.specs?.dwt, t('fleet.ton')), best: (v) => v.specs?.dwt },
    { label: 'GT', get: (v) => num(v.specs?.grossTonnage), best: (v) => v.specs?.grossTonnage },
    { label: t('fleet.loaLong'), get: (v) => num(v.specs?.loa, t('fleet.meter')) },
    { label: t('fleet.beam'), get: (v) => num(v.specs?.beam, t('fleet.meter')) },
    { label: t('fleet.draft'), get: (v) => num(v.specs?.draft, t('fleet.meter')) },
    { label: t('fleet.speed'), get: (v) => num(v.specs?.speed, t('fleet.knots')), best: (v) => v.specs?.speed },
    { label: t('fleet.engine'), get: (v) => v.specs?.engine },
    { label: t('fleet.flag'), get: (v) => v.flag },
    { label: t('fleet.location'), get: (v) => v.location },
    { label: t('fleet.price'), get: (v) => priceText(v, l) ?? t('fleet.callForPrice') },
  ]

  return (
    <>
      <PageHeader
        eyebrow={t('fleet.eyebrow')}
        title={t('compare.title')}
        intro={t('compare.intro')}
        crumbs={[{ href: '/fleet', label: t('nav.fleet') }, { label: t('compare.title') }]}
      />
      <Container className="py-12 lg:py-16">
        {vessels.length < 2 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="font-semibold">{t('compare.needTwo')}</p>
            <Link href="/fleet" className="mt-4 inline-block text-primary hover:underline">
              {t('compare.back')}
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="w-40" />
                  {vessels.map((v) => {
                    const cover = v.gallery?.[0]
                    return (
                      <th key={v.id} className="px-3 pb-6 text-start align-top font-normal">
                        <Link href={`/fleet/${v.slug}`} className="group block">
                          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-navy">
                            {cover && typeof cover !== 'number' && <CmsImage media={cover} size="card" fill sizes="33vw" className="transition duration-500 group-hover:scale-[1.03]" />}
                          </div>
                          <p className="mt-3 text-lg font-bold group-hover:text-primary">{v.name}</p>
                        </Link>
                        <span className="mt-2 inline-block">
                          <StatusBadge status={v.status} locale={l} />
                        </span>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const values = vessels.map((v) => r.get(v))
                  if (values.every((x) => !x)) return null
                  const nums = r.best ? vessels.map((v) => r.best!(v) ?? null) : []
                  const max = nums.length ? Math.max(...nums.map((n) => n ?? -Infinity)) : null
                  return (
                    <tr key={r.label} className="border-t border-border">
                      <th scope="row" className="py-4 pe-4 text-start text-xs font-normal text-muted">
                        {r.label}
                      </th>
                      {values.map((val, i) => {
                        const isBest = max !== null && nums.filter((n) => n === max).length === 1 && nums[i] === max
                        return (
                          <td key={i} className={`px-3 py-4 font-semibold ${isBest ? 'text-accent' : ''}`}>
                            {val || '—'}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <p className="mt-6 text-xs text-muted">{t('compare.bestHint')}</p>
          </div>
        )}
      </Container>
    </>
  )
}
