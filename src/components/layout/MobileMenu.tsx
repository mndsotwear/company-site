'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'

type Item = { href: string; label: string }
type Props = { items: Item[]; quote: Item; labels: { menu: string; close: string } }

export function MobileMenu({ items, quote, labels }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? labels.close : labels.menu}
        className="grid h-10 w-10 place-items-center rounded-full border border-current/20 text-current"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          {open ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" />}
        </svg>
      </button>

      {open && (
        <nav className="absolute inset-x-0 top-full border-b border-border bg-bg px-5 pb-6 pt-2 shadow-lg">
          <ul className="flex flex-col">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-border py-3 text-text hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={quote.href}
            onClick={() => setOpen(false)}
            className="mt-5 block rounded-full bg-accent py-3 text-center font-semibold text-white"
          >
            {quote.label}
          </Link>
        </nav>
      )}
    </div>
  )
}
