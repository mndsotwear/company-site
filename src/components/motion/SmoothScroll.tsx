'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

// اسکرول نرم و سنگین (حس سایت‌های لوکس). برای کسانی که «کاهش حرکت» را در سیستم روشن کرده‌اند غیرفعال است.
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), anchors: true })
    let id = 0
    const raf = (time: number) => {
      lenis.raf(time)
      id = requestAnimationFrame(raf)
    }
    id = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(id)
      lenis.destroy()
    }
  }, [])
  return null
}
