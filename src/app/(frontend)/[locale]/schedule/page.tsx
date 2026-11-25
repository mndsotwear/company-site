import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PageHeader } from '@/components/sections/PageHeader'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { DESTINATION_OPTIONS, ORIGIN_OPTIONS, labelOf } from '@/lib/options'
import { getSailings, SAILING_STATUS } from '@/lib/operations'
import type { Locale } from '@/lib/payload'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ origin?: string; destination?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'schedule' })
  return { title: t('title'), description: t('intro'), alternates: { languages: { fa: '/fa/schedule', en: '/en/schedule' } } }
}

const selectCls = 'w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none'

// برنامه‌ی حرکت کشتی‌ها: جستجو با مبدأ و مقصد (فرم GET)، فهرست حرکت‌های آینده
export default async function SchedulePage({ params, searchParams }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const l = locale as 'fa' | 'en'
  const f = await searchParams
  const t = await getTranslations()
  const sailings = await getSailings(locale as Locale, f)
  const date = (iso?: string | null, time = false) =>
    iso
      ? new Intl.DateTimeFormat(l === 'fa' ? 'fa-IR' : 'en-GB', {
          day: 'numeric',
          month: 'short',
          ...(time ? { hour: '2-digit', minute: '2-digit' } : { year: 'numeric' }),
          timeZone: 'Asia/Tehran',
        }).format(new Date(iso))
      : '—'
  const origins = ORIGIN_OPTIONS.filter((o) => o.value !== 'other')
  const dests = DESTINATION_OPTIONS.filter((o) => o.value !== 'other')

  return (
    <>
      <PageHeader eyebrow={t('schedule.eyebrow')} title={t('schedule.title')} intro={t('schedule.intro')} crumbs={[{ label: t('schedule.title') }]} />
      <Container className="py-12 lg:py-16">
        <form method="get" className="mb-10 grid grid-cols-1 gap-3 rounded-3xl border border-border bg-surface p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label className="text-sm">
            <span className="mb-2 block font-semibold">{t('schedule.origin')}</span>
            <select name="origin" defaultValue={f.origin || ''} className={selectCls}>
              <option value="">{t('schedule.any')}</option>
              {origins.map((o) => (
                <option key={o.value} value={o.value}>{o.label[l]}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-2 block font-semibold">{t('schedule.destination')}</span>
            <select name="destination" defaultValue={f.destination || ''} className={selectCls}>
              <option value="">{t('schedule.any')}</option>
              {dests.map((o) => (
                <option key={o.value} value={o.value}>{o.label[l]}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-white transition hover:bg-accent">
            {t('schedule.search')}
          </button>
        </form>

        {sailings.length ? (
          <ul className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-surface">
            {sailings.map((s) => {
              const st = SAILING_STATUS[s.status] ?? SAILING_STATUS.scheduled
              return (
                <li key={s.id} className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-12 sm:items-center sm:gap-6 sm:p-6">
                  <div className="col-span-2 sm:col-span-3">
                    <p className="font-bold">{s.vesselName}</p>
                    {s.voyage && <p className="ltr-nums mt-0.5 text-xs text-muted">{s.voyage}</p>}
                  </div>
                  <div className="col-span-2 flex items-center gap-3 sm:col-span-4">
                    <span className="font-semibold">{labelOf(ORIGIN_OPTIONS, s.origin, l)}</span>
                    <span className="text-muted rtl:rotate-180" aria-hidden>→</span>
                    <span className="font-semibold">{labelOf(DESTINATION_OPTIONS, s.destination, l)}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-muted">{t('schedule.departure')}</p>
                    <p className="mt-0.5 text-sm font-semibold">{date(s.departure, true)}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-muted">{s.cutoff ? t('schedule.cutoff') : t('schedule.eta')}</p>
                    <p className="mt-0.5 text-sm font-semibold">{date(s.cutoff || s.arrival, Boolean(s.cutoff))}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1 sm:justify-self-end">
                    <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${st.tone}`}>{st[l]}</span>
                  </div>
                  {s.note && <p className="col-span-2 text-sm text-muted sm:col-span-12">{s.note}</p>}
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="rounded-3xl border border-dashed border-border p-12 text-center">
            <p className="font-semibold">{t('schedule.empty')}</p>
            <p className="mt-2 text-sm text-muted">{t('schedule.emptyHint')}</p>
            <Button href="/quote" variant="accent" className="mt-6">
              {t('nav.quote')}
            </Button>
          </div>
        )}
      </Container>
    </>
  )
}
