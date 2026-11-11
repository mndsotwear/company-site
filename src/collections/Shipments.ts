import type { CollectionConfig } from 'payload'
import { adminOnly, loggedIn } from '../access/roles'
import { GROUPS } from '../lib/adminGroups'
import { chassisLast6, normalizeChassis } from '../lib/chassis'
import { sendSms } from '../lib/notify'
import { isIranMobile } from '../lib/validate'

// خودروها/محموله‌هایی که مشتری با ۶ رقم آخر شاسی رهگیری می‌کند.
// معمولاً از «ورود اکسل» پر می‌شود، ولی دستی هم قابل افزودن و ویرایش است.
// این کالکشن از API عمومی خوانده نمی‌شود؛ صفحه‌ی رهگیری فقط فیلدهای بی‌خطر را از سرور می‌گیرد.
export const Shipments: CollectionConfig = {
  slug: 'shipments',
  labels: {
    singular: { fa: 'خودرو (رهگیری)', en: 'Shipment' },
    plural: { fa: 'خودروها (رهگیری)', en: 'Shipments' },
  },
  admin: {
    group: GROUPS.tracking,
    useAsTitle: 'chassis',
    defaultColumns: ['chassis', 'model', 'customerName', 'status', 'currentLocation', 'updatedAt'],
    listSearchableFields: ['chassis', 'chassisLast6', 'customerName', 'customerPhone', 'model'],
    description: {
      fa: 'هر بار «وضعیت» یا «محل فعلی» عوض شود، خودکار یک ردیف به تاریخچه اضافه می‌شود و مشتری آن را می‌بیند.',
      en: 'Each change of status or location adds a history entry that the customer can see.',
    },
  },
  defaultSort: '-updatedAt',
  access: { read: loggedIn, create: loggedIn, update: loggedIn, delete: adminOnly },
  hooks: {
    afterChange: [
      // پیامک به مشتری وقتی وضعیت عوض شد (اگر در «تنظیمات سایت ← رهگیری» روشن باشد)
      async ({ doc, previousDoc, operation, req }) => {
        if (operation !== 'update' || !doc.status || doc.status === previousDoc?.status) return doc
        if (!doc.customerPhone || !isIranMobile(doc.customerPhone)) return doc
        const settings = await req.payload.findGlobal({ slug: 'site-settings', depth: 0, req })
        if (!settings.trackingSms) return doc
        const site = (process.env.NEXT_PUBLIC_SITE_URL || 'https://shahinmarine.com').replace(/^https?:\/\//, '')
        const where = doc.currentLocation ? ` - محل: ${doc.currentLocation}` : ''
        void sendSms(
          req.payload,
          doc.customerPhone,
          `شاهین مارین: وضعیت خودروی شما (${doc.model || 'شاسی'} ...${doc.chassisLast6}): ${doc.status}${where}\nپیگیری: ${site}/fa/tracking?code=${doc.chassisLast6}`,
        )
        return doc
      },
    ],
    beforeChange: [
      // ثبت خودکار تاریخچه وقتی وضعیت یا محل تغییر می‌کند
      ({ data, originalDoc, operation, context }) => {
        if (data.chassis) data.chassisLast6 = chassisLast6(data.chassis)
        const status = data.status ?? originalDoc?.status
        const location = data.currentLocation ?? originalDoc?.currentLocation
        const changed =
          operation === 'create' || status !== originalDoc?.status || location !== originalDoc?.currentLocation
        if (!changed || (!status && !location)) return data

        const history = Array.isArray(data.history) ? data.history : (originalDoc?.history ?? [])
        const eventDate = typeof context?.eventDate === 'string' ? context.eventDate : new Date().toISOString()
        data.history = [...history, { date: eventDate, status, location, note: data.note ?? originalDoc?.note }]
        return data
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'chassis',
          type: 'text',
          label: { fa: 'شماره شاسی (کامل)', en: 'Chassis number (full)' },
          required: true,
          unique: true,
          index: true,
          hooks: { beforeValidate: [({ value }) => (value ? normalizeChassis(value) : value)] },
          admin: { description: { fa: 'فاصله و خط تیره خودکار حذف و حروف بزرگ می‌شوند.', en: 'Spaces/dashes removed, uppercased.' } },
        },
        {
          name: 'chassisLast6',
          type: 'text',
          label: { fa: '۶ رقم آخر', en: 'Last 6' },
          index: true,
          admin: { readOnly: true, description: { fa: 'خودکار ساخته می‌شود.', en: 'Generated automatically.' } },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'model', type: 'text', label: { fa: 'مدل', en: 'Model' } },
        { name: 'color', type: 'text', label: { fa: 'رنگ', en: 'Color' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'status', type: 'text', label: { fa: 'وضعیت', en: 'Status' } },
        { name: 'currentLocation', type: 'text', label: { fa: 'محل فعلی', en: 'Current location' } },
      ],
    },
    {
      name: 'note',
      type: 'textarea',
      label: { fa: 'توضیح برای مشتری', en: 'Note for customer' },
      admin: { description: { fa: 'این متن در صفحه‌ی رهگیری به مشتری نشان داده می‌شود.', en: 'Shown on the tracking page.' } },
    },
    {
      type: 'collapsible',
      label: { fa: 'اطلاعات مشتری (فقط در پنل، هرگز در سایت نمایش داده نمی‌شود)', en: 'Customer (admin only, never shown on the site)' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'customerName', type: 'text', label: { fa: 'نام مشتری', en: 'Customer name' } },
            { name: 'customerPhone', type: 'text', label: { fa: 'شماره تماس مشتری', en: 'Customer phone' } },
          ],
        },
      ],
    },
    {
      name: 'history',
      type: 'array',
      label: { fa: 'تاریخچه', en: 'History' },
      labels: { singular: { fa: 'رویداد', en: 'Event' }, plural: { fa: 'رویدادها', en: 'Events' } },
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'date', type: 'date', label: { fa: 'تاریخ', en: 'Date' }, required: true },
            { name: 'status', type: 'text', label: { fa: 'وضعیت', en: 'Status' } },
            { name: 'location', type: 'text', label: { fa: 'محل', en: 'Location' } },
          ],
        },
        { name: 'note', type: 'text', label: { fa: 'توضیح', en: 'Note' } },
      ],
    },
  ],
}
