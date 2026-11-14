'use client'

import { ThemeProvider as NextThemes } from 'next-themes'
import type { ReactNode } from 'react'

// حالت روشن/تیره: پیش‌فرض را ادمین در «تنظیمات سایت ← ظاهر سایت» تعیین می‌کند؛ انتخاب بازدیدکننده ذخیره می‌شود
export function ThemeProvider({ children, defaultMode = 'dark' }: { children: ReactNode; defaultMode?: 'dark' | 'light' }) {
  return (
    <NextThemes attribute="class" defaultTheme={defaultMode} enableSystem={false} disableTransitionOnChange>
      {children}
    </NextThemes>
  )
}
