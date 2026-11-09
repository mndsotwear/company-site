import { cache } from 'react'
import type { Where } from 'payload'
import { getPayloadClient, type Locale } from './payload'
import { VESSEL_STATUS_OPTIONS, VESSEL_TYPE_OPTIONS } from './options'
import { formatNumber } from './format'
import type { Vessel } from '@/payload-types'

export type VesselFilters = { type?: string; status?: string; sort?: string }

const SORTS: Record<string, string> = {
  newest: '-createdAt',
  dwt: '-specs.dwt',
  year: '-yearBuilt',
}

/** کشتی‌های فروخته‌شده فقط اگر «بعد از فروش بماند» روشن باشد */
const visible: Where = {
  or: [{ status: { not_equals: 'sold' } }, { showWhenSold: { equals: true } }],
}

/** فهرست کشتی‌ها با فیلتر نوع و وضعیت و مرتب‌سازی (از آدرس صفحه) */
export async function getVessels(locale: Locale, f: VesselFilters) {
  const and: Where[] = [visible]
  if (f.type && VESSEL_TYPE_OPTIONS.some((o) => o.value === f.type)) and.push({ vesselType: { equals: f.type } })
  if (f.status && VESSEL_STATUS_OPTIONS.some((o) => o.value === f.status)) and.push({ status: { equals: f.status } })
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'vessels',
    locale,
    where: { and },
    sort: SORTS[f.sort || 'newest'] || SORTS.newest,
    limit: 60,
    depth: 1,
  })
  return docs
}

export const getVesselBySlug = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'vessels',
    locale,
    where: { and: [{ slug: { equals: slug } }, visible] },
    limit: 1,
    depth: 1,
  })
  return docs[0] ?? null
})

/** متن قیمت: مبلغ با واحد، یا null یعنی «تماس بگیرید» */
export function priceText(v: Vessel, locale: string): string | null {
  if (!v.price?.show || !v.price.amount) return null
  const { amount, currency } = v.price
  if (currency === 'IRT') return `${formatNumber(amount, locale)} ${locale === 'fa' ? 'تومان' : 'Toman'}`
  // فارسی: «۴۵۰٬۰۰۰ دلار» (به‌جای $۴۵۰,۰۰۰)
  if (locale === 'fa') return `${formatNumber(amount, locale)} ${currency === 'AED' ? 'درهم' : 'دلار'}`
  return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}
