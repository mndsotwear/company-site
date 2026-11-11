import { getPayloadClient } from './payload'
import { clientIp, rateLimit } from './antiSpam'
import { isValidTrackCode, maskChassis, normalizeChassis } from './chassis'

// جستجوی رهگیری برای صفحه‌ی عمومی سایت.
// فقط فیلدهای بی‌خطر برگردانده می‌شوند؛ نام و تلفن مشتری هرگز از این تابع بیرون نمی‌آید.

export type TrackEvent = { date: string; status?: string | null; location?: string | null; note?: string | null }
export type TrackResult = {
  id: number
  chassis: string // ماسک‌شده
  model?: string | null
  color?: string | null
  status?: string | null
  currentLocation?: string | null
  note?: string | null
  updatedAt: string
  history: TrackEvent[] // جدیدترین اول
}
export type TrackLookup =
  | { kind: 'empty' }
  | { kind: 'invalid'; code: string }
  | { kind: 'rate' }
  | { kind: 'error'; code: string }
  | { kind: 'found'; code: string; results: TrackResult[] }
  | { kind: 'notFound'; code: string }

/** محدودیت: ۱۰ جستجو در دقیقه و ۶۰ جستجو در ساعت برای هر IP */
async function allowed(): Promise<boolean> {
  const ip = await clientIp()
  return rateLimit(`track:m:${ip}`, 10, 60_000) && rateLimit(`track:h:${ip}`, 60, 60 * 60_000)
}

export async function lookupTracking(rawCode: string | undefined): Promise<TrackLookup> {
  if (!rawCode?.trim()) return { kind: 'empty' }
  const code = normalizeChassis(rawCode).slice(0, 20)
  if (!isValidTrackCode(code)) return { kind: 'invalid', code }
  if (!(await allowed())) return { kind: 'rate' }

  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'shipments',
      where: { chassisLast6: { equals: code } },
      limit: 5,
      depth: 0,
      sort: '-updatedAt',
      overrideAccess: true,
      // انتخاب صریح فیلدها: اطلاعات مشتری حتی از دیتابیس هم خوانده نمی‌شود
      select: { chassis: true, model: true, color: true, status: true, currentLocation: true, note: true, history: true, updatedAt: true },
    })
    if (!res.docs.length) return { kind: 'notFound', code }
    return {
      kind: 'found',
      code,
      results: res.docs.map((d) => ({
        id: d.id,
        chassis: maskChassis(d.chassis),
        model: d.model,
        color: d.color,
        status: d.status,
        currentLocation: d.currentLocation,
        note: d.note,
        updatedAt: d.updatedAt,
        history: (d.history ?? [])
          .map((h) => ({ date: h.date, status: h.status, location: h.location, note: h.note }))
          .sort((a, b) => b.date.localeCompare(a.date)),
      })),
    }
  } catch (e) {
    console.error('[tracking] lookup failed', e)
    return { kind: 'error', code }
  }
}
