import { defineRouting } from 'next-intl/routing'

// فارسی پیش‌فرض؛ همه‌ی آدرس‌ها با /fa یا /en شروع می‌شوند
export const routing = defineRouting({
  locales: ['fa', 'en'],
  defaultLocale: 'fa',
  localePrefix: 'always',
})

export type Locale = (typeof routing.locales)[number]

export const isRtl = (locale: string) => locale === 'fa'
