import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: { fa: 'رسانه', en: 'Media' }, plural: { fa: 'رسانه‌ها', en: 'Media' } },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  upload: {
    // عکس‌ها خودکار در چند اندازه و با فرمت WebP ذخیره می‌شوند
    staticDir: 'media',
    mimeTypes: ['image/*', 'application/pdf'],
    formatOptions: { format: 'webp', options: { quality: 82 } },
    imageSizes: [
      { name: 'thumb', width: 400 },
      { name: 'card', width: 800 },
      { name: 'hero', width: 1920 },
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
