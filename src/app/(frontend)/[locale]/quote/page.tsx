import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PageHeader } from '@/components/sections/PageHeader'
import { QuoteForm } from '@/components/forms/QuoteForm'
import { Container } from '@/components/ui/Container'
import { getSiteSettings, whatsappLink, type Locale } from '@/lib/payload'
import { SERVICE_OPTIONS } from '@/lib/options'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ service?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'quote' })
  return { title: t('title'), description: t('intro'), alternates: { languages: { fa: '/fa/quote', en: '/en/quote' } } }
}

// صفحه‌ی استعلام قیمت: فرم ۳ گامی + ستون کناری (بعد از ارسال چه می‌شود + تماس مستقیم)
export default async function QuotePage({ params, searchParams }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const { service } = await searchParams
  const t = await getTranslations()
  const s = await getSiteSettings(locale as Locale)
  const phone = s.phone || '09366334228'
  const wa = whatsappLink(s.whatsapp || phone)
  const defaultService = service && SERVICE_OPTIONS.some((o) => o.value === service) ? service : ''
  const after = [t('quote.after1'), t('quote.after2'), t('quote.after3')]
  const num = (n: number) => n.toLocaleString(locale === 'fa' ? 'fa-IR' : 'en-US')

  return (
    <>
      <PageHeader eyebrow={t('quote.eyebrow')} title={t('quote.title')} intro={t('quote.intro')} crumbs={[{ label: t('nav.quote') }]} />
      <Container className="grid grid-cols-1 gap-10 py-12 lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-8">
          <QuoteForm defaultService={defaultService} />
        </div>
        <aside className="space-y-6 lg:col-span-4">
          <div className="rounded-2xl border border-border p-7">
            <p className="font-bold">{t('quote.afterTitle')}</p>
            <ol className="mt-5 space-y-4 text-sm leading-7 text-muted">
              {after.map((a, i) => (
                <li key={i} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {num(i + 1)}
                  </span>
                  {a}
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl bg-navy p-7 text-foam">
            <p className="font-bold">{t('quote.directTitle')}</p>
            <p className="mt-2 text-sm leading-7 text-foam/70">{t('quote.directText')}</p>
            <a href={`tel:${phone}`} className="ltr-nums mt-5 inline-block text-2xl font-extrabold hover:text-sky">
              {phone}
            </a>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-3 block text-sm text-sky hover:underline">
                {t('footer.whatsapp')}
              </a>
            )}
          </div>
        </aside>
      </Container>
    </>
  )
}
