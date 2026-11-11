import { toLatinDigits } from './validate'

// ابزارهای شماره‌ی شاسی (VIN)

/** یکسان‌سازی: ارقام فارسی ← لاتین، حروف بزرگ، حذف فاصله و خط تیره و نقطه */
export const normalizeChassis = (raw: unknown): string =>
  toLatinDigits(String(raw ?? ''))
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')

/** ۶ کاراکتر آخر شاسی؛ همان چیزی که مشتری برای رهگیری وارد می‌کند */
export const chassisLast6 = (chassis: string): string => normalizeChassis(chassis).slice(-6)

/** ورودی جستجو معتبر است؟ دقیقاً ۶ حرف یا عدد لاتین (بعد از یکسان‌سازی) */
export const isValidTrackCode = (code: string): boolean => /^[A-Z0-9]{6}$/.test(code)

/** نمایش شاسی بدون لو دادن باقی شماره: •••••K12345 */
export const maskChassis = (chassis: string): string => `•••••${normalizeChassis(chassis).slice(-6)}`
