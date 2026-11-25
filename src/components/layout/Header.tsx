import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getSiteSettings, mediaUrl, type Locale } from '@/lib/payload'
import { getActiveServices } from '@/lib/services'
import { ThemeToggle } from './ThemeToggle'
import { ThemePicker } from './ThemePicker'
import { LocaleSwitcher } from './LocaleSwitcher'
import { MobileMenu } from './MobileMenu'
import { Logo } from './Logo'
import { HeaderShell } from './HeaderShell'

// منوی پیش‌فرض؛ اگر در پنل (تنظیمات سایت ← منو) لینکی تعریف شود، آن جایگزین می‌شود
const DEFAULT_NAV = [
  { href: '/fleet', key: 'fleet' },
  { href: '/schedule', key: 'schedule' },
  { href: '/tracking', key: 'tracking' },
  { href: '/about', key: 'about' },
  { href: '/contact', key: 'contact' },
] as const

// هدر دو ردیفه (الهام از ONE): ردیف بالا ابزارها (جستجو، زبان، رنگ، حالت، ورود پنل)،
// ردیف اصلی لوگو، منوی «خدمات» کشویی و لینک‌ها، و دکمه‌ی استعلام قیمت
export async function Header() {
  const locale = (await getLocale()) as Locale
  const t = await getTranslations()
  const settings = await getSiteSettings(locale)
  const services = await getActiveServices(locale)

  const items = settings.headerNav?.length
    ? settings.headerNav.map((n) => ({ href: n.href, label: n.label }))
    : DEFAULT_NAV.map((n) => ({ href: n.href, label: t(`nav.${n.key}`) }))
  const quote = { href: '/quote', label: t('nav.quote') }
  const phone = settings.phone || '09366334228'
  const mobileItems = [{ href: '/services', label: t('nav.services') }, ...items, { href: '/search', label: t('nav.search') }]

  return (
    <HeaderShell>
      {/* ردیف بالا */}
      <div className="hidden border-b border-current/10 lg:block">
        <div className="mx-auto flex h-11 max-w-7xl items-center justify-between gap-6 px-5 text-xs opacity-80">
          <a href={`tel:${phone}`} className="ltr-nums hover:opacity-70">
            {phone}
          </a>
          <div className="flex items-center gap-1">
            <Link href="/search" className="flex items-center gap-1.5 rounded-full px-3 py-1.5 hover:opacity-70">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              {t('nav.search')}
            </Link>
            <LocaleSwitcher label={t('locale.switch')} ariaLabel={t('locale.switchLabel')} />
            <ThemePicker />
            <ThemeToggle labels={{ toLight: t('theme.toLight'), toDark: t('theme.toDark') }} />
            <a href="/admin" className="flex items-center gap-1.5 rounded-full px-3 py-1.5 hover:opacity-70">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
              </svg>
              {t('nav.login')}
            </a>
          </div>
        </div>
      </div>

      {/* ردیف اصلی */}
      <div className="relative mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-5">
        <Link href="/" aria-label={t('meta.siteName')}>
          <Logo light={mediaUrl(settings.logo)} dark={mediaUrl(settings.logoDark)} name={t('meta.siteName')} tagline={t('meta.tagline')} />
        </Link>

        <nav className="hidden lg:block" aria-label={t('nav.menu')}>
          <ul className="flex items-center gap-1 whitespace-nowrap text-[15px] font-medium">
            <li className="group/menu relative">
              <Link href="/services" className="flex items-center gap-1 rounded-full px-3 py-2 hover:opacity-70">
                {t('nav.services')}
                <svg viewBox="0 0 24 24" className="h-4 w-4 transition group-hover/menu:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </Link>
              {/* منوی کشویی خدمات (با هاور یا فوکوس کیبورد باز می‌شود) */}
              {!!services.length && (
                <div className="invisible absolute start-0 top-full z-50 pt-2 opacity-0 transition group-focus-within/menu:visible group-focus-within/menu:opacity-100 group-hover/menu:visible group-hover/menu:opacity-100">
                  <ul className="w-72 rounded-2xl border border-border bg-surface p-2 text-text shadow-xl">
                    {services.map((s) => (
                      <li key={s.id}>
                        <Link href={`/services/${s.slug}`} className="block rounded-xl px-4 py-3 hover:bg-surface-2">
                          <span className="block text-sm font-semibold">{s.title}</span>
                          {s.summary && <span className="mt-0.5 line-clamp-1 block text-xs font-normal text-muted">{s.summary}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="rounded-full px-3 py-2 transition hover:opacity-70">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/quote"
            className="hidden whitespace-nowrap rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent lg:inline-flex"
          >
            {quote.label}
          </Link>
          <div className="flex items-center gap-2 lg:hidden">
            <ThemePicker />
            <ThemeToggle labels={{ toLight: t('theme.toLight'), toDark: t('theme.toDark') }} />
            <LocaleSwitcher label={t('locale.switch')} ariaLabel={t('locale.switchLabel')} />
          </div>
          <MobileMenu items={mobileItems} quote={quote} labels={{ menu: t('nav.menu'), close: t('nav.close') }} />
        </div>
      </div>
    </HeaderShell>
  )
}
