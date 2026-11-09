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
