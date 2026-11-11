import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getSiteSettings, mediaUrl, type Locale } from '@/lib/payload'
import { ThemeToggle } from './ThemeToggle'
import { LocaleSwitcher } from './LocaleSwitcher'
import { MobileMenu } from './MobileMenu'
import { Logo } from './Logo'
import { HeaderShell } from './HeaderShell'

// منوی پیش‌فرض؛ اگر در پنل (تنظیمات سایت ← منو) لینکی تعریف شود، آن جایگزین می‌شود
const DEFAULT_NAV = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/services', key: 'services' },
  { href: '/fleet', key: 'fleet' },
  { href: '/tracking', key: 'tracking' },
  { href: '/contact', key: 'contact' },
] as const

export async function Header() {
  const locale = (await getLocale()) as Locale
  const t = await getTranslations()
  const settings = await getSiteSettings(locale)

  const items = settings.headerNav?.length
    ? settings.headerNav.map((n) => ({ href: n.href, label: n.label }))
    : DEFAULT_NAV.map((n) => ({ href: n.href, label: t(`nav.${n.key}`) }))
  const quote = { href: '/quote', label: t('nav.quote') }

  return (
    <HeaderShell>
      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5">
        <Link href="/" aria-label={t('meta.siteName')}>
          <Logo
            light={mediaUrl(settings.logo)}
            dark={mediaUrl(settings.logoDark)}
            name={t('meta.siteName')}
            tagline={t('meta.tagline')}
          />
        </Link>

        <nav className="hidden lg:block" aria-label={t('nav.menu')}>
          <ul className="flex items-center gap-5 whitespace-nowrap text-[15px] xl:gap-8">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-line pb-1 opacity-85 transition hover:opacity-100">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher label={t('locale.switch')} ariaLabel={t('locale.switchLabel')} />
          <ThemeToggle labels={{ toLight: t('theme.toLight'), toDark: t('theme.toDark') }} />
          <Link
            href="/quote"
            className="group/q hidden items-center gap-2 whitespace-nowrap rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 lg:inline-flex"
          >
            {quote.label}
            <span aria-hidden className="transition-transform duration-500 rtl:rotate-180 rtl:group-hover/q:-translate-x-1 ltr:group-hover/q:translate-x-1">→</span>
          </Link>
          <MobileMenu items={items} quote={quote} labels={{ menu: t('nav.menu'), close: t('nav.close') }} />
        </div>
      </div>
    </HeaderShell>
  )
}
