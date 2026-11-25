'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'

// پوسته‌ی هدر: بالای صفحه کاملاً شفاف است (روی عکس هیرو متن سفید)،
// با اسکرول یک پس‌زمینه‌ی نیمه‌شفاف مات می‌گیرد.
export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false)
  const path = usePathname()
  const isHome = /^\/(fa|en)\/?$/.test(path || '')
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const overHero = isHome && !scrolled
  return (
    <header
      data-solid={scrolled}
      data-over-hero={overHero}
      className={`group fixed inset-x-0 top-0 z-40 transition-[background-color,color,box-shadow,border-color] duration-500 ${
        scrolled
          ? 'border-b border-border/60 bg-bg/85 text-text shadow-[0_8px_30px_-20px_rgb(0_0_0/0.4)] backdrop-blur-xl'
          : overHero
            ? 'border-b border-white/10 bg-transparent text-white'
            : 'border-b border-transparent bg-transparent text-text'
      }`}
    >
      {children}
    </header>
  )
}
