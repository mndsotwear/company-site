import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../access/roles'
import { slugField } from '../fields/slug'
import { GROUPS } from '../lib/adminGroups'
import { toPayloadOptions, VESSEL_STATUS_OPTIONS, VESSEL_TYPE_OPTIONS } from '../lib/options'

// کشتی‌های فروشی: کارفرما از پنل اضافه می‌کند، مشتری درخواست خرید می‌فرستد (بدون درگاه پرداخت)
export const Vessels: CollectionConfig = {
  slug: 'vessels',
  labels: { singular: { fa: 'کشتی فروشی', en: 'Vessel' }, plural: { fa: 'کشتی‌های فروشی', en: 'Vessels for sale' } },
  admin: {
    group: GROUPS.vessels,
    useAsTitle: 'name',
    defaultColumns: ['name', 'vesselType', 'yearBuilt', 'status', 'featured'],
    description: {
      fa: 'هر کشتی با عکس و مشخصات در صفحه‌ی «کشتی‌های فروشی» نمایش داده می‌شود.',
      en: 'Each vessel appears on the Vessels for sale page with photos and specs.',
    },
  },
  defaultSort: '-createdAt',
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { fa: 'اطلاعات اصلی', en: 'Main' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'name', type: 'text', label: { fa: 'نام / مدل کشتی', en: 'Name / model' }, required: true },
                {
                  name: 'vesselType',
                  type: 'select',
                  label: { fa: 'نوع کشتی', en: 'Vessel type' },
                  required: true,
                  options: toPayloadOptions(VESSEL_TYPE_OPTIONS),
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'yearBuilt', type: 'number', label: { fa: 'سال ساخت (میلادی)', en: 'Year built' }, min: 1950, max: 2100 },
                { name: 'flag', type: 'text', label: { fa: 'پرچم', en: 'Flag' }, localized: true },
                { name: 'location', type: 'text', label: { fa: 'محل فعلی', en: 'Current location' }, localized: true },
              ],
            },
            { name: 'summary', type: 'textarea', label: { fa: 'توضیح کوتاه (برای کارت)', en: 'Short summary' }, localized: true, maxLength: 220 },
            { name: 'description', type: 'richText', label: { fa: 'توضیحات کامل', en: 'Full description' }, localized: true },
          ],
        },
        {
          label: { fa: 'مشخصات فنی', en: 'Specifications' },
          fields: [
            {
              name: 'specs',
              type: 'group',
              label: false,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'loa', type: 'number', label: { fa: 'طول کل LOA (متر)', en: 'LOA (m)' }, min: 0 },
                    { name: 'beam', type: 'number', label: { fa: 'عرض (متر)', en: 'Beam (m)' }, min: 0 },
                    { name: 'draft', type: 'number', label: { fa: 'آبخور (متر)', en: 'Draft (m)' }, min: 0 },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'dwt', type: 'number', label: { fa: 'ظرفیت DWT (تن)', en: 'Deadweight DWT (t)' }, min: 0 },
                    { name: 'grossTonnage', type: 'number', label: { fa: 'تناژ ناخالص GT', en: 'Gross tonnage GT' }, min: 0 },
                    { name: 'speed', type: 'number', label: { fa: 'سرعت (گره)', en: 'Speed (knots)' }, min: 0 },
                  ],
                },
                { name: 'engine', type: 'text', label: { fa: 'موتور', en: 'Engine' } },
                {
                  name: 'extra',
                  type: 'array',
                  label: { fa: 'مشخصات بیشتر', en: 'More specs' },
                  labels: { singular: { fa: 'مشخصه', en: 'Spec' }, plural: { fa: 'مشخصات', en: 'Specs' } },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'label', type: 'text', label: { fa: 'عنوان', en: 'Label' }, required: true, localized: true },
                        { name: 'value', type: 'text', label: { fa: 'مقدار', en: 'Value' }, required: true, localized: true },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: { fa: 'عکس‌ها و فایل', en: 'Media' },
          fields: [
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: { fa: 'گالری عکس (اولی = عکس اصلی)', en: 'Gallery (first = cover)' },
            },
            {
              name: 'specSheet',
              type: 'upload',
              relationTo: 'media',
              label: { fa: 'فایل PDF مشخصات', en: 'Spec sheet PDF' },
              filterOptions: { mimeType: { equals: 'application/pdf' } },
            },
          ],
        },
        {
          label: { fa: 'قیمت', en: 'Price' },
          fields: [
            {
              name: 'price',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'show',
                  type: 'checkbox',
                  label: { fa: 'نمایش قیمت در سایت (خاموش = «تماس بگیرید»)', en: 'Show price (off = "Contact us")' },
                  defaultValue: false,
                },
                {
                  type: 'row',
                  admin: { condition: (_, sibling) => Boolean(sibling?.show) },
                  fields: [
                    { name: 'amount', type: 'number', label: { fa: 'مبلغ', en: 'Amount' }, min: 0 },
                    {
                      name: 'currency',
                      type: 'select',
                      label: { fa: 'واحد', en: 'Currency' },
                      defaultValue: 'USD',
                      options: [
                        { value: 'USD', label: { fa: 'دلار آمریکا', en: 'US dollar' } },
                        { value: 'AED', label: { fa: 'درهم امارات', en: 'UAE dirham' } },
                        { value: 'IRT', label: { fa: 'تومان', en: 'Toman' } },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    slugField(),
    {
      name: 'status',
      type: 'select',
      label: { fa: 'وضعیت', en: 'Status' },
      required: true,
      defaultValue: 'available',
      options: toPayloadOptions(VESSEL_STATUS_OPTIONS),
      admin: { position: 'sidebar' },
    },
    {
      name: 'showWhenSold',
      type: 'checkbox',
      label: { fa: 'بعد از فروش با برچسب «فروخته شد» بماند', en: 'Keep listed with a "Sold" badge' },
      defaultValue: true,
      admin: { position: 'sidebar', condition: (data) => data?.status === 'sold' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: { fa: 'نمایش در صفحه اصلی', en: 'Feature on homepage' },
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
