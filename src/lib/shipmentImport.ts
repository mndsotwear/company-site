import ExcelJS from 'exceljs'
import type { Payload } from 'payload'
import { chassisLast6, normalizeChassis } from './chassis'
import { jalaliToDate } from './jalali'
import { toLatinDigits } from './validate'

// ورود فایل اکسل رهگیری خودروها
// ۱) سطر عنوان را پیدا می‌کند (هر جای ۱۰ سطر اول) و ستون‌ها را از روی اسمشان می‌شناسد
// ۲) هر سطر را بررسی می‌کند و بر اساس شماره‌ی شاسی کامل «اضافه یا به‌روز» می‌کند
// ۳) گزارش برمی‌گرداند: چند جدید، چند به‌روز، چند بدون تغییر، کدام سطرها خطا داشتند

export type ShipmentField =
  | 'chassis'
  | 'customerName'
  | 'customerPhone'
  | 'model'
  | 'color'
  | 'currentLocation'
  | 'status'
  | 'note'
  | 'date'

/** یکسان‌سازی اسم ستون: حذف فاصله و نیم‌فاصله، یکی کردن ی/ي و ک/ك و «ه‍ٔ» */
const normHeader = (s: string) =>
  toLatinDigits(s)
    .toLowerCase()
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[ۀة]/g, 'ه')
    .replace(/[ًٔ-ٟ]/g, '')
    .replace(/[\s‌‏‎_\-.:/()*]/g, '')

// اسم‌هایی که برای هر ستون پذیرفته می‌شود (بعد از یکسان‌سازی بالا)
// اگر اکسل کارفرما اسم دیگری دارد، فقط کافی است همین‌جا اضافه شود
const ALIASES: Record<ShipmentField, string[]> = {
  chassis: ['شمارهشاسی', 'شاسی', 'شمارهیشاسی', 'vin', 'chassis', 'chassisnumber', 'chassisno'],
  customerName: ['ناممشتری', 'مشتری', 'نام', 'نامونامخانوادگی', 'نامصاحبکالا', 'customer', 'customername', 'name'],
  customerPhone: ['شمارهتماسمشتری', 'شمارهتماس', 'تلفن', 'تلفنمشتری', 'موبایل', 'همراه', 'phone', 'mobile', 'customerphone'],
  model: ['مدل', 'مدلخودرو', 'نوعخودرو', 'خودرو', 'model'],
  color: ['رنگ', 'color', 'colour'],
  currentLocation: ['محلفعلی', 'موقعیت', 'موقعیتفعلی', 'مکان', 'مکانفعلی', 'محل', 'location', 'currentlocation'],
  status: ['وضعیت', 'status'],
  note: ['توضیح', 'توضیحات', 'note', 'notes', 'description'],
  date: ['تاریخ', 'تاریخبهروزرسانی', 'تاریخبروزرسانی', 'تاریخثبت', 'date', 'updated'],
}

const ALIAS_LOOKUP = new Map<string, ShipmentField>()
for (const [key, list] of Object.entries(ALIASES)) for (const a of list) ALIAS_LOOKUP.set(a, key as ShipmentField)

/** مقدار خانه‌ی اکسل به متن (یا تاریخ). exceljs برای فرمول، لینک و متن قالب‌دار شیء برمی‌گرداند */
function cellValue(v: unknown): string | Date | null {
  if (v === null || v === undefined) return null
  if (v instanceof Date) return v
  if (typeof v === 'object') {
    const o = v as Record<string, unknown>
    if (Array.isArray(o.richText)) return (o.richText as { text: string }[]).map((r) => r.text).join('')
    if ('result' in o) return cellValue(o.result)
    if ('text' in o) return String(o.text)
    return null
  }
  return String(v)
}

const text = (v: string | Date | null) => (v instanceof Date ? '' : (v ?? '').replace(/\s+/g, ' ').trim())

