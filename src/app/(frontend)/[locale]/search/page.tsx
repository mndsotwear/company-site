import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { PageHeader } from '@/components/sections/PageHeader'
import { Container } from '@/components/ui/Container'
import { getPayloadClient, type Locale } from '@/lib/payload'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'search' })
  return { title: t('title'), robots: { index: false } }
}

// جستجوی سایت: خدمات، کشتی‌ها و صفحه‌های پنل (عنوان و خلاصه)
export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()
  const q = ((await searchParams).q || '').trim().slice(0, 60)

  type Hit = { href: string; title: string; text?: string | null; group: string }
  let hits: Hit[] = []
  if (q.length >= 2) {
    const payload = await getPayloadClient()
    const loc = locale as Locale
    const [services, vessels, pages] = await Promise.all([
      payload.find({ collection: 'services', locale: loc, limit: 10, depth: 0, where: { and: [{ isActive: { equals: true } }, { or: [{ title: { like: q } }, { summary: { like: q } }] }] } }),
      payload.find({
        collection: 'vessels',
        locale: loc,
        limit: 10,
        depth: 0,
        where: { and: [{ or: [{ status: { not_equals: 'sold' } }, { showWhenSold: { equals: true } }] }, { or: [{ name: { like: q } }, { summary: { like: q } }] }] },
      }),
      payload.find({ collection: 'pages', locale: loc, limit: 10, depth: 0, where: { and: [{ slug: { not_equals: 'home' } }, { title: { like: q } }] } }),
    ])
    hits = [
      ...services.docs.map((s) => ({ href: `/services/${s.slug}`, title: s.title, text: s.summary, group: t('search.services') })),
      ...vessels.docs.map((v) => ({ href: `/fleet/${v.slug}`, title: v.name, text: v.summary, group: t('search.vessels') })),
      ...pages.docs.filter((p) => p.title).map((p) => ({ href: `/${p.slug}`, title: p.title, group: t('search.pages') })),
    ]
  }

  return (
    <>
      <PageHeader title={t('search.title')} intro={t('search.intro')} crumbs={[{ label: t('search.title') }]} />
      <Container className="py-12 lg:py-16">
        <form method="get" className="flex max-w-2xl gap-2">
          <label className="sr-only" htmlFor="q">
            {t('search.placeholder')}
          </label>
          <input
            id="q"
            name="q"
            defaultValue={q}
            required
            minLength={2}
            placeholder={t('search.placeholder')}
            className="min-w-0 flex-1 rounded-full border border-border bg-surface px-5 py-3.5 focus:border-primary focus:outline-none"
          />
          <button type="submit" className="rounded-full bg-primary px-7 text-sm font-semibold text-white hover:bg-accent">
            {t('search.button')}
          </button>
        </form>

        {q.length > 0 && q.length < 2 && <p className="mt-6 text-sm text-muted">{t('search.short')}</p>}
        {q.length >= 2 && (
          <div className="mt-10 max-w-3xl">
            <p className="mb-4 text-sm text-muted">{t('search.results', { count: hits.length })}</p>
            <ul className="divide-y divide-border border-y border-border">
              {hits.map((h) => (
                <li key={h.href}>
                  <Link href={h.href} className="block py-5 hover:text-primary">
                    <span className="text-xs text-muted">{h.group}</span>
                    <span className="mt-1 block text-lg font-bold">{h.title}</span>
                    {h.text && <span className="mt-1 block text-sm text-muted">{h.text}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </>
  )
}
