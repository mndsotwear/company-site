import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PageHeader } from '@/components/sections/PageHeader'
import { Container } from '@/components/ui/Container'
import { getSiteSettings, whatsappLink, type Locale } from '@/lib/payload'
import { lookupTracking, type QuoteResult, type TrackResult } from '@/lib/tracking'
import { AltchaWidget } from '@/components/forms/AltchaWidget'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ code?: string | string[]; altcha?: string | string[] }> }

const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v)

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params
  const { code } = await searchParams
  const t = await getTranslations({ locale, namespace: 'tracking' })
  return {
    title: t('title'),
    description: t('intro'),
    alternates: { languages: { fa: '/fa/tracking', en: '/en/tracking' } },
    // صفحه‌ی نتیجه‌ی جستجو نباید در گوگل ثبت شود
    ...(first(code) ? { robots: { index: false, follow: false } } : {}),
  }
}

// صفحه‌ی رهگیری: فرم GET (بدون جاوااسکریپت هم کار می‌کند) و نتیجه که سمت سرور ساخته می‌شود.
// کادر رهگیری سریع صفحه‌ی اصلی هم به همین آدرس با ?code= می‌آید.
export default async function TrackingPage({ params, searchParams }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const sp = await searchParams
  const code = first(sp.code)
  const t = await getTranslations()
  const s = await getSiteSettings(locale as Locale)
  const phone = s.phone || '09366334228'
  const wa = whatsappLink(s.whatsapp || phone)
  const result = await lookupTracking(code, locale as Locale, first(sp.altcha))
  const error =
    result.kind === 'invalid' || result.kind === 'rate' || result.kind === 'error' || result.kind === 'captcha'
      ? t(`tracking.errors.${result.kind}`)
      : null

  return (
    <>
      <PageHeader eyebrow={t('tracking.eyebrow')} title={t('tracking.title')} intro={t('tracking.intro')} crumbs={[{ label: t('nav.tracking') }]} />
      <Container className="grid grid-cols-1 gap-10 py-12 lg:grid-cols-12 lg:py-16">
        <div className="space-y-8 lg:col-span-8">
          <form action={`/${locale}/tracking`} method="get" className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <label htmlFor="track-code" className="block font-bold">
              {t('tracking.label')}
            </label>
            <p className="mt-1 text-sm leading-7 text-muted">{t('tracking.hint')}</p>
            <div className="mt-5 flex gap-3">
              <input
                id="track-code"
                name="code"
                required
                minLength={6}
                maxLength={14}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                dir="ltr"
                placeholder="123456"
                defaultValue={result.kind === 'empty' || result.kind === 'rate' ? (code ?? '') : result.code}
                aria-invalid={result.kind === 'invalid'}
                aria-describedby={error ? 'track-error' : undefined}
                className="min-w-0 flex-1 rounded-xl border border-border bg-bg px-4 py-3 text-center font-mono text-xl uppercase tracking-[0.25em] placeholder:text-muted/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-red-500"
              />
              <button type="submit" className="rounded-xl bg-accent px-6 font-semibold text-white transition hover:brightness-110">
                {t('tracking.button')}
              </button>
            </div>
            {result.captcha && (
              <div className="mt-5">
                <AltchaWidget locale={locale as 'fa' | 'en'} />
              </div>
            )}
            {error && (
              <p id="track-error" role="alert" className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </form>

          {result.kind === 'found' && (
            <section aria-live="polite" className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold">{t('tracking.found', { count: result.results.length })}</h2>
                {result.results.length > 1 && <p className="mt-1 text-sm text-muted">{t('tracking.foundHint')}</p>}
              </div>
              {result.results.map((r) => (
                <ResultCard key={r.id} r={r} locale={locale} />
              ))}
            </section>
          )}

          {result.kind === 'quote' && <QuoteCard q={result.quote} locale={locale} />}

          {result.kind === 'notFound' && (
            <section aria-live="polite" className="rounded-2xl border border-dashed border-border p-8">
              <h2 className="text-xl font-extrabold">{t('tracking.notFoundTitle')}</h2>
              <p className="mt-3 leading-8 text-muted">{t('tracking.notFoundText')}</p>
            </section>
          )}
        </div>

        <aside className="lg:col-span-4">
          <div className="rounded-2xl bg-navy p-7 text-foam">
            <p className="font-bold">{t('tracking.helpTitle')}</p>
            <p className="mt-2 text-sm leading-7 text-foam/70">{t('tracking.helpText')}</p>
            <a href={`tel:${phone}`} className="ltr-nums mt-5 inline-block text-2xl font-extrabold hover:text-sky">
              {phone}
            </a>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-3 block text-sm text-sky hover:underline">
                {t('tracking.whatsapp')}
              </a>
            )}
          </div>
        </aside>
      </Container>
    </>
  )
}

