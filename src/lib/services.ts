import { cache } from 'react'
import { getPayloadClient, type Locale } from './payload'

// در نسخه‌ی انگلیسی متن فارسی جایگزین نمی‌شود؛ خدمتی که ترجمه ندارد نمایش داده نمی‌شود
const noFallback = (locale: Locale) => (locale === 'en' ? { fallbackLocale: false as const } : {})

/** خدمات فعال به ترتیب نمایش */
export const getActiveServices = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'services',
    locale,
    ...noFallback(locale),
    where: { isActive: { equals: true } },
    sort: 'order',
    limit: 50,
    depth: 1,
  })
  return docs.filter((d) => Boolean(d.title))
})

/** یک خدمت با آدرس (slug) */
export const getServiceBySlug = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'services',
    locale,
    ...noFallback(locale),
    where: { slug: { equals: slug }, isActive: { equals: true } },
    limit: 1,
    depth: 1,
  })
  return docs[0]?.title ? docs[0] : null
})
