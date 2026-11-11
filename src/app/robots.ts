import type { MetadataRoute } from 'next'

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://shahinmarine.com').replace(/\/$/, '')

// پنل مدیریت، API و صفحه‌ی نتیجه‌ی جستجو/مقایسه نباید در گوگل ثبت شوند
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/fa/fleet/compare', '/en/fleet/compare'] },
    sitemap: `${SITE}/sitemap.xml`,
  }
}
