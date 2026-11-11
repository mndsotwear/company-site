import ExcelJS from 'exceljs'
import { getPayloadClient } from '@/lib/payload'

// خروجی اکسل از درخواست‌ها و خودروها برای گزارش‌گیری (فقط برای کاربران واردشده به پنل)
export const dynamic = 'force-dynamic'

type Col = { key: string; header: string; width?: number }
const COLUMNS: Record<string, { title: string; cols: Col[] }> = {
  'quote-requests': {
    title: 'استعلام‌ها',
    cols: [
      { key: 'trackingNumber', header: 'شماره' },
      { key: 'createdAt', header: 'تاریخ' },
      { key: 'status', header: 'وضعیت' },
      { key: 'name', header: 'نام' },
      { key: 'company', header: 'شرکت' },
      { key: 'phone', header: 'تلفن' },
      { key: 'email', header: 'ایمیل' },
      { key: 'service', header: 'خدمت' },
      { key: 'origin', header: 'مبدأ' },
      { key: 'originOther', header: 'مبدأ (سایر)' },
      { key: 'destination', header: 'مقصد' },
      { key: 'destinationOther', header: 'مقصد (سایر)' },
      { key: 'cargo', header: 'بار' },
      { key: 'cargoOther', header: 'بار (سایر)' },
      { key: 'weight', header: 'وزن (تن)' },
      { key: 'volume', header: 'حجم/تعداد' },
      { key: 'details', header: 'توضیحات', width: 50 },
    ],
  },
  'vessel-inquiries': {
    title: 'درخواست خرید کشتی',
    cols: [
      { key: 'createdAt', header: 'تاریخ' },
      { key: 'status', header: 'وضعیت' },
      { key: 'vessel', header: 'کشتی' },
      { key: 'name', header: 'نام' },
      { key: 'company', header: 'شرکت' },
      { key: 'phone', header: 'تلفن' },
      { key: 'email', header: 'ایمیل' },
      { key: 'message', header: 'پیام', width: 50 },
    ],
  },
  'contact-messages': {
    title: 'پیام‌های تماس',
    cols: [
      { key: 'createdAt', header: 'تاریخ' },
      { key: 'status', header: 'وضعیت' },
      { key: 'name', header: 'نام' },
      { key: 'phone', header: 'تلفن' },
      { key: 'email', header: 'ایمیل' },
      { key: 'subject', header: 'موضوع' },
      { key: 'message', header: 'پیام', width: 50 },
    ],
  },
  shipments: {
    title: 'رهگیری',
    cols: [
      { key: 'chassis', header: 'شماره شاسی' },
      { key: 'customerName', header: 'نام مشتری' },
      { key: 'customerPhone', header: 'شماره تماس مشتری' },
      { key: 'model', header: 'مدل' },
      { key: 'color', header: 'رنگ' },
      { key: 'currentLocation', header: 'محل فعلی' },
      { key: 'status', header: 'وضعیت' },
      { key: 'note', header: 'توضیح', width: 40 },
      { key: 'updatedAt', header: 'آخرین تغییر' },
    ],
  },
}

const faDate = (iso: string) =>
  new Intl.DateTimeFormat('fa-IR-u-nu-latn', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Tehran' }).format(new Date(iso))

export async function GET(req: Request, { params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params
  const def = COLUMNS[collection]
  if (!def) return new Response('Not found', { status: 404 })

  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { docs } = await payload.find({
    collection: collection as 'quote-requests',
    pagination: false,
    depth: 1,
    sort: '-createdAt',
    overrideAccess: false,
    user,
  })

  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet(def.title, { views: [{ rightToLeft: true, state: 'frozen', ySplit: 1 }] })
  ws.columns = def.cols.map((c) => ({ header: c.header, key: c.key, width: c.width ?? 18 }))
  ws.getRow(1).font = { bold: true }
  for (const d of docs as unknown as Record<string, unknown>[]) {
    const row: Record<string, unknown> = {}
    for (const c of def.cols) {
      let v = d[c.key]
      if (v && typeof v === 'object' && 'name' in (v as object)) v = (v as { name: string }).name // رابطه (کشتی)
      if ((c.key === 'createdAt' || c.key === 'updatedAt') && typeof v === 'string') v = faDate(v)
      row[c.key] = v ?? ''
    }
    ws.addRow(row)
  }
  const buf = await wb.xlsx.writeBuffer()
  const stamp = new Date().toISOString().slice(0, 10)
  return new Response(buf as ArrayBuffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${collection}-${stamp}.xlsx"`,
      'Cache-Control': 'no-store',
    },
  })
}
