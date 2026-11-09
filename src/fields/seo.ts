import type { GroupField } from 'payload'

/** تنظیمات سئو برای هر صفحه یا آیتم */
export const seoField = (): GroupField => ({
  name: 'seo',
  type: 'group',
  label: { fa: 'سئو', en: 'SEO' },
  admin: { description: { fa: 'خالی بگذارید تا از عنوان و متن صفحه استفاده شود.', en: 'Leave empty to use the page title and text.' } },
  fields: [
    { name: 'title', type: 'text', label: { fa: 'عنوان در گوگل', en: 'Meta title' }, localized: true, maxLength: 70 },
    {
      name: 'description',
      type: 'textarea',
      label: { fa: 'توضیح در گوگل', en: 'Meta description' },
      localized: true,
      maxLength: 160,
    },
    { name: 'image', type: 'upload', relationTo: 'media', label: { fa: 'عکس اشتراک‌گذاری', en: 'Share image' } },
    {
      name: 'noIndex',
      type: 'checkbox',
      label: { fa: 'در گوگل نمایش داده نشود', en: 'Hide from search engines' },
      defaultValue: false,
    },
  ],
})
