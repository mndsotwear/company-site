import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../access/roles'
import { slugField } from '../fields/slug'
import { GROUPS } from '../lib/adminGroups'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: { fa: 'خدمت', en: 'Service' }, plural: { fa: 'خدمات', en: 'Services' } },
  admin: {
    group: GROUPS.content,
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order', 'isActive'],
    description: {
      fa: 'خدماتی که در صفحه‌ی «خدمات ما» و صفحه اصلی نمایش داده می‌شوند.',
      en: 'Services shown on the Services page and the homepage.',
    },
  },
  defaultSort: 'order',
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    { name: 'title', type: 'text', label: { fa: 'نام خدمت', en: 'Title' }, required: true, localized: true },
    {
      name: 'summary',
      type: 'textarea',
      label: { fa: 'توضیح کوتاه (برای کارت)', en: 'Short summary (card)' },
      localized: true,
      maxLength: 220,
    },
    { name: 'body', type: 'richText', label: { fa: 'متن کامل', en: 'Full text' }, localized: true },
    {
      name: 'steps',
      type: 'array',
      label: { fa: 'مراحل کار', en: 'Process steps' },
      labels: { singular: { fa: 'مرحله', en: 'Step' }, plural: { fa: 'مراحل', en: 'Steps' } },
      fields: [
        { name: 'title', type: 'text', label: { fa: 'عنوان مرحله', en: 'Step title' }, required: true, localized: true },
        { name: 'text', type: 'textarea', label: { fa: 'توضیح', en: 'Description' }, localized: true },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media', label: { fa: 'تصویر', en: 'Image' } },
    slugField(),
    {
      name: 'icon',
      type: 'select',
      label: { fa: 'آیکون', en: 'Icon' },
      defaultValue: 'ship',
      admin: { position: 'sidebar' },
      options: [
        { value: 'ship', label: { fa: 'کشتی', en: 'Ship' } },
        { value: 'container', label: { fa: 'کانتینر', en: 'Container' } },
        { value: 'truck', label: { fa: 'کامیون', en: 'Truck' } },
        { value: 'warehouse', label: { fa: 'انبار', en: 'Warehouse' } },
        { value: 'crane', label: { fa: 'جرثقیل بندری', en: 'Port crane' } },
        { value: 'anchor', label: { fa: 'لنگر', en: 'Anchor' } },
        { value: 'box', label: { fa: 'بسته‌بندی', en: 'Packaging' } },
      ],
    },
    {
      name: 'order',
      type: 'number',
      label: { fa: 'ترتیب نمایش', en: 'Order' },
      defaultValue: 0,
      admin: { position: 'sidebar', description: { fa: 'عدد کمتر = بالاتر', en: 'Lower shows first' } },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: { fa: 'نمایش در سایت', en: 'Show on site' },
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
}
