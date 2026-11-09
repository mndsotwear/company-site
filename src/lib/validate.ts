// ابزارهای بررسی ورودی فرم‌ها (سمت سرور)

/** تبدیل ارقام فارسی و عربی به لاتین */
export const toLatinDigits = (s: string) =>
  s.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))

/** شماره‌ی تلفن: حذف فاصله و خط تیره؛ برگرداندن null اگر معتبر نباشد */
export function normalizePhone(raw: string): string | null {
  const s = toLatinDigits(raw).replace(/[\s\-()]/g, '')
  if (/^09\d{9}$/.test(s)) return s
  if (/^\+989\d{9}$/.test(s)) return `0${s.slice(3)}`
  if (/^00989\d{9}$/.test(s)) return `0${s.slice(4)}`
  if (/^\+\d{8,15}$/.test(s)) return s // شماره‌ی خارجی (عراق، کویت، امارات، ...)
  if (/^0\d{9,11}$/.test(s)) return s // تلفن ثابت
  return null
}

/** آیا موبایل ایرانی است؟ (برای ارسال پیامک تأیید) */
export const isIranMobile = (phone: string) => /^09\d{9}$/.test(phone)

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)

/** خواندن یک فیلد متنی از FormData با حداکثر طول */
export const field = (fd: FormData, name: string, max = 500) => String(fd.get(name) ?? '').trim().slice(0, max)

/** فقط اگر مقدار جزو گزینه‌های مجاز باشد */
export const oneOf = <T extends string>(value: string, allowed: readonly T[]): T | null =>
  (allowed as readonly string[]).includes(value) ? (value as T) : null
