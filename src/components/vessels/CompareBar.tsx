'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { onCompareChange, readCompare, writeCompare, type CompareItem } from '@/lib/compareStore'

// نوار پایین صفحه وقتی حداقل یک کشتی برای مقایسه انتخاب شده
export function CompareBar() {
  const t = useTranslations('compare')
  const [items, setItems] = useState<CompareItem[]>([])
  useEffect(() => {
    setItems(readCompare())
    return onCompareChange(() => setItems(readCompare()))
  }, [])
  if (!items.length) return null

  return (
    <div className="fixed inset-x-4 bottom-24 z-40 mx-auto flex max-w-2xl flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-navy/95 p-4 text-foam shadow-2xl backdrop-blur sm:bottom-6">
      <p className="text-sm">
        <span className="font-bold">{t('selected', { count: items.length })}</span>
        <span className="ms-2 text-foam/60">{items.map((i) => i.name).join('، ')}</span>
      </p>
      <div className="ms-auto flex items-center gap-2">
        <button type="button" onClick={() => writeCompare([])} className="px-3 py-2 text-sm text-foam/60 hover:text-foam">
          {t('clear')}
        </button>
        {items.length >= 2 ? (
          <Link href={`/fleet/compare?v=${items.map((i) => i.slug).join(',')}`} className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:brightness-110">
            {t('go')}
          </Link>
        ) : (
          <span className="text-xs text-foam/50">{t('pickMore')}</span>
        )}
      </div>
    </div>
  )
}
