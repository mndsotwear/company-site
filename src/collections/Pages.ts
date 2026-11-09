import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../access/roles'
import { PAGE_BLOCKS } from '../blocks'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'
import { GROUPS } from '../lib/adminGroups'

// صفحات سایت که با بلوک‌ها ساخته می‌شوند (صفحه اصلی = آدرس home)
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: { fa: 'صفحه', en: 'Page' }, plural: { fa: 'صفحات', en: 'Pages' } },
  admin: {
    group: GROUPS.content,
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: {
      fa: 'صفحه‌ای با آدرس home همان صفحه اصلی سایت است.',
      en: 'The page with slug "home" is the homepage.',
    },
  },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    { name: 'title', type: 'text', label: { fa: 'عنوان صفحه', en: 'Title' }, required: true, localized: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: { fa: 'محتوا', en: 'Content' },
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              label: { fa: 'بلوک‌های صفحه', en: 'Blocks' },
              labels: { singular: { fa: 'بلوک', en: 'Block' }, plural: { fa: 'بلوک‌ها', en: 'Blocks' } },
              blocks: PAGE_BLOCKS,
            },
          ],
        },
        { label: { fa: 'سئو', en: 'SEO' }, fields: [seoField()] },
      ],
    },
    slugField(),
    {
      name: 'showInEnglish',
      type: 'checkbox',
      label: { fa: 'نمایش در نسخه‌ی انگلیسی', en: 'Show in English version' },
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: {
          fa: 'فقط وقتی ترجمه کامل شد روشن کنید.',
          en: 'Turn on only when the translation is complete.',
        },
      },
    },
  ],
}
