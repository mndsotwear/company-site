import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

// نقشه‌ی سایت برای گوگل: صفحه‌های ثابت + صفحه‌های پنل + خدمات + کشتی‌ها، در هر دو زبان
export const dynamic = 'force-dynamic'

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://shahinmarine.com').replace(/\/$/, '')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const entry = (path: string, lastModified?: string, en = true): MetadataRoute.Sitemap[number] => ({
    url: `${SITE}/fa${path}`,
    lastModified: lastModified ? new Date(lastModified) : undefined,
    alternates: { languages: { fa: `${SITE}/fa${path}`, ...(en ? { en: `${SITE}/en${path}` } : {}) } },
  })

  const statics = ['', '/services', '/fleet', '/tracking', '/quote', '/contact'].map((p) => entry(p))
  const [pages, services, vessels] = await Promise.all([
    payload.find({ collection: 'pages', limit: 200, depth: 0, select: { slug: true, updatedAt: true, showInEnglish: true, seo: true } }),
    payload.find({ collection: 'services', where: { isActive: { equals: true } }, limit: 200, depth: 0, select: { slug: true, updatedAt: true } }),
    payload.find({
      collection: 'vessels',
      where: { or: [{ status: { not_equals: 'sold' } }, { showWhenSold: { equals: true } }] },
      limit: 500,
      depth: 0,
      select: { slug: true, updatedAt: true, seo: true },
    }),
  ])

  return [
    ...statics,
    ...pages.docs.filter((p) => p.slug && p.slug !== 'home' && !p.seo?.noIndex).map((p) => entry(`/${p.slug}`, p.updatedAt, Boolean(p.showInEnglish))),
    ...services.docs.filter((s) => s.slug).map((s) => entry(`/services/${s.slug}`, s.updatedAt)),
    ...vessels.docs.filter((v) => v.slug && !v.seo?.noIndex).map((v) => entry(`/fleet/${v.slug}`, v.updatedAt)),
  ]
}
