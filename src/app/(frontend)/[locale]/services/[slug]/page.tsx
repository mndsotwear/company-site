import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { PageHeader } from '@/components/sections/PageHeader'
import { MaritimeIcon } from '@/components/icons/MaritimeIcon'
import { Button } from '@/components/ui/Button'
import { CmsImage } from '@/components/ui/CmsImage'
import { Container } from '@/components/ui/Container'
import { RichText } from '@/components/ui/RichText'
import { formatNumber } from '@/lib/format'
import { mediaUrl, type Locale } from '@/lib/payload'
import { getActiveServices, getServiceBySlug } from '@/lib/services'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const s = await getServiceBySlug(slug, locale as Locale)
  if (!s) return {}
  const image = mediaUrl(s.seo?.image) || mediaUrl(s.image, 'card')
  return {
    title: s.seo?.title || s.title,
    description: s.seo?.description || s.summary || undefined,
    alternates: { languages: { fa: `/fa/services/${slug}`, en: `/en/services/${slug}` } },
    ...(image ? { openGraph: { images: [image] } } : {}),
    ...(s.seo?.noIndex ? { robots: { index: false } } : {}),
  }
}

// صفحه‌ی هر خدمت: سربرگ، عکس، متن کامل، مراحل کار، ستون کناری استعلام و خدمات دیگر
export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const service = await getServiceBySlug(slug, locale as Locale)
  if (!service) notFound()

  const t = await getTranslations()
  const others = (await getActiveServices(locale as Locale)).filter((s) => s.id !== service.id)
  const hasImage = service.image && typeof service.image !== 'number'

  return (
    <>
      <PageHeader
        eyebrow={t('nav.services')}
        title={service.title}
        intro={service.summary}
        crumbs={[{ href: '/services', label: t('nav.services') }, { label: service.title }]}
      />

      <Container className="grid grid-cols-1 gap-14 py-16 lg:grid-cols-12 lg:py-24">
        <article className="lg:col-span-8">
          {hasImage && (
            <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-2xl">
              <CmsImage media={service.image} size="hero" fill priority sizes="(min-width:1024px) 66vw, 100vw" />
            </div>
          )}

          {service.body ? (
            <RichText data={service.body} className="text-lg text-muted" />
          ) : (
            // تا وقتی متن کامل در پنل نوشته نشده، توضیح کوتاه نمایش داده می‌شود
            service.summary && <p className="text-xl leading-9 text-muted">{service.summary}</p>
          )}

          {!!service.steps?.length && (
            <section className="mt-16">
              <h2 className="mb-8 text-2xl font-extrabold">{t('services.steps')}</h2>
              <ol className="relative space-y-8 border-s border-dashed border-primary/40 ps-8">
                {service.steps.map((step, i) => (
                  <li key={step.id} className="relative">
                    <span className="absolute -start-[2.85rem] top-0 grid h-7 w-7 place-items-center rounded-full border border-primary bg-bg text-xs font-bold text-primary">
                      {formatNumber(i + 1, locale)}
                    </span>
                    <h3 className="font-bold">{step.title}</h3>
                    {step.text && <p className="mt-2 leading-8 text-muted">{step.text}</p>}
                  </li>
                ))}
              </ol>
            </section>
          )}
        </article>

        <aside className="space-y-6 lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-2xl bg-navy p-7 text-foam">
              <span className="text-sky">
                <MaritimeIcon name={service.icon} className="h-9 w-9" />
              </span>
              <p className="mt-5 text-lg font-bold">{t('services.quoteTitle')}</p>
              <p className="mt-2 text-sm leading-7 text-foam/70">{t('services.quoteText')}</p>
              <Button href="/quote" variant="accent" className="mt-6 w-full">
                {t('nav.quote')}
              </Button>
            </div>

            {!!others.length && (
              <div className="rounded-2xl border border-border p-7">
                <p className="mb-4 font-bold">{t('services.others')}</p>
                <ul className="space-y-3 text-sm">
                  {others.map((o) => (
                    <li key={o.id}>
                      <Link href={`/services/${o.slug}`} className="flex items-center gap-3 text-muted transition hover:text-primary">
                        <MaritimeIcon name={o.icon} className="h-5 w-5" />
                        {o.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </Container>
    </>
  )
}
