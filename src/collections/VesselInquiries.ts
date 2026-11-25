import type { CollectionConfig } from 'payload'
import { adminOnly, loggedIn } from '../access/roles'
import { GROUPS } from '../lib/adminGroups'
import { CONTACT_VIA_OPTIONS, labelOf, toPayloadOptions } from '../lib/options'
import { emailTable, sendMail, sendSms } from '../lib/notify'
import { sendTelegram } from '../lib/telegram'
import { isIranMobile } from '../lib/validate'

// درخواست‌های خرید کشتی که مشتری از صفحه‌ی هر کشتی می‌فرستد.
// ثبت از سایت در فاز ۴ از طریق سرور انجام می‌شود (نه مستقیم از API عمومی).
export const VesselInquiries: CollectionConfig = {
  slug: 'vessel-inquiries',
  labels: {
    singular: { fa: 'درخواست خرید کشتی', en: 'Vessel inquiry' },
    plural: { fa: 'درخواست‌های خرید کشتی', en: 'Vessel inquiries' },
  },
  admin: {
    group: GROUPS.vessels,
    useAsTitle: 'name',
    defaultColumns: ['name', 'vessel', 'phone', 'status', 'createdAt'],
  },
  defaultSort: '-createdAt',
  access: { read: loggedIn, create: loggedIn, update: loggedIn, delete: adminOnly },
  hooks: {
    afterChange: [
      // اطلاع‌رسانی بعد از ثبت: پیامک و ایمیل به شرکت + پیامک تأیید به مشتری
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return doc
        const settings = await req.payload.findGlobal({ slug: 'site-settings', depth: 0, req })
        const vesselId = typeof doc.vessel === 'object' ? doc.vessel.id : doc.vessel
        const vessel = await req.payload.findByID({ collection: 'vessels', id: vesselId, depth: 0, req }).catch(() => null)
        const vesselName = vessel?.name ?? `#${vesselId}`

        // اجرای ناهمزمان تا پاسخ فرم منتظر پیامک و ایمیل نماند
        void Promise.all([
          sendTelegram(req.payload, settings.telegramChatId, `درخواست خرید کشتی: ${vesselName}`, [
            ['نام', doc.name],
            ['شرکت', doc.company],
            ['تلفن', doc.phone],
            ['پیام', (doc.message ?? '').slice(0, 400)],
          ]),
          sendSms(req.payload, settings.notifyPhone, `درخواست خرید کشتی: ${vesselName}\n${doc.name} ${doc.phone}`),
          isIranMobile(doc.phone)
            ? sendSms(
                req.payload,
                doc.phone,
                `شاهین مارین: درخواست شما برای کشتی ${vesselName} ثبت شد. کارشناسان ما به‌زودی با شما تماس می‌گیرند.`,
              )
            : Promise.resolve(),
          sendMail(
            req.payload,
            settings.notifyEmail,
            `درخواست خرید کشتی: ${vesselName}`,
            emailTable(`درخواست خرید کشتی ${vesselName}`, [
              ['کشتی', vesselName],
              ['نام', doc.name],
              ['شرکت', doc.company],
              ['تلفن', doc.phone],
              ['ایمیل', doc.email],
              ['روش تماس', labelOf(CONTACT_VIA_OPTIONS, doc.contactVia)],
              ['پیام', doc.message],
            ]),
          ),
        ])
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'vessel',
      type: 'relationship',
      relationTo: 'vessels',
      label: { fa: 'کشتی', en: 'Vessel' },
      required: true,
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', label: { fa: 'نام و نام خانوادگی', en: 'Full name' }, required: true },
        { name: 'company', type: 'text', label: { fa: 'شرکت', en: 'Company' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', label: { fa: 'شماره تماس', en: 'Phone' }, required: true },
        { name: 'email', type: 'email', label: { fa: 'ایمیل', en: 'Email' } },
      ],
    },
    {
      name: 'contactVia',
      type: 'select',
      label: { fa: 'روش تماس ترجیحی', en: 'Preferred contact' },
      options: toPayloadOptions(CONTACT_VIA_OPTIONS),
    },
    { name: 'message', type: 'textarea', label: { fa: 'پیام', en: 'Message' } },
    {
      name: 'status',
      type: 'select',
      label: { fa: 'وضعیت پیگیری', en: 'Status' },
      required: true,
      defaultValue: 'new',
      admin: { position: 'sidebar' },
      options: [
        { value: 'new', label: { fa: 'جدید', en: 'New' } },
        { value: 'contacted', label: { fa: 'تماس گرفته شد', en: 'Contacted' } },
        { value: 'negotiating', label: { fa: 'در حال مذاکره', en: 'Negotiating' } },
        { value: 'closed', label: { fa: 'بسته شد', en: 'Closed' } },
      ],
    },
    {
      name: 'internalNote',
      type: 'textarea',
      label: { fa: 'یادداشت داخلی (فقط در پنل)', en: 'Internal note' },
      admin: { position: 'sidebar' },
    },
  ],
}
