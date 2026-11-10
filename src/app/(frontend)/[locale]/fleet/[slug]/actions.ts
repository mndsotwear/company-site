'use server'

import { getPayloadClient } from '@/lib/payload'
import { clientIp, looksLikeBot, rateLimit } from '@/lib/antiSpam'
import { field, isEmail, normalizePhone, oneOf } from '@/lib/validate'
import { CONTACT_VIA_OPTIONS } from '@/lib/options'
import type { VesselInquiry } from '@/payload-types'

export type InquiryState = {
  ok: boolean
  /** کلید پیام خطا در messages (inquiry.errors.*) */
  error?: 'invalid' | 'rate' | 'server' | 'sold'
  fields?: string[]
}

// دریافت فرم درخواست خرید کشتی، بررسی و ذخیره در پنل (اطلاع‌رسانی در هوک کالکشن)
export async function submitInquiry(_prev: InquiryState, fd: FormData): Promise<InquiryState> {
  // ربات‌ها پاسخ «موفق» جعلی می‌گیرند تا تلاش دوباره نکنند
  if (looksLikeBot(fd)) return { ok: true }

  const ip = await clientIp()
  if (!rateLimit(`inquiry:${ip}`, 5, 10 * 60 * 1000)) return { ok: false, error: 'rate' }

  const bad: string[] = []
  const vesselId = Number(field(fd, 'vessel', 12))
  const name = field(fd, 'name', 120)
  if (name.length < 2) bad.push('name')
  const phone = normalizePhone(field(fd, 'phone', 30))
  if (!phone) bad.push('phone')
  const email = field(fd, 'email', 120)
  if (email && !isEmail(email)) bad.push('email')
  const contactVia = oneOf(field(fd, 'contactVia', 20), CONTACT_VIA_OPTIONS.map((o) => o.value))
  if (bad.length) return { ok: false, error: 'invalid', fields: bad }

  try {
    const payload = await getPayloadClient()
    // فقط کشتی واقعی و فروخته‌نشده
    const vessel = Number.isInteger(vesselId)
      ? await payload.findByID({ collection: 'vessels', id: vesselId, depth: 0 }).catch(() => null)
      : null
    if (!vessel) return { ok: false, error: 'server' }
    if (vessel.status === 'sold') return { ok: false, error: 'sold' }

    await payload.create({
      collection: 'vessel-inquiries',
      overrideAccess: true,
      data: {
        vessel: vessel.id,
        name,
        company: field(fd, 'company', 120) || undefined,
        phone: phone!,
        email: email || undefined,
        contactVia: (contactVia ?? undefined) as VesselInquiry['contactVia'],
        message: field(fd, 'message', 2000) || undefined,
        status: 'new',
      },
    })
    return { ok: true }
  } catch (e) {
    console.error('[inquiry] save failed', e)
    return { ok: false, error: 'server' }
  }
}
