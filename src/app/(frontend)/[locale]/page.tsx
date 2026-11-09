import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { Hero } from '@/components/sections/Hero'
import { getPayloadClient, mediaUrl, type Locale } from '@/lib/payload'

type Props = { params: Promise<{ locale: string }> }

/** صفحه‌ای با آدرس home در پنل */
async function getHomePage(locale: Locale) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    locale,
    where: { slug: { equals: 'home' } },
    limit: 1,
    depth: 2,
  })
  const page = docs[0]
  if (!page) return null
  if (locale === 'en' && !page.showInEnglish) return null
  return page
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const page = await getHomePage(locale as Locale)
  if (!page?.seo) return {}
  const image = mediaUrl(page.seo.image)
  return {
    ...(page.seo.title ? { title: { absolute: page.seo.title } } : {}),
    ...(page.seo.description ? { description: page.seo.description } : {}),
    ...(image ? { openGraph: { images: [image] } } : {}),
    ...(page.seo.noIndex ? { robots: { index: false } } : {}),
  }
}

// صفحه اصلی: اگر صفحه‌ی home در پنل ساخته شده باشد، از بلوک‌های آن ساخته می‌شود؛
// وگرنه همان هیروی پیش‌فرض نمایش داده می‌شود.
export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const page = await getHomePage(locale as Locale)

  if (page?.layout?.length) return <RenderBlocks blocks={page.layout} />

  const t = await getTranslations('home')
  return (
    <Hero
      eyebrow={t('eyebrow')}
      title={t('titleA')}
      titleAccent={t('titleB')}
      text={t('lead')}
      primary={{ label: t('ctaQuote'), href: '/quote' }}
      secondary={{ label: t('ctaServices'), href: '/services' }}
      showTracking
    />
  )
}
