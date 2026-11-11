import type { Block, Field } from 'payload'

// بلوک‌های صفحه‌ساز (جایگزین المنتور)
// طراحی هر بلوک ثابت است؛ کارفرما فقط متن، عکس و ترتیب را عوض می‌کند.

const heading: Field = { name: 'heading', type: 'text', label: { fa: 'تیتر', en: 'Heading' }, localized: true }
const eyebrow: Field = { name: 'eyebrow', type: 'text', label: { fa: 'متن کوچک بالای تیتر', en: 'Eyebrow' }, localized: true }
const intro: Field = { name: 'intro', type: 'textarea', label: { fa: 'متن کوتاه', en: 'Intro' }, localized: true }

/** دکمه/لینک: متن + آدرس */
const linkFields = (name: string, label: { fa: string; en: string }): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', type: 'text', label: { fa: 'متن دکمه', en: 'Label' }, localized: true },
        {
          name: 'href',
          type: 'text',
          label: { fa: 'آدرس', en: 'Link' },
          admin: { description: { fa: 'مثل /quote یا /services', en: 'e.g. /quote or /services' } },
        },
      ],
    },
  ],
})

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: { singular: { fa: 'هیرو (بنر اصلی)', en: 'Hero' }, plural: { fa: 'هیرو', en: 'Heroes' } },
  fields: [
    eyebrow,
    { name: 'title', type: 'text', label: { fa: 'تیتر خط اول', en: 'Title line 1' }, required: true, localized: true },
    { name: 'titleAccent', type: 'text', label: { fa: 'تیتر خط دوم (رنگی)', en: 'Title line 2 (accent)' }, localized: true },
    { name: 'text', type: 'textarea', label: { fa: 'متن', en: 'Text' }, localized: true },
    { name: 'image', type: 'upload', relationTo: 'media', label: { fa: 'عکس پس‌زمینه', en: 'Background image' } },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      label: { fa: 'ویدیوی پس‌زمینه (اختیاری)', en: 'Background video (optional)' },
      filterOptions: { mimeType: { contains: 'video' } },
      admin: {
        description: {
          fa: 'فایل MP4 یا WebM، ۱۰ تا ۲۰ ثانیه، بدون صدا، حداکثر حدود ۸ مگابایت. تا ویدیو بارگذاری شود (و روی گوشی با اینترنت کند) همان عکس پس‌زمینه نمایش داده می‌شود.',
          en: 'MP4/WebM, 10–20 s, no sound, about 8 MB max. The background image is shown until the video loads.',
        },
      },
    },
    linkFields('primary', { fa: 'دکمه اصلی', en: 'Primary button' }),
    linkFields('secondary', { fa: 'دکمه دوم', en: 'Secondary button' }),
    {
      name: 'showTracking',
      type: 'checkbox',
      label: { fa: 'نمایش کادر رهگیری سریع', en: 'Show quick tracking box' },
      defaultValue: true,
    },
  ],
}

export const ServicesBlock: Block = {
  slug: 'services',
  interfaceName: 'ServicesBlock',
  labels: { singular: { fa: 'معرفی خدمات', en: 'Services' }, plural: { fa: 'معرفی خدمات', en: 'Services' } },
  fields: [
    eyebrow,
    heading,
    intro,
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: { fa: 'خدمات (خالی = همه‌ی خدمات فعال)', en: 'Services (empty = all active)' },
    },
  ],
}

export const AboutBlock: Block = {
  slug: 'about',
  interfaceName: 'AboutBlock',
  labels: { singular: { fa: 'درباره ما', en: 'About' }, plural: { fa: 'درباره ما', en: 'About' } },
  fields: [
    eyebrow,
    heading,
    { name: 'body', type: 'richText', label: { fa: 'متن', en: 'Body' }, localized: true },
    { name: 'image', type: 'upload', relationTo: 'media', label: { fa: 'عکس', en: 'Image' } },
    linkFields('link', { fa: 'دکمه', en: 'Button' }),
  ],
}

export const StatsBlock: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: { singular: { fa: 'آمار و ارقام', en: 'Stats' }, plural: { fa: 'آمار و ارقام', en: 'Stats' } },
  fields: [
    heading,
    {
      name: 'items',
      type: 'array',
      label: { fa: 'آمارها', en: 'Items' },
      labels: { singular: { fa: 'آمار', en: 'Stat' }, plural: { fa: 'آمارها', en: 'Stats' } },
      maxRows: 6,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', type: 'number', label: { fa: 'عدد', en: 'Value' }, required: true },
            { name: 'suffix', type: 'text', label: { fa: 'پسوند (مثل +)', en: 'Suffix (e.g. +)' } },
            { name: 'label', type: 'text', label: { fa: 'عنوان', en: 'Label' }, required: true, localized: true },
          ],
        },
      ],
    },
  ],
}

