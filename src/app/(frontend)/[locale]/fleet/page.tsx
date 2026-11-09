import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PageHeader } from '@/components/sections/PageHeader'
import { Container } from '@/components/ui/Container'
import { VesselCard } from '@/components/vessels/VesselCard'
import { VESSEL_STATUS_OPTIONS, VESSEL_TYPE_OPTIONS } from '@/lib/options'
import type { Locale } from '@/lib/payload'
import { getVessels } from '@/lib/vessels'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ type?: string; status?: string; sort?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'fleet' })
  return { title: t('title'), description: t('intro'), alternates: { languages: { fa: '/fa/fleet', en: '/en/fleet' } } }
}

const selectCls =
  'rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-text focus:border-primary focus:outline-none'

// فهرست کشتی‌های فروشی؛ فیلترها با فرم ساده (GET) کار می‌کنند و در آدرس صفحه می‌مانند
export default async function FleetPage({ params, searchParams }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const f = await searchParams
  const t = await getTranslations()
  const vessels = await getVessels(locale as Locale, f)
  const l = locale as 'fa' | 'en'
  const filtered = Boolean(f.type || f.status)

  return (
    <>
      <PageHeader eyebrow={t('fleet.eyebrow')} title={t('fleet.title')} intro={t('fleet.intro')} crumbs={[{ label: t('nav.fleet') }]} />

      <Container className="py-12 lg:py-16">
        <form method="get" className="mb-10 flex flex-wrap items-center gap-3 border-b border-border pb-8">
          <label className="sr-only" htmlFor="f-type">{t('fleet.type')}</label>
          <select id="f-type" name="type" defaultValue={f.type || ''} className={selectCls}>
            <option value="">{t('fleet.allTypes')}</option>
            {VESSEL_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label[l]}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor="f-status">{t('fleet.status')}</label>
          <select id="f-status" name="status" defaultValue={f.status || ''} className={selectCls}>
            <option value="">{t('fleet.allStatuses')}</option>
            {VESSEL_STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label[l]}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor="f-sort">{t('fleet.sort')}</label>
          <select id="f-sort" name="sort" defaultValue={f.sort || 'newest'} className={selectCls}>
            <option value="newest">{t('fleet.sortNewest')}</option>
            <option value="dwt">{t('fleet.sortDwt')}</option>
            <option value="year">{t('fleet.sortYear')}</option>
          </select>
          <button type="submit" className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-110">
            {t('fleet.apply')}
          </button>
          {filtered && (
            <a href={`/${locale}/fleet`} className="text-sm text-muted hover:text-primary">
              {t('fleet.clear')}
            </a>
          )}
          <span className="ms-auto text-sm text-muted">{t('fleet.count', { count: vessels.length })}</span>
        </form>

        {vessels.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vessels.map((v) => (
              <li key={v.id}>
                <VesselCard vessel={v} locale={l} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="font-semibold">{filtered ? t('fleet.noMatch') : t('fleet.empty')}</p>
            <p className="mt-2 text-sm text-muted">{t('fleet.emptyHint')}</p>
          </div>
        )}
      </Container>
    </>
  )
}
