'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { COMPARE_MAX, onCompareChange, readCompare, writeCompare, type CompareItem } from '@/lib/compareStore'

// دکمه‌ی «افزودن به مقایسه» روی کارت کشتی
export function CompareToggle({ slug, name }: { slug: string; name: string }) {
  const t = useTranslations('compare')
  const [items, setItems] = useState<CompareItem[]>([])
  useEffect(() => {
    setItems(readCompare())
    return onCompareChange(() => setItems(readCompare()))
  }, [])

  const active = items.some((i) => i.slug === slug)
  const full = !active && items.length >= COMPARE_MAX

  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={full}
      title={full ? t('full') : undefined}
      onClick={() => writeCompare(active ? items.filter((i) => i.slug !== slug) : [...items, { slug, name }])}
      className={`absolute end-4 top-4 z-10 flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur transition disabled:cursor-not-allowed disabled:opacity-50 ${
        active ? 'border-accent bg-accent text-white' : 'border-white/30 bg-black/40 text-white hover:border-white'
      }`}
    >
      <span className={`grid h-3.5 w-3.5 place-items-center rounded-sm border ${active ? 'border-white bg-white text-accent' : 'border-white/70'}`} aria-hidden>
        {active && '✓'}
      </span>
      {t('add')}
    </button>
  )
}
