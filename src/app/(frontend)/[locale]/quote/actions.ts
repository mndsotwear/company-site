'use server'

import { getPayloadClient } from '@/lib/payload'
import { clientIp, looksLikeBot, rateLimit } from '@/lib/antiSpam'
import { field, isEmail, normalizePhone, oneOf, toLatinDigits } from '@/lib/validate'
import {
  CARGO_OPTIONS,
  CONTACT_VIA_OPTIONS,
  DESTINATION_OPTIONS,
  ORIGIN_OPTIONS,
  SERVICE_OPTIONS,
  TIMING_OPTIONS,
} from '@/lib/options'
import type { QuoteRequest } from '@/payload-types'

export type QuoteState = {
  ok: boolean
  trackingNumber?: string
  /** کلید پیام خطا در messages (quote.errors.*) */
  error?: 'invalid' | 'rate' | 'server'
  fields?: string[]
}

const values = (opts: { value: string }[]) => opts.map((o) => o.value)

// دریافت فرم استعلام قیمت، بررسی، ذخیره در پنل (اطلاع‌رسانی در هوک کالکشن انجام می‌شود)
export async function submitQuote(_prev: QuoteState, fd: FormData): Promise<QuoteState> {
  // ربات‌ها پاسخ «موفق» جعلی می‌گیرند تا تلاش دوباره نکنند
  if (looksLikeBot(fd)) return { ok: true, trackingNumber: '—' }

  const ip = await clientIp()
  if (!rateLimit(`quote:${ip}`, 5, 10 * 60 * 1000)) return { ok: false, error: 'rate' }

  const bad: string[] = []
  const pick = (name: string, opts: { value: string }[], required = true) => {
    const v = oneOf(field(fd, name, 40), values(opts))
    if (!v && required) bad.push(name)
    const other = v === 'other' ? field(fd, `${name}Other`, 120) : ''
    if (v === 'other' && !other) bad.push(`${name}Other`)
    return { v, other }
  }

  const service = pick('service', SERVICE_OPTIONS)
  const origin = pick('origin', ORIGIN_OPTIONS)
  const destination = pick('destination', DESTINATION_OPTIONS)
  const cargo = pick('cargo', CARGO_OPTIONS)
  const timing = pick('timing', TIMING_OPTIONS, false)

  const weightRaw = toLatinDigits(field(fd, 'weight', 20)).replace(/[,٬]/g, '')
  const weight = weightRaw ? Number(weightRaw) : null
  if (weightRaw && (!Number.isFinite(weight) || weight! < 0)) bad.push('weight')

  const name = field(fd, 'name', 120)
  if (name.length < 2) bad.push('name')
  const phone = normalizePhone(field(fd, 'phone', 30))
  if (!phone) bad.push('phone')
  const email = field(fd, 'email', 120)
  if (email && !isEmail(email)) bad.push('email')
  const contactVia = oneOf(field(fd, 'contactVia', 20), values(CONTACT_VIA_OPTIONS))
  const locale = field(fd, 'locale', 5) === 'en' ? 'en' : 'fa'

  if (bad.length) return { ok: false, error: 'invalid', fields: bad }

  try {
    const payload = await getPayloadClient()
    const doc = await payload.create({
      collection: 'quote-requests',
      overrideAccess: true,
      data: {
        service: service.v as QuoteRequest['service'],
        serviceOther: service.other || undefined,
        origin: origin.v as QuoteRequest['origin'],
        originOther: origin.other || undefined,
        destination: destination.v as QuoteRequest['destination'],
        destinationOther: destination.other || undefined,
        cargo: cargo.v as QuoteRequest['cargo'],
        cargoOther: cargo.other || undefined,
        weight: weight ?? undefined,
        volume: field(fd, 'volume', 120) || undefined,
        timing: (timing.v ?? undefined) as QuoteRequest['timing'],
        timingOther: timing.other || undefined,
        details: field(fd, 'details', 2000) || undefined,
        name,
        company: field(fd, 'company', 120) || undefined,
        phone: phone!,
        email: email || undefined,
        contactVia: (contactVia ?? undefined) as QuoteRequest['contactVia'],
        locale,
        status: 'new',
      },
    })
    return { ok: true, trackingNumber: doc.trackingNumber ?? undefined }
  } catch (e) {
    console.error('[quote] save failed', e)
    return { ok: false, error: 'server' }
  }
}
