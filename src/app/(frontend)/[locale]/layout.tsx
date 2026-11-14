import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing, isRtl } from '@/i18n/routing'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FloatingQuote } from '@/components/layout/FloatingQuote'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { getSiteSettings, type Locale } from '@/lib/payload'
import { PALETTE_IDS, paletteBootScript } from '@/lib/palette'
import '@/styles/globals.css'

// همه‌ی صفحه‌ها هنگام درخواست از دیتابیس ساخته می‌شوند (تغییرات پنل فوراً دیده می‌شود و ساخت Docker به دیتابیس نیاز ندارد)
export const dynamic = 'force-dynamic'

type Props = { children: ReactNode; params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: { default: `${t('siteName')} – ${t('tagline')}`, template: `%s | ${t('siteName')}` },
    description: t('description'),
    alternates: { languages: { fa: '/fa', en: '/en' } },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const settings = await getSiteSettings(locale as Locale)
  const palette = PALETTE_IDS.includes(settings.defaultPalette as never) ? settings.defaultPalette! : 'ocean'
  const mode = settings.defaultMode === 'light' ? 'light' : 'dark'

  return (
    <html
      lang={locale}
      dir={isRtl(locale) ? 'rtl' : 'ltr'}
      data-palette={palette}
      data-custom={settings.customColor || undefined}
      suppressHydrationWarning
    >
      <head>
        {/* اعمال تم رنگی انتخابی بازدیدکننده قبل از نمایش صفحه (بدون چشمک زدن) */}
        <script dangerouslySetInnerHTML={{ __html: paletteBootScript }} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        {/* اطلاعات ساختاریافته‌ی شرکت برای گوگل (Organization) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: locale === 'fa' ? 'شاهین مارین' : 'Shahin Marine',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://shahinmarine.com',
              email: 'shahin.marine1@gmail.com',
              telephone: '+989366334228',
              address: { '@type': 'PostalAddress', addressLocality: locale === 'fa' ? 'آبادان' : 'Abadan', addressCountry: 'IR' },
            }),
          }}
        />
        <NextIntlClientProvider>
          <ThemeProvider defaultMode={mode}>
            <SmoothScroll />
            <Header />
            <main>{children}</main>
            <Footer />
            <FloatingQuote />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
