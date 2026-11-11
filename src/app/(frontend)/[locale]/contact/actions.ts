'use server'

import { getPayloadClient } from '@/lib/payload'
import { clientIp, looksLikeBot, rateLimit } from '@/lib/antiSpam'
import { field, isEmail, normalizePhone } from '@/lib/validate'

export type ContactState = {
  ok: boolean
  error?: 'invalid' | 'rate' | 'server'
  fields?: string[]
}

// دریافت فرم «تماس با ما»؛ حداقل یکی از تلفن یا ایمیل لازم است تا بشود جواب داد
export async function submitContact(_prev: ContactState, fd: FormData): Promise<ContactState> {
  if (looksLikeBot(fd)) return { ok: true }
  const ip = await clientIp()
  if (!rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000)) return { ok: false, error: 'rate' }

  const bad: string[] = []
  const name = field(fd, 'name', 120)
  if (name.length < 2) bad.push('name')
  const rawPhone = field(fd, 'phone', 30)
  const phone = rawPhone ? normalizePhone(rawPhone) : null
  if (rawPhone && !phone) bad.push('phone')
  const email = field(fd, 'email', 120)
  if (email && !isEmail(email)) bad.push('email')
  if (!rawPhone && !email) bad.push('phone', 'email')
  const message = field(fd, 'message', 3000)
  if (message.length < 5) bad.push('message')
  if (bad.length) return { ok: false, error: 'invalid', fields: bad }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'contact-messages',
      overrideAccess: true,
      data: { name, phone: phone || undefined, email: email || undefined, subject: field(fd, 'subject', 160) || undefined, message, status: 'new' },
    })
    return { ok: true }
  } catch (e) {
    console.error('[contact] save failed', e)
    return { ok: false, error: 'server' }
  }
}
