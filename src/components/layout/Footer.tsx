import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

// اطلاعات تماس در فاز ۲ از «تنظیمات سایت» در پنل خوانده می‌شود
export async function Footer() {
  const t = await getTranslations()

  return (
    <footer className="text-foam">
      <div className="bg-navy-deep">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3">
          <div>
            <p className="text-lg font-bold">{t('meta.siteName')}</p>
            <p className="mt-3 max-w-xs text-sm leading-7 text-foam/70">{t('meta.description')}</p>
          </div>

          <div>
            <p className="mb-4 font-semibold">{t('footer.contactTitle')}</p>
            <ul className="space-y-3 text-sm text-foam/80">
              <li>{t('footer.address')}</li>
              <li>
                <a href="mailto:shahin.marine1@gmail.com" className="ltr-nums hover:text-sky">
                  shahin.marine1@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:09366334228" className="ltr-nums hover:text-sky">
                  0936 633 4228
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 font-semibold">{t('footer.linksTitle')}</p>
            <ul className="grid grid-cols-2 gap-3 text-sm text-foam/80">
              <li><Link href="/about" className="hover:text-sky">{t('nav.about')}</Link></li>
              <li><Link href="/services" className="hover:text-sky">{t('nav.services')}</Link></li>
              <li><Link href="/tracking" className="hover:text-sky">{t('nav.tracking')}</Link></li>
              <li><Link href="/quote" className="hover:text-sky">{t('nav.quote')}</Link></li>
              <li><Link href="/fleet" className="hover:text-sky">{t('nav.fleet')}</Link></li>
              <li><Link href="/contact" className="hover:text-sky">{t('nav.contact')}</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-ink">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-4 text-xs text-foam/60 sm:flex-row">
          <p>{t('footer.rights')}</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-sky">{t('footer.privacy')}</Link>
            <span>{t('footer.credit')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
