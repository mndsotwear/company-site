import type { CollectionConfig } from 'payload'
import { adminOnly, loggedIn } from '../access/roles'
import { GROUPS } from '../lib/adminGroups'
import { CONTACT_VIA_OPTIONS, toPayloadOptions } from '../lib/options'

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
