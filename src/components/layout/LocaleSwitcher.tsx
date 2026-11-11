'use client'

import { useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'

type Props = { label: string; ariaLabel: string }

export function LocaleSwitcher({ label, ariaLabel }: Props) {
  const locale = useLocale()
  const pathname = usePathname()
  const other = locale === 'fa' ? 'en' : 'fa'

  return (
    <Link
      href={pathname}
      locale={other}
      aria-label={ariaLabel}
      className="rounded-full border border-current/20 px-3 py-2 text-sm text-current transition hover:border-accent hover:text-accent"
    >
      {label}
    </Link>
  )
}
