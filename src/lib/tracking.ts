import { getPayloadClient, type Locale } from './payload'
import { clientIp, isOverLimit, rateLimit } from './antiSpam'
import { isValidTrackCode, maskChassis, normalizeChassis } from './chassis'
import { verifyAltcha } from './altcha'
import { CARGO_OPTIONS, DESTINATION_OPTIONS, ORIGIN_OPTIONS, labelOf, type Option } from './options'
import { toLatinDigits } from './validate'

// جستجوی رهگیری برای صفحه‌ی عمومی سایت:
// ۱) ۶ رقم آخر شاسی ← وضعیت خودرو
// ۲) شماره‌ی استعلام (Q-1405-0001) ← وضعیت درخواست قیمت
// فقط فیلدهای بی‌خطر برگردانده می‌شوند؛ نام و تلفن مشتری هرگز از این تابع بیرون نمی‌آید.

export type TrackEvent = { date: string; status?: string | null; location?: string | null }
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
export type QuoteResult = {
  number: string
  status: 'new' | 'in-review' | 'answered'
  route: string
  cargo: string
  createdAt: string
  updatedAt: string
}
type Base = { captcha: boolean }
export type TrackLookup = Base &
  (
    | { kind: 'empty' }
    | { kind: 'invalid'; code: string }
    | { kind: 'rate' }
    | { kind: 'captcha'; code: string }
    | { kind: 'error'; code: string }
    | { kind: 'found'; code: string; results: TrackResult[] }
    | { kind: 'quote'; code: string; quote: QuoteResult }
    | { kind: 'notFound'; code: string }
  )

// بعد از ۳ جستجو در ۱۰ دقیقه، کپچا لازم می‌شود؛ سقف کلی: ۱۰ در دقیقه و ۶۰ در ساعت
const FREE = { max: 3, window: 10 * 60_000 }

const QUOTE_RE = /^Q-?(1[34]\d{2})-?(\d{1,4})$/

export async function lookupTracking(rawCode: string | undefined, locale: Locale, altchaPayload?: string): Promise<TrackLookup> {
  const ip = await clientIp()
  const freeKey = `track:free:${ip}`
  const captchaNow = () => isOverLimit(freeKey, FREE.max, FREE.window)

  if (!rawCode?.trim()) return { kind: 'empty', captcha: captchaNow() }
  const upper = toLatinDigits(rawCode).toUpperCase().replace(/\s/g, '').slice(0, 24)
  const quote = upper.match(QUOTE_RE)
  const code = quote ? `Q-${quote[1]}-${quote[2].padStart(4, '0')}` : normalizeChassis(upper)
  if (!quote && !isValidTrackCode(code)) return { kind: 'invalid', code, captcha: captchaNow() }

  // کپچا: اگر سهمیه‌ی بدون کپچا تمام شده، پاسخ معتبر ALTCHA لازم است
  if (captchaNow()) {
    if (!(await verifyAltcha(altchaPayload))) return { kind: 'captcha', code, captcha: true }
  } else {
    rateLimit(freeKey, FREE.max, FREE.window)
  }
  if (!rateLimit(`track:m:${ip}`, 10, 60_000) || !rateLimit(`track:h:${ip}`, 60, 60 * 60_000)) {
    return { kind: 'rate', captcha: true }
  }

  try {
    const payload = await getPayloadClient()
    if (quote) {
      const res = await payload.find({
        collection: 'quote-requests',
        where: { trackingNumber: { equals: code } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
        select: { trackingNumber: true, status: true, origin: true, originOther: true, destination: true, destinationOther: true, cargo: true, cargoOther: true, createdAt: true, updatedAt: true },
      })
      const q = res.docs[0]
      if (!q) return { kind: 'notFound', code, captcha: captchaNow() }
      const pick = (v: string | null | undefined, other: string | null | undefined, opts: Option[]) =>
        v === 'other' ? other || labelOf(opts, v, locale) : labelOf(opts, v, locale)
      return {
        kind: 'quote',
        code,
        captcha: captchaNow(),
        quote: {
          number: q.trackingNumber ?? code,
          status: (q.status ?? 'new') as QuoteResult['status'],
          route: `${pick(q.origin, q.originOther, ORIGIN_OPTIONS)} ${locale === 'fa' ? '←' : '→'} ${pick(q.destination, q.destinationOther, DESTINATION_OPTIONS)}`,
          cargo: pick(q.cargo, q.cargoOther, CARGO_OPTIONS),
          createdAt: q.createdAt,
          updatedAt: q.updatedAt,
        },
      }
    }

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
    if (!res.docs.length) return { kind: 'notFound', code, captcha: captchaNow() }

    // ترجمه‌ی وضعیت‌ها برای سایت انگلیسی (از «تنظیمات سایت ← رهگیری»)
    let tr = (s?: string | null) => s
    if (locale === 'en') {
      const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
      const map = new Map((settings.statusTranslations ?? []).map((x) => [x.fa.trim(), x.en]))
      tr = (s) => (s ? (map.get(s.trim()) ?? s) : s)
    }

    return {
      kind: 'found',
      code,
      captcha: captchaNow(),
      results: res.docs.map((d) => ({
        id: d.id,
        chassis: maskChassis(d.chassis),
        model: d.model,
        color: d.color,
        status: tr(d.status),
        currentLocation: tr(d.currentLocation),
        note: d.note,
        updatedAt: d.updatedAt,
        history: (d.history ?? [])
          .map((h) => ({ date: h.date, status: tr(h.status), location: tr(h.location) }))
          .sort((a, b) => b.date.localeCompare(a.date)),
      })),
    }
  } catch (e) {
    console.error('[tracking] lookup failed', e)
    return { kind: 'error', code, captcha: captchaNow() }
  }
}