const fmtDate = (iso: string, locale: string, withTime = false) =>
  new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    timeZone: 'Asia/Tehran',
  }).format(new Date(iso))

// کارت نتیجه: وضعیت فعلی بزرگ، مشخصات، توضیح و خط زمانی تاریخچه
async function ResultCard({ r, locale }: { r: TrackResult; locale: string }) {
  const t = await getTranslations('tracking')
  const meta = [r.model, r.color].filter(Boolean).join(' · ')
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border p-6">
        <div>
          {meta && <p className="text-sm text-muted">{meta}</p>}
          <p className="mt-1 flex items-center gap-3 text-2xl font-extrabold">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent" aria-hidden />
            {r.status || t('noStatus')}
          </p>
        </div>
        <p className="text-sm text-muted">
          {t('chassis')}{' '}
          <span dir="ltr" className="font-mono tracking-wider text-text">
            {r.chassis}
          </span>
        </p>
      </header>

      <dl className="grid gap-5 p-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-muted">{t('location')}</dt>
          <dd className="mt-1 font-semibold">{r.currentLocation || '—'}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">{t('updated')}</dt>
          <dd className="mt-1 font-semibold">{fmtDate(r.updatedAt, locale, true)}</dd>
        </div>
        {r.note && (
          <div className="sm:col-span-2">
            <dt className="text-xs text-muted">{t('note')}</dt>
            <dd className="mt-1 whitespace-pre-line leading-8">{r.note}</dd>
          </div>
        )}
      </dl>

      {r.history.length > 0 && (
        <div className="border-t border-border p-6">
          <h3 className="text-sm font-bold">{t('history')}</h3>
          <ol className="mt-5 space-y-6 border-s border-border ps-6">
            {r.history.map((h, i) => (
              <li key={i} className="relative">
                <span
                  className={`absolute -start-[1.85rem] top-1.5 h-3 w-3 rounded-full border-2 border-surface ${i === 0 ? 'bg-primary' : 'bg-border'}`}
                  aria-hidden
                />
                <p className="text-xs text-muted">{fmtDate(h.date, locale)}</p>
                {h.status && <p className={`mt-1 font-semibold ${i === 0 ? '' : 'text-muted'}`}>{h.status}</p>}
                {h.location && <p className="text-sm text-muted">{h.location}</p>}
              </li>
            ))}
          </ol>
        </div>
      )}
    </article>
  )
}

// کارت وضعیت استعلام قیمت (جستجو با شماره‌ی Q)
async function QuoteCard({ q, locale }: { q: QuoteResult; locale: string }) {
  const t = await getTranslations('tracking')
  const steps: QuoteResult['status'][] = ['new', 'in-review', 'answered']
  const current = steps.indexOf(q.status)
  return (
    <article aria-live="polite" className="overflow-hidden rounded-2xl border border-border bg-surface">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border p-6">
        <div>
          <p className="text-sm text-muted">{t('quoteTitle')}</p>
          <p className="mt-1 flex items-center gap-3 text-2xl font-extrabold">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent" aria-hidden />
            {t(`quoteStatus.${q.status}`)}
          </p>
        </div>
        <span dir="ltr" className="font-mono text-sm tracking-wider text-muted">
          {q.number}
        </span>
      </header>
      <ol className="grid grid-cols-3 gap-2 px-6 pt-6">
        {steps.map((s, i) => (
          <li key={s}>
            <span className={`block h-1 rounded-full ${i <= current ? 'bg-primary' : 'bg-border'}`} aria-hidden />
            <span className={`mt-2 block text-xs ${i <= current ? 'font-semibold text-text' : 'text-muted'}`}>{t(`quoteStatus.${s}`)}</span>
          </li>
        ))}
      </ol>
      <dl className="grid gap-5 p-6 sm:grid-cols-3">
        <div>
          <dt className="text-xs text-muted">{t('route')}</dt>
          <dd className="mt-1 font-semibold">{q.route}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">{t('cargo')}</dt>
          <dd className="mt-1 font-semibold">{q.cargo}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">{t('submitted')}</dt>
          <dd className="mt-1 font-semibold">{fmtDate(q.createdAt, locale)}</dd>
        </div>
      </dl>
      <p className="border-t border-border px-6 py-4 text-sm text-muted">{t(`quoteHint.${q.status}`)}</p>
    </article>
  )
}
