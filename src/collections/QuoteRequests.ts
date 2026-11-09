import type { CollectionConfig, Field } from 'payload'
import { adminOnly, loggedIn } from '../access/roles'
import { GROUPS } from '../lib/adminGroups'
import { jalaliYear } from '../lib/jalali'
import {
  CARGO_OPTIONS,
  CONTACT_VIA_OPTIONS,
  DESTINATION_OPTIONS,
  ORIGIN_OPTIONS,
  SERVICE_OPTIONS,
  TIMING_OPTIONS,
  toPayloadOptions,
  type Option,
} from '../lib/options'

type L = { fa: string; en: string }

/** یک فیلد انتخابی + فیلد متنی «سایر» که فقط وقتی «سایر» انتخاب شده دیده می‌شود */
const selectWithOther = (name: string, label: L, options: Option[], required = true): Field[] => [
  { name, type: 'select', label, required, options: toPayloadOptions(options) },
  {
    name: `${name}Other`,
    type: 'text',
    label: { fa: `${label.fa} (سایر)`, en: `${label.en} (other)` },
    admin: { condition: (_, sibling) => sibling?.[name] === 'other' },
  },
]

// استعلام‌های قیمت از فرم سایت (همان فیلدهای فرم فعلی وردپرس)
export const QuoteRequests: CollectionConfig = {
  slug: 'quote-requests',
  labels: {
    singular: { fa: 'استعلام قیمت', en: 'Quote request' },
    plural: { fa: 'استعلام‌های قیمت', en: 'Quote requests' },
  },
  admin: {
    group: GROUPS.requests,
    useAsTitle: 'trackingNumber',
    defaultColumns: ['trackingNumber', 'name', 'origin', 'destination', 'cargo', 'status', 'createdAt'],
    listSearchableFields: ['trackingNumber', 'name', 'phone', 'company'],
  },
  defaultSort: '-createdAt',
  access: { read: loggedIn, create: loggedIn, update: loggedIn, delete: adminOnly },
  hooks: {
    beforeChange: [
      // ساخت شماره‌ی پیگیری خودکار: Q-1405-0001, Q-1405-0002, ...
      async ({ data, operation, req }) => {
        if (operation !== 'create' || data.trackingNumber) return data
        const prefix = `Q-${jalaliYear()}-`
        const last = await req.payload.find({
          collection: 'quote-requests',
          where: { trackingNumber: { like: prefix } },
          sort: '-trackingNumber',
          limit: 1,
          depth: 0,
          overrideAccess: true,
          req,
        })
        const lastNumber = Number(last.docs[0]?.trackingNumber?.split('-')[2] ?? 0)
        data.trackingNumber = `${prefix}${String(lastNumber + 1).padStart(4, '0')}`
        return data
      },
    ],
  },
  fields: [
    {
      type: 'collapsible',
      label: { fa: 'مسیر و بار', en: 'Route & cargo' },
      fields: [
        {
          type: 'row',
          fields: selectWithOther('service', { fa: 'نوع خدمت', en: 'Service' }, SERVICE_OPTIONS),
        },
        {
          type: 'row',
          fields: [
            ...selectWithOther('origin', { fa: 'مبدأ', en: 'Origin' }, ORIGIN_OPTIONS),
            ...selectWithOther('destination', { fa: 'مقصد', en: 'Destination' }, DESTINATION_OPTIONS),
          ],
        },
        { type: 'row', fields: selectWithOther('cargo', { fa: 'نوع بار', en: 'Cargo type' }, CARGO_OPTIONS) },
      ],
    },
    {
      type: 'collapsible',
      label: { fa: 'جزئیات', en: 'Details' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'weight', type: 'number', label: { fa: 'وزن تقریبی (تن)', en: 'Approx. weight (t)' }, min: 0 },
            { name: 'volume', type: 'text', label: { fa: 'حجم یا تعداد', en: 'Volume / count' } },
          ],
        },
        { type: 'row', fields: selectWithOther('timing', { fa: 'زمان تقریبی ارسال', en: 'Shipping time' }, TIMING_OPTIONS, false) },
        { name: 'details', type: 'textarea', label: { fa: 'توضیحات', en: 'Details' } },
      ],
    },
    {
      type: 'collapsible',
      label: { fa: 'اطلاعات تماس', en: 'Contact' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', label: { fa: 'نام و نام خانوادگی', en: 'Full name' }, required: true },
            { name: 'company', type: 'text', label: { fa: 'نام شرکت', en: 'Company' } },
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
      ],
    },
    {
      name: 'trackingNumber',
      type: 'text',
      label: { fa: 'شماره پیگیری', en: 'Tracking number' },
      unique: true,
      index: true,
      admin: { position: 'sidebar', readOnly: true, description: { fa: 'خودکار ساخته می‌شود', en: 'Generated automatically' } },
    },
    {
      name: 'status',
      type: 'select',
      label: { fa: 'وضعیت', en: 'Status' },
      required: true,
      defaultValue: 'new',
      admin: { position: 'sidebar' },
      options: [
        { value: 'new', label: { fa: 'جدید', en: 'New' } },
        { value: 'in-review', label: { fa: 'در حال بررسی', en: 'In review' } },
        { value: 'answered', label: { fa: 'پاسخ داده شد', en: 'Answered' } },
      ],
    },
    {
      name: 'locale',
      type: 'select',
      label: { fa: 'زبان فرم', en: 'Form language' },
      defaultValue: 'fa',
      options: [
        { value: 'fa', label: 'فارسی' },
        { value: 'en', label: 'English' },
      ],
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'internalNote',
      type: 'textarea',
      label: { fa: 'یادداشت داخلی (فقط در پنل)', en: 'Internal note' },
      admin: { position: 'sidebar' },
    },
  ],
}
