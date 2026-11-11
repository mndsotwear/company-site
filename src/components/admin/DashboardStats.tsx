import type { Payload } from 'payload'

// کارت‌های خلاصه بالای داشبورد پنل: درخواست‌های جدید، خودروهای رهگیری، آخرین ورود اکسل + دانلود اکسل
type Props = { payload: Payload; i18n?: { language?: string } }

export async function DashboardStats({ payload, i18n }: Props) {
  const fa = (i18n?.language ?? 'fa') === 'fa'
  const count = async (collection: 'quote-requests' | 'vessel-inquiries' | 'contact-messages' | 'shipments', where?: object) =>
    (await payload.count({ collection, where: where as never, overrideAccess: true })).totalDocs
  const [quotes, inquiries, messages, shipments, lastImport] = await Promise.all([
    count('quote-requests', { status: { equals: 'new' } }),
    count('vessel-inquiries', { status: { equals: 'new' } }),
    count('contact-messages', { status: { equals: 'new' } }),
    count('shipments'),
    payload.find({ collection: 'shipment-imports', limit: 1, sort: '-createdAt', depth: 0, overrideAccess: true }),
  ])
  const n = (x: number) => x.toLocaleString(fa ? 'fa-IR' : 'en-US')
  const last = lastImport.docs[0]

  const cards = [
    { label: fa ? 'استعلام قیمت جدید' : 'New quote requests', value: n(quotes), href: '/admin/collections/quote-requests?where[status][equals]=new', exportKey: 'quote-requests' },
    { label: fa ? 'درخواست خرید کشتی جدید' : 'New vessel inquiries', value: n(inquiries), href: '/admin/collections/vessel-inquiries?where[status][equals]=new', exportKey: 'vessel-inquiries' },
    { label: fa ? 'پیام تماس جدید' : 'New contact messages', value: n(messages), href: '/admin/collections/contact-messages?where[status][equals]=new', exportKey: 'contact-messages' },
    { label: fa ? 'خودروهای رهگیری' : 'Tracked vehicles', value: n(shipments), href: '/admin/collections/shipments', exportKey: 'shipments' },
  ]

  return (
    <div style={{ marginBottom: 'calc(var(--base) * 2)' }}>
      <div style={{ display: 'grid', gap: 'var(--base)', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {cards.map((c) => (
          <div key={c.label} style={{ border: '1px solid var(--theme-elevation-150)', borderRadius: 12, padding: 'calc(var(--base) * 1)', background: 'var(--theme-elevation-50)' }}>
            <a href={c.href} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ fontSize: 13, opacity: 0.7 }}>{c.label}</div>
              <div style={{ fontSize: 32, fontWeight: 800, marginTop: 4 }}>{c.value}</div>
            </a>
            <a href={`/api/export/${c.exportKey}`} style={{ fontSize: 12, marginTop: 8, display: 'inline-block' }}>
              {fa ? 'دانلود اکسل همه' : 'Download all as Excel'}
            </a>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 13, opacity: 0.7, marginTop: 'var(--base)' }}>
        {fa ? 'آخرین ورود اکسل رهگیری: ' : 'Last tracking import: '}
        {last ? `${new Date(last.createdAt).toLocaleString(fa ? 'fa-IR' : 'en-GB', { timeZone: 'Asia/Tehran' })} — ${last.summary ?? ''}` : fa ? 'هنوز فایلی وارد نشده' : 'none yet'}
      </p>
    </div>
  )
}
