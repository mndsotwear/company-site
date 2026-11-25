import type { CollectionConfig } from 'payload'
import { adminOnly, anyone, loggedIn } from '../access/roles'
import { GROUPS } from '../lib/adminGroups'
import { DESTINATION_OPTIONS, ORIGIN_OPTIONS, toPayloadOptions } from '../lib/options'

// برنامه‌ی حرکت کشتی‌ها: ادمین حرکت‌های آینده را وارد می‌کند و بازدیدکننده با مسیر جستجو می‌کند
export const Sailings: CollectionConfig = {
  slug: 'sailings',
  labels: {
    singular: { fa: 'حرکت کشتی', en: 'Sailing' },
    plural: { fa: 'برنامه حرکت کشتی‌ها', en: 'Sailing schedule' },
  },
  admin: {
    group: GROUPS.operations,
    useAsTitle: 'vesselName',
    defaultColumns: ['vesselName', 'origin', 'destination', 'departure', 'status'],
    description: {
      fa: 'حرکت‌های آینده را اینجا ثبت کنید. حرکت‌های گذشته خودکار از سایت پنهان می‌شوند.',
      en: 'Enter upcoming departures. Past sailings are hidden on the site automatically.',
    },
  },
  defaultSort: 'departure',
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: adminOnly },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'vesselName', type: 'text', label: { fa: 'نام کشتی', en: 'Vessel' }, required: true },
        { name: 'voyage', type: 'text', label: { fa: 'شماره سفر', en: 'Voyage no.' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'origin', type: 'select', label: { fa: 'مبدأ', en: 'Origin' }, required: true, options: toPayloadOptions(ORIGIN_OPTIONS.filter((o) => o.value !== 'other')) },
        { name: 'destination', type: 'select', label: { fa: 'مقصد', en: 'Destination' }, required: true, options: toPayloadOptions(DESTINATION_OPTIONS.filter((o) => o.value !== 'other')) },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'departure', type: 'date', label: { fa: 'تاریخ حرکت', en: 'Departure' }, required: true, index: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'arrival', type: 'date', label: { fa: 'تاریخ تقریبی رسیدن', en: 'ETA' }, admin: { date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'cutoff', type: 'date', label: { fa: 'آخرین مهلت تحویل بار', en: 'Cargo cut-off' }, admin: { date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: { fa: 'وضعیت', en: 'Status' },
      required: true,
      defaultValue: 'scheduled',
      admin: { position: 'sidebar' },
      options: [
        { value: 'scheduled', label: { fa: 'برنامه‌ریزی شده', en: 'Scheduled' } },
        { value: 'loading', label: { fa: 'در حال بارگیری', en: 'Loading' } },
        { value: 'full', label: { fa: 'ظرفیت تکمیل', en: 'Full' } },
        { value: 'departed', label: { fa: 'حرکت کرد', en: 'Departed' } },
        { value: 'cancelled', label: { fa: 'لغو شد', en: 'Cancelled' } },
      ],
    },
    { name: 'note', type: 'text', label: { fa: 'توضیح کوتاه', en: 'Note' }, localized: true },
  ],
}
