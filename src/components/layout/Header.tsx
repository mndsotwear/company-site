import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ThemeToggle } from './ThemeToggle'
import { LocaleSwitcher } from './LocaleSwitcher'
import { MobileMenu } from './MobileMenu'

// منوی اصلی (در فاز ۲ از تنظیمات پنل خوانده می‌شود)
const NAV = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/services', key: 'services' },
  { href: '/fleet', key: 'fleet' },
  { href: '/tracking', key: 'tracking' },
  { href: '/contact', key: 'contact' },
] as const

export async function Header() {
  const t = await getTranslations()
  const items = NAV.map((n) => ({ href: n.href, label: t(`nav.${n.key}`) }))
  const quote = { href: '/quote', label: t('nav.quote') }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg">
      <div className="relative mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-5">
        <Link href="/" className="flex items-baseline gap-2 text-text">
          {/* لوگوی واقعی در فاز ۰ جایگزین می‌شود */}
          <span className="text-xl font-extrabold tracking-tight">{t('meta.siteName')}</span>
          <span className="hidden text-xs text-muted sm:inline">{t('meta.tagline')}</span>
        </Link>

        <nav className="hidden lg:block" aria-label={t('nav.menu')}>
          <ul className="flex items-center gap-7 text-[15px]">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-text transition hover:text-primary">
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
            className="hidden rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 lg:inline-block"
          >
            {quote.label}
          </Link>
          <MobileMenu items={items} quote={quote} labels={{ menu: t('nav.menu'), close: t('nav.close') }} />
        </div>
      </div>
    </header>
  )
}
