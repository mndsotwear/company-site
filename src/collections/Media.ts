import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../access/roles'
import { GROUPS } from '../lib/adminGroups'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: { fa: 'رسانه', en: 'Media' }, plural: { fa: 'رسانه‌ها', en: 'Media' } },
  admin: { group: GROUPS.content },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  upload: {
    // عکس‌ها خودکار در چند اندازه و با فرمت WebP ذخیره می‌شوند
    staticDir: 'media',
    mimeTypes: ['image/*', 'application/pdf'],
    formatOptions: { format: 'webp', options: { quality: 82 } },
    // هر اندازه هم جداگانه WebP می‌شود؛ بدون این، Payload اندازه‌ها را با فرمت فایل اصلی (مثلاً PNG) می‌سازد
    imageSizes: [
      { name: 'thumb', width: 400, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'card', width: 800, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'hero', width: 1920, formatOptions: { format: 'webp', options: { quality: 82 } } },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: { fa: 'متن جایگزین (برای سئو و نابینایان)', en: 'Alt text' },
      localized: true,
      required: true,
    },
  ],
}
