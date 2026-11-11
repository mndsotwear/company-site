'use client'

import { ThemeProvider as NextThemes } from 'next-themes'
import type { ReactNode } from 'react'

// طراحی اصلی سایت تیره است؛ بازدیدکننده می‌تواند روشن را انتخاب کند و انتخابش ذخیره می‌شود
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemes attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      {children}
    </NextThemes>
  )
}
