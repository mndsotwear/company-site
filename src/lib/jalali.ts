/** سال شمسی (مثلاً 1405) به وقت تهران */
export function jalaliYear(date: Date = new Date()): number {
  const year = new Intl.DateTimeFormat('en-US-u-ca-persian', {
    year: 'numeric',
    timeZone: 'Asia/Tehran',
  })
    .formatToParts(date)
    .find((p) => p.type === 'year')?.value
  return Number(year)
}

/** تبدیل تاریخ شمسی به میلادی (الگوریتم استاندارد jalaali) — خروجی: Date در ظهر به وقت UTC */
export function jalaliToDate(jy: number, jm: number, jd: number): Date {
  jy += 1595
  let days = -355668 + 365 * jy + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4) + jd + (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186)
  let gy = 400 * Math.floor(days / 146097)
  days %= 146097
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524)
    days %= 36524
    if (days >= 365) days++
  }
  gy += 4 * Math.floor(days / 1461)
  days %= 1461
  if (days > 365) {
    gy += Math.floor((days - 1) / 365)
    days = (days - 1) % 365
  }
  let gd = days + 1
  const leap = (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0
  const monthDays = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  let gm = 0
  while (gm < 12 && gd > monthDays[gm]) gd -= monthDays[gm++]
  return new Date(Date.UTC(gy, gm, gd, 12))
}
