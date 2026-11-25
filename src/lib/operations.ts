import { cache } from 'react'
import type { Where } from 'payload'
import { getPayloadClient, type Locale } from './payload'
import { DESTINATION_OPTIONS, ORIGIN_OPTIONS } from './options'

// برنامه‌ی حرکت و دفاتر برای صفحه‌های سایت

export type SailingFilters = { origin?: string; destination?: string }

/** حرکت‌های آینده (از دیروز به بعد)، به ترتیب تاریخ حرکت */
export async function getSailings(locale: Locale, f: SailingFilters = {}, limit = 50) {
  const and: Where[] = [{ departure: { greater_than_equal: new Date(Date.now() - 24 * 3600 * 1000).toISOString() } }]
  if (f.origin && ORIGIN_OPTIONS.some((o) => o.value === f.origin)) and.push({ origin: { equals: f.origin } })
  if (f.destination && DESTINATION_OPTIONS.some((o) => o.value === f.destination)) and.push({ destination: { equals: f.destination } })
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'sailings', locale, where: { and }, sort: 'departure', limit, depth: 0 })
  return docs
}

export const getOffices = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'offices', locale, sort: 'order', limit: 20, depth: 0 })
  return docs
})

export const SAILING_STATUS: Record<string, { fa: string; en: string; tone: string }> = {
  scheduled: { fa: 'برنامه‌ریزی شده', en: 'Scheduled', tone: 'bg-primary/10 text-primary' },
  loading: { fa: 'در حال بارگیری', en: 'Loading', tone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  full: { fa: 'ظرفیت تکمیل', en: 'Full', tone: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' },
  departed: { fa: 'حرکت کرد', en: 'Departed', tone: 'bg-surface-2 text-muted' },
  cancelled: { fa: 'لغو شد', en: 'Cancelled', tone: 'bg-red-500/10 text-red-600 dark:text-red-400' },
}