export const IndustriesBlock: Block = {
  slug: 'industries',
  interfaceName: 'IndustriesBlock',
  labels: { singular: { fa: 'کارت صنایع', en: 'Industries' }, plural: { fa: 'کارت صنایع', en: 'Industries' } },
  fields: [
    eyebrow,
    heading,
    {
      name: 'items',
      type: 'array',
      label: { fa: 'کارت‌ها', en: 'Cards' },
      labels: { singular: { fa: 'کارت', en: 'Card' }, plural: { fa: 'کارت‌ها', en: 'Cards' } },
      fields: [
        { name: 'title', type: 'text', label: { fa: 'عنوان', en: 'Title' }, required: true, localized: true },
        { name: 'text', type: 'textarea', label: { fa: 'توضیح', en: 'Text' }, localized: true },
        { name: 'image', type: 'upload', relationTo: 'media', label: { fa: 'عکس', en: 'Image' } },
      ],
    },
  ],
}

export const RoutesBlock: Block = {
  slug: 'routes',
  interfaceName: 'RoutesBlock',
  labels: { singular: { fa: 'مسیرها و بنادر', en: 'Routes' }, plural: { fa: 'مسیرها و بنادر', en: 'Routes' } },
  fields: [
    eyebrow,
    heading,
    intro,
    {
      name: 'routes',
      type: 'array',
      label: { fa: 'مسیرها', en: 'Routes' },
      labels: { singular: { fa: 'مسیر', en: 'Route' }, plural: { fa: 'مسیرها', en: 'Routes' } },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'from', type: 'text', label: { fa: 'از', en: 'From' }, required: true, localized: true },
            { name: 'to', type: 'text', label: { fa: 'به', en: 'To' }, required: true, localized: true },
            { name: 'note', type: 'text', label: { fa: 'توضیح (مثل مدت سفر)', en: 'Note (e.g. transit time)' }, localized: true },
          ],
        },
      ],
    },
  ],
}

export const VesselsBlock: Block = {
  slug: 'featuredVessels',
  interfaceName: 'FeaturedVesselsBlock',
  labels: { singular: { fa: 'کشتی‌های فروشی منتخب', en: 'Featured vessels' }, plural: { fa: 'کشتی‌های منتخب', en: 'Featured vessels' } },
  fields: [
    eyebrow,
    heading,
    { name: 'limit', type: 'number', label: { fa: 'تعداد', en: 'How many' }, defaultValue: 3, min: 1, max: 6 },
  ],
}

export const CTABlock: Block = {
  slug: 'cta',
  interfaceName: 'CTABlock',
  labels: { singular: { fa: 'فراخوان (دعوت به تماس)', en: 'Call to action' }, plural: { fa: 'فراخوان', en: 'CTAs' } },
  fields: [
    heading,
    { name: 'text', type: 'textarea', label: { fa: 'متن', en: 'Text' }, localized: true },
    linkFields('link', { fa: 'دکمه', en: 'Button' }),
  ],
}

export const GalleryBlock: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  labels: { singular: { fa: 'گالری', en: 'Gallery' }, plural: { fa: 'گالری', en: 'Galleries' } },
  fields: [
    heading,
    { name: 'images', type: 'upload', relationTo: 'media', hasMany: true, label: { fa: 'عکس‌ها', en: 'Images' }, required: true },
  ],
}

export const FAQBlock: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  labels: { singular: { fa: 'سؤالات متداول', en: 'FAQ' }, plural: { fa: 'سؤالات متداول', en: 'FAQs' } },
  fields: [
    heading,
    {
      name: 'items',
      type: 'array',
      label: { fa: 'سؤال‌ها', en: 'Questions' },
      labels: { singular: { fa: 'سؤال', en: 'Question' }, plural: { fa: 'سؤال‌ها', en: 'Questions' } },
      fields: [
        { name: 'question', type: 'text', label: { fa: 'سؤال', en: 'Question' }, required: true, localized: true },
        { name: 'answer', type: 'textarea', label: { fa: 'جواب', en: 'Answer' }, required: true, localized: true },
      ],
    },
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  labels: { singular: { fa: 'متن ساده', en: 'Text' }, plural: { fa: 'متن', en: 'Text' } },
  fields: [{ name: 'content', type: 'richText', label: { fa: 'متن', en: 'Content' }, localized: true }],
}

export const PAGE_BLOCKS: Block[] = [
  HeroBlock,
  ServicesBlock,
  AboutBlock,
  StatsBlock,
  RoutesBlock,
  VesselsBlock,
  IndustriesBlock,
  CTABlock,
  GalleryBlock,
  FAQBlock,
  RichTextBlock,
]
