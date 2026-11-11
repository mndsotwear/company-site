import { headers } from 'next/headers'

// محافظت ساده‌ی فرم‌ها در برابر ربات و ارسال پشت‌سرهم:
// ۱) فیلد مخفی (honeypot) که انسان پر نمی‌کند
// ۲) حداقل زمان پر کردن فرم
// ۳) محدودیت تعداد ارسال برای هر IP در یک بازه‌ی زمانی

const hits = new Map<string, number[]>()

export async function clientIp(): Promise<string> {
  const h = await headers()
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'local'
}

/** true یعنی اجازه هست؛ false یعنی بیش از حد مجاز */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const list = (hits.get(key) || []).filter((t) => now - t < windowMs)
  if (list.length >= max) {
    hits.set(key, list)
    return false
  }
  list.push(now)
  hits.set(key, list)
  // پاک‌سازی دوره‌ای تا حافظه پر نشود
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k)
  return true
}

/** بررسی honeypot و زمان: true یعنی احتمالاً ربات است */
export function looksLikeBot(fd: FormData, minMs = 3000): boolean {
  if (String(fd.get('website') ?? '').trim()) return true
  const started = Number(fd.get('_t') ?? 0)
  return !started || Date.now() - started < minMs
}

/** آیا این کلید از سقف مجاز گذشته؟ (بدون ثبت یک بار جدید) */
export function isOverLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  return (hits.get(key) || []).filter((t) => now - t < windowMs).length >= max
}
