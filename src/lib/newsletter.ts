'use server'

import { getLocale } from 'next-intl/server'
import { getPayloadClient } from './payload'
import { clientIp, looksLikeBot, rateLimit } from './antiSpam'
import { field, isEmail } from './validate'

export type NewsletterState = { ok: boolean; error?: 'invalid' | 'rate' }

// عضویت در خبرنامه از فوتر؛ ایمیل تکراری هم «موفق» حساب می‌شود (بدون لو دادن عضویت دیگران)
export async function subscribe(_prev: NewsletterState, fd: FormData): Promise<NewsletterState> {
  if (looksLikeBot(fd, 1500)) return { ok: true }
  const ip = await clientIp()
  if (!rateLimit(`news:${ip}`, 5, 10 * 60 * 1000)) return { ok: false, error: 'rate' }
  const email = field(fd, 'email', 120).toLowerCase()
  if (!isEmail(email)) return { ok: false, error: 'invalid' }
  try {
    const payload = await getPayloadClient()
    const exists = await payload.count({ collection: 'subscribers', where: { email: { equals: email } }, overrideAccess: true })
    if (!exists.totalDocs) {
      await payload.create({ collection: 'subscribers', data: { email, locale: await getLocale() }, overrideAccess: true })
    }
    return { ok: true }
  } catch (e) {
    console.error('[newsletter]', e)
    return { ok: false, error: 'rate' }
  }
}
