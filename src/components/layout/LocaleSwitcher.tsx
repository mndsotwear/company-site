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
      className="rounded-full border border-border px-3 py-2 text-sm text-text transition hover:border-primary hover:text-primary"
    >
      {label}
    </Link>
  )
}
