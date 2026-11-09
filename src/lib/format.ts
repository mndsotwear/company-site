/** نمایش عدد با ارقام فارسی یا لاتین بر اساس زبان صفحه */
export const formatNumber = (n: number, locale: string, opts?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', opts).format(n)

/** تبدیل ارقام لاتین داخل یک متن به فارسی (برای متن‌هایی مثل «۲۰ فوت») */
export const toFaDigits = (s: string) => s.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])
