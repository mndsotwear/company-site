import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media, SiteSetting } from '@/payload-types'

export type Locale = 'fa' | 'en'

/** دسترسی به دیتابیس از داخل صفحات سایت (سمت سرور) */
export const getPayloadClient = () => getPayload({ config })

/** تنظیمات سایت از پنل (در هر درخواست فقط یک بار خوانده می‌شود) */
export const getSiteSettings = cache(async (locale: Locale): Promise<SiteSetting> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', locale, depth: 1 })
})

/** آدرس عکس از فیلد آپلود (اگر عکس انتخاب نشده باشد null) */
export const mediaUrl = (m: number | Media | null | undefined, size?: 'thumb' | 'card' | 'hero') => {
  if (!m || typeof m === 'number') return null
  return (size && m.sizes?.[size]?.url) || m.url || null
}

/** لینک واتساپ از شماره‌ی ایرانی (09…) */
export const whatsappLink = (phone?: string | null) => {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  const intl = digits.startsWith('0') ? `98${digits.slice(1)}` : digits
  return `https://wa.me/${intl}`
}
