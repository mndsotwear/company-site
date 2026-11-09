import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { Hero } from '@/components/sections/Hero'
import { getPageBySlug, pageMetadata } from '@/lib/pages'
import type { Locale } from '@/lib/payload'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const page = await getPageBySlug('home', locale as Locale)
  if (!page) return {}
  const meta = pageMetadata(page, '')
  // عنوان پیش‌فرض صفحه اصلی «شاهین مارین – حمل و نقل دریایی» می‌ماند مگر در سئو عوض شود
  if (!page.seo?.title) delete meta.title
  return meta
}

// صفحه اصلی: اگر صفحه‌ی home در پنل ساخته شده باشد، از بلوک‌های آن ساخته می‌شود؛
// وگرنه همان هیروی پیش‌فرض نمایش داده می‌شود.
export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const page = await getPageBySlug('home', locale as Locale)

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
