import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { PageHeader } from '@/components/sections/PageHeader'
import { CTASection } from '@/components/blocks/CTASection'
import { MaritimeIcon } from '@/components/icons/MaritimeIcon'
import { Section } from '@/components/ui/Section'
import { formatNumber } from '@/lib/format'
import { getActiveServices } from '@/lib/services'
import type { Locale } from '@/lib/payload'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'services' })
  return { title: t('title'), description: t('intro'), alternates: { languages: { fa: '/fa/services', en: '/en/services' } } }
}

// فهرست خدمات: سربرگ + ردیف‌های بزرگ (نه کارت‌های کوچک یکسان) + فراخوان
export default async function ServicesPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()
  const services = await getActiveServices(locale as Locale)

  return (
    <>
      <PageHeader
        eyebrow={t('services.eyebrow')}
        title={t('services.title')}
        intro={t('services.intro')}
        crumbs={[{ label: t('nav.services') }]}
      />

      <Section>
        {services.length ? (
          <ol className="divide-y divide-border border-y border-border">
            {services.map((s, i) => (
              <li key={s.id}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group grid items-center gap-6 py-8 sm:grid-cols-[4rem_3.5rem_1fr_auto] sm:gap-8 sm:py-10"
                >
                  <span className="text-sm tabular-nums text-muted">{formatNumber(i + 1, locale, { minimumIntegerDigits: 2 })}</span>
                  <span className="text-primary">
                    <MaritimeIcon name={s.icon} className="h-10 w-10" />
                  </span>
                  <span>
                    <span className="block text-2xl font-bold transition group-hover:text-primary">{s.title}</span>
                    {s.summary && <span className="mt-2 block max-w-2xl leading-8 text-muted">{s.summary}</span>}
                  </span>
                  <span className="text-sm text-primary">
                    {t('common.more')} {t('common.arrow')}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-muted">{t('services.empty')}</p>
        )}
      </Section>

      <CTASection
        blockType="cta"
        heading={t('services.ctaTitle')}
        text={t('services.ctaText')}
        link={{ label: t('nav.quote'), href: '/quote' }}
      />
    </>
  )
}
