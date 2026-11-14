// تم‌های رنگی سایت: ۴ پالت آماده + «رنگ دلخواه» که از روی یک رنگ ساخته می‌شود.
// رنگ‌های پالت‌های آماده در styles/globals.css تعریف شده‌اند؛ اینجا فقط نام و نمونه‌ی رنگ برای انتخاب‌گر است.

export const PALETTES = [
  { id: 'ocean', label: { fa: 'اقیانوس عمیق', en: 'Deep ocean' }, swatch: ['#22d3ee', '#818cf8'] },
  { id: 'midnight', label: { fa: 'نیمه‌شب و طلا', en: 'Midnight & gold' }, swatch: ['#1e3a8a', '#f5c26b'] },
  { id: 'classic', label: { fa: 'شاهین کلاسیک', en: 'Shahin classic' }, swatch: ['#079fe5', '#f57c00'] },
  { id: 'coral', label: { fa: 'غروب مرجانی', en: 'Coral sunset' }, swatch: ['#fb7185', '#fbbf24'] },
] as const

export type PaletteId = (typeof PALETTES)[number]['id'] | 'custom'
export const PALETTE_IDS = ['ocean', 'midnight', 'classic', 'coral', 'custom'] as const
export const STORAGE = { palette: 'shahin-palette', custom: 'shahin-custom' }

/**
 * ساخت متغیرهای CSS حالت روشن (--cl-*) و تیره (--cd-*) از یک رنگ هگز.
 * عمداً بدون import و با کد ساده نوشته شده، چون متن همین تابع در اسکریپت ابتدای صفحه هم اجرا می‌شود
 * (تا قبل از نمایش صفحه رنگ درست اعمال شود و صفحه چشمک نزند).
 */
export function customPaletteVars(hex: string): Record<string, string> {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '')
  const n = parseInt(m ? m[1] : '22d3ee', 16)
  const r = ((n >> 16) & 255) / 255
  const g = ((n >> 8) & 255) / 255
  const b = (n & 255) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4
    h *= 60
  }
  const S = Math.round(Math.max(s * 100, 55))
  const H = Math.round(h)
  const A = (H + 45) % 360
  const c = (hh: number, ss: number, ll: number) => 'hsl(' + hh + ' ' + ss + '% ' + ll + '%)'
  return {
    '--cl-bg': c(H, 40, 97),
    '--cl-surface': '#ffffff',
    '--cl-surface-2': c(H, 35, 93),
    '--cl-text': c(H, 45, 9),
    '--cl-muted': c(H, 12, 40),
    '--cl-primary': c(H, S, 40),
    '--cl-accent': c(A, 80, 45),
    '--cl-border': c(H, 25, 86),
    '--cl-deep': c(H, 50, 5),
    '--cd-bg': c(H, 45, 5),
    '--cd-surface': c(H, 35, 9),
    '--cd-surface-2': c(H, 30, 13),
    '--cd-text': c(H, 30, 94),
    '--cd-muted': c(H, 15, 62),
    '--cd-primary': c(H, S, 62),
    '--cd-accent': c(A, 85, 68),
    '--cd-border': c(H, 25, 17),
    '--cd-deep': c(H, 50, 4),
  }
}

/** اعمال پالت روی <html> (سمت مرورگر) */
export function applyPalette(id: PaletteId, custom?: string) {
  const el = document.documentElement
  el.setAttribute('data-palette', id)
  if (id === 'custom' && custom) {
    const vars = customPaletteVars(custom)
    for (const k in vars) el.style.setProperty(k, vars[k])
  }
}

/**
 * اسکریپت کوچک ابتدای صفحه: انتخاب قبلی بازدیدکننده را قبل از نمایش اعمال می‌کند؛
 * اگر انتخابی نکرده باشد، پیش‌فرض ادمین (که سرور روی <html> نوشته) می‌ماند.
 */
export const paletteBootScript = `(function(){try{var gen=${customPaletteVars.toString()};var d=document.documentElement;var p=localStorage.getItem('${STORAGE.palette}');var c=localStorage.getItem('${STORAGE.custom}')||d.getAttribute('data-custom')||'';if(p)d.setAttribute('data-palette',p);if(d.getAttribute('data-palette')==='custom'&&c){var v=gen(c);for(var k in v)d.style.setProperty(k,v[k]);}}catch(e){}})()`
