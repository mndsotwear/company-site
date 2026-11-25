import { getLocale, getTranslations } from 'next-intl/server'
import { getSiteSettings, whatsappLink, type Locale } from '@/lib/payload'
import { FloatingActions } from './FloatingActions'

// دکمه‌ی شناور «استعلام قیمت» (مثل سایت فعلی) + دکمه‌ی واتساپ
export async function FloatingQuote() {
  const locale = (await getLocale()) as Locale
  const t = await getTranslations()
  const s = await getSiteSettings(locale)
  return (
    <FloatingActions
      quoteLabel={t('nav.quote')}
      whatsappHref={whatsappLink(s.whatsapp || s.phone)}
      whatsappLabel={t('footer.whatsapp')}
      phoneHref={s.phone ? `tel:${s.phone.replace(/\s/g, '')}` : null}
      phoneLabel={t('footer.call')}
    />
  )
}
