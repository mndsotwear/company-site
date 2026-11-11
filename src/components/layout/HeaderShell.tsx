'use client'

import { useEffect, useState, type ReactNode } from 'react'

// پوسته‌ی هدر: بالای صفحه شفاف روی عکس/ویدیو، بعد از اسکرول پس‌زمینه‌ی مات می‌گیرد؛
// هنگام اسکرول به پایین کنار می‌رود و با اسکرول به بالا برمی‌گردد.
export function HeaderShell({ children }: { children: ReactNode }) {
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setSolid(y > 40)
      if (y > 400 && y > last + 4) setHidden(true)
      else if (y < last - 4 || y <= 400) setHidden(false)
      last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <header
      data-solid={solid}
      className={`group fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,color,transform] duration-500 ease-[var(--ease-luxe)] ${
        solid ? 'border-b border-hairline bg-bg/80 text-text backdrop-blur-xl' : 'border-b border-transparent text-foam'
      } ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      {children}
    </header>
  )
}
