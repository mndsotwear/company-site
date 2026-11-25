'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { CARGO_OPTIONS, DESTINATION_OPTIONS, ORIGIN_OPTIONS } from '@/lib/options'

export type OfficeLite = { id: number; name: string; city: string; phone?: string | null; hours?: string | null; mapUrl?: string | null }

const TABS = ['track', 'schedule', 'offices', 'quote'] as const
type Tab = (typeof TABS)[number]

const fieldCls =
  'h-12 w-full min-w-0 rounded-full border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/45 focus:border-white/70 focus:outline-none [&>option]:text-black'
const btnCls = 'h-12 shrink-0 rounded-full bg-white px-7 text-sm font-bold text-navy transition hover:bg-primary hover:text-white'

// نوار ابزار هیرو (الهام از ONE، ولی به شکل نوار باریک شیشه‌ای پایین تصویر تا عکس دیده شود):
// زبانه‌های کوچک بالا و فرم یک‌خطی پایین — رهگیری، برنامه حرکت، دفاتر، استعلام قیمت
export function HeroTools({ offices }: { offices: OfficeLite[] }) {
  const t = useTranslations('heroTools')
  const locale = useLocale() as 'fa' | 'en'
  const [tab, setTab] = useState<Tab>('track')
  const opt = (list: typeof ORIGIN_OPTIONS) => list.filter((o) => o.value !== 'other')

  const select = (name: string, label: string, list: typeof ORIGIN_OPTIONS, empty: string) => (
    <label className="min-w-0 flex-1">
      <span className="sr-only">{label}</span>
      <select name={name} className={fieldCls} defaultValue="" aria-label={label}>
        <option value="">{label}: {empty}</option>
        {opt(list).map((o) => (
          <option key={o.value} value={o.value}>
            {o.label[locale]}
          </option>
        ))}
      </select>
    </label>
  )

  return (
    <div className="rounded-[1.75rem] border border-white/15 bg-black/35 p-3 text-white backdrop-blur-xl sm:p-4">
      <div role="tablist" className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
              tab === k ? 'bg-white text-navy' : 'text-white/75 hover:bg-white/10 hover:text-white'
            }`}
          >
            {t(`tabs.${k}`)}
          </button>
        ))}
      </div>

      <div className="mt-3" role="tabpanel">
        {tab === 'track' && (
          <form action={`/${locale}/tracking`} method="get" className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="ht-code" className="sr-only">
              {t('trackLabel')}
            </label>
            <span id="ht-hint" className="sr-only">
              {t('trackHint')}
            </span>
            <input
              id="ht-code"
              name="code"
              required
              minLength={6}
              maxLength={14}
              autoComplete="off"
              dir="ltr"
              placeholder="123456  ·  Q-1405-0001"
              aria-describedby="ht-hint"
              className={`${fieldCls} flex-1 text-center font-mono tracking-wider sm:text-start`}
            />
            <button type="submit" className={btnCls}>
              {t('trackButton')}
            </button>
          </form>
        )}

        {tab === 'schedule' && (
          <form action={`/${locale}/schedule`} method="get" className="flex flex-col gap-2 sm:flex-row">
            {select('origin', t('origin'), ORIGIN_OPTIONS, t('any'))}
            {select('destination', t('destination'), DESTINATION_OPTIONS, t('any'))}
            <button type="submit" className={btnCls}>
              {t('scheduleButton')}
            </button>
          </form>
        )}

        {tab === 'offices' &&
          (offices.length ? (
            <ul className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
              {offices.map((o) => (
                <li key={o.id} className="flex shrink-0 items-center gap-4 rounded-full border border-white/15 bg-white/10 py-2 pe-2 ps-5">
                  <span className="text-sm">
                    <span className="font-bold">{o.name}</span>
                    <span className="ms-2 text-white/60">{o.city}</span>
                  </span>
                  {o.phone && (
                    <a href={`tel:${o.phone}`} className="ltr-nums rounded-full bg-white px-4 py-2 text-xs font-bold text-navy hover:bg-primary hover:text-white">
                      {o.phone}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="flex h-12 items-center px-2 text-sm text-white/75">
              {t('noOffices')}
              <a href={`/${locale}/contact`} className="ms-2 font-semibold text-white underline underline-offset-4">
                {t('contactPage')}
              </a>
            </p>
          ))}

        {tab === 'quote' && (
          <form action={`/${locale}/quote`} method="get" className="flex flex-col gap-2 sm:flex-row">
            {select('origin', t('origin'), ORIGIN_OPTIONS, t('choose'))}
            {select('destination', t('destination'), DESTINATION_OPTIONS, t('choose'))}
            {select('cargo', t('cargo'), CARGO_OPTIONS, t('choose'))}
            <input type="hidden" name="service" value="sea" />
            <button type="submit" className={btnCls}>
              {t('quoteButton')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
