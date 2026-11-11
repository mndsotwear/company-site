'use client'

import { createElement, useEffect, useState } from 'react'

// ویجت کپچای ALTCHA؛ فقط سمت مرورگر بارگذاری می‌شود
export function AltchaWidget({ locale }: { locale: 'fa' | 'en' }) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let alive = true
    Promise.all([import('altcha'), locale === 'fa' ? import('altcha/i18n/fa').catch(() => null) : null]).then(() => alive && setReady(true))
    return () => {
      alive = false
    }
  }, [locale])
  if (!ready) return <div className="h-16 animate-pulse rounded-xl bg-border/40" aria-hidden />
  return createElement('altcha-widget', {
    challenge: '/api/altcha',
    name: 'altcha',
    language: locale,
    auto: 'onsubmit',
    style: { '--altcha-max-width': '100%' },
  })
}