/** تاریخ از اکسل: خانه‌ی تاریخ، یا متن شمسی مثل ۱۴۰۵/۰۸/۱۹، یا متن میلادی */
function parseDate(v: string | Date | null): Date | null {
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v
  const s = toLatinDigits(text(v))
  if (!s) return null
  const m = s.match(/^(1[34]\d{2})[/\-.](\d{1,2})[/\-.](\d{1,2})/)
  if (m) return jalaliToDate(+m[1], +m[2], +m[3])
  const g = new Date(s)
  return Number.isNaN(g.getTime()) ? null : g
}

/** شماره تماس: ارقام لاتین؛ اگر اکسل صفر اول را خورده باشد (9123456789) برمی‌گرداند */
function normPhone(v: string | Date | null): string {
  const s = toLatinDigits(text(v)).replace(/[\s\-()]/g, '')
  return /^9\d{9}$/.test(s) ? `0${s}` : s
}

export type ImportRow = {
  row: number
  chassis: string
  customerName: string
  customerPhone: string
  model: string
  color: string
  currentLocation: string
  status: string
  note: string
  date: Date | null
}

export type ImportReport = {
  total: number
  created: number
  updated: number
  unchanged: number
  failed: number
  errors: { row: number; message: string }[]
  summary: string
}

/** خواندن اولین شیت اکسل و تبدیل سطرها به داده؛ خطای ساختاری (مثلاً نبودن ستون شاسی) را throw می‌کند */
export async function readShipmentSheet(buffer: Buffer): Promise<{ rows: ImportRow[]; errors: ImportReport['errors'] }> {
  const wb = new ExcelJS.Workbook()
  await wb.xlsx.load(buffer as unknown as ExcelJS.Buffer)
  const ws = wb.worksheets.find((w) => w.actualRowCount > 0)
  if (!ws) throw new Error('فایل اکسل خالی است.')

  // پیدا کردن سطر عنوان: اولین سطری (از ۱۰ سطر اول) که ستون شاسی دارد
  let headerRow = 0
  const columns = new Map<number, ShipmentField>()
  for (let r = 1; r <= Math.min(10, ws.rowCount) && !headerRow; r++) {
    const found = new Map<number, ShipmentField>()
    ws.getRow(r).eachCell((cell, col) => {
      const key = ALIAS_LOOKUP.get(normHeader(text(cellValue(cell.value))))
      if (key && ![...found.values()].includes(key)) found.set(col, key)
    })
    if ([...found.values()].includes('chassis')) {
      headerRow = r
      found.forEach((v, k) => columns.set(k, v))
    }
  }
  if (!headerRow) throw new Error('ستون «شماره شاسی» در ۱۰ سطر اول فایل پیدا نشد.')

  const rows: ImportRow[] = []
  const errors: ImportReport['errors'] = []
  const seen = new Map<string, number>()

  for (let r = headerRow + 1; r <= ws.rowCount; r++) {
    const raw: Partial<Record<ShipmentField, string | Date | null>> = {}
    ws.getRow(r).eachCell((cell, col) => {
      const key = columns.get(col)
      if (key) raw[key] = cellValue(cell.value)
    })
    const values = Object.values(raw).map((v) => (v instanceof Date ? 'd' : text(v ?? null)))
    if (!values.some(Boolean)) continue // سطر خالی

    const chassis = normalizeChassis(text(raw.chassis ?? null))
    if (!chassis) {
      errors.push({ row: r, message: 'شماره شاسی خالی است' })
      continue
    }
    if (chassis.length < 6) {
      errors.push({ row: r, message: `شماره شاسی «${chassis}» کمتر از ۶ کاراکتر است` })
      continue
    }
    if (seen.has(chassis)) {
      // شاسی تکراری در همین فایل: سطر پایین‌تر جایگزین قبلی می‌شود
      errors.push({ row: seen.get(chassis)!, message: `شاسی ${chassis} در سطر ${r.toLocaleString('fa-IR')} تکرار شده؛ سطر ${r.toLocaleString('fa-IR')} اعمال شد` })
      const i = rows.findIndex((x) => x.chassis === chassis)
      if (i >= 0) rows.splice(i, 1)
    }
    seen.set(chassis, r)
    rows.push({
      row: r,
      chassis,
      customerName: text(raw.customerName ?? null),
      customerPhone: normPhone(raw.customerPhone ?? null),
      model: text(raw.model ?? null),
      color: text(raw.color ?? null),
      currentLocation: text(raw.currentLocation ?? null),
      status: text(raw.status ?? null),
      note: text(raw.note ?? null),
      date: parseDate(raw.date ?? null),
    })
  }
  return { rows, errors }
}

