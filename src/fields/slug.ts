import type { TextField } from 'payload'

/** تبدیل متن به آدرس قابل استفاده در URL (فقط حروف انگلیسی، عدد و خط تیره) */
export const formatSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

/** فیلد «آدرس» (slug) یکتا در نوار کناری پنل */
export const slugField = (): TextField => ({
  name: 'slug',
  type: 'text',
  label: { fa: 'آدرس (انگلیسی)', en: 'Slug' },
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: {
      fa: 'بخشی از آدرس صفحه؛ فقط حروف انگلیسی، عدد و خط تیره. مثال: sea-freight',
      en: 'Part of the URL: English letters, numbers and dashes. Example: sea-freight',
    },
  },
  hooks: {
    beforeValidate: [({ value }) => (typeof value === 'string' ? formatSlug(value) : value)],
  },
})
