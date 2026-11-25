import type { CollectionConfig } from 'payload'
import { adminOnly, anyone, loggedIn } from '../access/roles'
import { GROUPS } from '../lib/adminGroups'

// دفاتر و نمایندگی‌ها: در کادر «دفاتر» هیرو و صفحه‌ی تماس نمایش داده می‌شوند
export const Offices: CollectionConfig = {
  slug: 'offices',
  labels: { singular: { fa: 'دفتر', en: 'Office' }, plural: { fa: 'دفاتر و نمایندگی‌ها', en: 'Offices' } },
  admin: { group: GROUPS.operations, useAsTitle: 'name', defaultColumns: ['name', 'city', 'phone', 'order'] },
  defaultSort: 'order',
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: adminOnly },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', label: { fa: 'نام دفتر', en: 'Name' }, required: true, localized: true },
        { name: 'city', type: 'text', label: { fa: 'شهر', en: 'City' }, required: true, localized: true },
      ],
    },
    { name: 'address', type: 'textarea', label: { fa: 'آدرس', en: 'Address' }, localized: true },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', label: { fa: 'تلفن', en: 'Phone' } },
        { name: 'email', type: 'email', label: { fa: 'ایمیل', en: 'Email' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'hours', type: 'text', label: { fa: 'ساعت کاری', en: 'Opening hours' }, localized: true },
        { name: 'mapUrl', type: 'text', label: { fa: 'لینک نقشه (گوگل یا نشان)', en: 'Map link' } },
      ],
    },
    { name: 'isMain', type: 'checkbox', label: { fa: 'دفتر مرکزی', en: 'Head office' }, admin: { position: 'sidebar' } },
    { name: 'order', type: 'number', label: { fa: 'ترتیب نمایش', en: 'Order' }, defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
