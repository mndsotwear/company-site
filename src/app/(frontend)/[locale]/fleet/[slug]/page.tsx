import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PageHeader } from '@/components/sections/PageHeader'
import { MaritimeIcon } from '@/components/icons/MaritimeIcon'
import { Button } from '@/components/ui/Button'
import { CmsImage } from '@/components/ui/CmsImage'
import { Container } from '@/components/ui/Container'
import { RichText } from '@/components/ui/RichText'
import { StatusBadge } from '@/components/vessels/StatusBadge'
import { formatNumber } from '@/lib/format'
import { labelOf, VESSEL_TYPE_OPTIONS } from '@/lib/options'
import { getSiteSettings, mediaUrl, whatsappLink, type Locale } from '@/lib/payload'
import { getVesselBySlug, priceText } from '@/lib/vessels'
import type { Media } from '@/payload-types'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const v = await getVesselBySlug(slug, locale as Locale)
  if (!v) return {}
  const image = mediaUrl(v.seo?.image) || mediaUrl(v.gallery?.[0], 'card')
  return {
    title: v.seo?.title || v.name,
    description: v.seo?.description || v.summary || undefined,
    alternates: { languages: { fa: `/fa/fleet/${slug}`, en: `/en/fleet/${slug}` } },
    ...(image ? { openGraph: { images: [image] } } : {}),
    ...(v.seo?.noIndex ? { robots: { index: false } } : {}),
  }
}

// صفحه‌ی هر کشتی: گالری، جدول مشخصات، قیمت یا «تماس بگیرید»، PDF، درخواست خرید
export default async function VesselPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const l = locale as 'fa' | 'en'
  const v = await getVesselBySlug(slug, l)
  if (!v) notFound()

  const t = await getTranslations()
  const settings = await getSiteSettings(l)
  const images = (v.gallery || []).filter((m): m is Media => typeof m !== 'number')
  const [cover, ...rest] = images
  const price = priceText(v, l)
  const pdf = v.specSheet && typeof v.specSheet !== 'number' ? v.specSheet : null
  const num = (n?: number | null, unit?: string) => (n ? `${formatNumber(n, l)}${unit ? ` ${unit}` : ''}` : null)

  const rows = [
    { label: t('fleet.type'), value: labelOf(VESSEL_TYPE_OPTIONS, v.vesselType, l) },
    { label: t('fleet.built'), value: v.yearBuilt ? formatNumber(v.yearBuilt, l, { useGrouping: false }) : null },
    { label: t('fleet.flag'), value: v.flag },
    { label: t('fleet.location'), value: v.location },
    { label: t('fleet.loaLong'), value: num(v.specs?.loa, t('fleet.meter')) },
    { label: t('fleet.beam'), value: num(v.specs?.beam, t('fleet.meter')) },
    { label: t('fleet.draft'), value: num(v.specs?.draft, t('fleet.meter')) },
    { label: 'DWT', value: num(v.specs?.dwt, t('fleet.ton')) },
    { label: 'GT', value: num(v.specs?.grossTonnage) },
    { label: t('fleet.speed'), value: num(v.specs?.speed, t('fleet.knots')) },
    { label: t('fleet.engine'), value: v.specs?.engine },
    ...(v.specs?.extra || []).map((e) => ({ label: e.label, value: e.value })),
  ].filter((r) => r.value)

  const waText = encodeURIComponent(`${t('fleet.waMessage')} ${v.name}`)
  const wa = whatsappLink(settings.whatsapp || settings.phone)
  const phone = settings.phone || '09366334228'

  return (
    <>
      <PageHeader
        eyebrow={labelOf(VESSEL_TYPE_OPTIONS, v.vesselType, l)}
        title={v.name}
        intro={v.summary}
        crumbs={[{ href: '/fleet', label: t('nav.fleet') }, { label: v.name }]}
      />

      <Container className="grid gap-12 py-12 lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-8">
          {/* گالری */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-navy">
            {cover ? (
              <a href={cover.url || '#'} target="_blank" rel="noopener noreferrer">
                <CmsImage media={cover} size="hero" fill priority sizes="(min-width:1024px) 66vw, 100vw" />
              </a>
            ) : (
              <div className="chart-grid grid h-full place-items-center text-foam/30">
                <MaritimeIcon name="ship" className="h-20 w-20" />
              </div>
            )}
          </div>
          {!!rest.length && (
            <ul className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
              {rest.map((m) => (
                <li key={m.id} className="relative aspect-square overflow-hidden rounded-lg">
                  <a href={m.url || '#'} target="_blank" rel="noopener noreferrer">
                    <CmsImage media={m} size="thumb" fill sizes="20vw" className="transition hover:scale-105" />
                  </a>
                </li>
              ))}
            </ul>
          )}

          {/* مشخصات فنی */}
          <section className="mt-14">
            <h2 className="mb-6 text-2xl font-extrabold">{t('fleet.specs')}</h2>
            <dl className="grid border-t border-border sm:grid-cols-2 sm:gap-x-10">
              {rows.map((r) => (
                <div key={r.label} className="flex items-baseline justify-between gap-4 border-b border-border py-4">
                  <dt className="text-sm text-muted">{r.label}</dt>
                  <dd className="text-end font-semibold">{r.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {v.description && (
            <section className="mt-14">
              <h2 className="mb-6 text-2xl font-extrabold">{t('fleet.description')}</h2>
              <RichText data={v.description} className="text-muted" />
            </section>
          )}
        </div>

        {/* ستون کناری: قیمت و درخواست */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-2xl bg-navy p-7 text-foam">
              <StatusBadge status={v.status} locale={l} />
              <p className="mt-5 text-sm text-foam/60">{t('fleet.price')}</p>
              <p className="mt-1 text-3xl font-extrabold">{price ?? t('fleet.callForPrice')}</p>

              {v.status !== 'sold' ? (
                <div className="mt-7 space-y-3">
                  {/* فرم کامل درخواست خرید در فاز ۴ اضافه می‌شود */}
                  {wa && (
                    <Button href={`${wa}?text=${waText}`} variant="accent" className="w-full">
                      {t('fleet.inquireWhatsapp')}
                    </Button>
                  )}
                  <Button href={`tel:${phone}`} variant="outlineLight" className="w-full">
                    {t('fleet.call')} <span className="ltr-nums">{phone}</span>
                  </Button>
                </div>
              ) : (
                <p className="mt-6 text-sm text-foam/70">{t('fleet.soldNote')}</p>
              )}
            </div>

            {pdf?.url && (
              <a
                href={pdf.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl border border-border p-6 transition hover:border-primary"
              >
                <span>
                  <span className="block font-bold">{t('fleet.specSheet')}</span>
                  <span className="text-sm text-muted">PDF</span>
                </span>
                <span className="text-primary">↓</span>
              </a>
            )}
          </div>
        </aside>
      </Container>
    </>
  )
}
