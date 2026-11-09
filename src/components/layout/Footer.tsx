import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getSiteSettings, whatsappLink, type Locale } from '@/lib/payload'

const DEFAULT_LINKS = [
  { href: '/about', key: 'about' },
  { href: '/services', key: 'services' },
  { href: '/tracking', key: 'tracking' },
  { href: '/quote', key: 'quote' },
  { href: '/fleet', key: 'fleet' },
  { href: '/contact', key: 'contact' },
] as const

const SOCIAL_NAMES: Record<string, { fa: string; en: string }> = {
  instagram: { fa: 'اینستاگرام', en: 'Instagram' },
  telegram: { fa: 'تلگرام', en: 'Telegram' },
  linkedin: { fa: 'لینکدین', en: 'LinkedIn' },
  whatsapp: { fa: 'واتساپ', en: 'WhatsApp' },
  eitaa: { fa: 'ایتا', en: 'Eitaa' },
  bale: { fa: 'بله', en: 'Bale' },
}

// اطلاعات تماس، لینک‌ها و شبکه‌های اجتماعی از «تنظیمات سایت» در پنل خوانده می‌شوند
export async function Footer() {
  const locale = (await getLocale()) as Locale
  const t = await getTranslations()
  const s = await getSiteSettings(locale)

  const phone = s.phone || '09366334228'
  const email = s.email || 'shahin.marine1@gmail.com'
  const address = s.address || t('footer.address')
  const links = s.footerNav?.length
    ? s.footerNav.map((n) => ({ href: n.href, label: n.label }))
    : DEFAULT_LINKS.map((n) => ({ href: n.href, label: t(`nav.${n.key}`) }))
  const wa = whatsappLink(s.whatsapp || phone)

  return (
    <footer className="text-foam">
      <div className="bg-navy-deep">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3">
          <div>
            <p className="text-lg font-bold">{t('meta.siteName')}</p>
            <p className="mt-3 max-w-xs text-sm leading-7 text-foam/70">{s.footerAbout || t('meta.description')}</p>
            {!!s.socials?.length && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {s.socials.map((so) => (
                  <li key={so.id ?? so.url}>
                    <a
                      href={so.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-full border border-foam/20 px-3 py-1.5 text-xs text-foam/80 transition hover:border-sky hover:text-sky"
                    >
                      {SOCIAL_NAMES[so.platform]?.[locale] ?? so.platform}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="mb-4 font-semibold">{t('footer.contactTitle')}</p>
            <ul className="space-y-3 text-sm text-foam/80">
              <li>
                {s.mapUrl ? (
                  <a href={s.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-sky">
                    {address}
                  </a>
                ) : (
                  address
                )}
              </li>
              <li>
                <a href={`mailto:${email}`} className="ltr-nums hover:text-sky">
                  {email}
                </a>
              </li>
              <li>
                <a href={`tel:${phone}`} className="ltr-nums hover:text-sky">
                  {phone}
                </a>
              </li>
              {wa && (
                <li>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-sky">
                    {t('footer.whatsapp')}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <p className="mb-4 font-semibold">{t('footer.linksTitle')}</p>
            <ul className="grid grid-cols-2 gap-3 text-sm text-foam/80">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-sky">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-ink">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-4 pb-20 text-xs text-foam/60 sm:flex-row sm:pb-4">
          <p>{t('footer.rights')}</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-sky">
              {t('footer.privacy')}
            </Link>
            <span>{t('footer.credit')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
