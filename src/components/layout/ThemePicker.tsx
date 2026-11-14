'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { PALETTES, STORAGE, applyPalette, type PaletteId } from '@/lib/palette'

// انتخاب تم رنگی در هدر: ۴ پالت آماده + رنگ دلخواه. انتخاب در مرورگر بازدیدکننده ذخیره می‌شود.
export function ThemePicker() {
  const t = useTranslations('theme')
  const locale = useLocale() as 'fa' | 'en'
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<PaletteId>('ocean')
  const [custom, setCustom] = useState('#22d3ee')
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const d = document.documentElement
    setCurrent((d.getAttribute('data-palette') as PaletteId) || 'ocean')
    try {
      setCustom(localStorage.getItem(STORAGE.custom) || d.getAttribute('data-custom') || '#22d3ee')
    } catch {}
    const close = (e: MouseEvent) => box.current && !box.current.contains(e.target as Node) && setOpen(false)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', esc)
    }
  }, [])

  const choose = (id: PaletteId, color = custom) => {
    setCurrent(id)
    applyPalette(id, color)
    window.dispatchEvent(new Event('shahin-palette-change'))
    try {
      localStorage.setItem(STORAGE.palette, id)
      if (id === 'custom') localStorage.setItem(STORAGE.custom, color)
    } catch {}
  }

  const active = PALETTES.find((p) => p.id === current)
  const sw = active ? active.swatch : [custom, custom]

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={t('palette')}
        className="grid h-10 w-10 place-items-center rounded-full border border-current/20 transition hover:border-current/60"
      >
        <span className="h-5 w-5 rounded-full" style={{ background: `conic-gradient(${sw[0]} 0 50%, ${sw[1]} 0 100%)` }} aria-hidden />
      </button>
      {open && (
        <div className="glass absolute end-0 top-12 z-50 w-64 rounded-2xl p-3 text-text shadow-2xl">
          <p className="px-2 pb-2 pt-1 text-xs text-muted">{t('palette')}</p>
          <ul className="space-y-1">
            {PALETTES.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => choose(p.id)}
                  aria-pressed={current === p.id}
                  className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-sm transition hover:bg-surface-2 ${current === p.id ? 'bg-surface-2 font-semibold' : ''}`}
                >
                  <span className="flex -space-x-1.5 rtl:space-x-reverse" aria-hidden>
                    <span className="h-5 w-5 rounded-full ring-2 ring-surface" style={{ background: p.swatch[0] }} />
                    <span className="h-5 w-5 rounded-full ring-2 ring-surface" style={{ background: p.swatch[1] }} />
                  </span>
                  {p.label[locale]}
                  {current === p.id && <span className="ms-auto text-primary">✓</span>}
                </button>
              </li>
            ))}
            <li>
              <label className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-sm transition hover:bg-surface-2 ${current === 'custom' ? 'bg-surface-2 font-semibold' : ''}`}>
                <input
                  type="color"
                  value={custom}
                  onChange={(e) => {
                    setCustom(e.target.value)
                    choose('custom', e.target.value)
                  }}
                  className="h-5 w-5 cursor-pointer rounded-full border-0 bg-transparent p-0"
                />
                {t('custom')}
                {current === 'custom' && <span className="ms-auto text-primary">✓</span>}
              </label>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
