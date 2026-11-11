import type { CollectionConfig } from 'payload'
import { adminOnly, loggedIn } from '../access/roles'
import { GROUPS } from '../lib/adminGroups'
import { emailTable, sendMail, sendSms } from '../lib/notify'

// پیام‌هایی که از فرم «تماس با ما» می‌رسد
export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: {
    singular: { fa: 'پیام تماس', en: 'Contact message' },
    plural: { fa: 'پیام‌های تماس', en: 'Contact messages' },
  },
  admin: {
    group: GROUPS.requests,
    useAsTitle: 'name',
    defaultColumns: ['name', 'subject', 'phone', 'status', 'createdAt'],
    listSearchableFields: ['name', 'phone', 'email', 'subject'],
  },
  defaultSort: '-createdAt',
  access: { read: loggedIn, create: loggedIn, update: loggedIn, delete: adminOnly },
  hooks: {
    afterChange: [
      // اطلاع‌رسانی به شرکت (پیامک کوتاه + ایمیل کامل)
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return doc
        const settings = await req.payload.findGlobal({ slug: 'site-settings', depth: 0, req })
        void Promise.all([
          sendSms(req.payload, settings.notifyPhone, `پیام جدید از سایت\n${doc.name} ${doc.phone ?? ''}\n${doc.subject ?? ''}`),
          sendMail(
            req.payload,
            settings.notifyEmail,
            `پیام جدید از سایت: ${doc.subject || doc.name}`,
            emailTable('پیام از فرم تماس', [
              ['نام', doc.name],
              ['تلفن', doc.phone],
              ['ایمیل', doc.email],
              ['موضوع', doc.subject],
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
      type: 'row',
      fields: [
        { name: 'name', type: 'text', label: { fa: 'نام', en: 'Name' }, required: true },
        { name: 'subject', type: 'text', label: { fa: 'موضوع', en: 'Subject' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', label: { fa: 'شماره تماس', en: 'Phone' } },
        { name: 'email', type: 'email', label: { fa: 'ایمیل', en: 'Email' } },
      ],
    },
    { name: 'message', type: 'textarea', label: { fa: 'پیام', en: 'Message' }, required: true },
    {
      name: 'status',
      type: 'select',
      label: { fa: 'وضعیت', en: 'Status' },
      required: true,
      defaultValue: 'new',
      admin: { position: 'sidebar' },
      options: [
        { value: 'new', label: { fa: 'جدید', en: 'New' } },
        { value: 'answered', label: { fa: 'پاسخ داده شد', en: 'Answered' } },
        { value: 'archived', label: { fa: 'بایگانی', en: 'Archived' } },
      ],
    },
    { name: 'internalNote', type: 'textarea', label: { fa: 'یادداشت داخلی', en: 'Internal note' }, admin: { position: 'sidebar' } },
  ],
}
