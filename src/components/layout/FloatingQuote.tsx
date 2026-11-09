import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

// دکمه‌ی شناور نارنجی «استعلام قیمت» (مثل سایت فعلی)
export async function FloatingQuote() {
  const t = await getTranslations('nav')
  return (
    <Link
      href="/quote"
      className="fixed bottom-5 end-5 z-30 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
    >
      {t('quote')}
    </Link>
  )
}