const COMPARED = ['customerName', 'customerPhone', 'model', 'color', 'currentLocation', 'status', 'note'] as const

/** اضافه یا به‌روز کردن سطرها در کالکشن shipments */
export async function importShipments(payload: Payload, buffer: Buffer): Promise<ImportReport> {
  const { rows, errors } = await readShipmentSheet(buffer)
  let created = 0
  let updated = 0
  let unchanged = 0
  // سطرهای تکراری خطای واقعی نیستند؛ فقط هشدارند
  const readFailed = errors.filter((e) => !e.message.includes('تکرار')).length
  let failed = readFailed

  // گرفتن رکوردهای موجود به‌صورت دسته‌ای (۲۰۰تایی) تا برای هر سطر یک کوئری جدا نزنیم
  const existing = new Map<string, { id: number } & Record<string, unknown>>()
  for (let i = 0; i < rows.length; i += 200) {
    const chunk = rows.slice(i, i + 200).map((r) => r.chassis)
    const res = await payload.find({
      collection: 'shipments',
      where: { chassis: { in: chunk } },
      pagination: false,
      depth: 0,
      overrideAccess: true,
    })
    for (const d of res.docs) existing.set(d.chassis, d as unknown as { id: number } & Record<string, unknown>)
  }

  for (const r of rows) {
    const data = {
      chassis: r.chassis,
      chassisLast6: chassisLast6(r.chassis),
      customerName: r.customerName || undefined,
      customerPhone: r.customerPhone || undefined,
      model: r.model || undefined,
      color: r.color || undefined,
      currentLocation: r.currentLocation || undefined,
      status: r.status || undefined,
      note: r.note || undefined,
    }
    // تاریخ ستون «تاریخ» (اگر بود) به هوک کالکشن می‌رود تا در تاریخچه ثبت شود
    const context = { eventDate: r.date?.toISOString() }
    try {
      const old = existing.get(r.chassis)
      if (!old) {
        await payload.create({ collection: 'shipments', data, overrideAccess: true, context })
        created++
      } else if (COMPARED.every((k) => (old[k] ?? '') === (data[k] ?? ''))) {
        unchanged++
      } else {
        await payload.update({ collection: 'shipments', id: old.id, data, overrideAccess: true, context })
        updated++
      }
    } catch (e) {
      failed++
      errors.push({ row: r.row, message: e instanceof Error ? e.message.slice(0, 200) : 'خطای ذخیره' })
    }
  }

  errors.sort((a, b) => a.row - b.row)
  const total = rows.length + readFailed
  const fa = (n: number) => n.toLocaleString('fa-IR')
  const badRows = errors.filter((e) => !e.message.includes('تکرار')).map((e) => fa(e.row))
  const summary =
    `${fa(total)} سطر: ${fa(created)} جدید، ${fa(updated)} به‌روز، ${fa(unchanged)} بدون تغییر، ${fa(failed)} خطا` +
    (badRows.length ? ` (سطرهای ${badRows.slice(0, 15).join('، ')}${badRows.length > 15 ? '، …' : ''})` : '')

  return { total, created, updated, unchanged, failed, errors, summary }
}
