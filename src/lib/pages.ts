import { cache } from 'react'
import type { Metadata } from 'next'
import { getPayloadClient, mediaUrl, type Locale } from './payload'
import type { Page } from '@/payload-types'

/** صفحه‌ی پنل با آدرس (slug). در نسخه‌ی انگلیسی فقط اگر «نمایش در نسخه‌ی انگلیسی» روشن باشد. */
export const getPageBySlug = cache(async (slug: string, locale: Locale): Promise<Page | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    locale,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  const page = docs[0]
  if (!page) return null
  if (locale === 'en' && !page.showInEnglish) return null
  return page
})

/** متادیتای سئو از تب «سئو»ی صفحه */
export function pageMetadata(page: Page | null, path: string): Metadata {
  if (!page) return {}
  const image = mediaUrl(page.seo?.image)
  return {
    title: page.seo?.title ? { absolute: page.seo.title } : page.title,
    ...(page.seo?.description ? { description: page.seo.description } : {}),
    alternates: { languages: { fa: `/fa${path}`, en: `/en${path}` } },
    ...(image ? { openGraph: { images: [image] } } : {}),
    ...(page.seo?.noIndex ? { robots: { index: false } } : {}),
  }
}
